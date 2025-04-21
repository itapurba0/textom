
import { Schema, model, models } from "mongoose";

const SharedTextSchema = new Schema({
    code: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 900 }, 
});

const SharedText = models.SharedText || model("SharedText", SharedTextSchema);

export default SharedText;