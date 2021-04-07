const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');

//create New Product ==> /api/v1/admin/product/new
exports.newProduct = async(req,res,next) => {
    try{
        req.body.user = req.user.id;//moving the user id to body bcoz Product.create() takes the data from body
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        })
    }
    catch(error){
        next(error);
    }
}

//GET ALL PRODUCTS ==> /api/v1/products?keyword=apple
exports.getProducts = async (req,res,next) => {
    try{

        // return next(new ErrorHandler('New Error',400))
        // console.log(req.query);
        const resPerPage = 8;
        const productCount = await Product.countDocuments();

        /*builds the query string*/
        const apiFeatures = new APIFeatures(Product, req.query)
                                .search()//you can just directly call Product.find({name:{$regex:'muthu'}}) but defined in a new class for code re-usablility
                                .filter()
                                .pagination(resPerPage);

        /*query Execution*/
        const products = await apiFeatures.query;

        res.status(200).json({
            success: true,
            count: products.length,
            productsCount: productCount,
            products,
            resPerPage
        })

    }
    catch(error){
        next(error);
    }
}

//GET SINGLE PRODUCT DETAILS => /api/v1/product/{id}
exports.getSingleProduct = async(req,res,next) => {
    try{
        // return next(new ErrorHandler('New Error',400))
        const product = await Product.findById(req.params.id);
    
        if(!product){
            return next(new ErrorHandler('Product not Found', 404));
        }
    
        res.status(200).json({
            success: true,
            product
        })
    }
    catch(error){
        next(error);
    }
}

//update Product => /api/v1/admin/product/:id
exports.updateProduct = async(req,res,next) => {
    try{
        let product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHandler('Product not Found', 404));
        }
    
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators: true,
            useFindAndModify: false
        })
    
        res.status(200).json({
            success: true
        })
    }
    catch(error){
        next(error);
    }
}

//DELETE PRODUCT => /api/v1/admin/product/:id
exports.deleteProduct = async (req,res,next) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHandler('Product not Found', 404));
        }
    
        await product.remove();
        res.status(200).json({
            success: true,
            message: 'Product Deleted'
        })
    }
    catch(error){
        next(error);
    }
}


//create a review ==> /api/v1/review
exports.createProductReview = async(req,res,next) => {
    try{
        const { rating, comment, productId } = req.body;
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        /*Load the product*/
        const product = await Product.findById(productId);
        /*Load the reviews array.  For each review check whether review user id and the current logged in user id matches*/
        const isReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());

        /*if reviewed edit it.  Else create a new review*/
        if(isReviewed){
            product.reviews.forEach(review => {
                if(review.user.toString() === req.user._id.toString() ){
                    review.comment = comment;
                    review.rating = rating;
                }
            })
        }else{
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length
        }

        //caculating average rating
        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save({validateBeforeSave: false});
        res.status(200).json({
            success:true
        })
    }
    catch(error){
        next(error);
    }
}

//Display all the reviews for a specific product => /api/v1/reviews
exports.getProductReviews = async(req,res,next) => {
    try{
        const product = await Product.findById(req.query.id);
        res.status(200).json({
            success:true,
            reviews: product.reviews
        })

    }
    catch(error){
        next(error);
    }
}

//Delete Product review => /api/v1/reviews
exports.deleteReview = async(req,res,next) => {
    try{
        const product = await Product.findById(req.query.productId);

        const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
        const numOfReviews = reviews.length;
        const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numOfReviews
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success:true
        })

    }
    catch(error){
        next(error);
    }
}