const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    storeName: { type: String, required: true, default: 'My Store' },
    storeEmail: { type: String, required: true, default: 'admin@example.com' },
    storePhone: { type: String, required: true, default: '+91 0000000000' },
    currency: { type: String, required: true, default: 'INR' },
    taxRate: { type: Number, required: true, default: 0 },
    freeShippingThreshold: { type: Number, required: true, default: 0 },
    enableCOD: { type: Boolean, required: true, default: true },
    enableOnlinePayment: { type: Boolean, required: true, default: true },
    maintenanceMode: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
