const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon,
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createCoupon).get(protect, admin, getCoupons);
router.post('/validate', protect, validateCoupon);
router.route('/:id').delete(protect, admin, deleteCoupon);

module.exports = router;
