import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(`${process.env.ConnectDB}`)
    .then(() => {
        console.log("MongoDB connected successfully");
    });
}