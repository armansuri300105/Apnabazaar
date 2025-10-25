import PRODUCT from "../models/product.js";
import USER from "../models/user.js";
import { getuser } from "../services/auth.js";
import ORDER from "../models/order.js"
import { sendVendorApprovalMail } from "../emails/sendMail.js";
import notification from "../models/notification.js";


export const getProducts = async (req,res) => {
    const products = await PRODUCT.find()
      .populate("vendor", "vendor.companyName")
      .lean();
    if (products.length===0) return res.json({products: []})
    const formattedProducts = products.map(p => ({
        productID: p._id,
        ...p
    }));
    return res.json({success: true, message: `All Products`,items: products.length, products: formattedProducts})
}

export const editproduct = async (req,res) => {
  const {id, images, name, price, stock, description, category} = req.body;

  try {
    const product = await PRODUCT.findById(id)
    if (!product){
      return res.status(404).json({success:false, message: "Product Not Found"})
    }

    product.name = name
    product.price = price
    product.stock = stock
    product.description = description
    product.category = category
    product.images = images

    await product.save()
    return res.json({success: true, message: "Product Edited successfully"});
  } catch (error) {
    return res.status(500).json({success:false, message: error.message})
  }
}

export const addproduct = async (req,res) => {
    const {images, name, price, stock, description, category} = req.body;
    await PRODUCT.create({
        name,
        description,
        price,
        category,
        images,
        stock,
        vendor: req?.user?._id
    })
    return res.json({success: true, message: "Product added successfully"});
}
export const removeproduct = async (req,res) => {
    const id = req.query.id;
    const product = await PRODUCT.findOne({_id:id});
    if (!product){
        return res.status(400).json({success: false, message: "Product not found with this id"});
    }
    product.isActive = false
    product.status = "Deleted"
    await product.save()
    return res.json({success: true, message: "product successfully removed"});
}
export const updateproduct = async (req,res) => {
    
}

export const checkAuth = async (req,res) => {
    try {
        const token = req?.cookies?.admin_token
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
        if (user.role!=="Admin"){
            return res.send({ isAuthenticate: false, message: "UnAutharized Access" })
        }
        return res.send({ isAuthenticate: true, message: "Authenticate user", user, role: user.role })
    } catch (error) {
        res.send({ isAuthenticate: false, message: error.message })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await ORDER.find().populate(["user", "items.product"]);
        return res.status(200).send({ success: true, message: `All Orders`, orders:  orders})
    } catch (error) {
        res.send({success: false, message: `Unable to get All orders`})
    }
}

export const getAllUsers = async (req,res) => {
    try {
        const users = await USER.find().select("email name createdAt phone orders totalSpent").lean()

        return res.status(200).send({ success: true, message: `All User`, users})
    } catch (error) {
        res.send({success: false, message: `Unable to get All Users`})
    }
}

export const calculateTotalSpent = async (req,res) => {
  const users = await USER.find({}).populate("orders")

  for (const user of users){
    const orders = user.orders
    let totalSpent = 0
    for (const order of orders){
      totalSpent += order.totalAmount
    }

    user.totalSpent = totalSpent
    await user.save()
  }


  return res.status(200).json({success: true, message: "Users updated successfully"})
}


export const getVendors = async (req,res) => {
    try {
        const user = await USER.find().lean()
        const vendors = user.filter(u => u.role=== "vendor")
        res.status(200).send({success: true, vendors})
    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
}

export const approveVendor = async (req,res) => {
    const {id} = req.query
    try {
        const user = await USER.findById(id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.vendor.status = "Active"
        user.vendor.approvedAt = Date.now()

        await user.save();

        await notification.create({
          receiver: id,
          title: "Vendor Application Approved",
          message: "Your Vendor Application Approved",
          type: "vendor_application",
          isRead: false
        })

        await sendVendorApprovalMail(user?.email, user?.name)

        res.status(200).json({
            success: true,
            message: "Vendor application Approved Successfully",
        });
    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
}

export const logout = (req,res) => {
    try{
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logout successful" , success: true});
    } catch (err) {
        res.status(500).json({ message: err.message , success: false});
    }
}

export const getLast7DaysOrders = async (req, res) => {
  try {
    const result = await ORDER.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = result.map(r => ({
      date: r._id,
      orders: r.orders
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrdersByCategory = async (req, res) => {
  try {
    const result = await ORDER.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          value: { $sum: "$items.quantity" }
        }
      },
      { $project: { _id: 0, name: "$_id", value: 1 } }
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesByVendors = async (req, res) => {
  try {
    const result = await ORDER.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "users", // vendor info stored in user documents
          localField: "product.vendor",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: "$vendor" },

      // Group by vendor and count unique orderIds
      {
        $group: {
          _id: "$vendor.vendor.companyName",
          orderIds: { $addToSet: "$_id" }, // store unique order ids
        },
      },

      // Count number of orders
      {
        $project: {
          _id: 0,
          vendor: "$_id",
          sales: { $size: "$orderIds" },
        },
      },
      { $sort: { sales: -1 } },
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTotalDetail = async (req,res) => {
  try {
    const orders = await ORDER.find({})
    let totalRevenue = 0
    orders.map((order) => (
      totalRevenue += order.totalAmount
    ))

    const totalVendors = await USER.countDocuments({role: `vendor`})
    res.status(200).json({success: true, totalOrder: orders.length, totalRevenue, totalVendors})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const updateProductStatus = async (req, res) => {
  try {
    const {product_id, status} = req.body
    const product = await PRODUCT.findById(product_id)
    if (!product){
      return res.status(404).json({success: true, message: "Product Not Found!"})
    }

    product.status = status
    product.isActive = true
    await product.save()

    await notification.create({
      receiver: product.vendor,
      title: "Product Status Updated",
      message: `Your Product is ${status} by Admin`,
      type: "product_status",
      isRead: false
    })

    return res.status(200).json({success: true, status: product.status})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

export const getNotifications = async (req,res) => {
  const admin_id = req?.user?.id
  try {
    const notifications = await notification.find({receiver: admin_id})

    return res.status(200).json({success: true, notifications})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

export const readNotification = async (req,res) => {
  const {note_id} = req.body
  try {
    const note = await notification.findById(note_id)
    if (!note) return res.status(404).json({success: false, message: "Notification not Found!"})
    
    note.isRead = true
    await note.save()

    return res.status(200).json({success: true, message: "Notification Readed"})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}