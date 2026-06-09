const { Router } = require('express');
const { AIPlanModel, ConversacionModel } = require('../models/AIPlan');
const { generateSetlistWithAI, chatWithAgent } = require('../services/aiAgent.service');
const { authMiddleware, requirePlan } = require('../middleware/auth.middleware');
const { aiRateLimit } = require('../middleware/rateLimit.middleware');

const router = Router();

// POST /api/ai/setlist
router.post('/setlist', authMiddleware, requirePlan(['premium', 'pro']), async (req, res) => {
  try {
    const { diagnostico } = req.body;
    if (!diagnostico) return res.status(400).json({ success: false, error: 'Diagnóstico requerido' });

    const existing = await AIPlanModel.findOne({ user_id: req.user.id });
    if (existing) return res.json({ success: true, data: existing });

    const generated = await generateSetlistWithAI(diagnostico);
    if (!generated) return res.status(500).json({ success: false, error: 'Error generando setlist' });

    const plan = await AIPlanModel.create({
      user_id: req.user.id,
      diagnostico,
      sprints: generated.sprints
    });

    await ConversacionModel.create({
      user_id: req.user.id,
      setlist_id: plan._id.toString(),
      mensajes: [{ role: 'system', content: `Setlist generado. Pilar dominante: ${diagnostico.recurso_dominante}. 12 semanas listas.`, timestamp: new Date() }]
    });

    return res.json({ success: true, data: plan });
  } catch (err) {
    console.error('Error generando setlist:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/chat
router.post('/chat', authMiddleware, requirePlan(['premium', 'pro']), aiRateLimit, async (req, res) => {
  try {
    const { mensajes, setlistId } = req.body;
    if (!mensajes || !Array.isArray(mensajes)) return res.status(400).json({ success: false, error: 'Mensajes requeridos' });

    const plan = await AIPlanModel.findOne({ user_id: req.user.id }).lean();
    if (!plan) return res.status(404).json({ success: false, error: 'Setlist no encontrado' });

    const targetSetlistId = setlistId || plan._id.toString();
    let conversacion = await ConversacionModel.findOne({ user_id: req.user.id, setlist_id: targetSetlistId });
    if (!conversacion) {
      conversacion = await ConversacionModel.create({ user_id: req.user.id, setlist_id: targetSetlistId, mensajes: [] });
    }

    const userMessage = mensajes[mensajes.length - 1];
    conversacion.mensajes.push({ role: 'user', content: userMessage.content, timestamp: new Date() });

    const response = await chatWithAgent(
      conversacion.mensajes.map(m => ({ role: m.role, content: m.content })),
      plan.diagnostico
    );

    conversacion.mensajes.push({ role: 'assistant', content: response, timestamp: new Date() });
    await conversacion.save();

    return res.json({ success: true, data: { response, mensajes: conversacion.mensajes } });
  } catch (err) {
    console.error('Error chat:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ai/conversation/:setlistId
router.get('/conversation/:setlistId', authMiddleware, async (req, res) => {
  try {
    const conversacion = await ConversacionModel.findOne({
      user_id: req.user.id,
      setlist_id: req.params.setlistId
    });
    return res.json({ success: true, data: conversacion || { mensajes: [] } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/ai/sprint/:setlistId/:semana
router.patch('/sprint/:setlistId/:semana', authMiddleware, async (req, res) => {
  try {
    const { setlistId, semana } = req.params;
    const { completado } = req.body;

    const result = await AIPlanModel.updateOne(
      { _id: setlistId, user_id: req.user.id },
      { $set: { 'sprints.$[elem].completado': completado, updated_at: new Date() } },
      { arrayFilters: [{ 'elem.semana': parseInt(semana) }] }
    );

    if (result.matchedCount === 0) return res.status(404).json({ success: false, error: 'Setlist no encontrado' });
    return res.json({ success: true, data: { semana: parseInt(semana), completado } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
