const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if(process.env.NODE_ENV === 'DEVELOPMENT') 
    {
        res.status(err.statusCode).json({
            status: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}

        error.message = err.message;

        //mongo object id error.  This line directly hits in try catch block.  So we again throw error using error Handler
        if(err.name == 'CastError'){
            const message = `Resource not found.  Invalid: ${err.path}`;
            error = new ErrorHandler(message, 400)
        }
        
        //Handling mongoose validation errors
        if(err.name == 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message);
            //Object.values wraps the object into an array.  so it converts entire object into 1 array element of type object
            error = new ErrorHandler(message, 400)
        }
        //Handling mongoose duplicate erros
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400);
        }

        //Handling wrong JWT token error
        if(err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'){
            const message = 'JWT token is invalid.  Please try again';
            error = new ErrorHandler(message, 400);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }

}