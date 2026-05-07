const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// @desc    Get admin analytics (sales statistics)
// @route   GET /api/analytics/admin
// @access  Private/Admin
const getAdminAnalytics = asyncHandler(async (req, res) => {
    const { startDate, endDate, orderType } = req.query;

    // Build filters
    const orderFilter = {};
    const userFilter = { role: 'user' };

    if (startDate || endDate) {
        orderFilter.createdAt = {};
        if (startDate) orderFilter.createdAt.$gte = new Date(startDate);
        if (endDate) orderFilter.createdAt.$lte = new Date(endDate);
    }

    if (orderType) {
        if (orderType === 'wholesale') {
            orderFilter.orderType = 'wholesale';
            userFilter.accountType = 'wholesale';
        } else {
            // Retail: Include 'retail', null, or missing orderType
            orderFilter.$or = [
                { orderType: 'retail' },
                { orderType: { $exists: false } },
                { orderType: null }
            ];
            // userFilter remains heuristic
            userFilter.accountType = { $ne: 'wholesale' };
        }
    }

    // Get total orders and revenue
    const orders = await Order.find(orderFilter);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get total customers
    const totalCustomers = await User.countDocuments(userFilter);

    // Get paid orders count
    const paidOrders = orders.filter(order => order.isPaid).length;

    // Get delivered orders count
    const deliveredOrders = orders.filter(order => order.isDelivered).length;

    // Calculate period comparison if date range provided
    let periodComparison = null;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const periodLength = end - start;

        const previousStart = new Date(start.getTime() - periodLength);
        const previousEnd = new Date(start);

        const previousFilter = {
            createdAt: {
                $gte: previousStart,
                $lte: previousEnd
            }
        };

        if (orderType) {
            if (orderType === 'wholesale') {
                previousFilter.orderType = 'wholesale';
            } else {
                previousFilter.$or = [
                    { orderType: 'retail' },
                    { orderType: { $exists: false } },
                    { orderType: null }
                ];
            }
        }

        const previousOrders = await Order.find(previousFilter);

        const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const revenueGrowth = previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
            : 0;

        periodComparison = {
            previousRevenue,
            previousOrders: previousOrders.length,
            revenueGrowth: revenueGrowth.toFixed(2),
            ordersGrowth: previousOrders.length > 0
                ? (((totalOrders - previousOrders.length) / previousOrders.length) * 100).toFixed(2)
                : 0
        };
    }

    res.json({
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders,
        totalCustomers,
        averageOrderValue: averageOrderValue.toFixed(2),
        paidOrders,
        deliveredOrders,
        periodComparison
    });
});

// @desc    Get best performing products
// @route   GET /api/analytics/admin/products
// @access  Private/Admin
const getBestPerformingProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const { startDate, endDate, orderType } = req.query;

    // Build filter
    const matchStage = {};

    if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    if (orderType) {
        if (orderType === 'wholesale') {
            matchStage.orderType = 'wholesale';
        } else {
            matchStage.$or = [
                { orderType: 'retail' },
                { orderType: { $exists: false } },
                { orderType: null }
            ];
        }
    }

    // Aggregate product sales from orders
    const productStats = await Order.aggregate([
        // Filter by date and type if provided
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        // Unwind order items
        { $unwind: '$orderItems' },
        // Group by product
        {
            $group: {
                _id: '$orderItems.product',
                totalQuantity: { $sum: '$orderItems.qty' },
                totalRevenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } },
                productName: { $first: '$orderItems.name' },
                productImage: { $first: '$orderItems.image' },
                productPrice: { $first: '$orderItems.price' }
            }
        },
        // Sort by revenue (descending)
        { $sort: { totalRevenue: -1 } },
        // Limit results
        { $limit: limit }
    ]);

    // Enrich with current product data
    const enrichedStats = await Promise.all(
        productStats.map(async (stat) => {
            const product = await Product.findById(stat._id).select('countInStock rating numReviews');
            return {
                productId: stat._id,
                name: stat.productName,
                image: stat.productImage,
                price: stat.productPrice,
                totalQuantitySold: stat.totalQuantity,
                totalRevenue: stat.totalRevenue.toFixed(2),
                currentStock: product ? product.countInStock : 0,
                rating: product ? product.rating : 0,
                numReviews: product ? product.numReviews : 0
            };
        })
    );

    res.json(enrichedStats);
});

