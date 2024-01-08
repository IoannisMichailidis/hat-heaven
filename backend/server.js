import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
dotenv.config();

// Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;
// Initialize the app
const app = express();

// Body parser middleware (parse body data)
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie parser moddleware (parse the cookie from the request)
app.use(cookieParser());

// Routes
app.get('/', (req,res) => {
    res.send('API is running...');
});

// Product Routes
app.use('/api/products', productRoutes); // api/products is the prefix for whatever is inside the productRoutes

// User Routes
app.use('/api/users', userRoutes); // api/users is the prefix for whatever is inside the userRoutes

// Order Routes
app.use('/api/orders', orderRoutes); // api/orders is the prefix for whatever is inside the orderRoutes

// Upload Image Route
app.use('/api/upload', uploadRoutes) // api/upload is the prefix for whatever is inside the uploadRoutes

// PayPal Route
app.get('/api/config/paypal', (req,res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID}));

// Make /loads directory static
const __dirname = path.resolve(); // set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

// If none of the above routers was hit then we go for the following handlers
app.use(notFound);

// General error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`))