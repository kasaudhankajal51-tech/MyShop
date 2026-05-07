const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                selectedSize: {
                    type: String,
                    required: false,
                },
                selectedColor: {
                    type: String,
                    required: false,
                },
            },
        ],
        shoppingMode: {
            type: String,
            enum: ['retail', 'wholesale'],
            default: 'retail',
        },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
