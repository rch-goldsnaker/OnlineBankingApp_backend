import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    accountFrom: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
    accountTo: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transfer", transferSchema);
