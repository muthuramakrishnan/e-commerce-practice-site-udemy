const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// const dotenv = require('dotenv');
const path = require('path');

const errorMiddleware = require('./middlewares/errors');
app.use(express.json());//populates json request in req.body
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({path: 'backend/config/config.env'});

//IMPORT ALL ROUTES
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');

app.use('/api/v1',products);
app.use('/api/v1',auth);
app.use('/api/v1',order);
app.use('/api/v1',payment);


//if the environment is production -> it serves the front end - build static files in the same port
if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    })
}

//middleware
app.use(errorMiddleware);
module.exports = app;