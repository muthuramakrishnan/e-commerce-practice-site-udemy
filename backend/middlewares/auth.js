//checks if user is authenticated or not

const jwt = require('jsonwebtoken');
const user = require('../models/user');
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthenticatedUser = async (req,res,next) => {
    try{
        const { token } = req.cookies;

        if(!token){
            return next(new ErrorHandler('Please login to access this API', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded.id);
        next();

    }
    catch(error){
        next(error);
    }
}

//Handling user roles
exports.authorizeRoles = (...roles)=>{
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler('Insufficient Permission - Not Authorized', 403));
        }
        next();
    }
}