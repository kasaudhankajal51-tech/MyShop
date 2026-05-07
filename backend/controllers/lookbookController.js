const asyncHandler = require('express-async-handler');
const Lookbook = require('../models/lookbookModel');

// @desc    Get all active lookbooks
// @route   GET /api/lookbook
// @access  Public
const getLookbooks = asyncHandler(async (req, res) => {
    const lookbooks = await Lookbook.find({ isActive: true })
        .populate({
            path: 'hotspots.productId',
            select: 'name price images category slug' // Select needed fields
        })
        .sort({ createdAt: -1 });

    // Filter out hotspots where product might have been deleted (productId is null)
    const sanitizedLookbooks = lookbooks.map(lb => {
        const lbObj = lb.toObject();
        lbObj.hotspots = lbObj.hotspots.filter(h => h.productId != null);
        return lbObj;
    });

    res.json(sanitizedLookbooks);
});

// @desc    Get all lookbooks (Admin)
// @route   GET /api/lookbook/admin
// @access  Private/Admin
const getAllLookbooksAdmin = asyncHandler(async (req, res) => {
    const lookbooks = await Lookbook.find({}).sort({ createdAt: -1 });
    res.json(lookbooks);
});

// @desc    Get lookbook by ID
// @route   GET /api/lookbook/:id
// @access  Private/Admin
const getLookbookById = asyncHandler(async (req, res) => {
    const lookbook = await Lookbook.findById(req.params.id);
    if (lookbook) {
        res.json(lookbook);
    } else {
        res.status(404);
        throw new Error('Lookbook not found');
    }
});

// @desc    Create a lookbook
// @route   POST /api/lookbook
// @access  Private/Admin
const createLookbook = asyncHandler(async (req, res) => {
    const { title, description, image, hotspots, isActive } = req.body;

    const lookbook = new Lookbook({
        title,
        description,
        image,
        hotspots,
        isActive: isActive !== undefined ? isActive : true
    });

    const createdLookbook = await lookbook.save();
    res.status(201).json(createdLookbook);
});

// @desc    Update a lookbook
// @route   PUT /api/lookbook/:id
// @access  Private/Admin
const updateLookbook = asyncHandler(async (req, res) => {
    const { title, description, image, hotspots, isActive } = req.body;
    const lookbook = await Lookbook.findById(req.params.id);

    if (lookbook) {
        lookbook.title = title || lookbook.title;
        lookbook.description = description !== undefined ? description : lookbook.description;
        lookbook.image = image || lookbook.image;
        if (hotspots) lookbook.hotspots = hotspots;
        if (isActive !== undefined) lookbook.isActive = isActive;

        const updatedLookbook = await lookbook.save();
        res.json(updatedLookbook);
    } else {
        res.status(404);
        throw new Error('Lookbook not found');
    }
});

// @desc    Delete a lookbook
// @route   DELETE /api/lookbook/:id
// @access  Private/Admin
const deleteLookbook = asyncHandler(async (req, res) => {
    const lookbook = await Lookbook.findById(req.params.id);

    if (lookbook) {
        await lookbook.deleteOne();
        res.json({ message: 'Lookbook removed' });
    } else {
        res.status(404);
        throw new Error('Lookbook not found');
    }
});

module.exports = {
    getLookbooks,
    getAllLookbooksAdmin,
    getLookbookById,
    createLookbook,
    updateLookbook,
    deleteLookbook
};
