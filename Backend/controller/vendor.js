import PRODUCT from "../models/product.js";
import ORDER from "../models/order.js"; // assuming you have an order model
import { sendOrderStatusMail } from "../emails/sendMail.js";
import USER from "../models/user.js";

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

    // Create product
    const newProduct = await PRODUCT.create({
      name,
      description,
      price,
      category,
      images,
      stock,
      vendor: req?.user?._id,
    });

    // Add product _id to vendor's profile
    await USER.findByIdAndUpdate(
      req.user._id,
      { $push: { "vendor.products": newProduct._id } },
      { new: true }
    );

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
  const id = req.query.id
  
}