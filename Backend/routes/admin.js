import express from "express"
import { checkAdmin } from "../services/auth.js";
import { addproduct, removeproduct, updateproduct, checkAuth, getProducts, getAllOrders, getAllUsers, getVendors, approveVendor, logout } from "../controller/admin.js";

const router = express.Router();

router.post('/addProduct', checkAdmin, addproduct)
router.delete('/removeProduct', checkAdmin, removeproduct)
router.put('/updateProduct', checkAdmin, updateproduct)
router.get('/getproduct', checkAdmin, getProducts)
router.get('/authcheck', checkAuth)
router.get('/getallorders', getAllOrders)
router.get('/getallusers', getAllUsers)
router.get('/getvendors', checkAdmin, getVendors)
router.get('/approvevendor', checkAdmin, approveVendor)
router.get('/logout', checkAdmin, logout)

export default router