import mongoose, { Schema, model, models } from "mongoose";

export interface IUserDoc {
  _id: mongoose.Types.ObjectId;
  phone: string;
  name?: string;
  friends?: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: false },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Force schema refresh in development if needed
if (models.User && !models.User.schema.paths.friends) {
  delete (mongoose as any).models.User;
}

export const User = models.User ?? model<IUserDoc>("User", UserSchema);
