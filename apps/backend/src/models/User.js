import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  supabaseId:           { type: String, required: true, unique: true, index: true },
  email:                { type: String, required: true, unique: true },
  name:                 { type: String },
  avatar:               { type: String },
  archetype:            { type: String },
  pillars: {
    presence:   { type: Number, default: 0 },
    creativity: { type: Number, default: 0 },
    resilience: { type: Number, default: 0 },
    charisma:   { type: Number, default: 0 },
    discipline: { type: Number, default: 0 },
    intuition:  { type: Number, default: 0 },
    rebellion:  { type: Number, default: 0 },
    vision:     { type: Number, default: 0 }
  },
  plan:                 { type: String, enum: ['free', 'premium', 'agency', 'corporate'], default: 'free' },
  stripeSubscriptionId: { type: String, default: null },  // ← faltaba
  createdAt:            { type: Date, default: Date.now },
  updatedAt:            { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
