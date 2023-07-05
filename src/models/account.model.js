import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    numberAccount: {
      type: Number,
      required: true,
      unique: true,
    },
    numberAccountInterbank: {
      type: Number,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Account", accountSchema);
