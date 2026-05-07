const asyncHandler = require('express-async-handler');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const { name, expiry, discount } = req.body;

    const couponExists = await Coupon.findOne({ name });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon already exists');
    }

    const coupon = await Coupon.create({
        name,
        expiry,
        discount,
    });

    if (coupon) {
        res.status(201).json({
            _id: coupon._id,
            name: coupon.name,
            expiry: coupon.expiry,
            discount: coupon.discount,
        });
    } else {
        res.status(400);
        throw new Error('Invalid coupon data');
    }
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
});

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
    const { couponCode } = req.body;

    const coupon = await Coupon.findOne({ name: couponCode, isActive: true });

    if (coupon) {
        if (new Date() > coupon.expiry) {
            res.status(400);
            throw new Error('Coupon expired');
        }
        res.json({
            _id: coupon._id,
            name: coupon.name,
            discount: coupon.discount,
        });
    } else {
        // Check for First Order Coupon logic (hardcoded or special check)
        if (couponCode === 'FIRSTORDER') {
            const existingOrders = await Order.countDocuments({ user: req.user._id });
            if (existingOrders === 0) {
                res.json({
                    name: 'FIRSTORDER',
                    discount: 15, // 15% discount for first order
                });
            } else {
                res.status(400);
                throw new Error('This coupon is only valid for your first order');
            }
        } else {
            res.status(404);
            throw new Error('Invalid coupon code');
        }
    }
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

module.exports = {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon,
};
