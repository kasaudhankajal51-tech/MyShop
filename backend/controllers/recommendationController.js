const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// @desc    Get "Customers Also Bought" recommendations
// @route   GET /api/products/:id/recommendations
// @access  Public
const getAlsoBought = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // 1. Find orders that contain this product
    const orders = await Order.find({ 'orderItems.product': productId })
        .select('orderItems')
        .limit(50); // Limit analysis to last 50 orders for performance

    if (!orders || orders.length === 0) {
        return res.json([]);
    }

    // 2. Extract other products from these orders
    const productFrequency = {};

    orders.forEach(order => {
        order.orderItems.forEach(item => {
            if (item.product.toString() !== productId) {
                const id = item.product.toString();
                productFrequency[id] = (productFrequency[id] || 0) + 1;
            }
        });
    });

    // 3. Sort by frequency
    const sortedProductIds = Object.keys(productFrequency).sort(
        (a, b) => productFrequency[b] - productFrequency[a]
    ).slice(0, 8); // Top 8 recommendations

    // 4. Fetch full product details
    const recommendations = await Product.find({ _id: { $in: sortedProductIds } });

    // Maintain sorted order
    const sortedRecommendations = sortedProductIds
        .map(id => recommendations.find(p => p._id.toString() === id))
        .filter(p => p !== undefined);

    res.json(sortedRecommendations);
});

// @desc    Record a product view
// @route   POST /api/users/history
// @access  Private
const recordProductView = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        // Remove existing view of same product to avoid duplicates/push to top
        user.recentlyViewed = user.recentlyViewed.filter(
            item => item.product.toString() !== productId
        );

        // Add to front
        user.recentlyViewed.unshift({ product: productId, viewedAt: Date.now() });

        // Keep only last 20 views
        if (user.recentlyViewed.length > 20) {
            user.recentlyViewed.pop();
        }

        await user.save();
        res.status(200).json({ message: 'View recorded' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user's recently viewed products
// @route   GET /api/users/history
// @access  Private
const getRecentlyViewed = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('recentlyViewed.product');

    if (user) {
        const viewedProducts = user.recentlyViewed.map(item => item.product);
        res.json(viewedProducts);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getAlsoBought,
    recordProductView,
    getRecentlyViewed
};
