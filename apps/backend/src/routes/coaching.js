import express from 'express';
import jwt from 'jsonwebtoken';
import CoachingPlan from '../models/CoachingPlan.js';
import User from '../models/User.js';
import { generateCoachingResponse } from '../services/groq.js';

const router = express.Router();

// Get or create coaching plan
router.get('/plan', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let plan = await CoachingPlan.findOne({ userId: decoded.userId })
      .sort({ createdAt: -1 });

    if (!plan) {
      const user = await User.findById(decoded.userId);
      plan = await CoachingPlan.create({
        userId: decoded.userId,
        archetype: user.archetype || 'presence',
        goals: [],
        actionItems: [],
        chatHistory: []
      });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update goals
router.put('/goals', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { goals } = req.body;

    const plan = await CoachingPlan.findOneAndUpdate(
      { userId: decoded.userId },
      { goals, updatedAt: new Date() },
      { sort: { createdAt: -1 }, new: true }
    );

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add action item
router.post('/actions', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, description, dueDate } = req.body;

    const plan = await CoachingPlan.findOneAndUpdate(
      { userId: decoded.userId },
      { 
        $push: { actionItems: { title, description, dueDate } },
        updatedAt: new Date()
      },
      { sort: { createdAt: -1 }, new: true }
    );

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle action completion
router.patch('/actions/:actionId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { completed } = req.body;

    const plan = await CoachingPlan.findOneAndUpdate(
      { userId: decoded.userId, 'actionItems._id': req.params.actionId },
      { 
        $set: { 'actionItems.$.completed': completed, updatedAt: new Date() }
      },
      { new: true }
    );

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message to AI coach
router.post('/chat', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { message } = req.body;

    // Get user data for context
    const user = await User.findById(decoded.userId);
    const plan = await CoachingPlan.findOne({ userId: decoded.userId })
      .sort({ createdAt: -1 });

    // Generate AI response
    const aiResponse = await generateCoachingResponse({
      message,
      archetype: user.archetype,
      pillars: user.pillars,
      goals: plan?.goals || [],
      chatHistory: plan?.chatHistory.slice(-10) || []
    });

    // Save to chat history
    await CoachingPlan.findOneAndUpdate(
      { userId: decoded.userId },
      {
        $push: {
          chatHistory: [
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse }
          ]
        },
        updatedAt: new Date()
      },
      { sort: { createdAt: -1 } }
    );

    res.json({ response: aiResponse });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;