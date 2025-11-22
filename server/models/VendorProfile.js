const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    serviceType: {
        type: String,
        required: true, // e.g., Catering, Venue, Photography
    },
    location: {
        type: String,
        required: true,
    },
    pricing: {
        type: String, // e.g., "$500/day" or "Start from $100"
    },
    portfolio: [
        {
            type: String, // URL of the image
        }
    ],
    description: {
        type: String,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: Number,
            comment: String,
            date: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);
