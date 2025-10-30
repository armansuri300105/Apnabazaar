// This file defines all URLs for admin operations (managing products, users, vendors, and analytics)

// Import necessary tools and functions
import express from "express"
import { checkAdmin } from "../services/auth.js";  // Verify admin privileges

// Import admin management functions
import { 
    // Product management
    addproduct, editproduct, removeproduct, updateproduct, updateProductStatus,
    // User/vendor management
    getAllUsers, getVendors, approveVendor,
    // Order management
    getAllOrders,
    // Analytics and reporting
    getLast7DaysOrders, getSalesByVendors, getOrdersByCategory, getTotalDetail,
    // Admin authentication
    checkAuth, logout,
    // Product listing
    getProducts,
    // Notifications
    getNotifications, readNotification 
} from "../controller/admin.js";

// Create router for admin-only URLs
const router = express.Router();

// Product Management
// ----------------
// Add new product to store
router.post('/addProduct', checkAdmin, addproduct)
// Edit existing product details
router.post('/editproduct', checkAdmin, editproduct)
// Remove product from store
router.delete('/removeProduct', checkAdmin, removeproduct)
// Update product information
router.put('/updateProduct', checkAdmin, updateproduct)
// List all products
router.get('/getproduct', checkAdmin, getProducts)
// Update product availability status
router.put('/updateproductstatus', checkAdmin, updateProductStatus)

// User Management
// -------------
// Get list of all users
router.get('/getallusers', getAllUsers)
// Get list of vendor applications
router.get('/getvendors', checkAdmin, getVendors)
// Approve vendor application
router.get('/approvevendor', checkAdmin, approveVendor)

// Order Management
// -------------
// View all orders in system
router.get('/getallorders', getAllOrders)

// Analytics and Reports
// ------------------
// Get order data for last week
router.get('/last7daysorders', checkAdmin, getLast7DaysOrders)
// View sales by product category
router.get('/salesbycategories', checkAdmin, getOrdersByCategory)
// View sales by vendor
router.get('/salesbyvendors', checkAdmin, getSalesByVendors)
// Get dashboard summary statistics
router.get('/dashboarddetail', checkAdmin, getTotalDetail)

// Admin Account Management
// ----------------------
// Check if admin is logged in
router.get('/authcheck', checkAuth)
// Admin logout
router.get('/logout', checkAdmin, logout)

// Notifications
// -----------
// Get admin notifications
router.get('/notification', checkAdmin, getNotifications)
// Mark notification as read
router.put('/readnotification', checkAdmin, readNotification)

export default router