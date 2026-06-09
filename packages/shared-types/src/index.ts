// packages/shared-types/src/index.ts
// Tipos compartidos entre frontend (Vue 3) y backend (Express + MongoDB)

// ============================================================================
// PILARES RAVEN
// ============================================================================

export const PILARES = [
  "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"
] as const;

export type PilarId = typeof PILARES[number];

export interface PilarInfo {
  id: PilarId;
  nombre: string;
  rockstars: string[];
  color: string;
  descripcion: string;
  tonoIA: string;
}

export const PILARES_INFO: Record<PilarId, PilarInfo> = {
  P1: {
    id: "P1",
    nombre: "El Arquitecto Sónico",
    rockstars: ["Cerati", "Roger Waters", "Jimmy Page", "Brandon Flowers"],
    color: "#00d4ff",
    descripcion: "Control absoluto, sofisticación, estructura milimétrica.",
    tonoIA: "Cerati: perfeccionista, obsesivo técnico, crea universos donde otros ven bits."
  },
  P2: {
    id: "P2",
    nombre: "El Alienígena Camaleón",
    rockstars: ["David Bowie", "Bunbury", "Thom Yorke", "Iván Ferreiro"],
    color: "#990000",
    descripcion: "Reinvención constante, desapego del pasado, vanguardia.",
    tonoIA: "Bunbury: mutante maduro, camufla ego en perfección, odiado por los pulcros, amado por los melodiosos."
  },
  P3: {
    id: "P3",
    nombre: "El Chamán de la Tribu",
    rockstars: ["Saúl Hernández", "Dave Grohl", "Paul McCartney", "Fito Páez"],
    color: "#D4AF37",
    descripcion: "Resiliencia luminosa, empatía, ritual colectivo.",
    tonoIA: "Grohl: resiliencia luminosa, empatía brutal, ritual colectivo sin eufemismos."
  },
  P4: {
    id: "P4",
    nombre: "El Nobel Errante",
    rockstars: ["Bob Dylan", "Indio Solari", "George Harrison", "Spinetta"],
    color: "#708090",
    descripcion: "Hermetismo, misticismo, desprecio por el aplauso fácil.",
    tonoIA: "Dylan: hermetismo, misticismo, desprecio por el aplauso fácil."
  },
  P5: {
    id: "P5",
    nombre: "El Forajido del Duelo",
    rockstars: ["Johnny Cash", "Nick Cave", "Nacho Vegas", "Robert Smith"],
    color: "#C0C0C0",
    descripcion: "Mirar de frente al dolor, transmutar sombra en belleza.",
    tonoIA: "Cash: mirar de frente al dolor, transmutar sombra en belleza."
  },
  P6: {
    id: "P6",
    nombre: "El Iconoclasta Satírico",
    rockstars: ["Frank Zappa", "Andrés Calamaro", "Charly García"],
    color: "#e9c349",
    descripcion: "Ironía letal, lucidez peligrosa, deconstrucción del absurdo.",
    tonoIA: "Zappa: ironía letal, lucidez peligrosa, deconstrucción del absurdo."
  },
  P7: {
    id: "P7",
    nombre: "La Resistencia Obrera",
    rockstars: ["Bruce Springsteen", "Patti Smith", "Alex Lora", "Quique González"],
    color: "#F0F5F9",
    descripcion: "Honestidad de clase, resistencia física extrema.",
    tonoIA: "Springsteen: honestidad de clase, resistencia física extrema."
  },
  P8: {
    id: "P8",
    nombre: "El Canalla Dionisíaco",
    rockstars: ["Mick Jagger", "Rod Stewart", "Iggy Pop", "José Andrëa"],
    color: "#ff4444",
    descripcion: "Hedonismo, vitalidad corporal salvaje, carisma animal.",
    tonoIA: "Jagger: hedonismo, vitalidad corporal salvaje, carisma animal."
  }
};

