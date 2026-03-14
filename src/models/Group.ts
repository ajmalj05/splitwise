import mongoose, { Schema, model, models } from "mongoose";

export interface IGroupDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdBy: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const GroupSchema = new Schema<IGroupDoc>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Group = models.Group ?? model<IGroupDoc>("Group", GroupSchema);
