import { getuser, setuserandcookies } from "../services/auth.js";
import USER from "../models/user.js"
import axios from "axios"
import bcrypt from "bcrypt"
import {oauth2Client} from "../services/googleAuth.js"
import { sendVendorApplicationMail, sendVerificationMail } from "../emails/sendMail.js";
import PRODUCT from "../models/product.js";

export const signup = async (req,res) => {
    const {name, email, phone, password} = req.body;
    const user = await USER.findOne({email});
    if (user){
        return res.json({message: "This Email already registered"})
    }
    const saltround = 11;
    const hashedpass = await bcrypt.hash(password, saltround);
    const verificationToken =  Math.floor(100000 + Math.random() * 900000)
    const verificationTokenExpiry = Date.now() + 15*60*60*1000 // 15 min
    const token = setuserandcookies(res, {name, email})
    await USER.create({
        name,
        email,
        phone,
        password: hashedpass,
        verificationToken,
        verificationTokenExpiry,
        authProvider: "local"
    })
    await sendVerificationMail(email, verificationToken);
    return res.json({success: true, message: "user registered successfully", user: {name, email, phone}, token});
}

export const login = async (req,res) => {
    const {email , password} = req.body;
    try {
        const user = await USER.findOne({email});

        if (!user){
            return res.json({success: false, message: "user not registered"});
        }

        const UserPassword = user.password;
        const isMatch = await bcrypt.compare(password, UserPassword);
        if (!isMatch){
            return res.json({success: false, message: "incorrect possword"});
        } else {
            const token = setuserandcookies(res, user);
            return res.json({success: true, message: "user login successfully", token});
        }
    } catch (error) {
        res.json({error: error});
    }
}

export const verifyEmail = async (req,res) => {
    const {Token} = req.query
    const user = await USER.findOne({verificationToken: Token});
    if (!user){
        return res.json({ success: false, message: "Invalid or expired verification link" })
    }
    if (user?.verificationTokenExpiry < Date.now()){
        return res.json({ success: false, message: "Verification link has expired" });
    }

    await USER.updateOne(
        { _id: user._id },
        { $set: { isVerified: true }, $unset: { verificationToken: "", verificationTokenExpiry: "" } }
    );

    return res.json({ success: true, message: "User verified successfully" });
}

export const verify = (req,res) => {
    const {token} = req.body;
    if (!token) return null;
    const user = getuser(token);
    if (!user) return null;
    return res.json({message: "user is verified",user})
}

