// This file handles connecting to the database where all website data is stored

// Import mongoose - a tool for working with MongoDB database
import mongoose from "mongoose";

// Function to connect to the database
// Takes a URL that tells where the database is located
export const connect = async (url) => {
    try {
        // Try to connect to the database
        await mongoose.connect(url);
        console.log("monogoDB connected Successfully");
    } catch (error) {
        // If connection fails, show the error
        console.log("Mongoose connect Error", error)
    }
}