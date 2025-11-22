const Guest = require('../models/Guest');
const Event = require('../models/Event');
const sendEmail = require('../utils/sendEmail');
const { validateGuest } = require('../validators/guestValidator');

const addGuest = async (guestData, userId) => {
    const errors = validateGuest(guestData);
    if (errors.length > 0) throw new Error(errors.join(', '));

    // Verify Event Ownership
    const event = await Event.findById(guestData.eventId);
    if (!event) throw new Error('Event not found');
    if (event.user.toString() !== userId.toString()) throw new Error('Not authorized to add guests to this event');

    const guest = await Guest.create({
        event: guestData.eventId,
        email: guestData.email,
        name: guestData.name,
    });

    return guest;
};

const getGuests = async (eventId, userId) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.user.toString() !== userId.toString()) throw new Error('Not authorized');

    return await Guest.find({ event: eventId });
};

const sendInvitation = async (guestId, userId, customMessage) => {
    const guest = await Guest.findById(guestId).populate('event');
    if (!guest) throw new Error('Guest not found');

    if (guest.event.user.toString() !== userId.toString()) throw new Error('Not authorized');

    const mapLink = guest.event.mapLink || '#';
    const guestName = guest.name || 'Guest';

    const htmlMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <div style="background-color: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">You're Invited!</h1>
            </div>
            <div style="padding: 20px; background-color: white;">
                <p style="font-size: 18px; color: #333;">Dear <strong>${guestName}</strong>,</p>
                <p style="font-size: 16px; color: #555;">${customMessage || `You are cordially invited to attend <strong>${guest.event.name}</strong>.`}</p>
                
                <div style="background-color: #f0f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${new Date(guest.event.date).toLocaleDateString()}</p>
                    <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${guest.event.time}</p>
                    <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${guest.event.location}</p>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="${mapLink}" style="background-color: #dc004e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">View Location on Map</a>
                </div>
            </div>
            <div style="text-align: center; padding: 15px; color: #888; font-size: 12px;">
                <p>Sent via EventEmpire</p>
            </div>
        </div>
    `;

    try {
        await sendEmail({
            email: guest.email,
            subject: `Invitation: ${guest.event.name}`,
            html: htmlMessage, // Send as HTML
        });

        guest.isInvited = true;
        guest.invitedAt = Date.now();
        await guest.save();

        return { message: 'Invitation sent successfully' };
    } catch (error) {
        throw new Error('Email could not be sent');
    }
};

module.exports = { addGuest, getGuests, sendInvitation };
