const app = require('./app');
const connectDatabase = require('./config/database');

// const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

//Handle uncaught exceptions
process.on('uncaughtException',err => {
    console.log(`Error: ${err.stack}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1);
});

// console.log(a); --> this is uncaught exception

//setting up config file
if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({path: 'backend/config/config.env'});

//connecting to the db
connectDatabase();

//setting up cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})

//handle unhandle promise rejections on server
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1)
    })
})