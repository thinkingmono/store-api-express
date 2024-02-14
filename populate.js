require('dotenv').config()
//Db connection handler import.
const connectDB = require('./db/connect')
//Product model import.
const Product = require('./models/product')
//Import sample data products
const jsonProducts = require('./products.json')

//Function to populate mongodb database with sample data.
const start = async () => {
    try {
        //Connect to db
        await connectDB(process.env.MONGO_URI);
        //Delete all products from db
        await Product.deleteMany();
        //Create all products into db
        await Product.create(jsonProducts);
        console.log('Success!');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
//Run start.
start();