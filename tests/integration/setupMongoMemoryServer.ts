import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectDB } from "../../src/config/db";

let mongoServer: MongoMemoryServer;

export const setupTestDB = () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await connectDB(uri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db!.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });
};
