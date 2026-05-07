const express = require('express');
const router = express.Router();
const {
    getLookbooks,
    getAllLookbooksAdmin,
    getLookbookById,
    createLookbook,
    updateLookbook,
    deleteLookbook
} = require('../controllers/lookbookController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getLookbooks).post(protect, admin, createLookbook);
router.get('/admin', protect, admin, getAllLookbooksAdmin);
router
    .route('/:id')
    .get(protect, admin, getLookbookById)
    .put(protect, admin, updateLookbook)
    .delete(protect, admin, deleteLookbook);

module.exports = router;
