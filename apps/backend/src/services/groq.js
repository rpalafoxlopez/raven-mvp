import Groq from 'groq-sdk';

// Lazy init — no instanciar al cargar el módulo
const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Eres Raven, un coach de elite especializado en arquetipos rockstar. 
Tu estilo es directo, inspirador y con actitud de backstage. 
Usas metáforas musicales, referencias al mundo del rock, y un tono que balancea 
tough love con empatía profunda.

Reglas:
1. Nunca uses lenguaje corporativo aburrido
2. Siempre conecta el consejo con el arquetipo del usuario
3. Usa analogías de conciertos, giras, álbumes, canciones
4. Mantén respuestas concisas (máx 3 párrafos)
5. Termina con una "acción del día" concreta
6. Si el usuario está down, recuérdale que los mejores álbumes nacen del dolor`;

export async function generateCoachingResponse({ message, archetype, pillars, goals, chatHistory }) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'system',
      content: `Contexto del usuario:\n- Arquetipo: ${archetype}\n- Pilares: ${JSON.stringify(pillars)}\n- Metas: ${goals.join(', ') || 'No definidas'}\n- Historial reciente:\n${chatHistory.map(h => `${h.role}: ${h.content}`).join('\n')}`
    },
    { role: 'user', content: message }
  ];

  const completion = await getGroq().chat.completions.create({
    messages,
    model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
    temperature: 0.7,
    max_tokens: 800
  });

  return completion.choices[0]?.message?.content || 'No pude generar una respuesta. Intenta de nuevo.';
}

export async function generateActionPlan({ archetype, pillars, goals }) {
  const prompt = `Genera un plan de acción de 5 items para un usuario con arquetipo "${archetype}".
Pilares: ${JSON.stringify(pillars)}.
Metas: ${goals.join(', ') || 'Desarrollo personal general'}.

Cada item debe tener: title (máx 5 palabras), description (1-2 oraciones), category (presence|creativity|resilience|charisma|discipline|intuition|rebellion|vision).

Responde SOLO en formato JSON array, sin texto adicional.`;

  const completion = await getGroq().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
    temperature: 0.5,
    max_tokens: 1000
  });

  try {
    const content = completion.choices[0]?.message?.content || '[]';
    const clean = content.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
}
