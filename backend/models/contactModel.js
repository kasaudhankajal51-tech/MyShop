const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'New' }, // New, Read, Responded
}, {
    timestamps: true,
});

module.exports = mongoose.model('Contact', contactSchema);
