const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const createAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'kasaudhankajal48@gmail.com' });

        if (adminExists) {
            console.log('Admin user already exists.'.yellow);
            console.log('Credentials: kasaudhankajal48@gmail.com / password123 (if not changed)');
            process.exit();
        }

        const user = await User.create({
            name: 'Kajal Kasaudhan',
            email: 'kasaudhankajal48@gmail.com',
            password: 'password123',
            role: 'admin',
        });

        console.log('Admin User Created!'.green.inverse);
        console.log('Email: kasaudhankajal48@gmail.com');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

createAdmin();
