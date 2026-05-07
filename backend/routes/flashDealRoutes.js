const express = require('express');
const router = express.Router();
const {
    getFlashDeals,
    createFlashDeal,
    updateFlashDeal,
    deleteFlashDeal,
} = require('../controllers/flashDealController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getFlashDeals)
    .post(protect, admin, createFlashDeal);

router.route('/:id')
    .put(protect, admin, updateFlashDeal)
    .delete(protect, admin, deleteFlashDeal);

module.exports = router;
