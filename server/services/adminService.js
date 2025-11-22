const User = require('../models/User');

const getAllUsers = async () => {
    return await User.find().select('-password');
};

const deleteUser = async (userId) => {
    await User.findByIdAndDelete(userId);
    return { message: 'User deleted' };
};

module.exports = { getAllUsers, deleteUser };
