const asyncHandler = require('express-async-handler');
const FlashDeal = require('../models/flashDealModel');

// @desc    Fetch all flash deals
// @route   GET /api/flashdeals
// @access  Public
const getFlashDeals = asyncHandler(async (req, res) => {
    const items = await FlashDeal.find({}).sort({ sortOrder: 1 });
    res.json(items);
});

// @desc    Create a flash deal
// @route   POST /api/flashdeals
// @access  Private/Admin
const createFlashDeal = asyncHandler(async (req, res) => {
    const { title, subtitle, image, link, originalPrice, discountPrice, discountPercent, isActive, sortOrder } = req.body;

    const item = new FlashDeal({
        title,
        subtitle,
        image,
        link,
        originalPrice,
        discountPrice,
        discountPercent,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
});

// @desc    Update a flash deal
// @route   PUT /api/flashdeals/:id
// @access  Private/Admin
const updateFlashDeal = asyncHandler(async (req, res) => {
    const { title, subtitle, image, link, originalPrice, discountPrice, discountPercent, isActive, sortOrder } = req.body;

    const item = await FlashDeal.findById(req.params.id);

    if (item) {
        item.title = title;
        if (subtitle !== undefined) item.subtitle = subtitle;
        if (image) item.image = image;
        if (link !== undefined) item.link = link;
        if (originalPrice !== undefined) item.originalPrice = originalPrice;
        if (discountPrice !== undefined) item.discountPrice = discountPrice;
        if (discountPercent !== undefined) item.discountPercent = discountPercent;
        if (isActive !== undefined) item.isActive = isActive;
        if (sortOrder !== undefined) item.sortOrder = sortOrder;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Flash deal not found');
    }
});

// @desc    Delete a flash deal
// @route   DELETE /api/flashdeals/:id
// @access  Private/Admin
const deleteFlashDeal = asyncHandler(async (req, res) => {
    const item = await FlashDeal.findById(req.params.id);

    if (item) {
        await item.deleteOne();
        res.json({ message: 'Flash deal removed' });
    } else {
        res.status(404);
        throw new Error('Flash deal not found');
    }
});

module.exports = {
    getFlashDeals,
    createFlashDeal,
    updateFlashDeal,
    deleteFlashDeal,
};
