const express = require('express');
const router = express.Router();
const {
    handleQuery,
    getWelcomeMessage,
    getAllFAQs
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/query', handleQuery);
router.get('/welcome', getWelcomeMessage);
router.get('/faqs', getAllFAQs);

// Protected routes (optional - for personalized responses)
router.post('/query/auth', protect, handleQuery);

module.exports = router;