// ============================================================================
// CUESTIONARIO RAVEN 3.0
// ============================================================================

export interface OpcionQuiz {
  id: string;
  texto: string;
  pilar: PilarId;
  costo?: number; // 1-4 para fase 2
}

export interface PreguntaQuiz {
  id: number;
  fase: number;
  titulo: string;
  descripcion?: string;
  opciones: OpcionQuiz[];
  tipo: "single" | "costo" | "scale" | "forced";
}

export interface RespuestaUsuario {
  preguntaId: number;
  seleccion: string; // ID de opción o valor
}

// ============================================================================
// EVALUACIÓN / RESULTADO
// ============================================================================

export interface EvaluacionRaw {
  user_id?: string;
  timestamp: Date;
  fase_0: number; // Mt: 1.0, 1.2, 1.5, 2.0, 3.0
  fase_1: PilarId[]; // Preguntas 1-8
  fase_2: Record<PilarId, number>; // Costo energético 1-4
  fase_3: PilarId[]; // Preguntas 17-24
  fase_4: PilarId[]; // Preguntas 25-28 (sombra)
  fase_5: number[]; // Preguntas 29-32 (escala 1-5)
  filtros: {
    q33_prohibido: PilarId;
    q34_llave: PilarId;
  };
}

export interface MetricaPilar {
  id: PilarId;
  uso_total: number;
  uso_fase3: number;
  sombra_total: number;
  costo_energia: number;
}

export interface DiagnosticoRaven {
  recurso_dominante: PilarId;
  recurso_secundario: PilarId;
  recurso_bloqueado: PilarId | null;
  alerta_burnout: boolean;
  impacto_desgaste: number;
  indice_elasticidad_pct: number;
  metricas: MetricaPilar[];
  multiplicador_tiempo: number;
}

export interface PerfilRockstar {
  pilarId: PilarId;
  nombre: string;
  rockstar: string;
  color: string;
  descripcion: string;
  setlistTono: string;
}

// ============================================================================
// USUARIO / AUTH
// ============================================================================

