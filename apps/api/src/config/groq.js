const Groq = require('groq-sdk');

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;
const GROQ_MODEL = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';

const generateSetlistPrompt = (dominante, secundario, terciario, bloqueado, burnout, impacto) =>
  `Eres el Agente Raven, coach de IA de psicología del arquetipo.
PERFIL:
- Dominante: ${dominante}
- Secundario: ${secundario}
- Terciario: ${terciario}
- Bloqueado: ${bloqueado || 'Ninguno'}
- Burnout: ${burnout ? 'ACTIVO' : 'Inactivo'}
- Impacto desgaste: ${Number(impacto).toFixed(1)}

GENERA un setlist JSON de 12 sprints con esta estructura exacta:
{"sprints":[{"semana":1,"tipo":"economico|espiritual|mental|celebracion","titulo":"...","descripcion":"...","metricas":["...","..."]}]}

REGLAS:
- 3 economicos, 3 espirituales, 3 mentales, 3 celebraciones
- Sin positivismo barato. Honestidad brutal.
- Metricas concretas y medibles.
- Si burnout activo: semana 1 debe ser RECUPERACION, no produccion.
- Responde SOLO JSON valido, sin texto adicional.`;

module.exports = { groq, GROQ_MODEL, generateSetlistPrompt };
