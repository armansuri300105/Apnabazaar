// Admin Panel API Functions
// This file contains all API calls for the admin dashboard

import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
    // baseURL: "http://localhost:3000",  // Development server
    baseURL: "https://apnabazaar-backend-3iwt.onrender.com",  // Production server
    withCredentials: true  // Enable sending cookies with requests
})

// Product Management APIs
// ---------------------

// Add a new product to the marketplace
export const addproduct = (data) => {
    return api.post('/api/admin/addProduct', data)
}

// Update existing product details
export const editProduct = (data) => {
    return api.post('/api/admin/editproduct', data)
}

// Get list of all products
export const getproducts = () => {
    return api.get('/api/admin/getproduct')
}

// Remove a product from the marketplace
export const removeproduct = (_id) => {
    return api.delete(`/api/admin/removeProduct?id=${_id}`)
}

// Authentication APIs
// ----------------

// Register new admin account
export const signup = (userData) => {
    return api.post('/api/user/signup', userData)
}

// Login to admin panel
export const signin = (userData) => {
    return api.post('/api/user/login', userData)
}

// Google OAuth login
export const googleLogin = (code) => {
    return api.post(`/api/user/googlelogin?code=${code}`)
}

// Session Management APIs
// --------------------

// Check if admin is currently logged in
export const authCheck = () => {
    return api.get('/api/admin/authcheck')
}

// Log out current admin session
export const logout = () => {
    return api.get('/api/admin/logout')
}

// Order Management APIs
// ------------------

// Get basic order information
export const getOrders = () => {
    return api.get('/api/order/getall')
}

// Get detailed information for all orders
export const getAllOrders = () => {
    return api.get(`/api/admin/getallorders`)
}

// User Management APIs
// -----------------

// Get list of all registered users
export const getAllUsers = () => {
    return api.get(`/api/admin/getallusers`)
}

// Vendor Management APIs
// -------------------

// Get list of all vendors
export const getVendors = () => {
    return api.get('/api/admin/getvendors');
}

// Approve a vendor's registration
export const approveVendor = (_id) => {
    return api.get(`/api/admin/approvevendor?id=${_id}`)
}

// Analytics APIs
// -----------

// Get order statistics for past week
export const getLast7DaysOrders = () => {
    return api.get('/api/admin/last7daysorders')
}

// Get sales breakdown by product category
export const getOrdersByCategory = () => {
    return api.get('/api/admin/salesbycategories')
}
export const getSalesByVendors = () => {
    return api.get('/api/admin/salesbyvendors')
}
export const dashboardDetail = () => {
    return api.get('/api/admin/dashboarddetail')
}
export const updateProjectStatus = (data) => {
    return api.put('/api/admin/updateproductstatus', data)
}

export const getNotifications = () => {
    return api.get('/api/admin/notification')
}
export const readNotification = (note_id) => {
    return api.put('/api/admin/readnotification', {note_id})
}