const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    createProductReview,
    getWholesalePricing,
    setPricingTiers,
    getWholesaleProducts,
} = require('../controllers/productController');
const { getAlsoBought } = require('../controllers/recommendationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { isApprovedWholesale } = require('../middleware/wholesaleMiddleware');

router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/recommendations').get(getAlsoBought);
router.route('/:id/wholesale-pricing').get(protect, isApprovedWholesale, getWholesalePricing);
router.route('/:id/pricing-tiers').put(protect, admin, setPricingTiers);

// Dedicated Wholesale Route
router.get('/wholesale', protect, isApprovedWholesale, getWholesaleProducts);

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);

module.exports = router;
