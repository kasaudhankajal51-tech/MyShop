const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const User = require('./models/userModel');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const createKidsProducts = async () => {
    await connectDB();
    try {
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('Admin user not found. Please run createAdmin.js first.');
            process.exit(1);
        }

        // Delete existing kids products to avoid duplication if run multiple times
        await Product.deleteMany({ category: 'kids' });

        const kidsProducts = [
            {
                name: "Floral Print Cotton Frock",
                slug: "floral-print-cotton-frock",
                price: 1299,
                compareAtPrice: 1999,
                description: "Lightweight and breathable pure cotton frock featuring elegant floral prints and a comfortable fit. Perfect for casual outings and play dates.",
                category: "kids",
                brand: "Balaji Kids",
                season: "summer",
                subcategory: "dresses",
                sizes: ["2-3Y", "4-5Y", "6-7Y"],
                colors: [
                    { name: "Sky Blue", hex: "#87CEEB" },
                    { name: "Peach Pink", hex: "#FFDAB9" }
                ],
                image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=1000",
                images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=1000"],
                countInStock: 25,
                rating: 4.8,
                numReviews: 12,
                isFeatured: true,
                isNewArrival: true,
                user: adminUser._id
            },
            {
                name: "Kids Ethnic Kurta Pajama Set",
                slug: "kids-ethnic-kurta-pajama-set",
                price: 1999,
                compareAtPrice: 2999,
                description: "Vibrant and soft cotton silk blend Kurta Pajama set for boys. Gentle on skin with festive embroidery details.",
                category: "kids",
                brand: "Balaji Kids Heritage",
                season: "winter",
                subcategory: "ethnic",
                sizes: ["3-4Y", "5-6Y", "7-8Y"],
                colors: [
                    { name: "Mustard Gold", hex: "#FFDB58" },
                    { name: "Royal Blue", hex: "#4169E1" }
                ],
                image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=1000",
                images: ["https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=1000"],
                countInStock: 15,
                rating: 4.9,
                numReviews: 8,
                isBestSeller: true,
                user: adminUser._id
            },
            {
                name: "Casual Denim dungaree Set",
                slug: "casual-denim-dungaree-set",
                price: 1599,
                compareAtPrice: 2499,
                description: "Fashionable denim dungaree paired with a soft striped cotton t-shirt. Durable design built for playtime.",
                category: "kids",
                brand: "Balaji Kids Contemporary",
                season: "summer",
                subcategory: "outerwear",
                sizes: ["1-2Y", "3-4Y", "5-6Y"],
                colors: [
                    { name: "Denim Blue", hex: "#1560BD" }
                ],
                image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=1000",
                images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=1000"],
                countInStock: 30,
                rating: 4.7,
                numReviews: 15,
                isNewArrival: true,
                user: adminUser._id
            }
        ];

        await Product.insertMany(kidsProducts);
        console.log('Kids Products Created successfully!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createKidsProducts();
