const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Register a user ==> /api/v1/register
exports.registerUser = async (req,res,next) => {
    try{
        /*since profile photo is a multipart/form-data storing it in CDN*/
        const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        })
        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });

        sendToken(user, 200, res);
    }
    catch(error){
        next(error);
    }
}

//Login user ==> /api/v1/login
exports.loginUser = async (req,res,next) => {
    try{
        const { email, password } = req.body;

        if(!email | !password){
            return next(new ErrorHandler('Please enter email and password'));
        }

        const user = await User.findOne({email}).select('+password');

        if(!user){
            return next(new ErrorHandler('Invalid Email or Password',401));
        }

        //checks if password is correct or not
        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched){
            return next(new ErrorHandler('Invalid Email or Password',401));
        }

        sendToken(user, 200, res);
    }
    catch(error){
        next(error)
    }
}

//get currently logged in user details
exports.getUserProfile = async (req,res,next) => {
    try{
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success:true,
            user
        })
    }
    catch(error){
        next(error);
    }
}

//update Password =? /api/v1/password/update
exports.updatePassword = async (req,res,next) => {
    try{
        const user = await User.findById(req.user.id).select('+password');
        const isMatched = await user.comparePassword(req.body.oldPassword);

        if(!isMatched){
            return next(new ErrorHandler('Password is incorrect'), 400);
        }
        
        user.password = req.body.password;
        await user.save();

        sendToken(user, 200, res);
    }
    catch(error){
        next(error);
    }
}

//update user profile => /api/v1/me/update
exports.updateProfile = async (req,res,next) => {
    try{
        const newUserData = {
            name: req.body.name,
            email: req.body.email
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new:true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            user
        });
    }
    catch(error){
        next(error);
    }
}

//Logout user => /api/v1/logout
exports.logout = async (req,res,next) => {
    try{
        res.cookie('token',null,{
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.status(200).json({
            success:true,
            message: 'Logged out Successfully'
        })
    }
    catch(error){
        next(error);
    }
}

//Forgot Password =? /api/v1/password/forgot
exports.forgotPassword = async (req,res,next) => {
    try{
        const user = await User.findOne({email: req.body.email});

        if(!user){
            return next(new ErrorHandler('User not found with this email',401));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save({validateBeforeSave: false}); //saves the hashed token into db

        //create reset password url - protocol gets http or https.. host is domain and then url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
        const message = `Please reset your password by clicking the following link \n\n${resetUrl}\nIf you have not requested this email please ignore it`;

        try{
            await sendEmail({
                email: user.email,
                subject: 'ShopIt Password Reset Link',
                message
            });
            res.status(200).json({
                success:true,
                message: `Email sent to ${user.email}`
            })
        }
        catch(error){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({validateBeforeSave: false});
            return next(new ErrorHandler(error.message, 500));
        }
    }
    catch(error){
        next(error)
    }
}

//reset password => /api/v1/password/reset/:token
exports.resetPassword = async (req,res,next) => {
    try{
        //hash the URL token and compare it with the PREVIOUSLY HASHED VALUE in the DB
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({resetPasswordToken, resetPasswordExpire: {$gt: Date.now()}});

        if(!user){
            return next(new Error('Password reset token is invalid or has been expired'),400);
        }

        if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorHandler('Passwords does not match',400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendToken(user, 200, res);

    }
    catch(error){
        next(error);
    }
}

//Admin Routes
//get all users /api/v1/admin/users
exports.allUsers = async(req,res,next) => {
    try{
        const users = await User.find();

        res.status(200).json({
            success:true,
            users
        })
    }
    catch(error){
        next(error);
    }
}

//get specific detail of a specific user /api/v1/admin/user/:id
exports.getUserDetails = async(req,res,next) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorHandler('User does not exist', 400));
        }

        res.status(200).json({
            success:true,
            user
        })
    }
    catch(error){
        next(error);
    }
}

//update user => /api/v1/admin/user/:id
exports.updateUser = async (req,res,next) => {
    try{
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new:true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            user
        });
    }
    catch(error){
        next(error);
    }
}

//delete user => /api/v1/admin/user/:id
exports.deleteUser = async(req,res,next) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorHandler('User does not exist', 400));
        }

        await user.remove();

        res.status(200).json({
            success:true,
            user
        })
    }
    catch(error){
        next(error);
    }
}