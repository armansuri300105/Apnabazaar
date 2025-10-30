// This file defines all URLs related to user operations (account management, wishlist, reviews, etc.)

// Import necessary tools and functions
import express from "express"
import { 
    // User authentication functions
    authCheck, login, signup, googleLogin, logout,
    // Email verification
    sendVerification, verify, verifyEmail,
    // Password reset
    generateResetLink, resetPassword,
    // Wishlist management
    deleteWishlist, updateWishlist, getWishlist,
    // User profile
    updateUser, updateAddress,
    // Vendor operations
    addVendor,
    // Product interactions
    interection, addRatingReview, editReview, deleteReview,
    // Communication
    chat, sendMail,
    // Order management
    cancelOrder
} from "../controller/user.js";
import { auth } from "../services/auth.js";              // Authentication middleware
import { calculateTotalSpent } from "../controller/admin.js";  // User spending analytics

// Create router for user-related URLs
const router = express.Router();

// Account Management URLs
// ----------------------
router.post('/login', login);                           // Log in existing user
router.post('/signup', signup);                         // Create new account
router.post('/googlelogin', googleLogin)                // Sign in with Google
router.get('/logout', logout)                           // Sign out
router.get('/authcheck', authCheck)                     // Check if user is logged in

// Email Verification
// ----------------
router.post('/verify',verify);                         // Verify email code
router.get('/verifyEmail', verifyEmail)                // Start verification process
router.get('/sendverification', auth, sendVerification) // Resend verification email

// Password Reset
// -------------
router.post('/generateresetlink', generateResetLink)    // Send password reset email
router.post('/resetpassword', resetPassword)            // Set new password

// Wishlist Management
// -----------------
router.post('/wishlist/:Productid',auth, updateWishlist)    // Add to wishlist
router.delete('/wishlist/:Productid',auth, deleteWishlist)  // Remove from wishlist
router.get('/wishlist/get',auth, getWishlist)              // View wishlist

// Profile Management
// ----------------
router.put('/update',auth, updateUser);                // Update profile info
router.put('/updateaddress', auth, updateAddress)      // Update shipping address

// Vendor Operations
// ---------------
router.post('/addvendor', auth, addVendor)            // Apply to become vendor

// Product Interactions
// ------------------
router.post('/interection', auth, interection)              // Track user behavior
router.post('/addratingreview', auth, addRatingReview)      // Add product review
router.put('/editreview', auth, editReview)                 // Edit review
router.delete('/deletereview', auth, deleteReview)          // Delete review

// Communication
// ------------
router.post('/chat', auth, chat)                      // Customer support chat
router.post('/sendmail', auth, sendMail);             // Send email to support

// Order Management
// --------------
router.post('/cancelorder', auth, cancelOrder)         // Cancel an order
router.get('/calculateTotalSpent', calculateTotalSpent) // Get user spending stats

export default router