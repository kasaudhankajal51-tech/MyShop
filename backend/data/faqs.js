// FAQ Database for Chatbot
const faqs = {
    shipping: [
        {
            question: "How long does shipping take?",
            keywords: ["shipping time", "delivery time", "how long", "when will i get"],
            answer: "📦 **Shipping Times:**\n\n• Standard Delivery: 5-7 business days\n• Express Delivery: 2-3 business days\n• Same Day (select cities): Order before 12 PM\n\nFree shipping on orders above ₹999!"
        },
        {
            question: "Do you ship internationally?",
            keywords: ["international", "outside india", "abroad", "overseas"],
            answer: "Currently, we ship within India only. International shipping coming soon! 🌍"
        },
        {
            question: "What are shipping charges?",
            keywords: ["shipping cost", "delivery charges", "shipping fee"],
            answer: "💰 **Shipping Charges:**\n\n• Orders above ₹999: FREE\n• Orders below ₹999: ₹50\n• Express delivery: +₹100"
        },
        {
            question: "Can I change delivery address?",
            keywords: ["change address", "modify address", "update address"],
            answer: "You can change the delivery address before the order is shipped. Go to **My Orders** → Select order → **Change Address**"
        }
    ],

    returns: [
        {
            question: "What is your return policy?",
            keywords: ["return policy", "return period", "can i return"],
            answer: "✅ **30-Day Return Policy**\n\n• Items must be unused with original tags\n• Free return pickup\n• Refund within 5-7 business days\n• Exchange available for size/color"
        },
        {
            question: "How do I return an item?",
            keywords: ["how to return", "return process", "return item"],
            answer: "📦 **Return Process:**\n\n1. Go to **My Account → Orders**\n2. Select the item to return\n3. Click **Request Return**\n4. Choose reason and submit\n5. We'll arrange free pickup!\n\nRefund processed within 5-7 days after pickup."
        },
        {
            question: "When will I get my refund?",
            keywords: ["refund time", "when refund", "refund status"],
            answer: "💳 **Refund Timeline:**\n\n• Pickup: 2-3 days\n• Quality check: 1-2 days\n• Refund processing: 5-7 business days\n\nTotal: 8-12 business days from return request"
        },
        {
            question: "Can I exchange an item?",
            keywords: ["exchange", "swap", "different size", "different color"],
            answer: "Yes! You can exchange for a different size or color. Follow the same return process and select **Exchange** instead of **Refund**."
        }
    ],

    payment: [
        {
            question: "What payment methods do you accept?",
            keywords: ["payment methods", "how to pay", "payment options"],
            answer: "💳 **Payment Methods:**\n\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• UPI (Google Pay, PhonePe, Paytm)\n• Net Banking\n• Wallets (Paytm, PhonePe)\n• Cash on Delivery (COD)"
        },
        {
            question: "Is COD available?",
            keywords: ["cod", "cash on delivery", "pay on delivery"],
            answer: "✅ **COD Available!**\n\n• Available for orders up to ₹10,000\n• ₹50 COD handling charges\n• Pay cash to delivery partner\n• No advance payment needed"
        },
        {
            question: "Is my payment secure?",
            keywords: ["secure payment", "safe payment", "payment security"],
            answer: "🔒 **100% Secure Payments**\n\n• SSL encrypted transactions\n• PCI DSS compliant\n• No card details stored\n• Trusted payment gateways"
        },
        {
            question: "Can I pay in installments?",
            keywords: ["emi", "installment", "pay later"],
            answer: "Yes! EMI options available on orders above ₹3,000 with select credit cards and Bajaj Finserv."
        }
    ],

    orders: [
        {
            question: "How do I track my order?",
            keywords: ["track order", "order status", "where is my order"],
            answer: "📍 **Track Your Order:**\n\n1. Go to **My Account → Orders**\n2. Click on your order\n3. View real-time tracking\n\nOr provide your Order ID here, and I'll check for you!"
        },
        {
            question: "Can I cancel my order?",
            keywords: ["cancel order", "cancel my order"],
            answer: "You can cancel before the order is shipped:\n\n1. Go to **My Orders**\n2. Select the order\n3. Click **Cancel Order**\n\nRefund will be processed within 5-7 days."
        },
        {
            question: "Can I modify my order?",
            keywords: ["modify order", "change order", "edit order"],
            answer: "You can modify your order within 1 hour of placing it. Contact our support team immediately at support@seasonsstyle.com or call 1800-XXX-XXXX"
        },
        {
            question: "What if I receive a damaged product?",
            keywords: ["damaged", "defective", "broken", "wrong item"],
            answer: "😔 Sorry to hear that!\n\n1. Don't accept the delivery if visibly damaged\n2. If already delivered, contact us within 48 hours\n3. Share photos of the damage\n4. We'll arrange immediate replacement or refund"
        }
    ],

    account: [
        {
            question: "How do I create an account?",
            keywords: ["create account", "sign up", "register"],
            answer: "Creating an account is easy:\n\n1. Click **Login/Sign Up** in the header\n2. Enter your email and password\n3. Verify your email\n4. Start shopping!\n\nOr sign up with Google for instant access."
        },
        {
            question: "I forgot my password",
            keywords: ["forgot password", "reset password", "can't login"],
            answer: "No worries! Reset your password:\n\n1. Click **Forgot Password** on login page\n2. Enter your registered email\n3. Check email for reset link\n4. Create new password"
        },
        {
            question: "How do I update my profile?",
            keywords: ["update profile", "change details", "edit profile"],
            answer: "Update your profile anytime:\n\n1. Go to **My Account**\n2. Click **Edit Profile**\n3. Update your details\n4. Click **Save**"
        }
    ],

    general: [
        {
            question: "How do I contact customer support?",
            keywords: ["contact", "customer support", "help", "talk to human"],
            answer: "📞 **Contact Us:**\n\n• Email: info@jaishreebalaji.com\n• Phone: +91 76070 27228 (Mon-Sat: 10 AM - 9 PM)\n• Address: H. No. 24 Ward No. 16, Durga Nagar, Bardahiya Bazaar, Khalilabad-272175, Sant Kabir Nagar, U.P.\n• Live Chat: Available 24/7 (that's me! 😊)\n\nWould you like me to connect you with a human agent?"
        },
        {
            question: "What are your business hours?",
            keywords: ["business hours", "timing", "when open"],
            answer: "🕐 **Business Hours:**\n\n• Store Hours: Mon-Sat: 10 AM - 9 PM\n• Sunday: Closed\n• Online Shopping: 24/7\n• Customer Support: Mon-Sat: 10 AM - 9 PM\n• Chatbot (me!): 24/7 support\n\nVisit us at: H. No. 24 Ward No. 16, Durga Nagar, Bardahiya Bazaar, Khalilabad-272175"
        },
        {
            question: "Do you have a physical store?",
            keywords: ["physical store", "offline store", "visit store"],
            answer: "Yes! Visit our store:\n\n📍 **Jai Shree Balaji Readymade**\nH. No. 24 Ward No. 16, Durga Nagar,\nBardahiya Bazaar, Khalilabad-272175\nSant Kabir Nagar, Uttar Pradesh\n\n📞 Call before visiting: +91 76070 27228\n🕐 Mon-Sat: 10 AM - 9 PM"
        }
    ]
};

// Quick replies based on context
const quickReplies = {
    welcome: [
        "Track My Order",
        "Return Policy",
        "Shipping Info",
        "Payment Options"
    ],
    orderStatus: [
        "Track Another Order",
        "Cancel Order",
        "Contact Support"
    ],
    returns: [
        "Start Return",
        "View Orders",
        "Refund Status"
    ],
    general: [
        "More Help",
        "Talk to Human",
        "View FAQs"
    ]
};

module.exports = { faqs, quickReplies };
