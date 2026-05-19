const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding Categories');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedCategories = async () => {
    await connectDB();
    try {
        // Clear existing categories
        await Category.deleteMany({});

        const categories = [
            {
                name: "Women",
                slug: "women",
                description: "Elegant Traditional & Contemporary Saree, Suit, Lehenga Wear",
                image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000",
                isActive: true
            },
            {
                name: "Men",
                slug: "men",
                description: "Premium Royal Sherwani, Kurta Pajama & Indo-Western wear",
                image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1000",
                isActive: true
            },
            {
                name: "Kids",
                slug: "kids",
                description: "Playful, Colorful & Comfortable Kids Wear",
                image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=1000",
                isActive: true
            },
            {
                name: "Winter Collection",
                slug: "winter",
                description: "Stay Warm in Style with Regal Winter wear & Shawls",
                image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000",
                isActive: true
            }
        ];

        await Category.insertMany(categories);
        console.log('Categories Seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
