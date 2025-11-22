const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String, // Optional, if user knows the name
    },
    isInvited: {
        type: Boolean,
        default: false,
    },
    invitedAt: {
        type: Date,
    },
});

module.exports = mongoose.model('Guest', guestSchema);
