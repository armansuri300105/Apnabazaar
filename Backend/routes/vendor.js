import express from "express"
import { checkVendor } from "../services/auth.js";
import { addVendorProduct, getVendorProducts, getVendorOrders, updateOrderStatus, removeProduct } from "../controller/vendor.js";
const router = express.Router();

router.post('/addproduct', checkVendor, addVendorProduct)
router.get('/getproducts', checkVendor, getVendorProducts)
router.get('/getorders', checkVendor, getVendorOrders)
router.put('/updateorderstatus', checkVendor, updateOrderStatus)
router.delete('/deleteproduct', checkVendor, removeProduct)

export default router