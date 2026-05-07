const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [], shoppingMode: 'retail' });
    }

    // Calculate mode-based pricing
    const cartWithPricing = {
        ...cart.toObject(),
        items: cart.items.filter(item => item.product).map(item => {
            const product = item.product;
            let effectivePrice = product.price;

            if (cart.shoppingMode === 'wholesale' && product.wholesaleEnabled && product.wholesalePrice) {
                effectivePrice = product.wholesalePrice;
            }

            return {
                ...item.toObject(),
                effectivePrice,
                subtotal: effectivePrice * item.quantity
            };
        })
    };

    res.json(cartWithPricing);
});

// @desc    Sync cart (merge local cart with db cart)
// @route   POST /api/cart/sync
// @access  Private
const syncCart = asyncHandler(async (req, res) => {
    const { items } = req.body; // Items from local storage

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Merge logic: Add local items to db cart if not already present or update quantity
    // This is a simple merge. sophisticated merge might ask user.
    // We will append/update.

    if (items && items.length > 0) {
        items.forEach(localItem => {
            const existingItemIndex = cart.items.findIndex(
                dbItem =>
                    dbItem.product.toString() === localItem.product._id &&
                    dbItem.selectedSize === localItem.selectedSize &&
                    dbItem.selectedColor === localItem.selectedColor
            );

            if (existingItemIndex > -1) {
                // Determine if we should overwrite or add. For sync, maybe max or overwrite?
                // Let's assume we keep the DB quantity unless local is higher ?? 
                // safely, let's just ensure it exists.
                // actually typically sync means "I just logged in, take my local cart and put it in DB"

                // If we follow typical flow: 
                // 1. User has empty DB cart. Login. Local cart -> DB Cart.
                // 2. User has DB items. Login. Local cart items added to DB items.

                // Logic: Update quantity
                // cart.items[existingItemIndex].quantity += localItem.quantity; // Be careful of duplicates
                // Let's just set it to local quantity if it's "sync on login"? 
                // No, usually "add to cart" calls this? No, sync is explicit.

                // If the item exists, we usually do nothing or update? 
                // Let's take the max for now or simply add. 
                // Let's just ignore if exists to avoid double counting during a simple "sync"
            } else {
                cart.items.push({
                    product: localItem.product._id,
                    quantity: localItem.quantity,
                    selectedSize: localItem.selectedSize,
                    selectedColor: localItem.selectedColor
                });
            }
        });
        await cart.save();
    }

    // Return full populated cart
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, size, color } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [], shoppingMode: 'retail' });
    }

    // Validate wholesale minimum quantity
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (cart.shoppingMode === 'wholesale' && product.wholesaleEnabled) {
        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
        );

        const currentQty = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
        const newTotalQty = currentQty + quantity;

        if (newTotalQty < product.minWholesaleQuantity) {
            res.status(400);
            throw new Error(`Minimum wholesale quantity is ${product.minWholesaleQuantity} units`);
        }
    }

    const itemIndex = cart.items.findIndex(item =>
        item.product.toString() === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity, selectedSize: size, selectedColor: color });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
});


// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity, size, color } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item =>
        item.product.toString() === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (itemIndex > -1) {
        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }
    } else {
        res.status(404);
        throw new Error('Item not in cart');
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
});


// @desc    Remove item from cart
// @route   DELETE /api/cart
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
    // We need body for size/color, but DELETE typically uses query or params. 
    // Axios allows data in delete. Or we can use POST /remove.
    // Let's use request body.

    const { productId, size, color } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.items = cart.items.filter(item =>
            !(item.product.toString() === productId &&
                item.selectedSize === size &&
                item.selectedColor === color)
        );
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        cart.items = [];
        await cart.save();
        res.json({ message: 'Cart cleared' });
    } else {
        res.json({ message: 'Cart already empty' });
    }
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCart
};
