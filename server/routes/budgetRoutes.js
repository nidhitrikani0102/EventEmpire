const express = require('express');
const router = express.Router();
const budgetService = require('../services/budgetService');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:eventId', async (req, res) => {
    try {
        const budget = await budgetService.getBudget(req.params.eventId, req.user._id);
        res.json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/:eventId', async (req, res) => {
    try {
        const budget = await budgetService.updateBudget(req.params.eventId, req.body, req.user._id);
        res.json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/:eventId/expense', async (req, res) => {
    try {
        const result = await budgetService.addExpense(req.params.eventId, req.body, req.user._id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
