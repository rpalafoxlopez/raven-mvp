import express from 'express';
import jwt from 'jsonwebtoken';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';

const router = express.Router();

// Archetype descriptions
const ARCHETYPES = {
  presence: {
    name: 'El Frontman',
    tagline: 'Naciste para estar en el centro del escenario',
    description: 'Tu energía magnetiza cualquier espacio. La gente no puede ignorarte porque irradias confianza antes de decir una palabra.',
    strengths: ['Carisma natural', 'Comunicación impactante', 'Liderazgo escénico'],
    weaknesses: ['Puede verse como egocéntrico', 'Dificultad para escuchar'],
    rockIcons: ['Freddie Mercury', 'Mick Jagger', 'David Bowie']
  },
  creativity: {
    name: 'El Guitar Hero',
    tagline: 'Tu mente es un riff que nunca termina',
    description: 'Ves conexiones donde otros ven caos. Tu creatividad no es un lujo, es tu forma de procesar el mundo.',
    strengths: ['Innovación constante', 'Pensamiento lateral', 'Expresión artística'],
    weaknesses: ['Dificultad para terminar proyectos', 'Frustración con lo convencional'],
    rockIcons: ['Jimi Hendrix', 'Prince', 'Tom Morello']
  },
  resilience: {
    name: 'El Survivor',
    tagline: 'Cada caída es solo un acorde menor antes del estribillo',
    description: 'Has enfrentado adversidad que hubiera roto a otros y sigues de pie. Tu fortaleza no es ausencia de dolor, es elegir seguir adelante.',
    strengths: ['Recuperación rápida', 'Persistencia extrema', 'Empatía profunda'],
    weaknesses: ['Dificultad para pedir ayuda', 'Tendencia a minimizar logros'],
    rockIcons: ['Kurt Cobain (legado)', 'Ozzy Osbourne', 'Steven Tyler']
  },
  charisma: {
    name: 'El Conector',
    tagline: 'No necesitas un micrófono para que todos te escuchen',
    description: 'Tu superpoder es hacer que cada persona se sienta la única en la habitación. Conectas corazones, no solo redes.',
    strengths: ['Empatía genuina', 'Networking natural', 'Influencia positiva'],
    weaknesses: ['Agotamiento emocional', 'Dificultad para decir no'],
    rockIcons: ['Bono', 'Bruce Springsteen', 'Dave Grohl']
  },
  discipline: {
    name: 'El Productor',
    tagline: 'La grandeza no es un accidente, es una rutina',
    description: 'Mientras otros sueñan, tú construyes. Tu consistencia es tu superpoder más subestimado.',
    strengths: ['Ejecución impecable', 'Gestión del tiempo', 'Mejora continua'],
    weaknesses: ['Rigidez excesiva', 'Dificultad para improvisar'],
    rockIcons: ['Rick Rubin', 'Brian Eno', 'Trent Reznor']
  },
  intuition: {
    name: 'El Visionario',
    tagline: 'Ves lo invisible, sientes lo intangible',
    description: 'Tu intuición es un radar que detecta oportunidades antes de que existan. Confías en tu voz interior porque rara vez falla.',
    strengths: ['Visión estratégica', 'Toma de decisiones rápida', 'Innovación disruptiva'],
    weaknesses: ['Dificultad para explicar procesos', 'Aislamiento'],
    rockIcons: ['John Lennon', 'Thom Yorke', 'Björk']
  },
  rebellion: {
    name: 'El Rebelde',
    tagline: 'Las reglas son sugerencias, las tuyas son leyes',
    description: 'No naciste para encajar. Tu rebeldía no es caos, es la fuerza que rompe estructuras obsoletas para crear algo mejor.',
    strengths: ['Coraje para desafiar', 'Originalidad radical', 'Liderazgo de cambio'],
    weaknesses: ['Conflictos innecesarios', 'Dificultad para colaborar'],
    rockIcons: ['Sid Vicious', 'Joan Jett', 'Rage Against the Machine']
  },
  vision: {
    name: 'El Dreamer',
    tagline: 'El futuro que imaginas ya existe en tu cabeza',
    description: 'Ves posibilidades donde otros ven imposibilidades. Tu visión no es fantasía, es un blueprint de lo que vendrá.',
    strengths: ['Pensamiento a largo plazo', 'Inspiración de equipos', 'Creatividad estratégica'],
    weaknesses: ['Dificultad con el presente', 'Desconexión de la realidad'],
    rockIcons: ['Roger Waters', 'Pete Townshend', 'Liam Gallagher']
  }
};

// Get user's latest result
router.get('/latest', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await QuizResult.findOne({ userId: decoded.userId })
      .sort({ completedAt: -1 });

    if (!result) return res.status(404).json({ error: 'No results found' });

    const archetypeData = ARCHETYPES[result.archetype];

    res.json({
      resultId: result._id,
      archetype: result.archetype,
      archetypeData,
      scores: result.scores,
      completedAt: result.completedAt
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all results for user
router.get('/history', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const results = await QuizResult.find({ userId: decoded.userId })
      .sort({ completedAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;