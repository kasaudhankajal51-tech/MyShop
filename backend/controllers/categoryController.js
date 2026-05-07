const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image, isActive } = req.body;

    const category = new Category({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        image,
        isActive: isActive !== undefined ? isActive : true,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const { name, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name;
        if (description) category.description = description;
        if (image) category.image = image;
        if (isActive !== undefined) category.isActive = isActive;
        // Re-generate slug if name changed? Optional but recommended
        if (category.name !== name) {
            category.slug = name.toLowerCase().replace(/\s+/g, '-');
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
