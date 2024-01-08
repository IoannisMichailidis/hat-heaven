import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
 } from '../controllers/orderController.js';
 import {protect, admin} from '../middleware/authMiddleware.js';

// Order Routes
router.route('/')
    .post(protect, addOrderItems) // protected route from anuthorized users using protect middleware
    .get(protect, admin, getOrders); // protected route from anuthorized users using protect middleware && non admins using admin middleware

router.route('/myorders').get(protect, getMyOrders); // protected route from anuthorized users using protect middleware

router.route('/:id').get(protect, getOrderById); // protected route from anuthorized users using protect middleware

router.route('/:id/pay').put(protect, updateOrderToPaid); // protected route from anuthorized users using protect middleware

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // protected route from anuthorized users using protect middleware && non admins using admin middleware

export default router;