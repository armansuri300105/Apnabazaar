import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Product description is required"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: 0
    },
    discount: {
        type: Number,
        min: 0,
        max: 100
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    stock: {
        type: Number,
        min: 0
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            username: {type: String},
            rating: { type: Number, min: 1, max: 5 },
            comment: { type: String, trim: true },
            createdAt: { type: String, default: Date.now }
        }
    ],
    isActive: {
        type: Boolean,
        default: false
    },
    status : {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "reject", "Deleted"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

const PRODUCT = mongoose.model("Product", productSchema);

export default PRODUCT;