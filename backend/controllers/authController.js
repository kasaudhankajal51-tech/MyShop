const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const otpGenerator = require('otp-generator');
// const Twilio = require('twilio'); // Uncomment when keys are added

// @desc    Forgot Password - Send OTP
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });

    // Save OTP to user (valid for 10 mins)
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Convert OTP to string for logging (simulated SMS)
    const message = `Your Season Style Verification Code is: ${otp}`;

    // In a real app with Twilio:
    /*
    const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    if (user.phone) {
        await client.messages.create({
            body: message,
            to: user.phone,
            from: process.env.TWILIO_PHONE_NUMBER
        });
    }
    */

    console.log(`[SIMULATED SMS] To: ${user.email} | Message: ${message}`);

    res.json({ message: 'OTP sent successfully (Simulated)' });
});

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    res.json({ message: 'OTP verified successfully' });
});

// @desc    Reset Password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
});

module.exports = {
    forgotPassword,
    verifyOtp,
    resetPassword,
};
