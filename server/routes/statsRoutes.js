const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');

// @route   GET /api/stats
// @desc    Get public statistics (Users, Vendors, Events)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'user' });
        const vendorCount = await User.countDocuments({ role: 'vendor' });
        const eventCount = await Event.countDocuments({});

        res.json({
            users: userCount,
            vendors: vendorCount,
            events: eventCount
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
