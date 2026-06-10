import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: Number,
    answer: Number,
    pillar: String
  }],
  scores: {
    presence: Number,
    creativity: Number,
    resilience: Number,
    charisma: Number,
    discipline: Number,
    intuition: Number,
    rebellion: Number,
    vision: Number
  },
  archetype: { type: String, required: true },
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuizResult', quizResultSchema);