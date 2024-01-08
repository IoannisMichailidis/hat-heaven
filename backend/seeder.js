import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js"; // I need the model because I am adding/creating users to the DB.
import Product from "./models/productModel.js"; // I need the model because I am adding/creating products to the DB.
import Order from "./models/orderModel.js"; // Because I am wipping the order before I start adding users or products
import connectDB from "./config/db.js";

// Initialize dotenv
dotenv.config();

// Connect to DB
connectDB();

// Import data
const importData = async () => {
    try {
        // Clean up the db before start adding
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Create Users
        const createdUsers = await User.insertMany(users);

        // Create Products (only the admin users can create products)
        const adminUser = createdUsers[0]._id; // Pick the adminUser. We know in advance that the first user is the admin as I hardcoded the users data
        const sampleProducts = products.map((product)=> {
            return {...product, user: adminUser}; // Add the adminUser to the products
        })
        await Product.insertMany(sampleProducts); // Insert the products to the db
        console.log('Data imported!')
        process.exit();
    } catch(error) {
        console.log(`${error}`)
        process.exit(1); // exit and kill the process
    }
}

// Delete data
const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch(error) {
        console.log(`${error}`)
        process.exit(1); // exit and kill the process
    }
}

// Execute the destroyData() if the command has the -d as 3rd argument
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}