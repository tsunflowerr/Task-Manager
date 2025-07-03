import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://quangthanh2k5bn:thanh09092005@cluster0.dytcilb.mongodb.net/Taskflow')
    .then(() => {
        console.log("MongoDB connected successfully");
    });
}