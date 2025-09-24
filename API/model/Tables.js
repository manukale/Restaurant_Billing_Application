import mongoose from "mongoose";

const TablesSchema = new mongoose.Schema(
    {
        table_number: { type: Number, required: true, unique: true, default: 0 },
        organization_id: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Organization'
            },
        status: {
            type: String,
            enum: ["vacant", "reserved", "engaged"],
            default: "vacant", // default so every new table starts as vacant
        },
    },
    { timestamps: true } // automatically adds createdAt & updatedAt
);

export default mongoose.model("Table", TablesSchema);
