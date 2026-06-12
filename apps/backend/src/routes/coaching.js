import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import CoachingPlan from '../models/CoachingPlan.js';
import User from '../models/User.js';
import { generateCoachingResponse } from '../services/groq.js';

const router = express.Router();

// Todas las rutas requieren auth — un solo middleware en vez de jwt.verify en cada ruta
router.use(requireAuth);

// GET /api/coaching/plan
router.get('/plan', async (req, res) => {
  try {
    let plan = await CoachingPlan.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!plan) {
      plan = await CoachingPlan.create({
        userId: req.user._id,
        archetype: req.user.archetype || 'presence',
        goals: [],
        actionItems: [],
        chatHistory: []
      });
    }

    res.json(plan);
  } catch (err) {
    console.error('Get plan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/coaching/goals
router.put('/goals', async (req, res) => {
  try {
    const { goals } = req.body;
    const plan = await CoachingPlan.findOneAndUpdate(
      { userId: req.user._id },
      { goals, updatedAt: new Date() },
      { sort: { createdAt: -1 }, new: true }
    );
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/coaching/actions
router.post('/actions', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const plan = await CoachingPlan.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { actionItems: { title, description, dueDate } }, updatedAt: new Date() },
      { sort: { createdAt: -1 }, new: true }
    );
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/coaching/actions/:actionId
router.patch('/actions/:actionId', async (req, res) => {
  try {
    const { completed } = req.body;
    const plan = await CoachingPlan.findOneAndUpdate(
      { userId: req.user._id, 'actionItems._id': req.params.actionId },
      { $set: { 'actionItems.$.completed': completed, updatedAt: new Date() } },
      { new: true }
    );
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/coaching/chat
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message requerido' });

    const plan = await CoachingPlan.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    const aiResponse = await generateCoachingResponse({
      message,
      archetype: req.user.archetype,
      pillars: req.user.pillars,
      goals: plan?.goals || [],
      chatHistory: plan?.chatHistory.slice(-10) || []
    });

    await CoachingPlan.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          chatHistory: {
            $each: [
              { role: 'user',      content: message },
              { role: 'assistant', content: aiResponse }
            ]
          }
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
