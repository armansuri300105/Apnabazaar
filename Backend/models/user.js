import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipcode: { type: String },
    phone: { type: String },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Active", "Blacklist"],
    default: "Pending",
  },
  businessDetails: String,
  gstNumber: String,
  bankAccount: String,
  appliedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  totalOrders: {type: Number, default: 0, required: true},
  totalRevenue: {type: Number, default: 0, required: true}
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      minlength: 8,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    authProvider: { type: String, enum: ["local", "google"], required: true },
    addresses: [addressSchema],
    role: {
      type: String,
      enum: ["customer", "admin", "vendor"],
      default: "customer",
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    history: [
      {
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        event: {
          type: {type: String},
          timeStamp: Date
        },
        time: Date,
        duration: Number
      }
    ],
    vendor: vendorSchema,
  },
  { timestamps: true }
);

const USER = mongoose.model("User", userSchema);

export default USER;