// @desc    Get user purchase analytics
// @route   GET /api/analytics/user/purchases
// @access  Private
const getUserPurchaseAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get all user orders
    const orders = await Order.find({ user: userId })
        .populate('orderItems.product', 'name image price')
        .sort({ createdAt: -1 });

    // Calculate statistics
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) =>
        sum + order.orderItems.reduce((itemSum, item) => itemSum + item.qty, 0), 0
    );

    // Group orders by month
    const monthlyBreakdown = {};
    orders.forEach(order => {
        const monthYear = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });

        if (!monthlyBreakdown[monthYear]) {
            monthlyBreakdown[monthYear] = {
                orders: 0,
                spent: 0,
                items: 0
            };
        }

        monthlyBreakdown[monthYear].orders += 1;
        monthlyBreakdown[monthYear].spent += order.totalPrice;
        monthlyBreakdown[monthYear].items += order.orderItems.reduce((sum, item) => sum + item.qty, 0);
    });

    // Get member since date
    const user = await User.findById(userId);
    const memberSince = user.createdAt;

    res.json({
        totalSpent: totalSpent.toFixed(2),
        totalOrders,
        totalItems,
        memberSince,
        monthlyBreakdown,
        recentOrders: orders.slice(0, 5) // Last 5 orders
    });
});

// @desc    Get reorder suggestions
// @route   GET /api/analytics/user/reorder-suggestions
// @access  Private
const getReorderSuggestions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Get all user orders
    const orders = await Order.find({ user: userId });

    // Analyze purchase history
    const productPurchases = {};

    orders.forEach(order => {
        order.orderItems.forEach(item => {
            const productId = item.product.toString();

            if (!productPurchases[productId]) {
                productPurchases[productId] = {
                    productId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    purchaseCount: 0,
                    lastPurchased: null,
                    totalQuantity: 0
                };
            }

            productPurchases[productId].purchaseCount += 1;
            productPurchases[productId].totalQuantity += item.qty;

            // Update last purchased date
            if (!productPurchases[productId].lastPurchased ||
                new Date(order.createdAt) > new Date(productPurchases[productId].lastPurchased)) {
                productPurchases[productId].lastPurchased = order.createdAt;
            }
        });
    });

    // Filter for reorder candidates
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const reorderCandidates = Object.values(productPurchases)
        .filter(product => {
            // Purchased at least twice
            if (product.purchaseCount < 2) return false;

            // Not purchased in last 30 days
            if (new Date(product.lastPurchased) > thirtyDaysAgo) return false;

            return true;
        })
        .sort((a, b) => b.purchaseCount - a.purchaseCount);

    // Check product availability and enrich data
    const suggestions = [];

    for (const candidate of reorderCandidates) {
        if (suggestions.length >= limit) break;

        const product = await Product.findById(candidate.productId)
            .select('name image price countInStock rating slug');

        // Only suggest if in stock
        if (product && product.countInStock > 0) {
            suggestions.push({
                productId: candidate.productId,
                name: product.name,
                image: product.image,
                price: product.price,
                slug: product.slug,
                countInStock: product.countInStock,
                rating: product.rating,
                purchaseCount: candidate.purchaseCount,
                lastPurchased: candidate.lastPurchased,
                totalQuantityPurchased: candidate.totalQuantity,
                daysSinceLastPurchase: Math.floor(
                    (new Date() - new Date(candidate.lastPurchased)) / (1000 * 60 * 60 * 24)
                )
            });
        }
    }

    res.json(suggestions);
});

module.exports = {
    getAdminAnalytics,
    getBestPerformingProducts,
    getUserPurchaseAnalytics,
    getReorderSuggestions
};
