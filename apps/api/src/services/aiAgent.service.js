const { groq, GROQ_MODEL, generateSetlistPrompt } = require('../config/groq');
const { PILARES_INFO } = require('../shared-types');

const generateSetlistWithAI = async (diagnostico) => {
  if (!groq) {
    console.warn('Groq no configurado. Usando fallback.');
    return generateFallbackSetlist(diagnostico);
  }

  const dominante  = PILARES_INFO[diagnostico.recurso_dominante];
  const secundario = PILARES_INFO[diagnostico.recurso_secundario];
  const terciarioId = diagnostico.metricas?.[2]?.id;
  const terciario  = terciarioId ? PILARES_INFO[terciarioId] : dominante;

  const prompt = generateSetlistPrompt(
    `${dominante.nombre} (${dominante.rockstars[0]})`,
    `${secundario.nombre} (${secundario.rockstars[0]})`,
    `${terciario.nombre} (${terciario.rockstars[0]})`,
    diagnostico.recurso_bloqueado ? PILARES_INFO[diagnostico.recurso_bloqueado]?.nombre : null,
    diagnostico.alerta_burnout,
    diagnostico.impacto_desgaste
  );

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Eres el Agente Raven. Responde SOLO en JSON válido.' },
        { role: 'user', content: prompt }
      ],
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Respuesta vacía de Groq');
    const parsed = JSON.parse(content);
    return { sprints: parsed.sprints };
  } catch (err) {
    console.error('Error Groq:', err.message);
    return generateFallbackSetlist(diagnostico);
  }
};

const generateFallbackSetlist = (diagnostico) => {
  const dominante = PILARES_INFO[diagnostico.recurso_dominante];

  const sprints = [
    { semana:1,  tipo:'economico',   titulo:'Auditoría de Ingresos',         descripcion:`Como ${dominante.rockstars[0]}, mapea cada fuente de ingreso y elimina lo que no paga tu valor real.`, metricas:['3 fuentes identificadas','1 fuente eliminada'], completado:false },
    { semana:2,  tipo:'economico',   titulo:'Blindaje de Proyectos',          descripcion:'Protege lo que construyes. Contratos, propiedad intelectual, límites claros.',                            metricas:['2 contratos revisados','1 cláusula de escape'], completado:false },
    { semana:3,  tipo:'economico',   titulo:'Meta de Ingreso Realista',       descripcion:'¿Cuánto necesitas para no ser esclavo? Ese es tu número. Sin fantasías.',                                 metricas:['Número mensual calculado','Plan 90 días trazado'], completado:false },
    { semana:4,  tipo:'espiritual',  titulo:'El Riff que te Mueve',           descripcion:'¿Qué hacías antes de que el sistema te convenciera de que necesitabas permiso?',                          metricas:['3 momentos de flow identificados','1h diaria reservada'], completado:false },
    { semana:5,  tipo:'espiritual',  titulo:'Valores No Negociables',         descripcion:'Lista lo que no venderías por dinero. Eso es tu brújula.',                                                metricas:['5 valores definidos','1 situación que los viola'], completado:false },
    { semana:6,  tipo:'espiritual',  titulo:'Paz Operativa',                  descripcion:'No busques paz zen. Busca la capacidad de actuar sin que el ruido te paralice.',                          metricas:['1 ritual diario','3 días sin reaccionar visceral'], completado:false },
    { semana:7,  tipo:'mental',      titulo:'Hábitos de Ejecución',           descripcion:'Diseña un estado de flow impecable. Tu ejecución diaria debe ser arte ejecutable.',                      metricas:['1 hábito core instalado','7 días consecutivos'], completado:false },
    { semana:8,  tipo:'mental',      titulo:'Claridad de Foco',               descripcion:'Un rockstar no multiplica proyectos; multiplica impacto en uno.',                                         metricas:['1 proyecto prioritario','3 distracciones eliminadas'], completado:false },
    { semana:9,  tipo:'mental',      titulo:'Arquitectura Mental',            descripcion:'Tu mente es tu estudio. Organízala con obsesión y propósito.',                                            metricas:['Sistema de notas implementado','Review semanal establecida'], completado:false },
    { semana:10, tipo:'celebracion', titulo:'Logro Económico',                descripcion:'Celebra el primer ingreso que llegó por tu propia regla.',                                                metricas:['Ingreso validado','Ritual de celebración ejecutado'], completado:false },
    { semana:11, tipo:'celebracion', titulo:'Recompensa Espiritual',          descripcion:'Reconoce el momento en que elegiste tu voz sobre el aplauso fácil.',                                     metricas:['Momento documentado','Compartido con 1 persona real'], completado:false },
    { semana:12, tipo:'celebracion', titulo:'Ritual de Cierre',               descripcion:'12 semanas. No es un curso terminado. Es un álbum masterizado. Escúchalo.',                              metricas:['Review completo del setlist','Nuevo setlist planificado'], completado:false }
  ];

  if (diagnostico.alerta_burnout) {
    sprints.unshift({
      semana:0, tipo:'mental',
      titulo:'RECUPERACIÓN: Detener el Motor',
      descripcion:`Tu ${dominante.nombre} está sobreexplotado. Impacto: ${Number(diagnostico.impacto_desgaste).toFixed(1)}. No produzcas esta semana. Recupera.`,
      metricas:['7h de sueño por 5 días','1 día sin pantallas'], completado:false
    });
  }

  if (diagnostico.recurso_bloqueado) {
    const bloqueado = PILARES_INFO[diagnostico.recurso_bloqueado];
    if (bloqueado) {
      sprints.splice(5, 0, {
        semana:5, tipo:'espiritual',
        titulo:`Desbloqueo: ${bloqueado.nombre}`,
        descripcion:`Has rechazado a ${bloqueado.rockstars[0]} por miedo. Esta semana, prueba una micro-dosis de su medicina.`,
        metricas:['1 acción del pilar bloqueado ejecutada','Diario de resistencia escrito'], completado:false
      });
    }
  }

  return { sprints };
};

const chatWithAgent = async (mensajes, diagnostico) => {
  if (!groq) return 'El Agente Raven está en mantenimiento. Vuelve en unos minutos.';

  const dominante = PILARES_INFO[diagnostico.recurso_dominante];
  const systemPrompt = `Eres el Agente Raven, coach de IA.
Perfil: ${dominante.nombre} (${dominante.rockstars[0]}).
Tono: ${dominante.tonoIA}
Reglas: Sin positivismo barato. Honestidad brutal. Ironía letal. Máx 150 palabras.`;

  // Limitar historial a últimos 20 mensajes para no exceder context window
  const historial = mensajes.slice(-20);

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...historial.map(m => ({ role: m.role, content: m.content }))
      ],
      model: GROQ_MODEL,
      temperature: 0.8,
      max_tokens: 500
    });
    return completion.choices[0]?.message?.content || 'El Agente Raven no tiene respuesta ahora.';
  } catch (err) {
    console.error('Error chat:', err.message);
    return 'Error de conexión con el Agente Raven. Intenta de nuevo.';
  }
};

module.exports = { generateSetlistWithAI, chatWithAgent };
