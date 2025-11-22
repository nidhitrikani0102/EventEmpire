const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/register', async (req, res) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const result = await authService.verifyLoginOtp(userId, otp);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await authService.resetPassword(email, otp, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.params.id).select('name email role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
