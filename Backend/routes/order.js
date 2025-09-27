import express from "express"
import { CreateOrder, verifyPayment, getOrders , getOrder, getOrderByID} from "../controller/order.js";
import { auth } from "../services/auth.js";

const router = express.Router();

router.post('/create', auth, CreateOrder)
router.post('/verifypayment',auth, verifyPayment)
router.get('/getall', auth, getOrders)
router.get('/get', auth, getOrder)
router.get('/getbyid', auth, getOrderByID)

export default router