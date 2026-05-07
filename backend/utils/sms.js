const twilio = require('twilio');

const sendSMS = async (message, to) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;
        const adminNumber = process.env.ADMIN_PHONE_NUMBER;

        if (!accountSid || !authToken || !fromNumber) {
            console.log('SMS notification skipped: Missing Twilio credentials in .env');
            return;
        }

        const client = twilio(accountSid, authToken);

        const response = await client.messages.create({
            body: message,
            from: fromNumber,
            to: to || adminNumber,
        });

        console.log(`SMS sent successfully: ${response.sid}`);
    } catch (error) {
        console.error('Error sending SMS:', error.message);
    }
};

module.exports = sendSMS;
