const validateRegister = (data) => {
    const errors = [];
    if (!data.name) errors.push('Name is required');
    if (!data.email) errors.push('Email is required');
    if (!data.password || data.password.length < 6) errors.push('Password must be at least 6 characters');
    if (!data.role || !['user', 'vendor', 'admin'].includes(data.role)) errors.push('Invalid role');
    return errors;
};

const validateLogin = (data) => {
    const errors = [];
    if (!data.email) errors.push('Email is required');
    if (!data.password) errors.push('Password is required');
    return errors;
};

module.exports = { validateRegister, validateLogin };
