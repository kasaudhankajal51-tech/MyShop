const asyncHandler = require('express-async-handler');
const Settings = require('../models/settingsModel');

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public (or Private? Public needed for frontend config maybe, but let's keep it open for now or protect write)
// Actually, public read is useful for maintenance mode check.
const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({
            storeName: 'Jai Shree Balaji Readymade',
            storeEmail: 'contact@jsb.com',
            storePhone: '+91 9876543210',
            currency: 'INR',
            taxRate: 0,
            freeShippingThreshold: 5000,
            enableCOD: true,
            enableOnlinePayment: true,
            maintenanceMode: false
        });
    }

    res.json(settings);
});

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    const settings = await Settings.findOne();

    if (settings) {
        settings.storeName = req.body.storeName || settings.storeName;
        settings.storeEmail = req.body.storeEmail || settings.storeEmail;
        settings.storePhone = req.body.storePhone || settings.storePhone;
        settings.currency = req.body.currency || settings.currency;
        settings.taxRate = req.body.taxRate !== undefined ? req.body.taxRate : settings.taxRate;
        settings.freeShippingThreshold = req.body.freeShippingThreshold !== undefined ? req.body.freeShippingThreshold : settings.freeShippingThreshold;
        settings.enableCOD = req.body.enableCOD !== undefined ? req.body.enableCOD : settings.enableCOD;
        settings.enableOnlinePayment = req.body.enableOnlinePayment !== undefined ? req.body.enableOnlinePayment : settings.enableOnlinePayment;
        settings.maintenanceMode = req.body.maintenanceMode !== undefined ? req.body.maintenanceMode : settings.maintenanceMode;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        res.status(404);
        throw new Error('Settings not found');
    }
});

module.exports = {
    getSettings,
    updateSettings
};
