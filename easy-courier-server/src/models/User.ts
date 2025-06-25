import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'shop owner' | 'delivery man';
  avatar: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['shop owner', 'delivery man'], required: true },
    avatar: String,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);