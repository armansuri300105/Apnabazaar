// This file defines all URLs related to order operations (placing orders, payments, tracking)

// Import necessary tools and functions
import express from "express"
import { 
    CreateOrder,      // Place new order
    verifyPayment,    // Confirm payment success
    getOrders,        // Get all orders for a user
    getOrder,         // Get order details
    getOrderByID      // Find specific order
} from "../controller/order.js";
import { auth } from "../services/auth.js";  // Check user is logged in

// Create router for order-related URLs
const router = express.Router();

// Order Creation and Payment
// ------------------------
// Place a new order (requires login)
// POST /api/order/create
// Body: items[], shipping address, payment method
router.post('/create', auth, CreateOrder)

// Verify payment was successful
// POST /api/order/verifypayment
// Body: payment details from Razorpay
router.post('/verifypayment',auth, verifyPayment)

// Order History and Tracking
// ------------------------
// Get all orders for current user
// GET /api/order/getall
router.get('/getall', auth, getOrders)

// Get orders with filters (status, date, etc.)
// GET /api/order/get?status=pending
router.get('/get', auth, getOrder)

// Get specific order details
// GET /api/order/getbyid?id=ORDER123
router.get('/getbyid', auth, getOrderByID)

export default router