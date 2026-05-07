const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    getUsers,
    updateUser,
    deleteUser,
    getUserById,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    addAddress,
    getAddresses,
    deleteAddress,
    updateUserProfile,
} = require('../controllers/userController');
const {
    forgotPassword,
    verifyOtp,
    resetPassword
} = require('../controllers/authController');
const { recordProductView, getRecentlyViewed } = require('../controllers/recommendationController');
const { protect, admin } = require('../middleware/authMiddleware');
const passport = require('passport');
const generateToken = require('../utils/generateToken');

router.post('/login', authUser);
router.get('/google/retail', passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'retail'
}));

router.get('/google/wholesale', passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: 'wholesale'
}));

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user._id);
        const accountType = req.user.accountType || 'retail';

        // Determine redirect URL based on account type
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080'; // Default to Vite default port
        let redirectPath = '/auth/success';

        // You might want to pass the role/accountType to the frontend too via query param
        res.redirect(`${frontendUrl}${redirectPath}?token=${token}&accountType=${accountType}`);
    }
);
router.route('/').post(registerUser).get(protect, admin, getUsers);

// OTP Routes - MUST come before /profile to avoid route conflicts
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Profile routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/address')
    .post(protect, addAddress)
    .get(protect, getAddresses);

router.route('/address/:id')
    .delete(protect, deleteAddress);

// History routes
router.route('/history')
    .post(protect, recordProductView)
    .get(protect, getRecentlyViewed);

// Wishlist routes
router.route('/wishlist')
    .get(protect, getWishlist);
router.route('/wishlist/:id')
    .post(protect, addToWishlist)
    .delete(protect, removeFromWishlist);

// Admin user management
router.route('/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
