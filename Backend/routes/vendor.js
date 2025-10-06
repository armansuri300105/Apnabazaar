import express from "express"
import { checkVendor } from "../services/auth.js";
import { addVendorProduct, editVendorProduct, getVendorProducts, getVendorOrders, updateOrderStatus, removeProduct, getVendorLast7DaysOrders, getVendorsOrdersByCategory } from "../controller/vendor.js";
const router = express.Router();

router.post('/addproduct', checkVendor, addVendorProduct)
router.post('/editproduct', checkVendor, editVendorProduct)
router.get('/getproducts', checkVendor, getVendorProducts)
router.get('/getorders', checkVendor, getVendorOrders)
router.put('/updateorderstatus', checkVendor, updateOrderStatus)
router.delete('/deleteproduct', checkVendor, removeProduct)
router.get('/getlast7daysorders', checkVendor, getVendorLast7DaysOrders)
router.get('/getordersbycategory', checkVendor, getVendorsOrdersByCategory)

export default router