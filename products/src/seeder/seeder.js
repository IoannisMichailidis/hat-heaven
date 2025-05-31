import dotenv from "dotenv";
import products from "./products-data.js";
import { Product } from "../models/productModel.js"; // I need the model because I am adding/creating users to the DB.
import { connectDB } from "@hat-heaven/common";
import { natsWrapper } from "../config/nats-wrapper.js";
import { connectNATS } from "../config/nats.js";
import { ProductCreatedPublisher } from "../events/publishers/publishers.js";

dotenv.config();

// --------------------------------
// Initialization
// --------------------------------
// Check if all of the env variables have been set on pod level
const MONGO_URI = process.env.MONGO_URI;
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID;
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID;
const NATS_URL = process.env.NATS_URL;

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}

if (!NATS_CLUSTER_ID) {
  throw new Error("NATS_CLUSTER_ID must be defined");
}

if (!NATS_CLIENT_ID) {
  throw new Error("NATS_CLIENT_ID must be defined");
}

if (!NATS_URL) {
  throw new Error("NATS_URL must be defined");
}

// Connect to MongoDB
await connectDB(MONGO_URI);

// Connect to NATS
await connectNATS(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

// Import data
const importData = async () => {
  try {
    // Clean up the db before start adding
    await Product.deleteMany();

    // Create Products
    await Promise.all(
      products.map(async (product) => {
        const productToSave = new Product({
          user: product.user,
          name: product.name,
          image: product.image,
          description: product.description,
          brand: product.brand,
          category: product.category,
          price: product.price,
          countInStock: product.countInStock,
          rating: product.rating,
          numReviews: product.numReviews,
        });

        const createdProduct = await productToSave.save();

        const publisher = new ProductCreatedPublisher(natsWrapper.client);
        await publisher.publish({
          id: createdProduct._id,
          user: createdProduct.user,
          name: createdProduct.name,
          image: createdProduct.image,
          description: createdProduct.description,
          brand: createdProduct.brand,
          category: createdProduct.category,
          price: createdProduct.price,
          countInStock: createdProduct.countInStock,
          rating: createdProduct.rating,
          numReviews: createdProduct.numReviews,
        });
      })
    );

    console.log("Data imported!");
    natsWrapper.client.close();
  } catch (error) {
    console.log(`${error}`);
    process.exit(1); // exit and kill the process
  }
};

// Delete data
const destroyData = async () => {
  try {
    await User.deleteMany();
    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.log(`${error}`);
    process.exit(1); // exit and kill the process
  }
};

// Execute the destroyData() if the command has the -d as 3rd argument
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