export interface User {
  _id?: string;
  email: string;
  nombre?: string;
  avatar?: string;
  auth_provider: "supabase" | "google" | "github";
  auth_id: string;
  plan: "free" | "premium" | "pro";
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// PLAN IA / SETLIST
// ============================================================================

export interface Sprint {
  semana: number;
  tipo: "economico" | "espiritual" | "mental" | "celebracion";
  titulo: string;
  descripcion: string;
  metricas: string[];
  completado: boolean;
}

export interface Setlist {
  _id?: string;
  user_id: string;
  diagnostico: DiagnosticoRaven;
  sprints: Sprint[];
  created_at: Date;
  updated_at: Date;
}

export interface MensajeChat {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface ConversacionIA {
  _id?: string;
  user_id: string;
  setlist_id: string;
  mensajes: MensajeChat[];
  created_at: Date;
}

// ============================================================================
// PAGOS / STRIPE
// ============================================================================

export interface PlanPrecio {
  id: "free" | "premium" | "pro";
  nombre: string;
  precio_mensual: number;
  precio_anual: number;
  features: string[];
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
}

export const PLANES: PlanPrecio[] = [
  {
    id: "free",
    nombre: "Backstage Pass",
    precio_mensual: 0,
    precio_anual: 0,
    features: [
      "Quiz completo + Perfil Raven",
      "Preview 2 pilares",
      "Diagnóstico básico"
    ]
  },
  {
    id: "premium",
    nombre: "Escenario Principal",
    precio_mensual: 9.99,
    precio_anual: 89.99,
    features: [
      "Plan IA 12 semanas",
      "Dashboard completo",
      "Sprints semanales",
      "Métricas de alto voltaje",
      "Celebraciones"
    ]
  },
  {
    id: "pro",
    nombre: "Productor Ejecutivo",
    precio_mensual: 29.99,
    precio_anual: 299.99,
    features: [
      "Todo Premium",
      "1 sesión mensual con Agente IA en vivo",
      "Prioridad nuevos arquetipos",
      "API access"
    ]
  }
];

// ============================================================================
// EMAIL CAPTURE
// ============================================================================

export interface EmailCapture {
  _id?: string;
  email: string;
  quizResult?: DiagnosticoRaven;
  offerCode: string;
  expiresAt: Date;
  used: boolean;
  created_at: Date;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

// ============================================================================
// ANTÍDOTOS RAVEN — 8 Snippets de Intervención por Pilar Bloqueado
// ============================================================================

export interface Antidoto {
  pilar: PilarId;
  titulo: string;
  diagnostico: string;
  accion: string;
}

export const ANTIDOTOS: Record<PilarId, Antidoto> = {
  P1: {
    pilar: 'P1',
    titulo: 'Bloqueo de Control y Estructura',
    diagnostico: 'El algoritmo detecta que tu recurso en la sombra es el Control y la Estructura (P1). Le tienes una alergia visceral a los presupuestos, a los procesos técnicos y a las métricas porque tu ego confunde la "libertad" con el desorden. Estás intentando resolver un problema técnico usando pura intuición, carisma o fuerza bruta, y por eso sigues tropezando.',
    accion: 'Apaga tu intuición. Siéntate frente a una hoja de cálculo o una libreta en blanco y vacía tu caos en un sistema numérico o un diagrama de flujo. Calcula tu presupuesto real, mapea tus horas, define reglas estrictas y sométete a un calendario. Quítale el misticismo a tu crisis; es solo un problema de ingeniería y te toca construir la tubería.'
  },
  P2: {
    pilar: 'P2',
    titulo: 'Bloqueo de Transformación y Mutación',
    diagnostico: 'El algoritmo detecta que tu recurso bloqueado es la Transformación y Mutación (P2). Te estás hundiendo con el barco por pura lealtad a un "yo" del pasado, a un contrato obsoleto o a una identidad que ya no te sirve. Le tienes terror a soltar porque crees que renunciar es fracasar.',
    accion: 'Tienes que matar al personaje. Ejecuta una amputación táctica: cancela ese proyecto zombi que vienes arrastrando, renuncia formalmente a esa dinámica que te asfixia o cambia radicalmente de entorno. Deja de intentar arreglar las ventanas de una casa que se está incendiando. Tu salida no es la reparación, es la evacuación y el cambio de piel.'
  },
  P3: {
    pilar: 'P3',
    titulo: 'Bloqueo de Comunidad y Alianza',
    diagnostico: 'El algoritmo detecta que tu recurso en la sombra es la Comunidad y la Alianza (P3). Tu síndrome de "lobo solitario" y tu orgullo te están aislando. Prefieres asfixiarte bajo el peso de la crisis antes que mostrarte vulnerable, pedir ayuda o admitir ante los demás que no tienes las respuestas.',
    accion: 'Rinde tu autonomía. Tienes estrictamente prohibido intentar resolver esto solo. Vas a levantar el teléfono, llamar a un aliado de confianza, socio o familiar, exponer tu nivel de agotamiento real y pedir soporte directo. La solución a tu estancamiento no está en tu cabeza, está en tu red. Trágate el ego y deja que tu tribu te sostenga.'
  },
  P4: {
    pilar: 'P4',
    titulo: 'Bloqueo de Retiro y Silencio',
    diagnostico: 'El algoritmo detecta que tu recurso bloqueado es el Retiro y el Silencio (P4). Tienes pánico a detenerte. Estás utilizando la hiperactividad, el ruido social o el trabajo compulsivo como anestesia para no tener que escuchar el crujido de tu propia crisis. Crees que si te detienes un segundo, todo se derrumba.',
    accion: 'Frena el motor en seco. Cancela tu agenda exterior, apaga las notificaciones, desconéctate de las demandas de los demás y aíslate. Tu intervención requiere inmovilidad contemplativa. Tienes que soportar la incomodidad de estar a solas en una habitación vacía contigo mismo hasta que recuperes la nitidez conceptual que perdiste por culpa de la velocidad.'
  },
  P5: {
    pilar: 'P5',
    titulo: 'Bloqueo de Duelo y Alquimia',
    diagnostico: 'El algoritmo detecta que tu recurso en la sombra es el Procesamiento del Duelo (P5). Estás huyendo del dolor real a través del positivismo tóxico, la evasión cínica o intentando "solucionar" cosas que simplemente ya murieron. No te has permitido sentir la herida de lo que perdiste y por eso el fantasma te sigue persiguiendo.',
    accion: 'No hagas absolutamente nada para "mejorar" tu situación. Cancela la euforia defensiva. Siéntate cara a cara con tu pérdida, tu fracaso o tu herida y asimila el luto. Escribe sobre ello sin filtros o permítete la catarsis emocional. Tienes que aceptar que esa pieza se rompió para siempre antes de poder construir algo nuevo sobre los escombros.'
  },
  P6: {
    pilar: 'P6',
    titulo: 'Bloqueo de Humor e Iconoclasia',
    diagnostico: 'El algoritmo detecta que tu recurso bloqueado es el Humor y la Iconoclasia (P6). Has convertido tu crisis en una tragedia griega. Estás atrapado porque te tomas a ti mismo, a tus problemas y a tu entorno con una solemnidad asfixiante. El exceso de gravedad y dramatismo te tiene paralizado.',
    accion: 'Pierde el respeto a tu propia crisis. Encuentra la grieta absurda y ridícula de tu problema actual y búrlate de tu propio ego. Aplica el sarcasmo, mira tu situación desde una lente cínica y ríete del desastre. Cuando logres desmitificar el tamaño del monstruo mediante la burla, recuperarás la agilidad mental para clavarle la espada.'
  },
  P7: {
    pilar: 'P7',
    titulo: 'Bloqueo de Resistencia y Ética Obrera',
    diagnostico: 'El algoritmo detecta que tu recurso en la sombra es la Resistencia Estoica (P7). Estás buscando atajos, inspiración divina, motivación o "hacks" para no tener que hacer el trabajo aburrido y pesado. Huyes de la fricción cuando las cosas dejan de ser divertidas o se vuelven monótonas.',
    accion: 'Se acabó la búsqueda de magia. Mañana vas a elegir la tarea operativa más pesada, menos glamurosa y más aburrida de tu crisis actual. Sin motivación, sin música épica y sin ganas: vas a apretar los dientes, morder el polvo y ejecutarla hasta el final por pura dignidad obrera. Tu salida requiere callar la mente y aguantar el esfuerzo bruto.'
  },
  P8: {
    pilar: 'P8',
    titulo: 'Bloqueo de Vitalidad e Instinto',
    diagnostico: 'El algoritmo detecta que tu recurso bloqueado es la Vitalidad y el Instinto (P8). Estás atrapado en la parálisis por análisis, disecando variables en tu mente, teorizando futuros posibles y desconectado por completo del mundo físico. Desprecias la acción impulsiva porque le tienes miedo al riesgo no calculado.',
    accion: 'Apaga el cerebro analítico. Tienes prohibido sobrepensar. Toma una decisión rápida e imperfecta basada únicamente en las tripas y asume el riesgo. Mueve el cuerpo: sal a correr hasta que quemen los pulmones, busca un estímulo físico intenso o rompe la inercia mental con acción visceral pura. La solución no está en tu cabeza, está en la velocidad de tu cuerpo.'
  }
};

// Helper: obtener antídoto por pilar bloqueado
export const getAntidoto = (pilarId: PilarId | null): Antidoto | null => {
  if (!pilarId) return null;
  return ANTIDOTOS[pilarId] ?? null;
};