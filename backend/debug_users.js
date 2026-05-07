
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const fs = require('fs');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkUsers = async () => {
    await connectDB();

    try {
        const allUsers = await User.countDocuments({});
        const retailUsers = await User.countDocuments({ accountType: 'retail' });
        const wholesaleUsers = await User.countDocuments({ accountType: 'wholesale' });
        const undefinedAccountType = await User.countDocuments({ accountType: { $exists: false } });
        const nullAccountType = await User.countDocuments({ accountType: null });

        const output = JSON.stringify({
            allUsers,
            retailUsers,
            wholesaleUsers,
            undefinedAccountType,
            nullAccountType
        }, null, 2);

        fs.writeFileSync('debug_output.txt', output);
        console.log('Output written to debug_output.txt');

    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        mongoose.disconnect();
    }
};

checkUsers();
