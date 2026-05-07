const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const User = require('./models/userModel');
const { addOrderItems } = require('./controllers/orderController');
const { createProduct, updateProduct } = require('./controllers/productController');

dotenv.config();

const runVerification = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected'.cyan.underline);

        // 1. Create Test User (Wholesaler)
        const testUserEmail = 'test_wholesaler_v2@example.com';
        await User.deleteOne({ email: testUserEmail });

        const user = await User.create({
            name: 'Test Wholesaler V2',
            email: testUserEmail,
            password: 'password123',
            role: 'user',
            wholesaleProfile: {
                approvalStatus: 'approved',
                businessName: 'Test Biz V2',
                gstNumber: '29ABCDE1234F1Z5'
            }
        });
        console.log(`Test User Created: ${user._id}`.green);

        // 2. Create Test Product (Wholesale Enabled with Images)
        const productData = {
            name: 'Wholesale Test Product V2',
            price: 1000,
            description: 'Test Description',
            category: 'Test',
            countInStock: 100,
            image: '/images/main.jpg',
            images: ['/images/main.jpg', '/images/side.jpg'],
            isWholesaleAvailable: true,
            minimumWholesaleQuantity: 10,
            pricingTiers: [
                { minQuantity: 10, pricePerUnit: 900 },
                { minQuantity: 50, pricePerUnit: 800 }
            ],
            gstRate: 18
        };

        // Mock Req/Res for Product Creation
        let createdProduct;
        const reqCreate = {
            user: { _id: user._id }, // Admin usually, but let's assume user has permission for this test or we mock admin
            body: productData
        };
        const resCreate = {
            status: (code) => ({ json: (data) => { createdProduct = data; } }),
            json: (data) => { createdProduct = data; }
        };

        // We need an admin user for createProduct usually. 
        // Let's temporarily make our user admin or stub the check? 
        // usage of createProduct in controller checks `req.user` for ownership? No, it's `protect` and `admin` middleware usually.
        // We are calling controller function directly, bypassing middleware.
        // Controller uses `req.user._id` to set `user`.

        await createProduct(reqCreate, resCreate);

        if (!createdProduct || !createdProduct._id) {
            throw new Error('Product creation failed');
        }
        console.log(`Test Product Created: ${createdProduct._id}`.green);
        console.log(`Product Images: ${createdProduct.images}`.cyan);

        // Verify Images Saved
        if (!createdProduct.images || createdProduct.images.length !== 2) {
            throw new Error('Product images not saved correctly');
        }

        // 3. Create Wholesale Order
        const orderQty = 12; // Should trigger Tier 1 (900)
        let createdOrder;
        const reqOrder = {
            user: user, // user object with wholesaleProfile
            body: {
                orderItems: [
                    {
                        product: createdProduct._id,
                        name: createdProduct.name,
                        qty: orderQty,
                        image: '/images/frontend_sent.jpg', // Frontend might send this
                        price: 1000 // Frontend might send retail
                    }
                ],
                shippingAddress: {
                    address: '123 Test St',
                    city: 'Test City',
                    postalCode: '12345',
                    country: 'India'
                },
                paymentMethod: 'COD',
                orderType: 'wholesale'
            }
        };

        const resOrder = {
            status: (code) => {
                console.log(`Order Status: ${code}`);
                return { json: (data) => { createdOrder = data; } };
            },
            json: (data) => { createdOrder = data; }
        };

        await addOrderItems(reqOrder, resOrder);

        if (!createdOrder || !createdOrder._id) {
            throw new Error('Order creation failed');
        }
        console.log(`Test Order Created: ${createdOrder._id}`.green);

        // 4. Verify Order Item Image
        const orderItem = createdOrder.orderItems[0];
        console.log(`Order Item Image: ${orderItem.image}`.cyan);

        if (orderItem.image !== '/images/main.jpg') {
            // Expecting backend to override frontend image with product.image
            // product.image was '/images/main.jpg'
            console.error(`Expected '/images/main.jpg', got '${orderItem.image}'`.red);
            throw new Error('Order item image mismatch! Backend did not use product image.');
        }

        // 5. Verify Price (Tier 1 = 900)
        console.log(`Order Item Price: ${orderItem.price}`.cyan);
        if (orderItem.price !== 900) {
            throw new Error(`Price mismatch! Expected 900, got ${orderItem.price}`);
        }

        console.log('VERIFICATION SUCCESSFUL: Wholesale System Integrity Confirmed'.green.bold);

        // Cleanup
        await User.deleteOne({ _id: user._id });
        await Product.deleteOne({ _id: createdProduct._id });
        await Order.deleteOne({ _id: createdOrder._id });
        console.log('Cleanup Done'.gray);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        console.error(error);
        process.exit(1);
    }
};

runVerification();
