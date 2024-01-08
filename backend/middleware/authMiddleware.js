import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// Protect routes from unauthorized users
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Read the JWT from the cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            // Decode the token to get the userId. When we created it we set the payload as the userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-paddword'); // exclude the password and add the result to the request object as user
            next(); // move to the next piece of middleware
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized, no failed'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

// Protect routes from non admin users
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
}

export {protect, admin}