// This file defines all URLs related to product operations (browsing, searching, etc.)

// Import necessary tools and functions
import express from "express"
import { 
    getallproducts,    // Get list of all products
    getproduct,        // Get products by category
    getproductsbyid,   // Get specific product details
    searchProduct,      // Search products by name
    getCategories      // Get list of all categories
} from "../controller/product.js";

// Create a new router for product-related URLs
const router = express.Router();

// Define URLs and what they do:

// Get products in a specific category
// Example: /api/product/get?cat=Electronics
router.get('/get',getproduct);

// Get all products in the store
// Example: /api/product/getall
router.get('/getall',getallproducts);

// Get details of a specific product
// Example: /api/product/getbyid?id=123
router.get('/getbyid',getproductsbyid);

// Search for products by name
// Example: /api/product/search?name=phone
router.get('/search',searchProduct);

// Get list of all product categories
// Example: /api/product/getcategories
router.get('/getcategories', getCategories)

export default router