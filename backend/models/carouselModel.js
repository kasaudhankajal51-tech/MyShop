const mongoose = require('mongoose');

const carouselSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
        link: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel;
