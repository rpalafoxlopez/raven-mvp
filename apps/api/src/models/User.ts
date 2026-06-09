import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@raven/shared-types';

export interface IUser extends Omit<User, '_id'>, Document {}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    nombre: { type: String },
    avatar: { type: String },
    auth_provider: { type: String, enum: ['supabase', 'google', 'github'], required: true },
    auth_id: { type: String, required: true, unique: true, index: true },
    plan: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
