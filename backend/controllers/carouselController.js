const asyncHandler = require('express-async-handler');
const Carousel = require('../models/carouselModel');

// @desc    Fetch all carousel items
// @route   GET /api/carousel
// @access  Public
const getCarouselItems = asyncHandler(async (req, res) => {
    const items = await Carousel.find({}).sort({ sortOrder: 1 });
    res.json(items);
});

// @desc    Create a carousel item
// @route   POST /api/carousel
// @access  Private/Admin
const createCarouselItem = asyncHandler(async (req, res) => {
    const { title, subtitle, image, link, isActive, sortOrder } = req.body;

    const item = new Carousel({
        title,
        subtitle,
        image,
        link,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
});

// @desc    Update a carousel item
// @route   PUT /api/carousel/:id
// @access  Private/Admin
const updateCarouselItem = asyncHandler(async (req, res) => {
    const { title, subtitle, image, link, isActive, sortOrder } = req.body;

    const item = await Carousel.findById(req.params.id);

    if (item) {
        item.title = title;
        if (subtitle !== undefined) item.subtitle = subtitle;
        if (image) item.image = image;
        if (link !== undefined) item.link = link;
        if (isActive !== undefined) item.isActive = isActive;
        if (sortOrder !== undefined) item.sortOrder = sortOrder;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Carousel item not found');
    }
});

// @desc    Delete a carousel item
// @route   DELETE /api/carousel/:id
// @access  Private/Admin
const deleteCarouselItem = asyncHandler(async (req, res) => {
    const item = await Carousel.findById(req.params.id);

    if (item) {
        await item.deleteOne();
        res.json({ message: 'Carousel item removed' });
    } else {
        res.status(404);
        throw new Error('Carousel item not found');
    }
});

module.exports = {
    getCarouselItems,
    createCarouselItem,
    updateCarouselItem,
    deleteCarouselItem,
};
