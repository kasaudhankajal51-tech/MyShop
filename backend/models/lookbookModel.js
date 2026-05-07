const mongoose = require('mongoose');

const hotspotSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    x: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    y: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, { _id: false });

const lookbookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String, // URL
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    hotspots: [hotspotSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Lookbook', lookbookSchema);
