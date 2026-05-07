const express = require('express');
const router = express.Router();
const { toggleShoppingMode, setShoppingMode, getShoppingMode } = require('../controllers/modeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getShoppingMode);
router.route('/toggle').post(protect, toggleShoppingMode);
router.route('/set').post(protect, setShoppingMode);

module.exports = router;
