const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // Mode filter (Wholesale vs Retail)
    const mode = req.query.mode;
    const modeFilter = {};
    if (mode === 'wholesale') {
        modeFilter.isWholesaleAvailable = true;
    } else {
        // Retail mode: Show products that are NOT exclusively wholesale
        // or strictly those that are strictly retail? 
        // User asked for "retails wala product nhi" in wholesale, and "retails ka alag".
        // Assuming strict separation: Retail gets non-wholesale marked products.
        modeFilter.isWholesaleAvailable = { $ne: true };
    }

    // Search keyword
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    // Filter by category
    const category = req.query.category
        ? { category: req.query.category }
        : {};

    // Filter by season
    const season = req.query.season
        ? { season: req.query.season }
        : {};

    // Filter by rating
    const rating = req.query.rating
        ? { rating: { $gte: Number(req.query.rating) } }
        : {};

    // Filter by price range
    let price = {};
    if (req.query.minPrice || req.query.maxPrice) {
        price = { price: {} };
        if (req.query.minPrice) price.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) price.price.$lte = Number(req.query.maxPrice);
    }

    // Filter by status labels
    const statusFilter = {};
    if (req.query.isFeatured === 'true') statusFilter.isFeatured = true;
    if (req.query.isBestSeller === 'true') statusFilter.isBestSeller = true;
    if (req.query.isNewArrival === 'true') statusFilter.isNewArrival = true;

    // Merge all filters, including modeFilter
    const filterConditions = {
        ...keyword,
        ...category,
        ...season,
        ...rating,
        ...price,
        ...statusFilter,
        ...modeFilter
    };

    // Sort
    let sort = { createdAt: -1 }; // Default newest
    if (req.query.sort) {
        if (req.query.sort === 'price-low') sort = { price: 1 };
        if (req.query.sort === 'price-high') sort = { price: -1 };
        if (req.query.sort === 'popular') sort = { numReviews: -1 };
        if (req.query.sort === 'rating') sort = { rating: -1 };
        if (req.query.sort === 'newest') sort = { createdAt: -1 };
    }

    const count = await Product.countDocuments(filterConditions);
    const products = await Product.find(filterConditions)
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    let product;

    // Check if valid ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(req.params.id);
    }

    // If not found by ID or invalid ID, try slug
    if (!product) {
        product = await Product.findOne({ slug: req.params.id });
    }

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        numReviews,
        slug,
        isActive,
        isFeatured,
        isBestSeller,
        isNewArrival,
        season,
        gender,
        compareAtPrice,
        category,
        countInStock,
        images, // Add images
        // Wholesale fields
        isWholesaleAvailable,
        minimumWholesaleQuantity,
        pricingTiers,
        caseQuantity,
        sku,
        gstRate,
    } = req.body;

    const product = new Product({
        name: name || 'Sample name',
        slug: slug || (name ? name.toLowerCase().replace(/\s+/g, '-') : 'sample-name'),
        price: price || 0,
        user: req.user._id,
        image: image || '/images/sample.jpg',
        images: images || [], // Save images
        brand: brand || 'Sample brand',
        category: category || 'Sample category',
        countInStock: countInStock || 0,
        numReviews: numReviews || 0,
        description: description || 'Sample description',
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        isBestSeller: isBestSeller || false,
        isNewArrival: isNewArrival || false,
        season: season || 'Summer',
        gender: gender || 'Unisex',
        compareAtPrice: compareAtPrice || 0,
        compareAtPrice: compareAtPrice || 0,
        // Wholesale fields
        isWholesaleAvailable: isWholesaleAvailable || false,
        minimumWholesaleQuantity: minimumWholesaleQuantity || 10,
        pricingTiers: pricingTiers || [],
        caseQuantity: caseQuantity || 1,
        sku: sku || undefined,
        gstRate: gstRate || 0,
    });

    try {
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400);
            if (error.keyPattern.slug) {
                throw new Error('Product with this name already exists.');
            }
        }
        throw error;
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
        slug,
        isActive,
        isFeatured,
        isBestSeller,
        isNewArrival,
        season,
        gender,
        compareAtPrice,
        images, // Add images
        // Wholesale fields
        isWholesaleAvailable,
        minimumWholesaleQuantity,
        pricingTiers,
        caseQuantity,
        sku,
        gstRate,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;
        if (slug) product.slug = slug;
        if (isActive !== undefined) product.isActive = isActive;
        if (isFeatured !== undefined) product.isFeatured = isFeatured;
        if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
        if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;
        if (season) product.season = season;
        if (gender) product.gender = gender;
        if (compareAtPrice !== undefined) product.compareAtPrice = compareAtPrice;
        if (compareAtPrice !== undefined) product.compareAtPrice = compareAtPrice;
        if (images) product.images = images; // Update images

        // Update wholesale fields
        if (isWholesaleAvailable !== undefined) product.isWholesaleAvailable = isWholesaleAvailable;
        if (minimumWholesaleQuantity !== undefined) product.minimumWholesaleQuantity = minimumWholesaleQuantity;
        if (pricingTiers) product.pricingTiers = pricingTiers;
        if (caseQuantity) product.caseQuantity = caseQuantity;
        if (sku) product.sku = sku;
        if (gstRate !== undefined) product.gstRate = gstRate;

        // Update wholesale fields
        if (isWholesaleAvailable !== undefined) product.isWholesaleAvailable = isWholesaleAvailable;
        if (minimumWholesaleQuantity !== undefined) product.minimumWholesaleQuantity = minimumWholesaleQuantity;
        if (pricingTiers) product.pricingTiers = pricingTiers;
        if (caseQuantity) product.caseQuantity = caseQuantity;
        if (sku) product.sku = sku;
        if (gstRate !== undefined) product.gstRate = gstRate;

        try {
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } catch (error) {
            if (error.code === 11000) {
                res.status(400);
                if (error.keyPattern.slug) {
                    throw new Error('Product with this name already exists.');
                }
            }
            throw error;
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});


// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        // Check if user ordered this product and it is paid
        const orders = await Order.find({
            user: req.user._id,
            isPaid: true,
            'orderItems.product': req.params.id,
        });

        const isVerified = orders.length > 0;

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            image, // Optional image
            verified: isVerified,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get wholesale pricing for a product
// @route   GET /api/products/:id/wholesale-pricing
// @access  Private (Wholesale users only)
const getWholesalePricing = asyncHandler(async (req, res) => {
    const { quantity } = req.query;
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!product.isWholesaleAvailable) {
        res.status(400);
        throw new Error('Product is not available for wholesale');
    }

    // Calculate tier price based on quantity
    let tierPrice = null;
    let applicableTier = null;
    let nextTier = null;

    if (quantity && product.pricingTiers && product.pricingTiers.length > 0) {
        const qty = Number(quantity);

        // Find applicable tier
        for (let i = 0; i < product.pricingTiers.length; i++) {
            const tier = product.pricingTiers[i];
            if (qty >= tier.minQuantity && (tier.maxQuantity === null || qty <= tier.maxQuantity)) {
                applicableTier = tier;
                tierPrice = tier.pricePerUnit;

                // Find next tier
                if (i < product.pricingTiers.length - 1) {
                    nextTier = product.pricingTiers[i + 1];
                }
                break;
            }
        }
    }

    const savings = tierPrice ? product.price - tierPrice : 0;

    res.json({
        productId: product._id,
        productName: product.name,
        retailPrice: product.price,
        minimumQuantity: product.minimumWholesaleQuantity,
        pricingTiers: product.pricingTiers,
        requestedQuantity: quantity ? Number(quantity) : null,
        tierPrice,
        applicableTier,
        nextTier,
        savings,
        savingsPercentage: tierPrice ? Math.round((savings / product.price) * 100) : 0,
    });
});

// @desc    Set pricing tiers for a product (Admin)
// @route   PUT /api/products/:id/pricing-tiers
// @access  Private/Admin
const setPricingTiers = asyncHandler(async (req, res) => {
    const { pricingTiers, isWholesaleAvailable, minimumWholesaleQuantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Validate pricing tiers
    if (pricingTiers && pricingTiers.length > 0) {
        // Sort tiers by minQuantity
        pricingTiers.sort((a, b) => a.minQuantity - b.minQuantity);

        // Validate tier structure
        for (let i = 0; i < pricingTiers.length; i++) {
            if (!pricingTiers[i].minQuantity || !pricingTiers[i].pricePerUnit) {
                res.status(400);
                throw new Error('Each tier must have minQuantity and pricePerUnit');
            }

            // Last tier should have maxQuantity as null
            if (i === pricingTiers.length - 1) {
                pricingTiers[i].maxQuantity = null;
            }
        }
    }

    product.pricingTiers = pricingTiers;
    product.isWholesaleAvailable = isWholesaleAvailable !== undefined ? isWholesaleAvailable : product.isWholesaleAvailable;
    product.minimumWholesaleQuantity = minimumWholesaleQuantity || product.minimumWholesaleQuantity;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
});

// @desc    Fetch wholesale products
// @route   GET /api/products/wholesale
// @access  Private (Wholesale/Admin)
const getWholesaleProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // Strict Wholesale Filter
    const wholesaleFilter = { isWholesaleAvailable: true };

    // Search keyword
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    // Filter by category
    const category = req.query.category
        ? { category: req.query.category }
        : {};

    // Filter by season
    const season = req.query.season
        ? { season: req.query.season }
        : {};

    // Filter by rating
    const rating = req.query.rating
        ? { rating: { $gte: Number(req.query.rating) } }
        : {};

    // Filter by price range (Based on min tier price maybe? For now simple price check on base price or ignore)
    // Wholesale pricing is complex (tiers). Let's filter by base price for simplicity if provided.
    let price = {};
    if (req.query.minPrice || req.query.maxPrice) {
        price = { price: {} };
        if (req.query.minPrice) price.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) price.price.$lte = Number(req.query.maxPrice);
    }

    const filterConditions = {
        ...wholesaleFilter,
        ...keyword,
        ...category,
        ...season,
        ...rating,
        ...price,
    };

    // Sort
    let sort = { createdAt: -1 }; // Default newest
    if (req.query.sort) {
        if (req.query.sort === 'price-low') sort = { price: 1 };
        if (req.query.sort === 'price-high') sort = { price: -1 };
        if (req.query.sort === 'popular') sort = { numReviews: -1 };
        if (req.query.sort === 'rating') sort = { rating: -1 };
        if (req.query.sort === 'newest') sort = { createdAt: -1 };
    }

    const count = await Product.countDocuments(filterConditions);
    const products = await Product.find(filterConditions)
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getWholesalePricing,
    setPricingTiers,
    getWholesaleProducts,
};
