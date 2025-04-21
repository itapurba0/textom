import mongoose, { Mongoose } from "mongoose";

const cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } = {
    conn: null,
    promise: null,
};

const MONGODB_URI = process.env.DATABASE_URL || "";

if (!MONGODB_URI) {
    throw new Error("Please define the DATABASE_URL environment variable in .env.local");
}

async function connectToDatabase(): Promise<Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
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
