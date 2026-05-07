require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/orderModel');
const fs = require('fs');

const verifyOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const totalOrders = await Order.countDocuments();
        const retailOrders = await Order.countDocuments({ orderType: 'retail' });
        const wholesaleOrders = await Order.countDocuments({ orderType: 'wholesale' });
        const missingTypeOrders = await Order.countDocuments({ orderType: { $exists: false } });
        const nullTypeOrders = await Order.countDocuments({ orderType: null });
        const otherTypeOrders = await Order.countDocuments({
            orderType: { $nin: ['retail', 'wholesale'], $exists: true, $ne: null }
        });

        const output = `
--- Order Stats ---
Total Orders: ${totalOrders}
Retail Orders: ${retailOrders}
Wholesale Orders: ${wholesaleOrders}
Missing orderType: ${missingTypeOrders}
Null orderType: ${nullTypeOrders}
Other orderType: ${otherTypeOrders}
`;

        console.log(output);
        fs.writeFileSync('order_stats.txt', output);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyOrders();
