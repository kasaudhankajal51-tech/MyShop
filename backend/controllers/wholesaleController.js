const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Register as wholesale buyer
// @route   POST /api/wholesale/register
// @access  Private
const registerWholesale = asyncHandler(async (req, res) => {
    const { businessName, gstNumber, shopAddress, phone, expectedMonthlyVolume, panNumber, businessType, documentUrl } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if user is already a wholesaler AND has a profile
    if (user.accountType === 'wholesale' && user.wholesaleProfile && user.wholesaleProfile.gstNumber) {
        res.status(400);
        throw new Error('Already registered as wholesale buyer');
    }

    // Update user with wholesale profile
    user.accountType = 'wholesale';
    user.wholesaleProfile = {
        businessName,
        gstNumber,
        shopAddress,
        phone,
        expectedMonthlyVolume,
        panNumber,
        businessType,
        documentUrl,
        approvalStatus: 'pending',
    };

    const updatedUser = await user.save();

    // Send email notification to admin
    try {
        await sendEmail({
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            subject: 'New Wholesale Registration',
            message: `New wholesale registration from ${businessName}. GST: ${gstNumber}. Please review and approve.`,
        });
    } catch (error) {
        console.log('Email notification failed:', error);
    }

    res.status(201).json({
        message: 'Wholesale registration submitted successfully. Awaiting admin approval.',
        wholesaleProfile: updatedUser.wholesaleProfile,
    });
});

// @desc    Get all pending wholesale registrations
// @route   GET /api/admin/wholesale/pending
// @access  Private/Admin
const getPendingWholesale = asyncHandler(async (req, res) => {
    const pendingUsers = await User.find({
        accountType: 'wholesale',
        'wholesaleProfile.approvalStatus': 'pending',
    }).select('-password');

    res.json(pendingUsers);
});

// @desc    Get all wholesale accounts
// @route   GET /api/admin/wholesale/accounts
// @access  Private/Admin
const getAllWholesaleAccounts = asyncHandler(async (req, res) => {
    const { status } = req.query;

    const filter = { accountType: 'wholesale' };
    if (status) {
        filter['wholesaleProfile.approvalStatus'] = status;
    }

    const accounts = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json(accounts);
});

// @desc    Approve wholesale account
// @route   PUT /api/admin/wholesale/approve/:id
// @access  Private/Admin
const approveWholesale = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.accountType !== 'wholesale') {
        res.status(400);
        throw new Error('User is not a wholesale account');
    }

    user.wholesaleProfile.approvalStatus = 'approved';
    user.wholesaleProfile.approvedBy = req.user._id;
    user.wholesaleProfile.approvedAt = Date.now();
    user.wholesaleVerified = true; // Legacy field

    const updatedUser = await user.save();

    // Send approval email to user
    try {
        await sendEmail({
            email: user.email,
            subject: 'Wholesale Account Approved',
            message: `Congratulations! Your wholesale account for ${user.wholesaleProfile.businessName} has been approved. You can now access wholesale pricing.`,
        });
    } catch (error) {
        console.log('Email notification failed:', error);
    }

    res.json({
        message: 'Wholesale account approved successfully',
        user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            wholesaleProfile: updatedUser.wholesaleProfile,
        },
    });
});

// @desc    Reject wholesale account
// @route   PUT /api/admin/wholesale/reject/:id
// @access  Private/Admin
const rejectWholesale = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.accountType !== 'wholesale') {
        res.status(400);
        throw new Error('User is not a wholesale account');
    }

    user.wholesaleProfile.approvalStatus = 'rejected';
    user.wholesaleProfile.rejectionReason = reason;

    const updatedUser = await user.save();

    // Send rejection email to user
    try {
        await sendEmail({
            email: user.email,
            subject: 'Wholesale Account Application',
            message: `We regret to inform you that your wholesale account application has been rejected. Reason: ${reason}`,
        });
    } catch (error) {
        console.log('Email notification failed:', error);
    }

    res.json({
        message: 'Wholesale account rejected',
        user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            wholesaleProfile: updatedUser.wholesaleProfile,
        },
    });
});

// @desc    Get wholesale account status
// @route   GET /api/wholesale/status
// @access  Private
const getWholesaleStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        accountType: user.accountType,
        wholesaleProfile: user.wholesaleProfile,
        isApproved: user.wholesaleProfile?.approvalStatus === 'approved',
    });
});

// @desc    Get wholesale stats for dashboard
// @route   GET /api/admin/wholesale/stats
// @access  Private/Admin
const getWholesaleStats = asyncHandler(async (req, res) => {
    const totalCount = await User.countDocuments({ accountType: 'wholesale' });
    const pendingCount = await User.countDocuments({
        accountType: 'wholesale',
        'wholesaleProfile.approvalStatus': 'pending'
    });

    // Get 5 most recent wholesale registrations
    const recentRegistrations = await User.find({ accountType: 'wholesale' })
        .select('name email wholesaleProfile createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        totalCount,
        pendingCount,
        recentRegistrations
    });
});

module.exports = {
    registerWholesale,
    getPendingWholesale,
    getAllWholesaleAccounts,
    approveWholesale,
    rejectWholesale,
    getWholesaleStatus,
    getWholesaleStats,
};
