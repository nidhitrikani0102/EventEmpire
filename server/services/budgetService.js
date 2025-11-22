const Budget = require('../models/Budget');
const Event = require('../models/Event');

const getBudget = async (eventId, userId) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.user.toString() !== userId.toString()) throw new Error('Not authorized');

    let budget = await Budget.findOne({ event: eventId });
    if (!budget) {
        // Create default if not exists
        budget = await Budget.create({ event: eventId, totalBudget: 0, expenses: [] });
    }
    return budget;
};

const updateBudget = async (eventId, budgetData, userId) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.user.toString() !== userId.toString()) throw new Error('Not authorized');

    const budget = await Budget.findOneAndUpdate(
        { event: eventId },
        { totalBudget: budgetData.totalBudget },
        { new: true, upsert: true }
    );
    return budget;
};

const addExpense = async (eventId, expenseData, userId) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.user.toString() !== userId.toString()) throw new Error('Not authorized');

    const budget = await Budget.findOne({ event: eventId });
    if (!budget) throw new Error('Budget not set');

    budget.expenses.push(expenseData);
    await budget.save();

    // Check threshold
    const totalExpenses = budget.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = budget.totalBudget - totalExpenses;
    const alert = remaining < (budget.totalBudget * 0.1); // Less than 10%

    return { budget, alert, remaining };
};

module.exports = { getBudget, updateBudget, addExpense };
