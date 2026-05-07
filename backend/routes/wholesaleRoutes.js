const express = require('express');
const router = express.Router();
const {
    registerWholesale,
    getPendingWholesale,
    getAllWholesaleAccounts,
    approveWholesale,
    rejectWholesale,
    getWholesaleStatus,
    getWholesaleStats,
} = require('../controllers/wholesaleController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.post('/register', protect, registerWholesale);
router.get('/status', protect, getWholesaleStatus);

// Admin routes
router.get('/admin/pending', protect, admin, getPendingWholesale);
router.get('/admin/accounts', protect, admin, getAllWholesaleAccounts);
router.get('/admin/stats', protect, admin, getWholesaleStats);
router.put('/admin/approve/:id', protect, admin, approveWholesale);
router.put('/admin/reject/:id', protect, admin, rejectWholesale);

module.exports = router;
