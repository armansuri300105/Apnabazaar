import PRODUCT from "../models/product.js";
import ORDER from "../models/order.js"; // assuming you have an order model
import { sendOrderStatusMail } from "../emails/sendMail.js";
import USER from "../models/user.js";
import notification from "../models/notification.js";

// ✅ Add Product by Vendor
export const addVendorProduct = async (req, res) => {
  try {
    const { images, name, price, stock, description, category } = req.body;

    if (!name || !price || !description || !category || !images?.length) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newProduct = await PRODUCT.create({
      name,
      description,
      price,
      category,
      images,
      stock,
      vendor: req?.user?._id,
      status: "Pending"
    });

    await USER.findByIdAndUpdate(
      req.user._id,
      { $push: { "vendor.products": newProduct._id } },
      { new: true }
    );

    const admins = await USER.find({role: "Admin"})

    const vendor_id = req?.user?._id
    const vendor = await USER.findById(vendor_id).populate("vendor")

    for (const admin of admins){
      await notification.create({
        receiver: admin._id,
        title: "New Product Added",
        message: `New Product Added by ${vendor?.vendor?.companyName}`,
        type: "new_product",
        isRead: false
      })
    }

    return res.json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

export const editVendorProduct = async (req ,res) => {
  const {id, images, name, price, stock, description, category} = req.body;

  try {
    const product = await PRODUCT.findById(id)
    if (!product){
      return res.status(404).json({success:false, message: "Product Not Found"})
    }

    product.name = name
    product.price = price
    product.stock = parseInt(stock)
    product.description = description
    product.category = category
    product.images = images

    await product.save()
    return res.json({success: true, message: "Product Edited successfully"});
  } catch (error) {
    return res.status(500).json({success:false, message: error.message})
  }
}

// ✅ Get All Products of Logged-in Vendor
export const getVendorProducts = async (req, res) => {
  try {
    const products = await PRODUCT.find({ vendor: req?.user?._id, isActive: true }).lean();

    if (!products || products.length === 0) {
      return res.json({ success: true, products: [] });
    }

    const formattedProducts = products.map((p) => ({
      productID: p._id,
      ...p,
    }));

    return res.json({
      success: true,
      message: "All Products",
      items: products.length,
      products: formattedProducts,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    // Step 1: First find all products that belong to this vendor
    const vendorProducts = await PRODUCT.find({ vendor: req.user._id}).select('_id').lean();
    const vendorProductIds = vendorProducts.map(product => product._id);

    if (vendorProductIds.length === 0) {
      return res.json({ 
        success: true, 
        message: "No products found for this vendor",
        orders: [],
        totalOrders: 0
      });
    }

    // Step 2: Find orders that contain any of these products
    let orders = await ORDER.find({ 
        "items.product": { $in: vendorProductIds } 
    })
    .populate({
        path: "items.product",
        model: "Product",
        select: "name price images vendor"
    })
    .populate({
        path: "user", 
        model: "User",
        select: "name email"
    })
    .lean();
    
    if (!orders || orders.length === 0) {
      return res.json({ success: true, message: "No orders found for this vendor",orders: [],totalOrders: 0 });
    }

    // Step 3: Filter items to only include vendor's products and remove empty orders
    orders = orders
      .map(order => {
        const vendorItems = order.items.filter(
          item => item.product && 
                  item.product.vendor && 
                  item.product.vendor._id.toString() === req.user._id.toString()
        );
        
        if (vendorItems.length === 0) return null;
        
        // Calculate vendor-specific total
        const vendorTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return { 
          ...order, 
          items: vendorItems,
          vendorTotal
        };
      })
      .filter(order => order !== null);

    return res.json({ success: true, message: "Vendor Orders Retrieved Successfully", orders, totalOrders: orders.length});
  } catch (err) {
    console.error("Error fetching vendor orders:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch vendor orders",error: process.env.NODE_ENV === 'development' ? err.message : undefined});
  }
};

export const updateOrderStatus = async (req,res) => {
  try {
    const vendor_id = req?.user?._id;
    const { id, nextStatus } = req.body;

    if (!id || !nextStatus) {
      return res.status(400).json({
        success: false,
        message: "Order ID and next status are required",
      });
    }

    const updatedOrder = await ORDER.findByIdAndUpdate(
      id,
      { orderStatus: nextStatus },
      { new: true }
    )
      .populate({
        path: "items.product",
        model: "Product",
        select: "name price images vendor",
      })
      .populate("user", "name email");

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const vendor = await USER.findById({_id: vendor_id})

    const to = updatedOrder?.shippingAddress?.email
    const name = updatedOrder?.shippingAddress?.name
    const orderId = updatedOrder?.orderId
    const status = nextStatus

    if (status==="Delivered"){
      vendor.vendor.totalOrders += 1
      let total = 0
      updatedOrder?.items?.map((item) => total+=item.price)
      vendor.vendor.totalRevenue += total
    }

    await vendor.save();

    await sendOrderStatusMail(to, name, orderId, status)

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const removeProduct = async (req,res) => {
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

export const getVendorLast7DaysOrders = async (req, res) => {
  try {
    const vendorId = req.user._id; // current vendor

    const result = await ORDER.aggregate([
      // Only last 7 days
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      // Expand order items
      { $unwind: "$items" },

      // Join with product collection
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },

      // Filter only the vendor's products
      {
        $match: {
          "product.vendor": vendorId
        }
      },

      // Group by day and count total orders
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
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorsOrdersByCategory = async (req, res) => {
  try {
    // Assuming req.user._id is already a MongoDB ObjectId type or converted later
    const vendorId = req?.user?._id; 

    const result = await ORDER.aggregate([
      {
        // Stage 1: Deconstruct the 'items' array to process each product individually
        $unwind: "$items"
      },
      {
        // Stage 2: Look up the full product document from the 'products' collection
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails" // Renamed 'product' to 'productDetails' to be more descriptive
        }
      },
      {
        // Stage 3: Deconstruct the 'productDetails' array
        $unwind: "$productDetails"
      },
      {
        // ----------------------------------------------------------------
        // Stage 4: THE CRITICAL FIX - Filter by the Vendor ID found inside the product document.
        // Assuming the 'products' collection has a field named 'vendor' which holds the vendor's _id.
        $match: {
          "productDetails.vendor": vendorId
        }
        // ----------------------------------------------------------------
      },
      {
        // Stage 5: Group by the product's category and sum the quantity
        $group: {
          _id: "$productDetails.category",
          value: { $sum: "$items.quantity" }
        }
      },
      {
        // Stage 6: Rename _id to name and keep value
        $project: {
          _id: 0,
          name: "$_id",
          value: 1
        }
      }
    ]);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req,res) => {
  const vendor_id = req?.user?.id
  try {
    const notifications = await notification.find({receiver: vendor_id})

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