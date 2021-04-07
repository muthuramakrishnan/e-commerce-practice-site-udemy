const Product = require('../models/product');

const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');

//setting dotenv
dotenv.config({path: 'backend/config/config.env'});
connectDatabase();

const seedProducts = async () => {
    try{
        await Product.deleteMany();
        console.log('Products deleted');

        await Product.insertMany(products);
        console.log('All products added');
        process.exit();
    }
    catch(err){
        console.log(err.message);
        process.exit();
    }
}

seedProducts();