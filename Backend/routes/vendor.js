import express from "express"
import { checkVendor } from "../services/auth.js";
import { addVendorProduct, getVendorProducts, getVendorOrders, updateOrderStatus } from "../controller/vendor.js";
const router = express.Router();

router.post('/addproduct', checkVendor, addVendorProduct)
router.get('/getproducts', checkVendor, getVendorProducts)
router.get('/getorders', checkVendor, getVendorOrders)
router.put('/updateorderstatus', checkVendor, updateOrderStatus)

export default router