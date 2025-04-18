import mongoose, { Mongoose } from "mongoose";

// Use a global variable to cache the Mongoose connection.
const cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } = {
    conn: null,
    promise: null,
};

const MONGODB_URI = process.env.DATABASE_URL || "";

if (!MONGODB_URI) {
    throw new Error("Please define the DATABASE_URL environment variable in .env.local");
}

/**
 * Establishes a connection to a MongoDB database using Mongoose.
 *
 * This function uses a global cache to avoid creating multiple connections
 * to the database, which can lead to performance issues, especially in
 * serverless environments like Next.js.
 *
 * @returns A promise that resolves to the Mongoose instance.
 * @throws Will throw an error if the connection fails.
 */
async function connectToDatabase(): Promise<Mongoose> {
    // 1. Check if a cached connection exists
    if (cached.conn) {
        return cached.conn;
    }

    // 2. If no cached connection, create a new one
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Don't buffer commands in case of connection issues
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;