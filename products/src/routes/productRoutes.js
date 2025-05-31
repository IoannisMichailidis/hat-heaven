import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getCategoryProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { checkObjectId } from "@hat-heaven/common"; // used wherever :id is in place

// Product Routes
router.route("/").get(getProducts).post(protect, createProduct); // admin,// protected route from anuthorized users using protect middleware && non admins using admin middleware

router.route("/:id/reviews").post(protect, checkObjectId, createProductReview); // protected route from anuthorized users using protect middleware

router.route("/top").get(getTopProducts);

router.route("/category/:category").get(getCategoryProducts);

router
  .route("/:id")
  .get(checkObjectId, getProductById)
  .put(protect, checkObjectId, updateProduct) // admin, // protected route from anuthorized users using protect middleware && non admins using admin middleware
  .delete(protect, checkObjectId, deleteProduct); // admin,  // protected route from anuthorized users using protect middleware && non admins using admin middleware

export default router;
