import express from "express"
import { authCheck, deleteWishlist, googleLogin, login, signup, sendVerification,  updateWishlist, verify, verifyEmail, logout, getWishlist, updateUser, addVendor, interection, addRatingReview, editReview, deleteReview, chat, updateAddress, sendMail } from "../controller/user.js";
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
router.post('/interection', auth, interection)
router.post('/addratingreview', auth, addRatingReview)
router.put('/editreview', auth, editReview)
router.delete('/deletereview', auth, deleteReview)
router.post('/chat', auth, chat)
router.get('/sendverification', auth, sendVerification)
router.put('/updateaddress', auth, updateAddress)
router.post('/sendmail', auth, sendMail);

export default router