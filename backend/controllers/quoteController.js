const asyncHandler = require('express-async-handler');
const Quote = require('../models/quoteModel');
const Product = require('../models/productModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Request custom quote
// @route   POST /api/quotes/request
// @access  Private (Wholesale users only)
const requestQuote = asyncHandler(async (req, res) => {
    const { productId, requestedQuantity, expectedPricePerUnit, message } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!product.isWholesaleAvailable) {
        res.status(400);
        throw new Error('Product is not available for wholesale');
    }

    const quote = await Quote.create({
        user: req.user._id,
        product: productId,
        requestedQuantity,
        expectedPricePerUnit,
        message,
    });

    const populatedQuote = await Quote.findById(quote._id)
        .populate('user', 'name email')
        .populate('product', 'name price image');

    // Send email notification to admin
    try {
        await sendEmail({
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            subject: 'New Quote Request',
            message: `New quote request from ${req.user.name} for ${product.name}. Quantity: ${requestedQuantity}`,
        });
    } catch (error) {
        console.log('Email notification failed:', error);
    }

    res.status(201).json(populatedQuote);
});

// @desc    Get user's quote requests
// @route   GET /api/quotes/user
// @access  Private
const getUserQuotes = asyncHandler(async (req, res) => {
    const quotes = await Quote.find({ user: req.user._id })
        .populate('product', 'name price image')
        .populate('adminResponse.respondedBy', 'name')
        .sort({ createdAt: -1 });

    res.json(quotes);
});

// @desc    Get all quote requests (Admin)
// @route   GET /api/admin/quotes
// @access  Private/Admin
const getAllQuotes = asyncHandler(async (req, res) => {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const quotes = await Quote.find(filter)
        .populate('user', 'name email wholesaleProfile.businessName')
        .populate('product', 'name price image pricingTiers')
        .populate('adminResponse.respondedBy', 'name')
        .sort({ createdAt: -1 });

    res.json(quotes);
});

// @desc    Approve quote
// @route   PUT /api/admin/quotes/:id/approve
// @access  Private/Admin
const approveQuote = asyncHandler(async (req, res) => {
    const { approvedPrice, message } = req.body;

    const quote = await Quote.findById(req.params.id)
        .populate('user', 'name email')
        .populate('product', 'name');

    if (!quote) {
        res.status(404);
        throw new Error('Quote not found');
    }

    quote.status = 'approved';
    quote.adminResponse = {
        respondedBy: req.user._id,
        respondedAt: Date.now(),
        approvedPrice,
        message,
    };

    const updatedQuote = await quote.save();

    // Send email notification to user
    try {
        await sendEmail({
            email: quote.user.email,
            subject: 'Quote Request Approved',
            message: `Your quote request for ${quote.product.name} has been approved at ₹${approvedPrice} per unit. ${message || ''}`,
        });
    } catch (error) {
        console.log('Email notification failed:', error);
    }

    res.json(updatedQuote);
});

// @desc    Reject quote
// @route   PUT /api/admin/quotes/:id/reject
// @access  Private/Admin
const rejectQuote = asyncHandler(async (req, res) => {
    const { message } = req.body;

    const quote = await Quote.findById(req.params.id)
        .populate('user', 'name email')
        .populate('product', 'name');

    if (!quote) {
        res.status(404);
        throw new Error('Quote not found');
    }

    quote.status = 'rejected';
    quote.adminResponse = {
        respondedBy: req.user._id,
        respondedAt: Date.now(),
        message,
    };

    const updatedQuote = await quote.save();

    // Send email notification to user
    try {
        await sendEmail({
            email: quote.user.email,
            subject: 'Quote Request Update',
            message: `Your quote request for ${quote.product.name} has been rejected. ${message || ''}`,
        });
    } catch (error) {
        console.log('Email notification failed:', error);
    }

    res.json(updatedQuote);
});

// @desc    Counter-offer quote
// @route   PUT /api/admin/quotes/:id/counter-offer
// @access  Private/Admin
const counterOfferQuote = asyncHandler(async (req, res) => {
    const { counterOfferPrice, message } = req.body;

    const quote = await Quote.findById(req.params.id)
        .populate('user', 'name email')
        .populate('product', 'name');

    if (!quote) {
        res.status(404);
        throw new Error('Quote not found');
    }

    quote.status = 'counter-offered';
    quote.adminResponse = {
        respondedBy: req.user._id,
        respondedAt: Date.now(),
        counterOfferPrice,
        message,
    };

    const updatedQuote = await quote.save();

    // Send email notification to user
    try {
        await sendEmail({
            email: quote.user.email,
            subject: 'Quote Counter-Offer',
            message: `We have a counter-offer for your quote request for ${quote.product.name} at ₹${counterOfferPrice} per unit. ${message || ''}`,
        });
    } catch (error) {
        console.log('Email notification failed:', error);
    }

    res.json(updatedQuote);
});

module.exports = {
    requestQuote,
    getUserQuotes,
    getAllQuotes,
    approveQuote,
    rejectQuote,
    counterOfferQuote,
};
