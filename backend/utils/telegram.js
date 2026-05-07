const axios = require('axios');

const sendTelegramMessage = async (message) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.warn('Telegram Bot Token or Chat ID is missing. Message not sent.');
            return;
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown', // Optional: allows bold/italic text
        });

        console.log('Telegram message sent successfully');
    } catch (error) {
        console.error('Error sending Telegram message:', error.response?.data || error.message);
    }
};

module.exports = sendTelegramMessage;
