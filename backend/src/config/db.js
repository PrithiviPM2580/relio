import mongoose from "mongoose";

export const connectDB = async () => {

    const url= process.env.MONGO_URI;

    if(!url){
        throw new Error("MONGO_URI is not defined in the environment variables");
    }

    mongoose.set("strictQuery", true);

    try {
       const conn= await mongoose.connect(url,{
            serverSelectionTimeoutMS: 10000, // Set a timeout for server selection
        });
        console.log("Connected to MongoDB");
        return conn;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}