const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const carouselRoutes = require('./routes/carouselRoutes');
const flashDealRoutes = require('./routes/flashDealRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contactRoutes = require('./routes/contactRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const couponRoutes = require('./routes/couponRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const modeRoutes = require('./routes/modeRoutes');
const wholesaleRoutes = require('./routes/wholesaleRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const lookbookRoutes = require('./routes/lookbookRoutes');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const passport = require('./config/passport'); // Import passport config (even if not used directly, it registers the strategy)

// Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/flashdeals', flashDealRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/mode', modeRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/lookbook', lookbookRoutes);


const __dirname1 = path.resolve();
app.use('/uploads', express.static(path.join(__dirname1, '/uploads')));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
