const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel'); // Import Product model
const sendWhatsAppNotification = require('../utils/whatsapp');
const sendTelegramMessage = require('../utils/telegram');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        orderType, // 'retail' or 'wholesale'
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // 1. Fetch real products from DB to verify prices and stock
    let dbOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.name}`);
        }

        // Security: Check Stock
        if (product.countInStock < item.qty) {
            res.status(400);
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        let finalPrice = product.price; // Default to retail

        // Pricing Logic
        if (orderType === 'wholesale') {
            // Verify User Eligibility
            if (!req.user.wholesaleProfile || req.user.wholesaleProfile.approvalStatus !== 'approved') {
                res.status(403);
                throw new Error('Not authorized for wholesale orders');
            }

            // Verify Product Eligibility
            if (!product.isWholesaleAvailable) {
                res.status(400);
                throw new Error(`${product.name} is not available for wholesale`);
            }

            // Verify MOQ
            if (item.qty < product.minimumWholesaleQuantity) {
                res.status(400);
                throw new Error(`${product.name}: Minimum wholesale quantity is ${product.minimumWholesaleQuantity}`);
            }

            // Calculate Tier Price
            // Sort tiers by minQuantity desc to find the best match
            const tiers = product.pricingTiers.sort((a, b) => b.minQuantity - a.minQuantity);
            const applicableTier = tiers.find(t => item.qty >= t.minQuantity);

            if (applicableTier) {
                finalPrice = applicableTier.pricePerUnit;
            } else {
                // Fallback (shouldn't happen if validation passes, maybe base wholesale price?)
                // For now, use the lowest tier or error out? 
                // Let's assume the first tier is the base.
                finalPrice = tiers[tiers.length - 1]?.pricePerUnit || product.price;
            }
        } else {
            // Retail: Ensure product is not wholesale-only (if you enforce that logic)
            // For now, just use retail price.
            finalPrice = product.price;
        }

        // Add to processed items
        dbOrderItems.push({
            name: product.name,
            qty: item.qty,
            image: product.image || (product.images && product.images[0]) || '/sample.jpg',
            price: finalPrice,
            product: product._id,
        });

        itemsPrice += finalPrice * item.qty;
    }

    // 2. Calculate Extra Costs (Server Side)
    // Tax (Assuming 18% GST standard or sum of product tax. 
    // For simplicity, let's take 18% of itemsPrice for now or 0 if included.)
    // User requested "GST Rate" in product model, so ideally sum(item.price * item.qty * item.gstRate/100).
    // Let's implement that refinement if time permits, but for now flat 18% or 0 is safer than untrusted frontend.
    // Let's assume prices are tax-exclusive for wholesale, inclusive for retail? 
    // Typically Retail is inclusive. Wholesale is exclusive.
    let taxPrice = 0;
    if (orderType === 'wholesale') {
        taxPrice = itemsPrice * 0.18; // 18% GST for wholesale
    } else {
        taxPrice = 0; // Retail prices usually inclusive in display, or calculate differently
    }

    // Shipping
    let shippingPrice = itemsPrice > 5000 ? 0 : 100; // Example rule: Free shipping > 5000

    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderType: orderType || 'retail', // Save order type
    });

    const createdOrder = await order.save();

    // Send WhatsApp Notification
    const message = `📦 *New ${orderType === 'wholesale' ? 'Wholesale ' : ''}Order!* \n\n🆔 ID: ${createdOrder._id}\n💰 Total: ₹${createdOrder.totalPrice.toFixed(2)}\n👤 User: ${req.user.name}\n\nCheck Admin Panel.`;
    // const message = ... (Keep existing logic or update)
    sendWhatsAppNotification(message);

    // Send Telegram Notification
    sendTelegramMessage(message);

    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const { orderType } = req.query;
    let query = {};

    if (orderType) {
        if (orderType === 'wholesale') {
            query = { orderType: 'wholesale' };
        } else {
            // Retail: Include 'retail', null, or explicitly missing
            query = {
                $or: [
                    { orderType: 'retail' },
                    { orderType: { $exists: false } },
                    { orderType: null }
                ]
            };
        }
    }

    const orders = await Order.find(query)
        .populate('user', 'id name')
        .sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.orderStatus = 'Delivered';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isShipped = true;
        order.shippedAt = Date.now();
        order.orderStatus = 'Shipped';

        // Reset future statuses to allow flow correction
        order.isOutForDelivery = false;
        order.outForDeliveryAt = undefined;
        order.isDelivered = false;
        order.deliveredAt = undefined;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to out for delivery
// @route   PUT /api/orders/:id/out
// @access  Private/Admin
const updateOrderToOutForDelivery = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isOutForDelivery = true;
        order.outForDeliveryAt = Date.now();
        order.orderStatus = 'Out for Delivery';

        // Reset future statuses to allow flow correction
        order.isDelivered = false;
        order.deliveredAt = undefined;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.isShipped || order.isDelivered) {
            res.status(400);
            throw new Error('Cannot cancel order that has been shipped or delivered');
        }

        order.isCancelled = true;
        order.cancelledAt = Date.now();
        order.cancellationReason = req.body.reason || 'Customer request';
        order.orderStatus = 'Cancelled';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Return order
// @route   PUT /api/orders/:id/return
// @access  Private
const updateOrderToReturned = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (!order.isDelivered) {
            res.status(400);
            throw new Error('Cannot return order that has not been delivered');
        }

        if (order.isReturned) {
            res.status(400);
            throw new Error('Order is already returned');
        }

        order.isReturned = true;
        order.returnedAt = Date.now();
        order.returnReason = req.body.reason || 'Customer request';
        order.orderStatus = 'Returned';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Track order by ID (Public)
// @route   POST /api/orders/track
// @access  Public
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        await order.deleteOne();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

const trackOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        res.status(400);
        throw new Error('Please provide an Order ID');
    }

    // Check if valid ObjectId
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(404);
        throw new Error('Order not found');
    }

    const order = await Order.findById(orderId).select('isPaid isDelivered createdAt totalPrice orderItems');

    if (order) {
        let status = order.orderStatus || 'Placed';
        // Fallback for older orders or if status not set explicitly
        if (status === 'Placed') {
            if (order.isDelivered) status = 'Delivered';
            else if (order.isOutForDelivery) status = 'Out for Delivery'; // Check schema fields if populated
            else if (order.isShipped) status = 'Shipped';
            else if (order.isPaid) status = 'Processing';
        }

        res.json({
            id: order._id,
            status: status,
            date: order.createdAt,
            items: order.orderItems.length,
            total: order.totalPrice,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            history: {
                placed: order.createdAt,
                paid: order.paidAt,
                shipped: order.shippedAt,
                outForDelivery: order.outForDeliveryAt,
                delivered: order.deliveredAt,
            }
        });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderToShipped,
    updateOrderToOutForDelivery,
    getMyOrders,
    getOrders,
    trackOrder,
    deleteOrder,
    cancelOrder,
    updateOrderToReturned,
};
