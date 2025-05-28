import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from '@hat-heaven/common';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from '@hat-heaven/common';


dotenv.config();

// --------------------------------
// Initialization
// --------------------------------
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined');
}

const mongoURI = process.env.MONGO_URI;

if(!mongoURI) {
    throw new Error('MONGO_URI must be defined');
}

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(mongoURI);

// Initialize the app
const app = express();

// --------------------------------
// Middleware
// --------------------------------
// Body parser middleware (parse body data)
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie parser moddleware (parse the cookie from the request)
app.use(cookieParser());


// --------------------------------
// Routes
// --------------------------------
app.use('/api/products', productRoutes); // api/products is the prefix for whatever is inside the productRoutes

// If none of the above routers was hit then we go for the following handlers
app.use(notFound);

// General error handler
app.use(errorHandler);

// --------------------------------
// Listener
// --------------------------------
app.listen(port, () => console.log(`Products Micro-Server running on port ${port}`))