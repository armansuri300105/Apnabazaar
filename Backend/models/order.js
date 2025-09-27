import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
},{_id: false})

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: {
        email: {type: String},
        phone: {type: String},
        name: {type: String},
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true }
    },
    deliveryMethod: {
        type: String,
        enum: ["Standard", "Express"],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "pending"
    },
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
}, {timestamps: true})

const ORDER = mongoose.model("Order", orderSchema)

export default ORDER