import express from "express"
import { checkAdmin } from "../services/auth.js";
import { addproduct, editproduct, removeproduct, updateproduct, checkAuth, getProducts, getAllOrders, getAllUsers, getVendors, approveVendor, logout, getLast7DaysOrders, getSalesByVendors, getOrdersByCategory, getTotalDetail } from "../controller/admin.js";

const router = express.Router();

router.post('/addProduct', checkAdmin, addproduct)
router.post('/editproduct', checkAdmin, editproduct)
router.delete('/removeProduct', checkAdmin, removeproduct)
router.put('/updateProduct', checkAdmin, updateproduct)
router.get('/getproduct', checkAdmin, getProducts)
router.get('/authcheck', checkAuth)
router.get('/getallorders', getAllOrders)
router.get('/getallusers', getAllUsers)
router.get('/getvendors', checkAdmin, getVendors)
router.get('/approvevendor', checkAdmin, approveVendor)
router.get('/logout', checkAdmin, logout)
router.get('/last7daysorders', checkAdmin, getLast7DaysOrders)
router.get('/salesbycategories', checkAdmin, getOrdersByCategory)
router.get('/salesbyvendors', checkAdmin, getSalesByVendors)
router.get('/dashboarddetail', checkAdmin, getTotalDetail)

export default router