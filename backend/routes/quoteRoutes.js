const express = require('express');
const router = express.Router();
const {
    requestQuote,
    getUserQuotes,
    getAllQuotes,
    approveQuote,
    rejectQuote,
    counterOfferQuote,
} = require('../controllers/quoteController');
const { protect, admin } = require('../middleware/authMiddleware');
const { isApprovedWholesale } = require('../middleware/wholesaleMiddleware');

// User routes
router.post('/request', protect, isApprovedWholesale, requestQuote);
router.get('/user', protect, getUserQuotes);

// Admin routes
router.get('/admin', protect, admin, getAllQuotes);
router.put('/admin/:id/approve', protect, admin, approveQuote);
router.put('/admin/:id/reject', protect, admin, rejectQuote);
router.put('/admin/:id/counter-offer', protect, admin, counterOfferQuote);

module.exports = router;
