const express = require('express');
const router = express.Router();
const vendorService = require('../services/vendorService');
const { protect, authorize } = require('../middleware/roleMiddleware'); // Need to fix import path
const authMiddleware = require('../middleware/authMiddleware');

// Public route to search vendors
router.get('/search', async (req, res) => {
    try {
        const vendors = await vendorService.searchVendors(req.query);
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected routes
router.use(authMiddleware.protect);

router.post('/profile', async (req, res) => {
    // Ensure user is a vendor
    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: 'Only vendors can create a profile' });
    }
    try {
        const profile = await vendorService.createOrUpdateProfile(req.body, req.user._id);
        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/portfolio', async (req, res) => {
    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: 'Only vendors can update portfolio' });
    }
    try {
        const profile = await vendorService.addPortfolioImage(req.user._id, req.body.imageUrl);
        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/profile', async (req, res) => {
    try {
        const profile = await vendorService.getVendorProfile(req.user._id);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
