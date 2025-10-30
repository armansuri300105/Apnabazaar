// This file handles all order-related operations including creating orders, processing payments, and managing order status

// Import necessary tools and services
import Razorpay from 'razorpay';                                      // Payment gateway integration
import PRODUCT from "../models/product.js";                           // Product database model
import ORDER from "../models/order.js"                                // Order database model
import crypto, { createECDH } from 'crypto'                          // For security operations
import 'dotenv/config'                                               // Environment configuration
import USER from '../models/user.js';                                // User database model
import { generateOrderId } from '../services/generateOrderId.js';     // Custom order ID generator
import { sendOrderConfirmation, sendOrderToVendor } from '../emails/sendMail.js';  // Email notifications
import notification from '../models/notification.js';                 // In-app notifications
import mongoose from 'mongoose';                                      // Database operations

// Set up payment gateway with security credentials
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

// Handle creation of new orders
export const CreateOrder = async (req, res) => {
    // Get order details from checkout form
    const { user, items, shippingAddress, paymentMethod, deliveryMethod } = req.body;
    let session; // For managing database changes safely
    try {
        // Start a safe transaction - ensures all changes happen together or none happen
        session = await mongoose.startSession();
        session.startTransaction();

        // Initialize tracking variables
        let totalAmount = 0;
        let vendors = [];  // Track different sellers in the order
        const stockUpdates = []; // Track inventory changes needed

        // First check: Make sure all products are available
        for (const item of items) {
            // Find the product in database
            const product = await PRODUCT.findById(item.productID).session(session);

            // Stop if product doesn't exist
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Product not found for ID ${item.productID}` });
            }

            // Stop if not enough stock available
            if (product.stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
            }

            // Get seller information
            const vendor_id = product?.vendor;
            const populate_prd = await product.populate("vendor");
            const vendorEmail = populate_prd?.vendor?.email;

            // Group items by seller
            let vendor = vendors.find(v => v.email === vendorEmail);
            if (!vendor) {
                vendor = {
                    vendor_id,
                    email: vendorEmail,
                    products: []
                };
                vendors.push(vendor);
            }

            vendor.products.push({
                productID: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            // Prepare for atomic stock update
            stockUpdates.push({
                productId: product._id,
                quantity: item.quantity
            });

            totalAmount += product.price * item.quantity;
        }

        // 2. Calculate final amount
        let delivery = totalAmount >= 499 ? 0 : 40;
        totalAmount += totalAmount * 2 / 100; // Assuming 2% fee
        if (deliveryMethod === 'Express') delivery = 60;
        totalAmount += delivery;
        totalAmount = parseFloat(totalAmount.toFixed(2));

        let OrderData = {
            user,
            items,
            shippingAddress,
            paymentMethod,
            deliveryMethod
        };

        // 3. Handle COD logic (stock update and order creation are inside the transaction)
        if (paymentMethod === 'COD') {
            // Atomically decrement stock for all products
            for (const update of stockUpdates) {
                const updatedProduct = await PRODUCT.findOneAndUpdate(
                    { _id: update.productId, stock: { $gte: update.quantity } }, // Only update if stock is sufficient
                    { $inc: { stock: -update.quantity } }, // Atomic decrement
                    { new: true, session: session }
                );

                if (!updatedProduct) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ message: `Stock sold out for product ID ${update.productId} during final check.` });
                }
            }

            // Prepare and save Order
            const finalItems = OrderData.items.map(item => ({
                product: item.productID,
                quantity: item.quantity,
                price: item.price
            }));

            const newOrderData = {
                orderId: generateOrderId(),
                user: OrderData.user._id,
                items: finalItems,
                shippingAddress: OrderData.shippingAddress,
                deliveryMethod: OrderData.deliveryMethod,
                paymentMethod: OrderData.paymentMethod,
                paymentStatus: 'Pending',
                orderStatus: 'Processing',
                totalAmount: totalAmount
            };

            const newOrder = new ORDER(newOrderData);
            await newOrder.save({ session }); // Save order within transaction

            // Update user details
            const userUpdate = { $push: { orders: newOrder._id } };
            if (newOrderData?.shippingAddress?.remember) {
                userUpdate.$push.addresses = newOrderData.shippingAddress;
            }
            await USER.findByIdAndUpdate(newOrderData.user, userUpdate, { new: true, session });

            // Commit the transaction after all DB operations are successful
            await session.commitTransaction();
            session.endSession();

            // 4. Post-transaction operations (emails/notifications)
            for (const v of vendors) {
                await sendOrderToVendor(v?.email, v?.name || "Vendor", newOrder.orderId, v.products, newOrderData.shippingAddress, newOrderData?.user?.name);
            }
            for (const v of vendors) {
                await notification.create({
                    receiver: v.vendor_id,
                    title: `New Order`,
                    message: `You have received a new Order ${newOrderData?.orderId}`,
                    type: "new_order",
                    isRead: false,
                });
            }

            const userDoc = await USER.findById(newOrderData.user);
            userDoc.totalSpent += totalAmount;
            await userDoc.save();
            await sendOrderConfirmation(OrderData?.user?.email, OrderData.user?.name, newOrderData?.orderId, OrderData?.items, newOrderData?.totalAmount);

            return res.status(200).json({ success: true, message: "Order saved successfully", orderid: newOrder._id });
        }

        // 5. Handle Online Payment (Razorpay order creation)
        // No stock update here yet, as payment is pending. It happens in verifyPayment.
        await session.commitTransaction(); // Commit pre-check only
        session.endSession();

        const orderId = generateOrderId();
        const orderOptions = {
            amount: Math.round(totalAmount * 100),
            currency: 'INR',
            receipt: orderId
        };

        const order = await instance.orders.create(orderOptions);
        res.json({
            success: true,
            key_id: process.env.RAZORPAY_ID_KEY,
            amount: order.amount,
            order_id: order.id,
            product_name: user.name, // Changed from OrderData.items[0].name (which is not available on OrderData yet) to user.name, or find a better product name
            description: "E-commerce Order Payment",
            contact: user.phone,
            name: user.name,
            email: user.email,
            // You might need to send totalAmount back to client for Razorpay display
            totalAmount: totalAmount // Sending final calculated amount
        });
    } catch (error) {
        console.error('CreateOrder error:', error);
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        res.status(500).json({ success: false, msg: "Order processing failed", error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    const { payment_id, order_id, signature } = req.body;
    let { orderData } = req.body;
    let session; // Declare session outside try-catch

    // 1. Verify Razorpay Signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
    shasum.update(order_id + "|" + payment_id);
    const generated_signature = shasum.digest('hex');

    if (generated_signature !== signature) {
        return res.json({ success: false, message: "Payment verification failed" });
    }

    // Payment signature is valid, proceed with atomic stock update and order saving
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        let totalAmount = 0;
        let vendors = [];
        const stockUpdates = []; // To hold product IDs and quantities for atomic update

        // 2. Recalculate and perform atomic stock update
        for (const item of orderData.items) {
            const product = await PRODUCT.findById(item.productID).session(session); // Use productID from original item structure

            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Product not found for ID ${item.productID}` });
            }

            if (product.stock < item.quantity) {
                 await session.abortTransaction();
                 session.endSession();
                 // Note: Ideally, this should trigger a refund or an order review process
                 return res.status(400).json({ message: `Stock sold out for ${product.name} after payment.` });
            }

            // Atomic stock decrement preparation
            stockUpdates.push({
                productId: product._id,
                quantity: item.quantity
            });

            // Vendor information gathering
            const vendor_id = product?.vendor;
            const populate_prd = await product.populate("vendor");
            const vendorEmail = populate_prd?.vendor?.email;

            let vendor = vendors.find(v => v.email === vendorEmail);
            if (!vendor) {
                vendor = {
                    vendor_id,
                    email: vendorEmail,
                    products: []
                };
                vendors.push(vendor);
            }

            vendor.products.push({
                productID: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
            totalAmount += product.price * item.quantity;
        }

        // Recalculate amount (Ensure this logic is identical to CreateOrder)
        totalAmount += totalAmount * 2 / 100;
        let delivery = totalAmount >= 499 ? 0 : 40;
        if (orderData?.deliveryMethod === 'Express') delivery = 60;
        totalAmount += delivery;
        totalAmount = parseFloat(totalAmount.toFixed(2));


        // **Atomic Stock Decrement**
        for (const update of stockUpdates) {
            const updatedProduct = await PRODUCT.findOneAndUpdate(
                { _id: update.productId, stock: { $gte: update.quantity } }, // Only update if stock is sufficient
                { $inc: { stock: -update.quantity } }, // Atomic decrement
                { new: true, session: session }
            );

            if (!updatedProduct) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Stock sold out for product ID ${update.productId} during final check.` });
            }
        }

        // 3. Save Order (must happen inside transaction)
        const finalItems = orderData.items.map(item => ({
            product: item.productID, // Use productID from original item structure
            quantity: item.quantity,
            price: item.price
        }));

        const newOrderData = {
            orderId: generateOrderId(),
            user: orderData.user._id,
            items: finalItems,
            shippingAddress: orderData.shippingAddress,
            deliveryMethod: orderData.deliveryMethod,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: 'Paid',
            orderStatus: 'Processing',
            totalAmount: totalAmount
        };

        const newOrder = new ORDER(newOrderData);
        await newOrder.save({ session }); // Save order within transaction

        // Update user details
        const userUpdate = { $push: { orders: newOrder._id } };
        if (newOrderData?.shippingAddress?.remember) {
            userUpdate.$push.addresses = newOrderData.shippingAddress;
        }
        await USER.findByIdAndUpdate(newOrderData.user, userUpdate, { new: true, session });

        // Commit the transaction after all DB operations are successful
        await session.commitTransaction();
        session.endSession();

        // 4. Post-transaction operations (emails/notifications)
        for (const v of vendors) {
            await sendOrderToVendor(v?.email, v?.name || "Vendor", newOrder.orderId, v.products, orderData.shippingAddress, orderData?.user?.name);
        }
        for (const v of vendors) {
            await notification.create({
                receiver: v.vendor_id,
                title: `New Order`,
                message: `You have received a new Order ${newOrderData?.orderId}`,
                type: "new_order",
                isRead: false,
            });
        }
        const userDoc = await USER.findById(newOrderData.user);
        userDoc.totalSpent += totalAmount;
        await userDoc.save();
        await sendOrderConfirmation(orderData?.user?.email, orderData.user?.name, newOrderData?.orderId, orderData.items, newOrderData?.totalAmount);

        return res.status(200).json({ success: true, message: "Order saved successfully", orderid: newOrder._id });

    } catch (error) {
        console.error('verifyPayment error:', error);
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        return res.status(500).json({ message: 'Error saving order after payment verification', error });
    }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req?.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const orders = await ORDER.find({ user: userId }).select("orderId items totalAmount createdAt orderStatus").populate({
      path: "items.product",
      model: "Product",
      select: "name price images"
    });

    if (!orders || orders.length === 0) {
      return res.json({ success: true, orders: [], message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const getOrder = async (req,res) => {
  const {id} = req.query
  try {
    const order = await ORDER.findById(id).populate("items.product");
    if (!order){
      res.status(404).json({success: false, message: "Order Not Found"})
    }
    return res.status(200).json({success: true, order})
  } catch (error) {
    return res.status(500).json({ message: 'Error fatching order', error });
  }
}

export const getOrderByID = async (req,res) => {
  const {orderId} = req.query
  try {
    const order = await ORDER.findOne({orderId}).populate("items.product");
    if (!order){
      res.status(404).json({success: false, message: "Order Not Found"})
    }
    return res.status(200).json({success: true, order})
  } catch (error) {
    return res.status(500).json({ message: 'Error fatching order', error });
  }
}