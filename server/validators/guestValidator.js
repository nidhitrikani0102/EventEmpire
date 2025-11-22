const validateGuest = (data) => {
    const errors = [];
    if (!data.email) errors.push('Guest email is required');
    if (!data.eventId) errors.push('Event ID is required');
    return errors;
};

module.exports = { validateGuest };
