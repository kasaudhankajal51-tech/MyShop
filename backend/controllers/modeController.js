const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Toggle shopping mode
// @route   POST /api/mode/toggle
// @access  Private
const toggleShoppingMode = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [], shoppingMode: 'retail' });
    }

    // Toggle mode
    const newMode = cart.shoppingMode === 'retail' ? 'wholesale' : 'retail';

    // Check if user is eligible for wholesale mode
    if (newMode === 'wholesale' && !req.user.wholesaleVerified) {
        res.status(403);
        throw new Error('You are not verified for wholesale shopping. Please contact support.');
    }

    cart.shoppingMode = newMode;
    await cart.save();

    res.json({
        mode: cart.shoppingMode,
        message: `Shopping mode switched to ${cart.shoppingMode}`
    });
});

// @desc    Set shopping mode
// @route   POST /api/mode/set
// @access  Private
const setShoppingMode = asyncHandler(async (req, res) => {
    const { mode } = req.body;

    if (!['retail', 'wholesale'].includes(mode)) {
        res.status(400);
        throw new Error('Invalid mode. Must be retail or wholesale.');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [], shoppingMode: mode });
    }

    // Check if user is eligible for wholesale mode
    if (mode === 'wholesale' && !req.user.wholesaleVerified) {
        res.status(403);
        throw new Error('You are not verified for wholesale shopping. Please contact support.');
    }

    cart.shoppingMode = mode;
    await cart.save();

    res.json({
        mode: cart.shoppingMode,
        message: `Shopping mode set to ${cart.shoppingMode}`
    });
});

// @desc    Get current shopping mode
// @route   GET /api/mode
// @access  Private
const getShoppingMode = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [], shoppingMode: 'retail' });
    }

    res.json({
        mode: cart.shoppingMode,
        isWholesaleEligible: req.user.wholesaleVerified || false,
        accountType: req.user.accountType || 'retail'
    });
});

module.exports = {
    toggleShoppingMode,
    setShoppingMode,
    getShoppingMode
};
