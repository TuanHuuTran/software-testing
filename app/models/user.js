import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: { ref: "Cart", type: Schema.Types.ObjectId },
    role: { type: String, default: "customer" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
