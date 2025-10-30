// This file defines what information is stored for each product in the database

// Import mongoose to create the database structure
import mongoose from "mongoose"

// Define the structure for product information
const productSchema = new mongoose.Schema({
    // Basic product details
    name: {
        type: String,
        required: [true, "Product name is required"],  // Product must have a name
        trim: true                                     // Remove extra spaces
    },
    description: {
        type: String,
        required: [true, "Product description is required"]  // Must include description
    },
    // Price information
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: 0                                        // Price cannot be negative
    },
    discount: {
        type: Number,
        min: 0,                                      // Discount percentage 0-100%
        max: 100
    },
    // Product classification
    category: {
        type: String,
        required: [true, "Category is required"],     // Must specify product category
        trim: true
    },
    brand: {
        type: String,
        trim: true                                   // Brand name of the product
    },
    // Product images
    images: [
        {
            type: String,                            // URLs of product images
            required: true
        }
    ],
    // Inventory tracking
    stock: {
        type: Number,
        min: 0                                      // Cannot have negative stock
    },
    // Seller information
    vendor: {
        type: mongoose.Schema.Types.ObjectId,        // Links to the seller's account
        ref: "User",
    },
    // Customer ratings
    ratings: {
        average: {
            type: Number,
            default: 0,                              // Start with 0 rating
            min: 0,                                  // Rating cannot be negative
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