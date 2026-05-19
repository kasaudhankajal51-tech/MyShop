const mongoose = require('mongoose');

const connectDB = async () => {
    const primaryURI = process.env.MONGO_URI;
    const fallbackURI = 'mongodb://127.0.0.1:27017/myshop';

    try {
        // Attempt primary connection to MongoDB Atlas
        const conn = await mongoose.connect(primaryURI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout before trying fallback
        });
        console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
    } catch (error) {
        console.error(`\n⚠️ MongoDB Atlas Connection Failed!`);
        console.error(`Error details: ${error.message}`);
        console.error(`👉 This is commonly caused by your current IP address not being whitelisted in MongoDB Atlas.`);
        console.error(`🔗 Add your IP to the Atlas whitelist: https://cloud.mongodb.com/`);
        
        console.log(`\n🔄 Attempting to connect to Local MongoDB fallback...`);
        try {
            const conn = await mongoose.connect(fallbackURI, {
                serverSelectionTimeoutMS: 3000 // 3 seconds timeout
            });
            console.log(`✅ Connected to Local MongoDB Fallback: ${conn.connection.host}`);
            console.log(`⚠️  Note: You are now using a local database. Remote data will not be available.\n`);
        } catch (fallbackError) {
            console.error(`❌ Local MongoDB Fallback Connection Failed!`);
            console.error(`Error details: ${fallbackError.message}`);
            console.error(`💡 Ensure MongoDB is running locally (e.g., run 'net start MongoDB' or start 'mongod' in PowerShell).`);
            console.error(`⚠️  The application will proceed starting, but database queries will fail until a connection is established.\n`);
            
            // Prevent queries from hanging infinitely when not connected
            mongoose.set('bufferCommands', false);
        }
    }
};

module.exports = connectDB;
