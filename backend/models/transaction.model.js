import mongoose, { mongo } from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trime: true,
      required: [true, "Please add some text"], //e.g. Lunch at canteen
    },
    amount: {
      type: Number,
      required: [true, "Please add positive or negative number"],
    },
    //e.g. Food , Transport , Fees , Entertaiment
    category: {
      type: String,
      enum: ["Food", "Transport", "Fees", "Entertainment", "Health", "Other"],
      required: true,
    },
    //allow you to distinguish between money goes out or comes in
    type: {
      type: String,
      enum: ["Income", "Expense"],
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
