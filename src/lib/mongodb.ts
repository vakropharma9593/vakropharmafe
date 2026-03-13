import mongoose from "mongoose";

const MONGODB_URI =  `mongodb+srv://${process.env.MDB_UN}:${process.env.MDB_PW}@vakropharma.qzygq1e.mongodb.net/${process.env.MDB_DB}?retryWrites=true&w=majority&appName=vakropharma`;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached: any = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}