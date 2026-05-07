const Order = require('../models/orderModel');
const { detectIntent, findMatchingFAQ, extractOrderId } = require('../utils/intentDetection');
const { faqs, quickReplies } = require('../data/faqs');

/**
 * Handle chatbot query
 * @route POST /api/chatbot/query
 * @access Public
 */
const handleQuery = async (req, res) => {
    try {
        const { query, userId } = req.body;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Query is required' });
        }

        // Detect intent
        const { intent, confidence, category, orderId } = detectIntent(query);

        let response = {
            message: '',
            quickReplies: [],
            data: null,
            intent,
            confidence
        };

        // Handle based on intent
        switch (intent) {
            case 'orderStatus':
                if (orderId) {
                    // User provided order ID
                    response = await getOrderStatusResponse(orderId, userId);
                } else {
                    // Ask for order ID
                    response.message = "I can help you track your order! 📦\n\nPlease provide your **Order ID** (you can find it in your order confirmation email or My Orders section).\n\nExample: #65f3a2b1c4d5e6f7a8b9c0d1";
                    response.quickReplies = ["View My Orders", "Contact Support"];
                }
                break;

            case 'returns':
                const returnFAQ = findMatchingFAQ(query, 'returns');
                if (returnFAQ) {
                    response.message = returnFAQ.answer;
                    response.quickReplies = quickReplies.returns;
                } else {
                    response.message = faqs.returns[0].answer; // Default return policy
                    response.quickReplies = quickReplies.returns;
                }
                break;

            case 'shipping':
            case 'payment':
            case 'account':
                const faq = findMatchingFAQ(query, category);
                if (faq) {
                    response.message = faq.answer;
                    response.quickReplies = quickReplies.general;
                } else {
                    response.message = getDefaultResponse(category);
                    response.quickReplies = quickReplies.general;
                }
                break;

            case 'contact':
                response.message = faqs.general[0].answer; // Contact support FAQ
                response.quickReplies = ["Talk to Human", "More Help"];
                break;

            default:
                // Try to find any matching FAQ
                const anyFAQ = findMatchingFAQ(query);
                if (anyFAQ) {
                    response.message = anyFAQ.answer;
                    response.quickReplies = quickReplies.general;
                } else {
                    response.message = "I'm not sure I understand. 🤔\n\nI can help you with:\n\n• **Track orders** - Provide your order ID\n• **Returns & Refunds** - Our return policy\n• **Shipping info** - Delivery times and charges\n• **Payment options** - COD, cards, UPI\n• **Account help** - Login, password reset\n\nWhat would you like to know?";
                    response.quickReplies = quickReplies.welcome;
                }
        }

        res.json(response);

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            message: "Sorry, I'm having trouble right now. Please try again or contact support.",
            quickReplies: ["Contact Support", "Try Again"]
        });
    }
};

/**
 * Get order status response
 */
const getOrderStatusResponse = async (orderId, userId) => {
    try {
        // Find order
        const order = await Order.findById(orderId).populate('user', 'name email');

        if (!order) {
            return {
                message: "❌ I couldn't find an order with that ID.\n\nPlease check your order ID and try again, or view your orders in **My Account → Orders**.",
                quickReplies: ["View My Orders", "Contact Support"],
                data: null
            };
        }

        // Check if user owns this order (if userId provided)
        if (userId && order.user._id.toString() !== userId) {
            return {
                message: "🔒 This order belongs to a different account.\n\nPlease login to view your orders or contact support for help.",
                quickReplies: ["Login", "Contact Support"],
                data: null
            };
        }

        // Format order status message
        const statusEmojis = {
            pending: '⏳',
            processing: '📦',
            shipped: '🚚',
            delivered: '✅',
            cancelled: '❌'
        };

        const emoji = statusEmojis[order.status] || '📦';

        let message = `${emoji} **Order Status: ${order.status.toUpperCase()}**\n\n`;
        message += `**Order ID:** #${order._id}\n`;
        message += `**Items:** ${order.orderItems.length} item(s)\n`;
        message += `**Total:** ₹${order.totalPrice}\n`;
        message += `**Placed on:** ${new Date(order.createdAt).toLocaleDateString('en-IN')}\n\n`;

        // Status-specific messages
        switch (order.status) {
            case 'pending':
                message += "Your order is being processed. We'll notify you once it's shipped!";
                break;
            case 'processing':
                message += "Your order is being packed and will be shipped soon!";
                break;
            case 'shipped':
                message += `Your order is on the way! 🚚\n`;
                if (order.estimatedDelivery) {
                    message += `**Expected delivery:** ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}`;
                }
                break;
            case 'delivered':
                message += `Your order was delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-IN')}! 🎉\n\nHope you love it! ❤️`;
                break;
            case 'cancelled':
                message += "This order has been cancelled. Refund will be processed within 5-7 business days.";
                break;
        }

        return {
            message,
            quickReplies: order.status === 'delivered'
                ? ["Write Review", "Return Item", "Track Another Order"]
                : ["Track Another Order", "Cancel Order", "Contact Support"],
            data: {
                orderId: order._id,
                status: order.status,
                totalPrice: order.totalPrice,
                itemCount: order.orderItems.length,
                createdAt: order.createdAt
            }
        };

    } catch (error) {
        console.error('Order status error:', error);
        return {
            message: "Sorry, I couldn't fetch the order status. Please try again or contact support.",
            quickReplies: ["Try Again", "Contact Support"],
            data: null
        };
    }
};

/**
 * Get default response for category
 */
const getDefaultResponse = (category) => {
    const defaults = {
        shipping: faqs.shipping[0].answer,
        payment: faqs.payment[0].answer,
        account: faqs.account[0].answer,
        general: "I'm here to help! What would you like to know?"
    };

    return defaults[category] || defaults.general;
};

/**
 * Get welcome message
 * @route GET /api/chatbot/welcome
 * @access Public
 */
const getWelcomeMessage = (req, res) => {
    const message = "👋 Hi! I'm your shopping assistant!\n\nI can help you with:\n\n• Track your orders 📦\n• Returns & refunds 💳\n• Shipping information 🚚\n• Payment options 💰\n• Account help 👤\n\nHow can I assist you today?";

    res.json({
        message,
        quickReplies: quickReplies.welcome
    });
};

/**
 * Get all FAQs
 * @route GET /api/chatbot/faqs
 * @access Public
 */
const getAllFAQs = (req, res) => {
    try {
        // Flatten FAQs for display
        const allFAQs = [];

        for (const [category, questions] of Object.entries(faqs)) {
            for (const faq of questions) {
                allFAQs.push({
                    category,
                    question: faq.question,
                    answer: faq.answer
                });
            }
        }

        res.json(allFAQs);
    } catch (error) {
        console.error('FAQ error:', error);
        res.status(500).json({ message: 'Error fetching FAQs' });
    }
};

module.exports = {
    handleQuery,
    getWelcomeMessage,
    getAllFAQs
};
