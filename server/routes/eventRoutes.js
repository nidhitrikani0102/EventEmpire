const express = require('express');
const router = express.Router();
const eventService = require('../services/eventService');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all event routes

router.post('/', async (req, res) => {
    try {
        const event = await eventService.createEvent(req.body, req.user._id);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await eventService.getEvents(req.user._id);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id, req.user._id);
        res.json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body, req.user._id);
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await eventService.deleteEvent(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
