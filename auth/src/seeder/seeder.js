import dotenv from "dotenv";
import users from "./users-data.js";
import { User } from "../models/userModel.js"; // I need the model because I am adding/creating users to the DB.
import { connectDB } from "@hat-heaven/common";
import { natsWrapper } from "../config/nats-wrapper.js";
import { connectNATS } from "../config/nats.js";
import { UserCreatedPublisher } from "../events/publishers/publishers.js";

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
    await User.deleteMany();

    // Create Users
    // const createdUsers = await User.insertMany(users);
    await Promise.all(
      users.map(async (user) => {
        const createdUser = await User.create({
          _id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          isAdmin: user.isAdmin,
        });

        const publisher = new UserCreatedPublisher(natsWrapper.client);
        await publisher.publish({
          id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          isAdmin: createdUser.isAdmin,
          version: createdUser.version,
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
