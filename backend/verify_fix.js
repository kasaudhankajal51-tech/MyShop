require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/orderModel');
const fs = require('fs');

const verifyFix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Simulate the query logic used in the fix
        const retailQuery = {
            $or: [
                { orderType: 'retail' },
                { orderType: { $exists: false } },
                { orderType: null }
            ]
        };

        const retailOrders = await Order.find(retailQuery);
        console.log(`Retail Orders Found (with fix logic): ${retailOrders.length}`);

        const output = `
--- Verification Result ---
Retail Orders Found: ${retailOrders.length}
`;
        console.log(output);
        fs.writeFileSync('verification_result.txt', output);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyFix();
