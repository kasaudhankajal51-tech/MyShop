const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                size: { type: String },
                color: { type: String },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        isShipped: {
            type: Boolean,
            default: false,
        },
        shippedAt: {
            type: Date,
        },
        isOutForDelivery: {
            type: Boolean,
            default: false,
        },
        outForDeliveryAt: {
            type: Date,
        },
        orderStatus: {
            type: String,
            required: true,
            default: 'Processing',
        },
        // Wholesale order fields
        orderType: {
            type: String,
            enum: ['retail', 'wholesale'],
            default: 'retail',
        },
        paymentDetails: {
            paymentType: {
                type: String,
                enum: ['full', 'partial'],
                default: 'full',
            },
            totalAmount: Number,
            advanceAmount: Number,
            advancePercentage: Number,
            pendingAmount: Number,
            advancePaid: {
                type: Boolean,
                default: false,
            },
            fullPaymentDate: Date,
            paymentHistory: [
                {
                    amount: Number,
                    type: {
                        type: String,
                        enum: ['advance', 'full', 'partial'],
                    },
                    paidAt: Date,
                    transactionId: String,
                },
            ],
        },
        gstDetails: {
            gstNumber: String,
            cgst: Number,
            sgst: Number,
            igst: Number,
            totalGst: Number,
        },
        isCancelled: {
            type: Boolean,
            default: false,
        },
        cancelledAt: {
            type: Date,
        },
        cancellationReason: {
            type: String,
        },
        isReturned: {
            type: Boolean,
            default: false,
        },
        returnedAt: {
            type: Date,
        },
        returnReason: {
            type: String,
        },
        invoiceNumber: String,
        invoiceUrl: String,
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
