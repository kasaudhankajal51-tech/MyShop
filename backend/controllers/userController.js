const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const passport = require('passport');
const sendEmail = require('../utils/sendEmail');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            accountType: user.accountType,
            wishlist: user.wishlist,
            wholesaleProfile: user.wholesaleProfile,
            token: generateToken(user._id),
        });

        // Send Login Alert Email
        try {
            const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            const message = `
                <h1>New Login Alert ⚠️</h1>
                <p>Hi ${user.name},</p>
                <p>Your account was just accessed on <b>${loginTime}</b>.</p>
                <p>If this was you, you can ignore this email.</p>
                <p>If not, please reset your password immediately.</p>
                <br>
                <p>Regards,</p>
                <p>Jai Shree Balaji Readymade Security Team</p>
            `;

            await sendEmail({
                email: user.email,
                subject: 'New Login to your Account 🔐',
                message: `New login detected for ${user.name}`,
                html: message,
            });
        } catch (error) {
            console.error('Login alert email failed:', error);
        }

        // Send Login Alert Email
        try {
            const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            const message = `
                <h1>New Login Alert ⚠️</h1>
                <p>Hi ${user.name},</p>
                <p>Your account was just accessed on <b>${loginTime}</b>.</p>
                <p>If this was you, you can ignore this email.</p>
                <p>If not, please reset your password immediately.</p>
                <br>
                <p>Regards,</p>
                <p>Jai Shree Balaji Readymade Security Team</p>
            `;

            await sendEmail({
                email: user.email,
                subject: 'New Login to your Account 🔐',
                message: `New login detected for ${user.name}`,
                html: message,
            });
        } catch (error) {
            console.error('Login alert email failed:', error);
        }
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, accountType } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        accountType: accountType || 'retail', // Default to retail if not specified
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            wishlist: user.wishlist,
            token: generateToken(user._id),
        });

        // Send Welcome Email
        const message = `
            <h1>Welcome to Jai Shree Balaji Readymade! 🎉</h1>
            <p>Hi ${user.name},</p>
            <p>Thank you for creating an account with us. We are excited to have you on board!</p>
            <p>Explore our latest collection and enjoy a seamless shopping experience.</p>
            <br>
            <p>Best Regards,</p>
            <p>The Jai Shree Balaji Readymade Team</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Jai Shree Balaji Readymade! 🛍️',
                message: `Hi ${user.name}, Welcome to Jai Shree Balaji Readymade!`, // Fallback text
                html: message,
            });
        } catch (error) {
            console.error('Welcome email failed:', error);
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            accountType: user.accountType,
            wishlist: user.wishlist,
            wholesaleProfile: user.wholesaleProfile,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone; // Update phone
        user.avatar = req.body.avatar || user.avatar; // Update avatar

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.role === 'admin',
            phone: updatedUser.phone, // Return phone
            avatar: updatedUser.avatar, // Return avatar
            wishlist: updatedUser.wishlist,
            accountType: updatedUser.accountType,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.accountType) {
        filter.accountType = req.query.accountType;
    }
    const users = await User.find(filter);
    res.json(users);
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        if (req.body.phone !== undefined) {
            user.phone = req.body.phone;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Add item to wishlist
// @route   POST /api/users/wishlist/:id
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.id);

    if (user && product) {
        if (user.wishlist.includes(product._id)) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }

        user.wishlist.push(product._id);
        await user.save();
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User or Product not found');
    }
});

// @desc    Remove item from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.wishlist = user.wishlist.filter(
            (productId) => productId.toString() !== req.params.id
        );
        await user.save();
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    googleAuth: passport.authenticate('google', { scope: ['profile', 'email'] }),
    googleAuthCallback: (req, res) => {
        // Successful authentication
        const token = generateToken(req.user._id);
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth/success?token=${token}`);
    },

    // Address Book Controllers
    addAddress: asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            const { address, city, postalCode, country, isDefault } = req.body;

            // If new address is default, unset previous default
            if (isDefault) {
                user.addresses.forEach(addr => addr.isDefault = false);
            }

            user.addresses.push({ address, city, postalCode, country, isDefault });
            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    }),

    getAddresses: asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.addresses);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    }),

    deleteAddress: asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    })
};
