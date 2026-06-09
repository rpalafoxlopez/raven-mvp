const mongoose = require('mongoose');

const EmailCaptureSchema = new mongoose.Schema(
  {
    email:      { type: String, required: true, index: true },
    offerCode:  { type: String },
    expiresAt:  { type: Date },
    used:       { type: Boolean, default: false },
    quizResult: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: { createdAt: 'created_at' } }
);

const EmailCaptureModel = mongoose.model('EmailCapture', EmailCaptureSchema);
module.exports = { EmailCaptureModel };
