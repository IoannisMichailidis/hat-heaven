import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from '@hat-heaven/common';


dotenv.config();

// --------------------------------
// Initialization
// --------------------------------
// Connect to MongoDB
connectDB();

// if (!process.env.JWT_SECRET) {
//     throw new Error('JWT_SECRET must be defined');
// }

const port = process.env.PORT || 5000;
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
// Route
// --------------------------------
app.use('/api/users', userRoutes); // api/users is the prefix for whatever is inside the userRoutes

// If none of the above routers was hit then we go for the following handlers
app.use(notFound);

// General error handler
app.use(errorHandler);

// --------------------------------
// Listener
// --------------------------------
app.listen(port, () => console.log(`Auth Micro-Server running on port ${port}`))