import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// ----------------------------------------------------------
// Public
// ----------------------------------------------------------
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req,res) => {
    // Implement Pagination
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i'}} : {}; // Product search functionality

    const count = await Product.countDocuments({...keyword}); // It will count only the documents with the specific keyword. If there is no keyword, it will count everything

    const products = await Product.find({...keyword})         // It will find only the products with the specific keyword. If there is no keyword, it will find everything
        .limit(pageSize)              // specify the project must be fetched
        .skip(pageSize * (page -1));  // only products for the current page are displayed
    res.json({products, page, pages: Math.ceil(count/pageSize)});
});

// @desc    Get category products (fedora | bowler | cowboy)
// @route   GET /api/products/category/:category
// @access  Public
const getCategoryProducts = asyncHandler(async (req,res) => {
    // Implement Pagination
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;
    const category = req.query.category;

    const count = await Product.countDocuments({category: category}); // It will count only the documents with the specific category.

    const products = await Product.find({category: category})           // It will find only the documents with the specific category.
        .limit(pageSize)
        .skip(pageSize * (page -1));  // only products for the current page are displayed

    res.json({products, page, pages: Math.ceil(count/pageSize)});
});

// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id); // if the id matches the id is in the url

    if(product) {
       return res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get top 3 rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3); // Get all the products, sort them desc, get only the frist 3

    return res.status(200).json(products);
});

// ----------------------------------------------------------
// Private
// ----------------------------------------------------------
// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req,res) => {
    // Get from body
    const {rating, comment} = req.body;

    // Get from url
    const product = await Product.findById(req.params.id);

    if(product) {
        // user can leave a review to a product just onnce
        const alreadyReviewd = product.reviews.find((review) => review.user.toString() === req.user._id.toString())

        if (alreadyReviewd) {
            res.status(400);
            throw new Error('Product already reviewed'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
        }

        // Create review
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        product.reviews.push(review);

        // Calculate the numReviews
        product.numReviews = product.reviews.length;

        // Calculate the rating
        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        // Save product (which includes the review) to DB
        await product.save();
        res.status(201).json({message: 'Review added'});
    } else {
        res.status(404);
        throw new Error('Resource not found'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});
// ----------------------------------------------------------
// ADMIN
// ----------------------------------------------------------
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req,res) => {
    // Create product
    const product = new Product({
        name:'Sample name',
        price:0,
        user: req.user._id,
        image:'/images/sample.jpg',
        brand:'Sample brand',
        category:'Sample Category',
        countInStock: 0,
        numReview: 0,
        description: 'Sample description'
    })

    // Save product to db
    const createdProduct = await product.save();

    // Response with the product data
    res.status(201).json(createdProduct)
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req,res) => {
    // Get data from the frontend through body
    const { name, price, description, image, brand, category, countInStock} = req.body;

    const product = await Product.findById(req.params.id);

    if(product) {
        // Update product
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category.toLowerCase();
        product.countInStock = countInStock;

        // Save product to db
        const updateProduct = await product.save();

        // Response with the product data
        res.status(200).json(updateProduct);
    } else {
        res.status(404);
        throw new Error('Resource not found'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        // Delete product from db
        await Product.deleteOne({_id: product._id});

        // Response
        res.status(200).json({message:'Product deleted'});
    } else {
        res.status(404);
        throw new Error('Resource not found'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
    getCategoryProducts
};