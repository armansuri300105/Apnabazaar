// This file defines all URLs for vendor operations (selling products, managing orders, viewing sales)

// Import necessary tools and functions
import express from "express"
import { checkVendor } from "../services/auth.js";  // Verify vendor account

// Import vendor management functions
import { 
    // Product management
    addVendorProduct, editVendorProduct, removeProduct,
    // Order management
    getVendorOrders, updateOrderStatus,
    // Product listing
    getVendorProducts,
    // Analytics
    getVendorLast7DaysOrders, getVendorsOrdersByCategory,
    // Notifications
    getNotifications, readNotification 
} from "../controller/vendor.js";

// Create router for vendor-only URLs
const router = express.Router();

// Product Management
// ----------------
// Add new product to sell
router.post('/addproduct', checkVendor, addVendorProduct)
// Edit product details
router.post('/editproduct', checkVendor, editVendorProduct)
// Remove product from store
router.delete('/deleteproduct', checkVendor, removeProduct)
// View all products listed by vendor
router.get('/getproducts', checkVendor, getVendorProducts)

// Order Management
// --------------
// View orders for vendor's products
router.get('/getorders', checkVendor, getVendorOrders)
// Update order status (processing/shipped/delivered)
router.put('/updateorderstatus', checkVendor, updateOrderStatus)

// Sales Analytics
// -------------
// View last week's orders
router.get('/getlast7daysorders', checkVendor, getVendorLast7DaysOrders)
// View sales by product category
router.get('/getordersbycategory', checkVendor, getVendorsOrdersByCategory)

// Notifications
// -----------
// Get vendor notifications (new orders, etc.)
router.get('/notification', checkVendor, getNotifications)
// Mark notification as read
router.put('/readnotification', checkVendor, readNotification)

export default router