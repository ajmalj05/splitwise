import mongoose from "mongoose";

function getMongoUri(): string {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const host = process.env.MONGODB_HOST;
  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const db = process.env.MONGODB_DB_NAME ?? "naasthamukk";
  const port = process.env.MONGODB_PORT ?? "27017";
  const authSource = process.env.MONGODB_AUTH_SOURCE ?? "admin";
  if (!host || !user || !password) {
    throw new Error(
      "Define either MONGODB_URI or all of MONGODB_HOST, MONGODB_USER, MONGODB_PASSWORD in .env.local"
    );
  }
  const encoded = encodeURIComponent(password);
  return `mongodb://${user}:${encoded}@${host}:${port}/${db}?directConnection=true&authSource=${authSource}`;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (process.env.NODE_ENV !== "production") {
  global.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = getMongoUri();
    cached.promise = mongoose.connect(uri);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
