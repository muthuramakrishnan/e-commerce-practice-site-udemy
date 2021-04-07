const Order = require('../models/order');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');

//Create a new order => /api/v1/order/new
exports.newOrder = async (req,res,next) => {
    try{
        const { 
            orderItems, 
            shippingInfo, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice, 
            paymentInfo 
        } = req.body;
        
        const order = await Order.create({
            orderItems, 
            shippingInfo, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice, 
            paymentInfo,
            paidAt: Date.now(),
            user: req.user._id
        });

        res.status(200).json({
            success: true,
            order
        })
    }
    catch(error){
        next(error);
    }
}

//get single order => /api/v1/order/:id
exports.getSingleOrder = async (req,res,next) => {
    try{
        const order = await Order.findById(req.params.id).populate('user', 'name email');//populates name, email data from the user table with the help of foreign key

        if(!order){
            return next(new ErrorHandler('No order found with this id', 404));
        }

        res.status(200).json({
            success:true,
            order
        })
    }
    catch(error){
        next(error);
    }
}
//get all user orders => /api/v1/orders/me
exports.myOrders = async (req,res,next) => {
    try{
        const order = await Order.find({user:req.user.id})

        res.status(200).json({
            success:true,
            order
        })
    }
    catch(error){
        next(error);
    }
}

//show all the orders in the db => /api/v1/admin/orders - ADMIN
exports.allOrders = async (req,res,next) => {
    try{
        const orders = await Order.find();

        let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += order.totalPrice
        });

        res.status(200).json({
            success:true,
            totalAmount,
            orders
        })
    }
    catch(error){
        next(error);
    }
}

//update process ORDER - ADMIN => /api/v1/admin/orders
exports.updateOrder = async (req,res,next) => {
    try{
        const order = await Order.findById(req.params.id);

        if(order.orderStatus==='Delivered'){
            return next(new ErrorHandler('Order already delivered',400));
        }
        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.quantity)
        })

        order.orderStatus = req.body.status,
        order.deliveredAt = Date.now();
        
        await order.save();

        res.status(200).json({
            success:true
        })
    }
    catch(error){
        next(error);
    }
}

updateStock = async (id, quantity) => {
    const product = await Product.findById(id);
    product.stock = product.stock-quantity;

    await product.save();
}
//delete single order => /api/v1/admin/order/:id - admin
exports.deleteOrder = async (req,res,next) => {
    try{
        const order = await Order.findById(req.params.id);

        if(!order){
            return next(new ErrorHandler('No order found with this id', 404));
        }

        await order.remove();

        res.status(200).json({
            success:true
        })
    }
    catch(error){
        next(error);
    }
}