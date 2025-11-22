const VendorProfile = require('../models/VendorProfile');

const createOrUpdateProfile = async (profileData, userId) => {
    let profile = await VendorProfile.findOne({ user: userId });

    if (profile) {
        profile = await VendorProfile.findOneAndUpdate(
            { user: userId },
            profileData,
            { new: true }
        );
    } else {
        profile = await VendorProfile.create({
            ...profileData,
            user: userId,
        });
    }
    return profile;
};

const getVendorProfile = async (userId) => {
    return await VendorProfile.findOne({ user: userId });
};

const searchVendors = async (filters) => {
    const query = {};
    if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters.serviceType) {
        query.serviceType = { $regex: filters.serviceType, $options: 'i' };
    }
    // Add more filters as needed (price, etc.)

    return await VendorProfile.find(query).populate('user', 'name email');
};



const addPortfolioImage = async (userId, imageUrl) => {
    const profile = await VendorProfile.findOne({ user: userId });
    if (!profile) {
        throw new Error('Vendor profile not found');
    }
    profile.portfolio.push(imageUrl);
    await profile.save();
    return profile;
};

module.exports = { createOrUpdateProfile, getVendorProfile, searchVendors, addPortfolioImage };
