// This file handles user authentication, login sessions, and access control

// Import required security and database tools
import jwt from "jsonwebtoken"              // For creating secure login tokens
import USER from "../models/user.js"        // User database model

// Create login session for user and set secure cookie
export const setuserandcookies = (res, user) => {
    // Create token with user information
    const payload = {
        name: user.name,
        email: user.email
    }
    // Sign token with secret key and set 7-day expiry
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '7d'})

    // Set cookie based on user type (customer/vendor or admin)
    if (user?.role === "customer" || user?.role === "vendor"){
        res.cookie("token", token, {
            httpOnly: true,          // Cannot be accessed by browser JavaScript
            secure: true,            // Only sent over HTTPS
            sameSite: "none",        // Allows cross-site requests
            maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expires in 7 days
        });
    }
    if (user?.role === "Admin"){
        // Special cookie for admin users
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    return token
}

// Get user information from login token
export const getuser = (token) => {
    try {
        if (!token) return null;
        // Verify token is valid and not expired
        return jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        console.error({error});
    }
}

// Check if user has admin privileges
export const checkAdmin = async (req,res,next) => {
    try {
        // Get admin token from cookie
        const token = req?.cookies?.admin_token
        if (!token) return res.status(401).json({ message: "No token provided" });

        // Get user info from token
        const decoded = getuser(token);

        // Find user in database (exclude password from results)
        const user = await USER.findOne({email: decoded.email}).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if user is an admin
        const role = user.role;
        if (role!="Admin"){
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

export const auth = async (req,res,next) => {
    try {
        const token = req?.cookies?.token
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = getuser(token);

        const user = await USER.findOne({email: decoded.email}).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

export const checkVendor = async (req,res,next) => {
    try {
        const token = req?.cookies?.token
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = getuser(token);

        const user = await USER.findOne({email: decoded.email}).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const role = user?.role;
        if (role!=="vendor"){
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}