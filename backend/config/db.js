import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://quangthanh2k5bn:thanhday09092005@cluster0.grspm0z.mongodb.net/Taskflow')
    .then(() => {
        console.log("MongoDB connected successfully");
    });
}