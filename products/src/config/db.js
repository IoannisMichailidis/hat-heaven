import mongoose from 'mongoose';

const connectDB = async (mongoURI) => {
    try {
        // const conn = await mongoose.connect(process.env.MONGO_URI);
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // exit the process
    }
};

export default connectDB;