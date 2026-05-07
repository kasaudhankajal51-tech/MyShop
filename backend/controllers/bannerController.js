const asyncHandler = require('express-async-handler');
const Banner = require('../models/bannerModel');

// @desc    Fetch all banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find({}).sort({ sortOrder: 1 });
    res.json(banners);
});

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, image, link, position, isActive, sortOrder } = req.body;

    const banner = new Banner({
        title,
        subtitle,
        image,
        link,
        position,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, image, link, position, isActive, sortOrder } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
        banner.title = title;
        if (subtitle !== undefined) banner.subtitle = subtitle;
        if (image) banner.image = image;
        if (link !== undefined) banner.link = link;
        if (position) banner.position = position;
        if (isActive !== undefined) banner.isActive = isActive;
        if (sortOrder !== undefined) banner.sortOrder = sortOrder;

        const updatedBanner = await banner.save();
        res.json(updatedBanner);
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
        await banner.deleteOne();
        res.json({ message: 'Banner removed' });
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

module.exports = {
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
};
