
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

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

const migrateUsers = async () => {
    await connectDB();

    try {
        const result = await User.updateMany(
            { accountType: { $exists: false } },
            { $set: { accountType: 'retail' } }
        );

        console.log(`Migration Complete:`);
        console.log(`Matched Count: ${result.matchedCount}`);
        console.log(`Modified Count: ${result.modifiedCount}`);

        const nullResult = await User.updateMany(
            { accountType: null },
            { $set: { accountType: 'retail' } }
        );
        
        console.log(`Null Migration Complete:`);
        console.log(`Matched Count: ${nullResult.matchedCount}`);
        console.log(`Modified Count: ${nullResult.modifiedCount}`);

    } catch (error) {
        console.error('Error migrating users:', error);
    } finally {
        mongoose.disconnect();
    }
};

migrateUsers();
