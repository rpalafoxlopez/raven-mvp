import express from 'express';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


const QUESTIONS = [
  { id: 1,  pillar: 'presence',   text: 'Cuando entras a un escenario o sala, sientes que...', options: ['Desaparezco en la multitud', 'Atraigo miradas naturalmente', 'Me pongo nervioso', 'Comando la atención sin esfuerzo'] },
  { id: 2,  pillar: 'presence',   text: 'Tu lenguaje corporal habitual es...', options: ['Encogido y protectivo', 'Abierto y expansivo', 'Inquieto y nervioso', 'Firme y consciente'] },
  { id: 3,  pillar: 'presence',   text: 'Ante una cámara o audiencia, tú...', options: ['Te escondes', 'Brillas naturalmente', 'Te congelas', 'Te transformas'] },
  { id: 4,  pillar: 'presence',   text: 'La gente tiende a...', options: ['Olvidarte rápido', 'Recordarte por tu energía', 'Confundirte con otros', 'Buscarte cuando necesitan liderazgo'] },
  { id: 5,  pillar: 'creativity', text: 'Cuando enfrentas un problema, prefieres...', options: ['Seguir el manual', 'Inventar una solución nueva', 'Copiar lo que funcionó antes', 'Mezclar ideas de fuentes inesperadas'] },
  { id: 6,  pillar: 'creativity', text: 'Tu proceso creativo se siente como...', options: ['Una tortura', 'Una explosión', 'Una brisa suave', 'Un ritual sagrado'] },
  { id: 7,  pillar: 'creativity', text: 'La originalidad para ti es...', options: ['Sobrerrevalorada', 'Tu superpoder', 'Peligrosa', 'Necesaria pero controlada'] },
  { id: 8,  pillar: 'creativity', text: 'Cuando creas algo, buscas...', options: ['Aprobación', 'Autenticidad', 'Perfección', 'Impacto'] },
  { id: 9,  pillar: 'resilience', text: 'Después de un fracaso grande, tú...', options: ['Te rindes', 'Regresas más fuerte', 'Te culpas eternamente', 'Analizas y pivotas'] },
  { id: 10, pillar: 'resilience', text: 'La adversidad te hace sentir...', options: ['Derrotado', 'Vivo', 'Atrapado', 'Desafiado'] },
  { id: 11, pillar: 'resilience', text: 'Tu relación con el rechazo es...', options: ['Evitativa', 'Lo usas como combustible', 'Te paraliza', 'Lo transformas en dirección'] },
  { id: 12, pillar: 'resilience', text: 'En tu peor momento, encuentras...', options: ['Nada', 'Una chispa que no se apaga', 'Razones para rendirte', 'Una lección valiosa'] },
  { id: 13, pillar: 'charisma',   text: 'En una conversación grupal, tú...', options: ['Escuchas en silencio', 'Dominas sin querer', 'Interrumpes sin darte cuenta', 'Conectas a todos'] },
  { id: 14, pillar: 'charisma',   text: 'La gente se siente a tu alrededor...', options: ['Indiferente', 'Energizada', 'Intimidada', 'Inspirada'] },
  { id: 15, pillar: 'charisma',   text: 'Tu humor es...', options: ['Inexistente', 'Un arma de conexión', 'Forzado', 'Reflejo de tu inteligencia'] },
  { id: 16, pillar: 'charisma',   text: 'Cuando hablas, la gente...', options: ['Mira el celular', 'Presta atención total', 'Se confunde', 'Siente que les hablas directamente'] },
  { id: 17, pillar: 'discipline', text: 'Tu rutina diaria es...', options: ['Caótica', 'Militar', 'Inexistente', 'Flexible pero constante'] },
  { id: 18, pillar: 'discipline', text: 'Ante una meta a largo plazo, tú...', options: ['La olvidas en una semana', 'La cumples cueste lo que cueste', 'Te frustras y abandonas', 'La divides en pasos pequeños'] },
  { id: 19, pillar: 'discipline', text: 'La práctica deliberada para ti es...', options: ['Aburrida', 'Tu religión', 'Necesaria pero sufrida', 'Un juego de mejoramiento'] },
  { id: 20, pillar: 'discipline', text: 'Tu relación con el tiempo es...', options: ['Te controla', 'Lo dominas', 'Te escapa', 'Lo inviertes sabiamente'] },
  { id: 21, pillar: 'intuition',  text: 'Cuando tomas decisiones, confías más en...', options: ['Datos fríos', 'Tu instinto', 'Opiniones ajenas', 'Una mezcla de datos e intuición'] },
  { id: 22, pillar: 'intuition',  text: 'Tu "sexto sentido" te ha salvado...', options: ['Nunca', 'Incontables veces', 'Un par de veces', 'Siempre que le hago caso'] },
  { id: 23, pillar: 'intuition',  text: 'Las señales sutiles del entorno tú...', options: ['Las ignoras', 'Las captas al instante', 'Las sobrepiensas', 'Las usas como guía'] },
  { id: 24, pillar: 'intuition',  text: 'Tu voz interior es...', options: ['Silenciada', 'Tu mejor consejera', 'Confusa', 'Clara cuando meditas'] },
  { id: 25, pillar: 'rebellion',  text: 'Ante una regla injusta, tú...', options: ['La obedeces', 'La rompes públicamente', 'La evitas en secreto', 'La reescribes'] },
  { id: 26, pillar: 'rebellion',  text: 'El status quo te hace sentir...', options: ['Cómodo', 'Asfixiado', 'Indiferente', 'Desafiante'] },
  { id: 27, pillar: 'rebellion',  text: 'Tu relación con la autoridad es...', options: ['Sumisa', 'Confrontacional', 'Desinteresada', 'Selectivamente respetuosa'] },
  { id: 28, pillar: 'rebellion',  text: 'La rebeldía para ti es...', options: ['Infantil', 'Necesaria para el cambio', 'Peligrosa', 'Una herramienta creativa'] },
  { id: 29, pillar: 'vision',     text: 'Tu visión del futuro es...', options: ['Borrosa', 'Cinematográficamente clara', 'Ansiosamente incierta', 'Un mapa en constante evolución'] },
  { id: 30, pillar: 'vision',     text: 'Cuando imaginas tu legado, ves...', options: ['Nada', 'Una revolución', 'Una vida tranquila', 'Un puente para otros'] },
  { id: 31, pillar: 'vision',     text: 'Tu capacidad de ver lo invisible es...', options: ['Inexistente', 'Sobrenatural', 'Limitada', 'Entrenable'] },
  { id: 32, pillar: 'vision',     text: 'El futuro que quieres crear es...', options: ['Igual al presente', 'Radicalmente diferente', 'Ligeramente mejor', 'Una versión elevada de ahora'] }
];
 GET /api/quiz/questions — público, sin auth
