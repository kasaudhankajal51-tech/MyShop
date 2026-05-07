const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID || 'place-holder-id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'place-holder-secret',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/users/google/callback',
        passReqToCallback: true, // Enable access to req in callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // User exists - Send Login Alert
                try {
                    const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                    await sendEmail({
                        email: user.email,
                        subject: 'New Login to your Account 🔐',
                        message: `New Google login detected for ${user.name} on ${loginTime}`,
                        html: `
                            <h1>New Google Login Alert ⚠️</h1>
                            <p>Hi ${user.name},</p>
                            <p>Your account was accessed via Google Login on <b>${loginTime}</b>.</p>
                            <p>If this was you, you can ignore this email.</p>
                            <br>
                            <p>Regards,</p>
                            <p>Jai Shree Balaji Readymade Security Team</p>
                        `
                    });
                } catch (error) {
                    console.error('Google login alert failed:', error);
                }
                return done(null, user);
            }

            // Check if user exists with same email (link account)
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                user.googleId = profile.id;
                await user.save();
                // accountType = req.query.state; // Removed erroneous line
            }

            // Determine account type from state
            let accountType = 'retail'; // Default
            if (req.query && req.query.state && ['retail', 'wholesale'].includes(req.query.state)) {
                accountType = req.query.state;
            }

            // Create new user
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Dummy password
                googleId: profile.id,
                avatar: profile.photos[0].value,
                role: 'user', // Default role
                accountType: accountType, // Set based on login source
            });

            // User created - Send Welcome Email
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Welcome to Jai Shree Balaji Readymade! 🛍️',
                    message: `Hi ${user.name}, Welcome!`,
                    html: `
                        <h1>Welcome to Jai Shree Balaji Readymade! 🎉</h1>
                        <p>Hi ${user.name},</p>
                        <p>Thank you for registering via Google.</p>
                        <p>We are excited to have you on board!</p>
                        <br>
                        <p>Best Regards,</p>
                        <p>The Jai Shree Balaji Readymade Team</p>
                    `
                });
            } catch (error) {
                console.error('Google welcome email failed:', error);
            }

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
));

module.exports = passport;
