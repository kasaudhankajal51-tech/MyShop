const mongoose = require('mongoose');

const flashDealSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
        link: {
            type: String,
        },
        originalPrice: {
            type: Number,
        },
        discountPrice: {
            type: Number,
        },
        discountPercent: {
            type: Number,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const FlashDeal = mongoose.model('FlashDeal', flashDealSchema);

module.exports = FlashDeal;
