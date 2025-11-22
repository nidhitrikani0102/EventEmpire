const validateEvent = (data) => {
    const errors = [];
    if (!data.name) errors.push('Event name is required');
    if (!data.date) errors.push('Event date is required');
    if (!data.time) errors.push('Event time is required');
    if (!data.location) errors.push('Event location is required');
    if (!data.type) errors.push('Event type is required');


    if (data.date) {
        const eventDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventDate < today) {
            errors.push('Event date cannot be in the past');
        }
    }

    return errors;
};

module.exports = { validateEvent };
