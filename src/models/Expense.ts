import mongoose, { Schema, model, models } from "mongoose";
import type { SplitType } from "@/types";

const PaymentEntrySchema = new Schema(
  { userId: { type: Schema.Types.ObjectId, ref: "User" }, amount: { type: Number, required: true } },
  { _id: false }
);

export interface IExpenseDoc {
  _id: mongoose.Types.ObjectId;
  group: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  currency: string;
  splitType: SplitType;
  splitDetails: Record<string, number>;
  payments: { userId: mongoose.Types.ObjectId; amount: number }[];
  receiptKey?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ExpenseSchema = new Schema<IExpenseDoc>(
  {
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    splitType: { type: String, enum: ["equal", "unequal", "percentage"], required: true },
    splitDetails: { type: Schema.Types.Mixed, default: {} },
    payments: [PaymentEntrySchema],
    receiptKey: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Expense = models.Expense ?? model<IExpenseDoc>("Expense", ExpenseSchema);
