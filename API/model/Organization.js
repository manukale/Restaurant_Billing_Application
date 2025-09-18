import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
export default mongoose.model('Organization', OrganizationSchema)