const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin')); // Only admins

router.get('/users', async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const result = await adminService.deleteUser(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
