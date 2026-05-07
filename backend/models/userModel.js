const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        phone: {
            type: String,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allow multiple nulls
        },
        avatar: {
            type: String, // URL to image
        },
        resetPasswordOtp: {
            type: String,
        },
        resetPasswordOtpExpire: {
            type: Date,
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        addresses: [
            {
                address: { type: String, required: true },
                city: { type: String, required: true },
                postalCode: { type: String, required: true },
                country: { type: String, required: true },
                isDefault: { type: Boolean, default: false }
            }
        ],
        recentlyViewed: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                viewedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        accountType: {
            type: String,
            enum: ['retail', 'wholesale'],
            default: 'retail',
        },
        wholesaleProfile: {
            businessName: {
                type: String,
            },
            gstNumber: {
                type: String,
                validate: {
                    validator: function (v) {
                        if (!v) return true; // Allow empty
                        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
                    },
                    message: 'Invalid GST number format'
                }
            },
            shopAddress: {
                street: String,
                city: String,
                state: String,
                pincode: String,
            },
            phone: {
                type: String,
            },
            expectedMonthlyVolume: {
                type: Number,
            },
            // New Wholesale Profile Fields
            panNumber: {
                type: String,
            },
            businessType: {
                type: String,
                enum: ['retailer', 'wholesaler', 'distributor', 'other'],
            },
            documentUrl: {
                type: String, // URL to uploaded document
            },
            approvalStatus: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending',
            },
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            approvedAt: {
                type: Date,
            },
            rejectionReason: {
                type: String,
            },
        },
        // Legacy fields for backward compatibility
        wholesaleVerified: {
            type: Boolean,
            default: false,
        },
        businessName: {
            type: String,
        },
        taxId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password pre-save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
