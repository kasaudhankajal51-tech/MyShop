const axios = require('axios');

const sendWhatsAppNotification = async (message) => {
    try {
        const phone = process.env.CALLMEBOT_PHONE; // Your phone number
        const apiKey = process.env.CALLMEBOT_API_KEY; // Your API Key

        if (!phone || !apiKey) {
            console.log('WhatsApp notification skipped: Missing CALLMEBOT_PHONE or CALLMEBOT_API_KEY in .env');
            console.log('Message:', message);
            return;
        }

        const encodedMessage = encodeURIComponent(message);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;

        await axios.get(url);
        console.log('WhatsApp notification sent successfully');
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error.message);
    }
};

module.exports = sendWhatsAppNotification;
