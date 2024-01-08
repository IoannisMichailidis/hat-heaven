import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from '../utils/generateToken.js';

// ----------------------------------------------------------
// Public
// ----------------------------------------------------------
// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req,res) => {
    // console.log(req.body);
    // Get the data sent in the request
    const { email, password } = req.body;
    // Check if user exists with that email
    const user = await User.findOne({ email });

    // Send back user info
    if (user && (await user.matchPassword(password))) { // matchPassword method created in the userModel.js
        generateToken(res, user._id)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(401); // unauthorized
        throw new Error('Invalid email or password'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

// @desc    Register user
// @route   POST /api/users/
// @access  Public
const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    // User exists
    if (userExists) {
        res.status(400);
        throw new Error('User already exists'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
    // User doesn't exist => Create User
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        generateToken(res, user._id)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

// ----------------------------------------------------------
// Private
// ----------------------------------------------------------
// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req,res) => {
    // clear the cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out succesfully'});
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req,res) => {
    // User id exists after logged in or registered stored in the cookie
    const user = await User.findById(req.user._id);

    if (user) {
        generateToken(res, user._id)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(400);
        throw new Error('User not found'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

// @desc    Update user profile (token is used instead of id)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req,res) => {
    // User id exists after logged in or registered stored in the cookie
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;     // Update name if there is req.body otherwise keep whatever already exists
        user.email = req.body.email || user.email;  // Update email if there is req.body otherwise keep whatever already exists

        if (req.body.password) {                    // Update password if there is req.body
            user.password = req.body.password;
        }

        // Update db
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });

    } else {
        res.status(400);
        throw new Error('User not found'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

// ----------------------------------------------------------
// ADMIN
// ----------------------------------------------------------
// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req,res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserByID = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select('-password'); // we don't want the password

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Can't delete Admin user
        if (user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete admin user'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
        }
        // Delete user
        await User.deleteOne({_id: user._id});
        res.status(200).json({ message: 'User deleted successfully'});
    } else {
        res.status(404);
        throw new Error('User not found'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Update user
        user.name = req.body.name || user.name; // Update name if there is req.body otherwise keep whatever already exists
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        // Save user changes to DB
        const updatedUser = await user.save();

        // Send updated user data
        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        })
    } else {
        res.status(404);
        throw new Error('User not found'); // throw error using the custom error handler (errorHandler which is located at the end of routers int the serer.js)
    }
});

export {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser
}