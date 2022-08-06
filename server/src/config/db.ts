import mongoose from "mongoose";

export const connectDB = (URL: string) => {
    return mongoose.connect(URL, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};