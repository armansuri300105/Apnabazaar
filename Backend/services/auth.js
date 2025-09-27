import jwt from "jsonwebtoken"
import USER from "../models/user.js"

export const setuserandcookies = (res, user) => {
    const payload = {
        name: user.name,
        email: user.email
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '7d'})
    console.log(user?.role)
    if (user?.role === "customer" || user?.role === "vendor"){
        res.cookie("token", token ,{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        })
    }
    if (user?.role === "Admin"){
        res.cookie("admin_token", token ,{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        })
    }

    return token
}

export const getuser = (token) => {
    try {
        if (!token) return null;
        return jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        console.error({error});
    }
}

export const checkAdmin = async (req,res,next) => {
    try {
        const token = req?.cookies?.admin_token
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = getuser(token);

        const user = await USER.findOne({email: decoded.email}).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

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