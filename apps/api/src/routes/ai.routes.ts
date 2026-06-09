import { Router } from 'express';
import { AIPlanModel, ConversacionModel, IAIPlan } from '../models/AIPlan';
import { generateSetlistWithAI, chatWithAgent } from '../services/aiAgent.service';
import { authMiddleware, AuthRequest, requirePlan } from '../middleware/auth.middleware';
import { aiRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// POST /api/ai/setlist — Generar setlist de 12 semanas (requiere premium/pro)
router.post('/setlist', authMiddleware, requirePlan(['premium', 'pro']), async (req: AuthRequest, res) => {
  try {
    const { diagnostico } = req.body;

    if (!diagnostico) {
      return res.status(400).json({ success: false, error: 'Diagnóstico requerido' });
    }

    // Verificar si ya existe un setlist para este usuario
    const existing = await AIPlanModel.findOne({ user_id: req.user!.id });
    if (existing) {
      return res.json({ success: true, data: existing });
    }

    // Generar con IA
    const generated = await generateSetlistWithAI(diagnostico);

    if (!generated) {
      return res.status(500).json({ success: false, error: 'Error generando setlist' });
    }

    // Guardar en DB
    const plan = await AIPlanModel.create({
      user_id: req.user!.id,
      diagnostico,
      sprints: generated.sprints
    });

    // Crear conversación inicial
    await ConversacionModel.create({
      user_id: req.user!.id,
      setlist_id: plan._id,
      mensajes: [
        {
          role: 'system',
          content: `Setlist generado para ${diagnostico.recurso_dominante}. 12 semanas listas.`,
          timestamp: new Date()
        }
      ]
    });

    return res.json({ success: true, data: plan });
  } catch (error: any) {
    console.error('Error generando setlist:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/ai/chat — Chat con el Agente Raven
router.post('/chat', authMiddleware, requirePlan(['premium', 'pro']), aiRateLimit, async (req: AuthRequest, res) => {
  try {
    const { mensajes, setlistId } = req.body;

    if (!mensajes || !Array.isArray(mensajes)) {
      return res.status(400).json({ success: false, error: 'Mensajes requeridos' });
    }

    // Obtener diagnóstico del usuario
    const plan = await AIPlanModel.findOne({ user_id: req.user!.id }).lean() as IAIPlan | null;
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Setlist no encontrado' });
    }

    // Obtener historial de conversación
    let conversacion = await ConversacionModel.findOne({
      user_id: req.user!.id,
      setlist_id: setlistId || plan._id
    });

    if (!conversacion) {
      conversacion = await ConversacionModel.create({
        user_id: req.user!.id,
        setlist_id: setlistId || plan._id,
        mensajes: []
      });
    }

    // Añadir mensaje del usuario
    const userMessage = mensajes[mensajes.length - 1];
    conversacion.mensajes.push({
      role: 'user',
      content: userMessage.content,
      timestamp: new Date()
    });

    // Generar respuesta con IA
    const response = await chatWithAgent(
      conversacion.mensajes.map((m: any) => ({ role: m.role, content: m.content })),
      plan.diagnostico
    );

    // Guardar respuesta
    conversacion.mensajes.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });
    await conversacion.save();

    return res.json({
      success: true,
      data: {
        response,
        mensajes: conversacion.mensajes
      }
    });
  } catch (error: any) {
    console.error('Error en chat:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/ai/conversation/:setlistId — Obtener historial de chat
router.get('/conversation/:setlistId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const conversacion = await ConversacionModel.findOne({
      user_id: req.user!.id,
      setlist_id: req.params.setlistId
    });

    if (!conversacion) {
      return res.json({ success: true, data: { mensajes: [] } });
    }

    return res.json({ success: true, data: conversacion });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/ai/sprint/:setlistId/:semana — Marcar sprint como completado
router.patch('/sprint/:setlistId/:semana', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { setlistId, semana } = req.params;
    const { completado } = req.body;

    const plan = await AIPlanModel.findOne({
      _id: setlistId,
      user_id: req.user!.id
    }).lean() as IAIPlan | null;

    if (!plan) {
      return res.status(404).json({ success: false, error: 'Setlist no encontrado' });
    }

    const sprint = plan.sprints.find((s: any) => s.semana === parseInt(semana));
    if (!sprint) {
      return res.status(404).json({ success: false, error: 'Sprint no encontrado' });
    }

    sprint.completado = completado;
    // FIX: No usar updated_at en lean(), usar updateOne en su lugar
    await AIPlanModel.updateOne(
      { _id: setlistId },
      { 
        $set: { 
          'sprints.$[elem].completado': completado,
          updated_at: new Date()
        }
      },
      { arrayFilters: [{ 'elem.semana': parseInt(semana) }] }
    );

    return res.json({ success: true, data: { semana: parseInt(semana), completado } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;