import Razorpay from 'razorpay';
import PRODUCT from "../models/product.js";
import ORDER from "../models/order.js"
import crypto from 'crypto'
import 'dotenv/config'
import USER from '../models/user.js';
import { generateOrderId } from '../services/generateOrderId.js';
import { sendOrderConfirmation, sendOrderToVendor } from '../emails/sendMail.js';
import notification from '../models/notification.js';

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

export const CreateOrder =  async (req, res) => {
    const {user, items, shippingAddress, paymentMethod, deliveryMethod} = req.body;
    let OrderData = {
      user,
      items,
      shippingAddress,
      paymentMethod,
      deliveryMethod
    }
    let totalAmount = 0;
    let vendors = []
    for (const item of items) {
      const product = await PRODUCT.findById(item.productID);
      if (!product) return res.status(400).json({ message: `Product not found for ID ${item.productID}` });
      const vendor_id = product?.vendor
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

      product.stock -= item.quantity;
      totalAmount += product.price * item.quantity;
    }
    let delivery = totalAmount >= 499 ? 0 : 40;
    totalAmount += totalAmount*2/100;
    if (OrderData?.deliveryMethod === 'Express') delivery = 60;
    totalAmount += delivery;
    totalAmount = parseFloat(totalAmount.toFixed(2));

    if (paymentMethod==='COD'){
        const finalItems = OrderData?.items?.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        }));
        OrderData = {
          ...OrderData,
          paymentStatus: 'Pending',
          orderStatus: 'Processing',
          totalAmount,
        }
        const newOrderData = {
          orderId: generateOrderId(),
          user: OrderData.user._id,
          items: finalItems,
          shippingAddress: OrderData.shippingAddress,
          deliveryMethod: OrderData.deliveryMethod,
          paymentMethod: OrderData.paymentMethod,
          paymentStatus: OrderData.paymentStatus,
          orderStatus: OrderData.orderStatus,
          totalAmount: OrderData.totalAmount
        }
        const newOrder = new ORDER(newOrderData);
        await newOrder.save();
        if (newOrderData?.shippingAddress?.remember) {
          await USER.findByIdAndUpdate(
            newOrderData.user,
            {
              $push: {
                orders: newOrder._id,
                addresses: newOrderData.shippingAddress
              }
            },
            { new: true }
          );
        } else {
          await USER.findByIdAndUpdate(
            newOrderData.user,
            { $push: { orders: newOrder._id } },
            { new: true }
          );
        }
        for (const v of vendors) {
          await sendOrderToVendor(
            v?.email,
            v?.name || "Vendor",
            newOrder.orderId,
            v.products,
            newOrderData.shippingAddress,
            newOrderData?.user?.name
          );
        }
        for (const v of vendors) {
          await notification.create({
            receiver: v.vendor_id,
            title: `New Order`,
            message: `You have received a new Order ${newOrderData?.orderId}`,
            type: "new_order",
            isRead: false,
          })
        }

        const user = await USER.findById(newOrderData.user)
        user.totalSpent += totalAmount
        await user.save()
        await sendOrderConfirmation(OrderData?.user?.email, OrderData.user?.name, newOrderData?.orderId, OrderData?.items, newOrderData?.totalAmount)
        return res.status(200).json({ success: true,  message: "Order saved successfully", orderid: newOrder._id });
    }
    const orderId = generateOrderId()
    const orderOptions = {
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        receipt: orderId
    };

    try {
        const order = await instance.orders.create(orderOptions);
        res.json({
          success: true,
          key_id: process.env.RAZORPAY_ID_KEY,
          amount: order.amount,
          order_id: order.id,
          product_name: OrderData.items[0].name,
          description: "Sample Product Description",
          contact: user.phone,
          name: user.name,
          email: user.email
        });
    } catch (error) {
      console.log(error)
        res.json({ success: false, msg: "Order creation failed", error: error.message });
    }
};

export const verifyPayment =  async (req, res) => {
  const { payment_id, order_id, signature } = req.body;
  let {orderData} = req.body;

  let totalAmount = 0;
  let vendors = []
  for (const item of orderData.items) {
    const product = await PRODUCT.findById(item.productID);
    if (!product) return res.status(400).json({ message: `Product not found for ID ${item.ProductID}` });
    const vendor_id = product?.vendor
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
  totalAmount += totalAmount*2/100;
  let delivery = totalAmount >= 499 ? 0 : 40;
  if (orderData?.deliveryMethod === 'Express') delivery = 60;
  totalAmount += delivery;
  totalAmount = parseFloat(totalAmount.toFixed(2));

  const finalItems = orderData.items.map(item => ({
    product: item._id,
    quantity: item.quantity,
    price: item.price
  }));
  orderData = {
    ...orderData,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    totalAmount,
  }
  const newOrderData = {
    orderId: generateOrderId(),
    user: orderData.user._id,
    items: finalItems,
    shippingAddress: orderData.shippingAddress,
    deliveryMethod: orderData.deliveryMethod,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: orderData.paymentStatus,
    orderStatus: orderData.orderStatus,
    totalAmount: orderData.totalAmount
  }
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
  shasum.update(order_id + "|" + payment_id);
  const generated_signature = shasum.digest('hex');
  if (generated_signature === signature) {
    try {
        const newOrder = new ORDER(newOrderData);
        await newOrder.save();
        if (newOrderData?.shippingAddress?.remember) {
          await USER.findByIdAndUpdate(
            newOrderData.user,
            {
              $push: {
                orders: newOrder._id,
                addresses: newOrderData.shippingAddress
              }
            },
            { new: true }
          );
        }
        else {
          await USER.findByIdAndUpdate(
            newOrderData.user,
            { $push: { orders: newOrder._id } },
            { new: true }
          );
        }
        for (const v of vendors) {
          await sendOrderToVendor(
            v?.email,
            v?.name || "Vendor",
            newOrder.orderId,
            v.products,
            orderData.shippingAddress,
            newOrderData?.user?.name
          );
        }
        for (const v of vendors) {
          await notification.create({
            receiver: v.vendor_id,
            title: `New Order`,
            message: `You have received a new Order ${newOrderData?.orderId}`,
            type: "new_order",
            isRead: false,
          })
        }
        const user = await USER.findById(newOrderData.user)
        user.totalSpent += totalAmount
        await user.save()
        await sendOrderConfirmation(orderData?.user?.email, orderData.user?.name, newOrderData?.orderId, orderData.items, newOrderData?.totalAmount)
        return res.status(200).json({ success: true,  message: "Order saved successfully", orderid: newOrder._id });
    } catch (error) {
        console.error('Error saving order:', error);
        return res.status(500).json({ message: 'Error saving order', error });
    }
  } else {
    return res.json({ success: false });
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
      return res.status(404).json({ message: "No orders found for this user" });
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