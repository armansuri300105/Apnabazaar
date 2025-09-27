import mongoose from "mongoose";

export const connect = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("monogoDB connected Successfully");
    } catch (error) {
        console.log("Mongoose connect Error", error)
    }
}