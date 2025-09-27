import express from "express"
import { authCheck, deleteWishlist, googleLogin, login, signup, updateWishlist, verify, verifyEmail, logout, getWishlist, updateUser, addVendor } from "../controller/user.js";
import { auth } from "../services/auth.js";

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/verify',verify);
router.get('/verifyEmail', verifyEmail)
router.post('/googlelogin', googleLogin)
router.get('/authcheck', authCheck)
router.post('/wishlist/:Productid',auth, updateWishlist)
router.delete('/wishlist/:Productid',auth, deleteWishlist)
router.get('/wishlist/get',auth, getWishlist)
router.put('/update',auth, updateUser);
router.get('/logout', logout)
router.post('/addvendor', auth, addVendor)

export default router