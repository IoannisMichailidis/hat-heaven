import express from 'express';
const router = express.Router();
import {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser
 } from '../controllers/userController.js';
 import {protect, admin} from '../middleware/authMiddleware.js';

// Product Routes
router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers); // protected route from anuthorized users using protect middleware && non admins using admin middleware

router.post('/logout', logoutUser); // No .route is needed because there is just one request for that

router.post('/login', loginUser);

router.route('/profile')
    .get(protect, getUserProfile) // protected route from anuthorized users using protect middleware
    .put(protect, updateUserProfile); // protected route from anuthorized users using protect middleware

router.route('/:id')
    .delete(protect, admin, deleteUser) // protected route from anuthorized users using protect middleware && non admins using admin middleware
    .get(protect, admin, getUserByID)   // protected route from anuthorized users using protect middleware && non admins using admin middleware
    .put(protect, admin, updateUser);   // protected route from anuthorized users using protect middleware && non admins using admin middleware

export default router;