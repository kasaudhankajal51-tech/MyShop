const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    const contact = await Contact.create({
        name,
        email,
        subject,
        message,
    });

    if (contact) {
        res.status(201).json({
            _id: contact._id,
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            message: contact.message,
            success: true,
            message: "Message received successfully"
        });
    } else {
        res.status(400);
        throw new Error('Invalid contact data');
    }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
});

module.exports = {
    submitContactForm,
    getContactMessages
};
