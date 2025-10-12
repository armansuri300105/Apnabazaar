import express from "express"
import { getallproducts, getproduct, getproductsbyid, searchProduct } from "../controller/product.js";

const router = express.Router();

router.get('/get',getproduct);
router.get('/getall',getallproducts);
router.get('/getbyid',getproductsbyid);
router.get('/search',searchProduct);

export default router