export const googleLogin = async (req,res) => {
    const {code} = req.query;
    const googleres = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleres.tokens);
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleres.tokens.access_token}`);
    const {email, name } = userRes.data;
    let user = await USER.findOne({email});
    if (!user){
        const newUser = await USER.create({
            email,
            name,
            authProvider: "google",
            isVerified: true,
        });
        user = newUser;
    }
    const token = setuserandcookies(res, user);
    res.send({success: true,user: {email,name,token}})
    // try {
    // } catch (error) {
    //     console.log("Error while authenticating user: ", error.message);
    //     res.send({success: false, message: "Error while authenticating user: ", error: error.message});
    // }
}

export const authCheck = async (req,res) => {
    try {
        const token = req?.cookies?.token
        if (!token){
            return res.send({isAuthenticate: false, message: "UnAutharized Access"})
        }
        const decodeUser = getuser(token)
        if (!decodeUser){
            return res.send({isAuthenticate: false, message: "UnAutharized Access"})
        }
        const email = decodeUser?.email
        const user = await USER.findOne({email});
        if (!user){
            return res.send({ isAuthenticate: false, message: "UnAutharized Access" })
        }
        return res.send({ isAuthenticate: true, message: "Authenticate user", user, role: user.role })
    } catch (error) {
        res.send({ isAuthenticate: false, message: error.message })
    }
}

export const updateWishlist = async (req,res) => {
    console.log(req.user)
    try {
        const user = await USER.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { wishlist: req.params.Productid } },
            { new: true }
        ).populate("wishlist");
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const deleteWishlist = async (req,res) => {
    try {
        const user = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { wishlist: req.params.Productid } },
            { new: true }
        ).populate("wishlist");
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const logout = (req,res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logout successful" , success: true});
    } catch (err) {
        res.status(500).json({ message: err.message , success: false});
    }
}

export const getWishlist = async (req,res) => {
    try {
        const data = await USER.findById(req.user._id).populate("wishlist")
        return res.status(200).json({success: true, data})
    } catch (error) {
        res.status(500).json({ message: err.message , success: false});
    }
}

export const updateUser = async (req,res) => {
    const formData = req.body;
    const data = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
    }
    try {
        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            {$set : data},
            {new: true, runValidators: true}
        )

        res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: err.message , success: false});
    }
}

export const addVendor = async (req, res) => {
  try {
    const { companyName, address } = req.body;
    const userId = req.user?._id;

    if (!companyName || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Company name and address are required" });
    }

    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "vendor") {
      return res
        .status(400)
        .json({ success: false, message: "You are already a vendor" });
    }

    user.vendor = {
      companyName,
      address,
      status: "Pending",
      appliedAt: new Date(),
    };
    user.role = "vendor";

    await user.save();

    await sendVendorApplicationMail("arshadmansuri572@gmail.com", user?.name, user?.email)

    res.status(200).json({
      success: true,
      message: "Vendor application submitted successfully",
      vendor: user.vendor,
    });
  } catch (err) {
    console.error("Error in addVendor:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const interection = async (req,res) => {
    try {
        const data = req.body
        console.log(data);
        res.status(200).json({success: true, message: "Data saved Successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const addRatingReview = async (req,res) => {
    try {
        const reviewData = req.body
        const ProductID = reviewData?.productID
        const product = await PRODUCT.findOne({_id: ProductID})
        if (!product){
            return res.status(404).json({success: false, message: "Product not found"})
        }

        product.reviews = [...product.reviews, {
            user: reviewData.user,
            username: reviewData.name,
            rating: reviewData.rating,
            comment: reviewData.review,
            createdAt: reviewData.date
        }]
        let avgrating = 0 
        product.reviews.map((review) => (
            avgrating += review.rating
        ))
        avgrating = avgrating/(product.ratings.count + 1)
        product.ratings.count += 1
        product.ratings.average = avgrating
        await product.save()
        return res.status(200).json({ success: true, message: "Review added successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const editReview = async (req, res) => {
  try {
    const data = req.body
    const { productID, user, rating, review } = data

    const product = await PRODUCT.findById(productID)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    const reviewIndex = product.reviews.findIndex(r => r.user.toString() === user)

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: "Review not found for this user" })
    }

    product.reviews[reviewIndex].rating = rating
    product.reviews[reviewIndex].comment = review
    product.reviews[reviewIndex].createdAt = new Date()

    let avgrating = 0 
    product.reviews.map((review) => (
        avgrating += review.rating
    ))
    avgrating = avgrating/(product.ratings.count + 1)
    product.ratings.average = avgrating

    await product.save()

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      reviews: product.reviews
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const { productID } = req.query
    const userID = req?.user?._id
    console.log(productID, userID)

    const product = await PRODUCT.findById(productID)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    // Filter out the user's review
    const updatedReviews = product.reviews.filter(
      (r) => r.user.toString() !== userID.toString()
    )

    // If no change, review not found
    if (updatedReviews.length === product.reviews.length) {
      return res.status(404).json({ success: false, message: "Review not found" })
    }

    product.reviews = updatedReviews

    await product.save()
    
    let avgrating = 0
    product.reviews.map((review) => (
        avgrating += review.rating
    ))
    avgrating = avgrating/(product.ratings.count + 1)
    product.ratings.count -= 1
    product.ratings.average = avgrating

    await product.save()

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      reviews: product.reviews
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}