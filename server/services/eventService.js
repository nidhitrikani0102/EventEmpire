const Event = require('../models/Event');
const { validateEvent } = require('../validators/eventValidator');

const createEvent = async (eventData, userId) => {
    const errors = validateEvent(eventData);
    if (errors.length > 0) throw new Error(errors.join(', '));

    const event = await Event.create({
        ...eventData,
        user: userId,
    });
    return event;
};

const getEvents = async (userId) => {
    return await Event.find({ user: userId });
};

const getEventById = async (eventId, userId) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.user.toString() !== userId.toString()) throw new Error('Not authorized');
    return event;
};

const updateEvent = async (eventId, eventData, userId) => {
    let event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.user.toString() !== userId.toString()) throw new Error('Not authorized');

    // Optional: Validate updates
    // const errors = validateEvent(eventData); 
    // if (errors.length > 0) throw new Error(errors.join(', '));

    event = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
    return event;
};

const deleteEvent = async (eventId, userId) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.user.toString() !== userId.toString()) throw new Error('Not authorized');

    await event.deleteOne();
    return { message: 'Event removed' };
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
