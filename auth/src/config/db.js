import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // provide the ClusterIP service name to connect to the specific mongoose instance + /auth which is the db name
        // check the infra/k8s/auth-mongo-depl.yaml file
        // const conn = await mongoose.connect(process.env.MONGO_URI);
        const conn = await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // exit the process
    }
};

export default connectDB;