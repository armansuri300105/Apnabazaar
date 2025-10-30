// Main server file that sets up and runs the e-commerce website's backend

// Import required packages and functionalities
// express: Creates the web server
// routes: Different sections of the website (user, product, order, etc.)
import express, { urlencoded } from "express"
import user from "./routes/user.js"
import product from "./routes/product.js"
import order from "./routes/order.js"
import admin from "./routes/admin.js"
import vendor from "./routes/vendor.js"
import bodyParser from "body-parser";
import cors from "cors"
import dotenv from "dotenv"
import { connect } from "./connection/connection.js";
import cookieParser from "cookie-parser";
dotenv.config();

// Create the main server application
const app = express();
const PORT = 3000 || process.env.PORT;

// Set up server to handle different types of data
app.use(urlencoded({extended: true}));  // Handle form data
app.use(bodyParser.json());             // Handle JSON data
app.use(cookieParser())                 // Handle cookies for user sessions

// Security settings: Define which websites can access this server
app.use(cors({
    origin: ["https://apnabzaar.netlify.app", "https://apnabazaaradmin.netlify.app", "http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// Database connection string - where all the data is stored
const url = process.env.MONGO_URL || "mongodb://localhost:27017/E-Commerce"

// Set up different sections of the website
// Each section handles different features like shopping, ordering, etc.
app.use('/api/user',user);        // User features (login, profile, etc.)
app.use('/api/product', product); // Product features (listing, details, etc.)
app.use('/api/order', order);     // Order features (cart, checkout, etc.)
app.use('/api/admin', admin);     // Admin features (management tools)
app.use('/api/vendor', vendor);   // Vendor features (selling tools)

// Start the server and connect to the database
app.listen(PORT, () => {
    connect(url)
    console.log(`Server run on port ${PORT}`);
})