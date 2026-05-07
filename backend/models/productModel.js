const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        image: { type: String }, // URL to review image
        verified: { type: Boolean, default: false }, // Verified buyer status
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const productSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        images: [String], // Array of image URLs
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        isNewArrival: {
            type: Boolean,
            default: false,
        },
        season: {
            type: String,
        },
        gender: {
            type: String,
        },
        compareAtPrice: {
            type: Number,
            default: 0,
        },
        // Wholesale pricing configuration
        isWholesaleAvailable: {
            type: Boolean,
            default: false,
        },
        minimumWholesaleQuantity: {
            type: Number,
            default: 10,
        },
        pricingTiers: [
            {
                minQuantity: {
                    type: Number,
                    required: true,
                },
                maxQuantity: {
                    type: Number, // null for last tier (e.g., 100+)
                },
                pricePerUnit: {
                    type: Number,
                    required: true,
                },
            },
        ],
        // Legacy fields for backward compatibility
        wholesalePrice: {
            type: Number,
            default: null,
        },
        minWholesaleQuantity: {
            type: Number,
            default: 10,
        },
        wholesaleEnabled: {
            type: Boolean,
            default: false,
        },
        // Additional product details
        sizes: [String],
        colors: [
            {
                name: String,
                hex: String,
            },
        ],
        // New Wholesale Fields
        caseQuantity: {
            type: Number,
            default: 1,
        },
        sku: {
            type: String,
            sparse: true,
        },
        gstRate: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
