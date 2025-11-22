const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const mongoose = require('mongoose');

// Protect all routes
router.use(authMiddleware.protect);

// Send a message
router.post('/', async (req, res) => {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
        return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    try {
        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            content,
        });
        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
});

// Get conversations (list of users interacted with)
router.get('/conversations', async (req, res) => {
    try {
        const sentMessages = await Message.find({ sender: req.user._id }).populate('receiver', 'name email role');
        const receivedMessages = await Message.find({ receiver: req.user._id }).populate('sender', 'name email role');

        const users = new Map();

        sentMessages.forEach(msg => {
            if (msg.receiver) users.set(msg.receiver._id.toString(), msg.receiver);
        });
        receivedMessages.forEach(msg => {
            if (msg.sender) users.set(msg.sender._id.toString(), msg.sender);
        });

        res.json(Array.from(users.values()));
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
});

// Delete a conversation
router.delete('/conversations/:userId', async (req, res) => {
    console.log('DELETE /conversations/:userId request received');
    console.log('Params:', req.params);
    console.log('User:', req.user ? req.user._id : 'No user');

    try {
        const otherUserId = req.params.userId;

        if (!req.user) {
            console.log('User not authenticated');
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const myId = req.user._id;

        if (!otherUserId || otherUserId === 'undefined' || otherUserId === 'null') {
            console.log('Invalid user ID:', otherUserId);
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Check if valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            console.log('Invalid ObjectId format:', otherUserId);
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        console.log(`Deleting messages between ${myId} and ${otherUserId}`);
        const result = await Message.deleteMany({
            $or: [
                { sender: myId, receiver: otherUserId },
                { sender: otherUserId, receiver: myId }
            ]
        });
        console.log('Delete result:', result);

        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        const errorDetails = error.message || error.toString() || 'Unknown error';
        res.status(500).json({ message: 'Failed to delete conversation', error: errorDetails });
    }
});

// Get messages with a specific user
router.get('/:userId', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user._id },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

module.exports = router;