router.get('/questions', (req, res) => {
  res.json(QUESTIONS);
});

// POST /api/quiz/submit — auth opcional
router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers requerido' });
    }

    // Calcular scores por pilar
    const scores = {
      presence: 0, creativity: 0, resilience: 0, charisma: 0,
      discipline: 0, intuition: 0, rebellion: 0, vision: 0
    };

    answers.forEach(ans => {
      const question = QUESTIONS.find(q => q.id === ans.questionId);
      if (question && scores[question.pillar] !== undefined) {
        scores[question.pillar] += (ans.score ?? ans.answer ?? 0);
      }
    });

    // Normalizar a 0-100 (máx = 4 preguntas * 3 = 12)
    Object.keys(scores).forEach(pillar => {
      scores[pillar] = Math.round((scores[pillar] / 12) * 100);
    });

    // Arquetipo = pilar con mayor score
    const archetype = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

    // Auth opcional — si hay token, guardar resultado y actualizar user
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch { /* token inválido — continuar anónimo */ }
    }

    let resultId = null;
    if (userId) {
      const result = await QuizResult.create({ userId, answers, scores, archetype });
      resultId = result._id;
      await User.findByIdAndUpdate(userId, { archetype, pillars: scores });
    }

    return res.json({ resultId, archetype, scores });
  } catch (err) {
    console.error('Quiz submit error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;