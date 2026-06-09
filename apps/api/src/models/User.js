const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email:         { type: String, required: true, unique: true, index: true },
    nombre:        { type: String },
    avatar:        { type: String },
    auth_provider: { type: String, enum: ['supabase', 'google', 'github'], required: true },
    auth_id:       { type: String, required: true, unique: true, index: true },
    plan:          { type: String, enum: ['free', 'premium', 'pro'], default: 'free' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const UserModel = mongoose.model('User', UserSchema);
module.exports = { UserModel };
