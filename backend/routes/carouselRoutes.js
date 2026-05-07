const express = require('express');
const router = express.Router();
const {
    getCarouselItems,
    createCarouselItem,
    updateCarouselItem,
    deleteCarouselItem,
} = require('../controllers/carouselController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCarouselItems)
    .post(protect, admin, createCarouselItem);

router.route('/:id')
    .put(protect, admin, updateCarouselItem)
    .delete(protect, admin, deleteCarouselItem);

module.exports = router;
