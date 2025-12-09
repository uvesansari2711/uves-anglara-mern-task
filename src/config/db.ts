import mongoose from "mongoose";

export const connectDB = async (uri?: string) => {
  const mongoUri = uri || process.env.MONGO_URI;
  await mongoose.connect(mongoUri!);
  if (process.env.NODE_ENV !== "test") {
    console.log(`MongoDB connected to ${mongoUri}`);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  if (process.env.NODE_ENV !== "test") {
    console.log("MongoDB disconnected");
  }
};
