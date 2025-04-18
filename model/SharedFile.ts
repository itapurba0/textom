import  { Schema, model, models } from "mongoose";

const SharedFileSchema = new Schema({
    code: { type: String, required: true, unique: true }, // Unique code for the file
    fileName: { type: String, required: true }, // Original file name
    fileData: { type: Buffer, required: true }, // File stored as binary data
    mimeType: { type: String, required: true }, // File MIME type
    createdAt: { type: Date, default: Date.now, expires: 600 }, // TTL: 600 seconds (10 minutes)
});

const SharedFile = models.SharedFile || model("SharedFile", SharedFileSchema);

export default SharedFile;