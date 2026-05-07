const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema(
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
        position: {
            type: String,
            default: 'hero', // hero, sidebar, footer
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

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
