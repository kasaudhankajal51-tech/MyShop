// Intent Detection Utility for Chatbot
const { faqs } = require('../data/faqs');

/**
 * Detect user intent from query text
 * @param {string} query - User's query text
 * @returns {object} - { intent, confidence, category }
 */
const detectIntent = (query) => {
    const lowerQuery = query.toLowerCase().trim();

    // Intent patterns with keywords
    const intentPatterns = {
        orderStatus: {
            keywords: ['order', 'track', 'status', 'where is', 'delivery', 'shipped', 'dispatched', 'arriving'],
            priority: 1
        },
        returns: {
            keywords: ['return', 'refund', 'exchange', 'cancel', 'money back', 'send back'],
            priority: 1
        },
        shipping: {
            keywords: ['shipping', 'delivery time', 'how long', 'when will', 'shipping cost', 'delivery charges'],
            priority: 2
        },
        payment: {
            keywords: ['payment', 'pay', 'cod', 'card', 'upi', 'emi', 'installment', 'secure'],
            priority: 2
        },
        account: {
            keywords: ['account', 'profile', 'login', 'password', 'sign up', 'register'],
            priority: 3
        },
        contact: {
            keywords: ['contact', 'support', 'help', 'human', 'agent', 'call', 'email'],
            priority: 3
        }
    };

    // Check for order ID pattern (e.g., #12345 or 12345)
    const orderIdPattern = /#?([0-9a-fA-F]{24}|[0-9]{5,})/;
    const orderIdMatch = lowerQuery.match(orderIdPattern);

    if (orderIdMatch) {
        return {
            intent: 'orderStatus',
            confidence: 0.95,
            category: 'orders',
            orderId: orderIdMatch[1]
        };
    }

    // Score each intent
    let maxScore = 0;
    let detectedIntent = 'general';
    let matchedCategory = 'general';

    for (const [intent, pattern] of Object.entries(intentPatterns)) {
        let score = 0;

        for (const keyword of pattern.keywords) {
            if (lowerQuery.includes(keyword)) {
                score += 1 / pattern.priority; // Higher priority = higher score
            }
        }

        if (score > maxScore) {
            maxScore = score;
            detectedIntent = intent;
        }
    }

    // Map intent to FAQ category
    const intentToCategoryMap = {
        orderStatus: 'orders',
        returns: 'returns',
        shipping: 'shipping',
        payment: 'payment',
        account: 'account',
        contact: 'general'
    };

    matchedCategory = intentToCategoryMap[detectedIntent] || 'general';

    // Calculate confidence (0-1)
    const confidence = Math.min(maxScore / 2, 1);

    return {
        intent: detectedIntent,
        confidence,
        category: matchedCategory
    };
};

/**
 * Find best matching FAQ
 * @param {string} query - User's query
 * @param {string} category - FAQ category
 * @returns {object|null} - Matching FAQ or null
 */
const findMatchingFAQ = (query, category = null) => {
    const lowerQuery = query.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    // Search in specific category or all categories
    const categoriesToSearch = category ? [category] : Object.keys(faqs);

    for (const cat of categoriesToSearch) {
        if (!faqs[cat]) continue;

        for (const faq of faqs[cat]) {
            let score = 0;

            // Check keyword matches
            for (const keyword of faq.keywords) {
                if (lowerQuery.includes(keyword.toLowerCase())) {
                    score += 1;
                }
            }

            // Bonus for exact question match
            if (lowerQuery.includes(faq.question.toLowerCase())) {
                score += 5;
            }

            if (score > maxScore) {
                maxScore = score;
                bestMatch = faq;
            }
        }
    }

    return maxScore > 0 ? bestMatch : null;
};

/**
 * Extract order ID from text
 * @param {string} text - Text containing order ID
 * @returns {string|null} - Extracted order ID or null
 */
const extractOrderId = (text) => {
    const orderIdPattern = /#?([0-9a-fA-F]{24}|[0-9]{5,})/;
    const match = text.match(orderIdPattern);
    return match ? match[1] : null;
};

module.exports = {
    detectIntent,
    findMatchingFAQ,
    extractOrderId
};
