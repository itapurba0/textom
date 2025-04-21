import { Schema, model, models } from "mongoose";

const SharedFileSchema = new Schema({
    code: { type: String, required: true, unique: true },
    fileData: { type: Buffer, required: true },
    mimeType: { type: String, required: true },
    fileName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL: 15 minutes
});

const SharedFile = models.SharedFile || model("SharedFile", SharedFileSchema);

export default SharedFile;