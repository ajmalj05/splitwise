import mongoose, { Schema, model, models } from "mongoose";

export interface IUserDoc {
  _id: mongoose.Types.ObjectId;
  phone: string;
  name?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const User = models.User ?? model<IUserDoc>("User", UserSchema);
