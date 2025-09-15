import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending", index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);