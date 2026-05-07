const asyncHandler = require('express-async-handler');

// Check if user is wholesale type
const isWholesale = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.accountType === 'wholesale') {
        next();
    } else {
        res.status(403);
        throw new Error('Wholesale access required');
    }
});

// Check if wholesale account is approved
const isApprovedWholesale = asyncHandler(async (req, res, next) => {
    if (
        req.user &&
        req.user.accountType === 'wholesale' &&
        req.user.wholesaleProfile &&
        req.user.wholesaleProfile.approvalStatus === 'approved'
    ) {
        next();
    } else {
        res.status(403);
        throw new Error('Your wholesale account is pending approval or has been rejected');
    }
});

module.exports = { isWholesale, isApprovedWholesale };
