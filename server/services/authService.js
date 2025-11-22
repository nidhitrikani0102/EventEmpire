const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const validateLogin = (data) => {
    const errors = [];
    if (!data.email) errors.push('Email is required');
    if (!data.password) errors.push('Password is required');
    return errors;
};

const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Send welcome email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Welcome to EventEmpire',
            message: `Hi ${user.name}, welcome to EventEmpire! We are excited to have you.`
        });
    } catch (error) {
        console.error('Email send failed:', error);
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    };
};

const loginUser = async (userData) => {
    const errors = validateLogin(userData);
    if (errors.length > 0) throw new Error(errors.join(', '));

    const user = await User.findOne({ email: userData.email });
    if (!user || !(await user.matchPassword(userData.password))) {
        throw new Error('Invalid credentials');
    }

    // Generate OTP for 2FA
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: 'Login OTP',
            message: `Your OTP for login is ${otp}`
        });
    } catch (error) {
        console.error('Email send failed:', error);
        // We don't throw here because we want to return the OTP for dev mode if email fails
    }

    return {
        message: 'OTP sent to your email',
        userId: user._id,
        requiresOtp: true,
        otp: otp // Keeping for dev convenience
    };
};

const verifyLoginOtp = async (userId, otp) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.otp !== otp || user.otpExpires < Date.now()) {
        throw new Error('Invalid or expired OTP');
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    };
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            message: `Your OTP for password reset is ${otp}`
        });
    } catch (error) {
        console.error('Email send failed:', error);
        // We don't throw here because we want to return the OTP for dev mode if email fails
    }

    return { message: 'OTP sent to your email', otp: otp };
};

const resetPassword = async (email, otp, newPassword) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    if (user.otp !== otp || user.otpExpires < Date.now()) {
        throw new Error('Invalid or expired OTP');
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: 'Password reset successful. You can now login.' };
};

module.exports = { registerUser, loginUser, verifyLoginOtp, forgotPassword, resetPassword };
