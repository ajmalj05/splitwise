import mongoose, { Schema, model, models } from "mongoose";

export interface ISettlementDoc {
  _id: mongoose.Types.ObjectId;
  group: mongoose.Types.ObjectId;
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  amount: number;
  createdAt: Date;
}

const SettlementSchema = new Schema<ISettlementDoc>(
  {
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Settlement = models.Settlement ?? model<ISettlementDoc>("Settlement", SettlementSchema);
