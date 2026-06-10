import mongoose from 'mongoose';

const coachingPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  archetype: { type: String, required: true },
  goals: [{ type: String }],
  actionItems: [{
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    dueDate: Date
  }],
  chatHistory: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CoachingPlan', coachingPlanSchema);