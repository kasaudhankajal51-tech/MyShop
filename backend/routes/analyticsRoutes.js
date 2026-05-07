const express = require('express');
const router = express.Router();
const {
    getAdminAnalytics,
    getBestPerformingProducts,
    getUserPurchaseAnalytics,
    getReorderSuggestions
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin routes
router.get('/admin', protect, admin, getAdminAnalytics);
router.get('/admin/products', protect, admin, getBestPerformingProducts);

// User routes
router.get('/user/purchases', protect, getUserPurchaseAnalytics);
router.get('/user/reorder-suggestions', protect, getReorderSuggestions);

module.exports = router;
