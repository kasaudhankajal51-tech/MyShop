const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        requestedQuantity: {
            type: Number,
            required: true,
        },
        expectedPricePerUnit: {
            type: Number,
        },
        message: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'counter-offered'],
            default: 'pending',
        },
        adminResponse: {
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            respondedAt: {
                type: Date,
            },
            approvedPrice: {
                type: Number,
            },
            counterOfferPrice: {
                type: Number,
            },
            message: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
