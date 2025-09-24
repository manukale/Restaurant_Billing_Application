import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    itemName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },  // e.g., starter, main, dessert
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    hsnCode: { type: String, trim: true },
    vegType: { type: String, enum: ["veg", "nonveg"], required: true },
    organization_id: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization'
        },
    image: { type: String }, // will store image path or URL
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

// Middleware to auto-update `updated_at`
menuSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

export default mongoose.model("Menus", menuSchema);
