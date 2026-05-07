require('dotenv').config();
const sendTelegramMessage = require('./utils/telegram');

console.log('Testing Telegram Notification...');
console.log('Token:', process.env.TELEGRAM_BOT_TOKEN ? 'Loaded' : 'Missing');
console.log('Chat ID:', process.env.TELEGRAM_CHAT_ID ? 'Loaded' : 'Missing');

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('ERROR: Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env file');
    process.exit(1);
}

sendTelegramMessage('🔔 *Test Notification* \n\nThis is a test message from your e-commerce backend. If you see this, the integration is working!')
    .then(() => console.log('Check your Telegram app!'))
    .catch(err => console.error('Failed:', err.message));
