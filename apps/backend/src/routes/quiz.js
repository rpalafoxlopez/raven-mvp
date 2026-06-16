import express from 'express';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// ARQUETIPOS REALES (P1-P8) — Sistema RockYourself
// ─────────────────────────────────────────────────────────────

const ARQUETIPOS = {
  P1: {
    id: 'P1',
    nombre: 'El Arquitecto Sónico',
    mecanismo: 'Planificación, ordenamiento micro y macro, diseño de sistemas, optimización de datos y predictibilidad.',
    usoFuncional: 'Capacidad para desglosar el caos en pasos lógicos, trazar hojas de ruta y construir infraestructura duradera.',
    sombra: 'Parálisis por exceso de métricas. Intentas resolver el agotamiento haciendo más listas, incapaz de tolerar la incertidumbre o improvisar.',
    sombraLabel: 'Rigidez / Burnout',
    color: '#2ecc71',
    colorSombra: '#e74c3c',
    rockstarPrincipal: 'Bruce Springsteen',
    rockstarSecundario: 'James Hetfield'
  },
  P2: {
    id: 'P2',
    nombre: 'El Alienígena Camaleón',
    mecanismo: 'Flexibilidad radical, cambio de código, adaptabilidad, reinvención y corte de lazos.',
    usoFuncional: 'Agilidad para abandonar barcos que se hunden, despojarse de identidades obsoletas y sobrevivir en entornos completamente nuevos.',
    sombra: 'Evasión crónica. Huyes y destruyes proyectos al primer síntoma de aburrimiento o fricción, confundiendo el escape con la evolución.',
    sombraLabel: 'Fuga / Evasión',
    color: '#9b59b6',
    colorSombra: '#c0392b',
    rockstarPrincipal: 'David Bowie',
    rockstarSecundario: 'Lady Gaga'
  },
  P3: {
    id: 'P3',
    nombre: 'El Chamán de la Tribu',
    mecanismo: 'Cohesión, reciprocidad, soporte colectivo, empatía operativa y lealtad de red.',
    usoFuncional: 'Capacidad para unificar a las personas, resolver conflictos internos, pedir ayuda y operar en bloque como una tribu.',
    sombra: 'Pérdida de autonomía. Te cargas los problemas de todos, te niegas a avanzar si alguien se queda atrás, o te paralizas sin validación externa.',
    sombraLabel: 'Codependencia / Burnout',
    color: '#e67e22',
    colorSombra: '#c0392b',
    rockstarPrincipal: 'Bono',
    rockstarSecundario: 'Freddie Mercury'
  },
  P4: {
    id: 'P4',
    nombre: 'El Nobel Errante',
    mecanismo: 'Pausa, introspección, abstracción conceptual, aislamiento estratégico y distancia analítica.',
    usoFuncional: 'Detener el ruido del entorno para observar el panorama completo, recuperar la nitidez mental y no reaccionar impulsivamente.',
    sombra: 'Desconexión absoluta. Te refugias en tu mente, teorizando sin actuar, usando el "análisis" como excusa para no enfrentarte a la realidad material.',
    sombraLabel: 'Parálisis / Aislamiento',
    color: '#34495e',
    colorSombra: '#2c3e50',
    rockstarPrincipal: 'Bob Dylan',
    rockstarSecundario: 'Thom Yorke'
  },
  P5: {
    id: 'P5',
    nombre: 'El Forajido del Duelo',
    mecanismo: 'Procesamiento del dolor, catarsis, aceptación de la pérdida y habitar la crisis sin filtros.',
    usoFuncional: 'Valentía para mirar la herida de frente, asimilar lo que se rompió y transmutar el sufrimiento en significado, arte o madurez.',
    sombra: 'Adicción a la tragedia. Te enamoras de tus propias cicatrices, densificas tus problemas y usas tu sufrimiento como identidad para no avanzar.',
    sombraLabel: 'Melancolía / Burnout',
    color: '#8e44ad',
    colorSombra: '#2c3e50',
    rockstarPrincipal: 'Kurt Cobain',
    rockstarSecundario: 'Ian Curtis'
  },
  P6: {
    id: 'P6',
    nombre: 'El Iconoclasta Satírico',
    mecanismo: 'Desmitificación, ironía defensiva, relativización del drama y cinismo táctico.',
    usoFuncional: 'Capacidad para reírse del desastre, quitarle autoridad a sistemas opresivos y usar el sarcasmo para no ser aplastado por la solemnidad del problema.',
    sombra: 'Superficialidad defensiva. Nada se toma en serio. Usas el chiste para anestesiar el dolor real y evitar cualquier confrontación profunda.',
    sombraLabel: 'Evasión / Cinismo',
    color: '#f1c40f',
    colorSombra: '#7f8c8d',
    rockstarPrincipal: 'Frank Zappa',
    rockstarSecundario: 'Liam Gallagher'
  },
  P7: {
    id: 'P7',
    nombre: 'La Resistencia Obrera',
    mecanismo: 'Persistencia a largo plazo, contención del daño, soporte de la carga, disciplina dura y estoicismo.',
    usoFuncional: 'Fortaleza moral para morder el polvo, aguantar el castigo cuando las cosas se ponen difíciles y no quebrarse ante el esfuerzo.',
    sombra: 'El síndrome del mártir. Aguantas peso innecesario, glorificas el exceso de trabajo y te niegas a buscar vías más inteligentes por puro orgullo obrero.',
    sombraLabel: 'Terquedad / Burnout',
    color: '#C0C0C0',
    colorSombra: '#7f8c8d',
    rockstarPrincipal: 'Johnny Cash',
    rockstarSecundario: 'Bruce Dickinson'
  },
  P8: {
    id: 'P8',
    nombre: 'El Canalla Dionisíaco',
    mecanismo: 'Impulso corporal, juego, instinto animal, velocidad, riesgo calculado y acción visceral.',
    usoFuncional: 'Tomar decisiones rápidas con las tripas, romper la inercia mental mediante la aceleración física y disfrutar de la intensidad del momento.',
    sombra: 'Impulsividad destructiva. Riesgos ciegos, hedonismo que sabotea los planes a largo plazo y quema de recursos por pura incapacidad de tolerar el aburrimiento.',
    sombraLabel: 'Caos / Exceso',
    color: '#e74c3c',
    colorSombra: '#c0392b',
    rockstarPrincipal: 'Jimi Hendrix',
    rockstarSecundario: 'Keith Richards'
  }
};

// ─────────────────────────────────────────────────────────────
// CUESTIONARIO RAVEN 3.0 — 34 REACTIVOS
// ─────────────────────────────────────────────────────────────

const QUESTIONS = [
  // FASE 0 — CRONOLOGÍA (Filtro de Desgaste)
  {
    id: 0,
    fase: 'cronologia',
    tipo: 'escala',
    texto: '¿Cuánto tiempo llevas sintiendo de manera continua que tu situación o proyecto principal se encuentra bloqueado, estancado o bajo una presión que no logras resolver?',
    opciones: [
      { label: 'Menos de una semana.', valor: 1 },
      { label: 'Entre 1 y 4 semanas.', valor: 2 },
      { label: 'Entre 1 y 3 meses.', valor: 3 },
      { label: 'Entre 3 y 12 meses.', valor: 4 },
      { label: 'Más de un año.', valor: 5 }
    ],
    arquetipoId: null,
    peso: 1
  },

  // FASE I — ACTIVACIÓN AUTOMÁTICA (Conductas Desnudas)
  {
    id: 1,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Colapso financiero inmediato: Tu principal fuente de ingresos sufre un recorte del 80%. Tu conducta en las primeras 24 horas es:',
    opciones: [
      { label: 'Abrir la computadora, generar hojas de cálculo y trazar un cronograma de recortes.', arquetipoId: 'P1', peso: 2 },
      { label: 'Llamar a contactos antiguos, programar reuniones y buscar socios inmediatos.', arquetipoId: 'P3', peso: 2 },
      { label: 'Cancelar suscripciones, guardar los proyectos y salir a caminar durante horas en silencio.', arquetipoId: 'P4', peso: 2 },
      { label: 'Diseñar un producto diferente y lanzar una oferta piloto en redes esa misma noche.', arquetipoId: 'P2', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 2,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Quiebre de un acuerdo clave: Un colaborador indispensable abandona el proyecto en el peor momento. Tu primera acción física es:',
    opciones: [
      { label: 'Redactar un documento analítico enumerando las fallas del proceso.', arquetipoId: 'P1', peso: 2 },
      { label: 'Ajustar el plan a mis capacidades actuales y continuar operando sin sustituto.', arquetipoId: 'P2', peso: 2 },
      { label: 'Buscar un relevo inmediato o pedir respaldo operativo en mi red de confianza.', arquetipoId: 'P3', peso: 2 },
      { label: 'Apagar el monitor y recluirme en mi espacio sin emitir respuesta inmediata.', arquetipoId: 'P4', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 3,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Fricción por estancamiento: Llegas al viernes tras una semana donde todo lo que intentaste fue bloqueado por factores externos. Tú:',
    opciones: [
      { label: 'Planificas jornadas dobles para el fin de semana con el fin de corregir el desfase.', arquetipoId: 'P7', peso: 2 },
      { label: 'Buscas un estímulo corporal intenso de manera inmediata (ejercicio pesado, fiesta, alcohol).', arquetipoId: 'P8', peso: 2 },
      { label: 'Te sientas en silencio a procesar la frustración o escribes sobre el fracaso de la semana.', arquetipoId: 'P5', peso: 2 },
      { label: 'Envías un meme ácido al equipo, haces un comentario satírico y te desentiendes.', arquetipoId: 'P6', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 4,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Parálisis de equipo: El grupo que lideras entra en un bucle de discusiones estériles:',
    opciones: [
      { label: 'Intervienes para delimitar tareas individuales y exigir el cumplimiento de plazos.', arquetipoId: 'P1', peso: 2 },
      { label: 'Propones disolver la mesa de trabajo actual y abordar el problema desde cero.', arquetipoId: 'P2', peso: 2 },
      { label: 'Interrumpes para hablar individualmente con los afectados y restaurar la cohesión.', arquetipoId: 'P3', peso: 2 },
      { label: 'Te retiras físicamente o apagas la cámara para observar sin emitir opinión.', arquetipoId: 'P4', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 5,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Impacto emocional: Recibes una mala noticia personal en tu jornada más saturada:',
    opciones: [
      { label: 'Bloqueas el impacto, lo archivas mentalmente y continúas trabajando de forma mecánica.', arquetipoId: 'P7', peso: 2 },
      { label: 'Abandonas el lugar de inmediato y buscas una actividad distractora de alta velocidad.', arquetipoId: 'P8', peso: 2 },
      { label: 'Buscas un espacio aislado para llorar y procesar el malestar de forma consciente.', arquetipoId: 'P5', peso: 2 },
      { label: 'Utilizas el sarcasmo ante el entorno para restarle gravedad al impacto y seguir operando.', arquetipoId: 'P6', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 6,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Ruina pública: Un error tuyo se expone públicamente ante clientes o pares:',
    opciones: [
      { label: 'Emites un informe técnico de control de daños con datos puros para corregir la falla.', arquetipoId: 'P1', peso: 2 },
      { label: 'Das por terminada la relación con ese nicho y cambias el nombre del proyecto.', arquetipoId: 'P2', peso: 2 },
      { label: 'Convocas a tus aliados para recibir respaldo y validar la contención del grupo.', arquetipoId: 'P3', peso: 2 },
      { label: 'Soportas el impacto en silencio, asumes la culpa y usas el aislamiento para aprender.', arquetipoId: 'P5', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 7,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Ultimátum logístico: Se duplican las exigencias y se reducen los plazos a la mitad. Te anclas en:',
    opciones: [
      { label: 'Sostener el ritmo, duplicar las horas de esfuerzo y trabajar sacrificando el descanso.', arquetipoId: 'P7', peso: 2 },
      { label: 'Tomar decisiones viscerales sobre la marcha, acelerar el cuerpo y ejecutar impulsivamente.', arquetipoId: 'P8', peso: 2 },
      { label: 'Ridiculizar la exigencia de los líderes y usar el humor negro ante el desastre inminente.', arquetipoId: 'P6', peso: 2 },
      { label: 'Detener el ritmo de producción para buscar claridad conceptual sobre el panorama completo.', arquetipoId: 'P4', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 8,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Desgaste por inercia: Atrapado en una etapa monótona y predecible por contratos vigentes, tú:',
    opciones: [
      { label: 'Optimizas minuciosamente tu escritorio, tus carpetas digitales y las variables que controlas.', arquetipoId: 'P1', peso: 2 },
      { label: 'Cambias constantemente de estilo visual, horarios o rutas físicas de manera aleatoria.', arquetipoId: 'P2', peso: 2 },
      { label: 'Enfocas tu energía en armar reuniones informales y cuidar a tu red de contactos.', arquetipoId: 'P3', peso: 2 },
      { label: 'Aceptas el aburrimiento, aguantas el desgaste diario de manera estoica y cumples el horario.', arquetipoId: 'P7', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },

  // FASE II — COSTO ENERGÉTICO (Escala 1-4)
  {
    id: 9,
    fase: 'costo',
    tipo: 'escala',
    texto: 'Diseñar metodologías, desglosar datos y planificar variables logísticas a mediano plazo.',
    arquetipoId: 'P1',
    peso: 1.5
  },
  {
    id: 10,
    fase: 'costo',
    tipo: 'escala',
    texto: 'Cerrar ciclos de forma abrupta, abandonar identidades obsoletas y mudar de entorno.',
    arquetipoId: 'P2',
    peso: 1.5
  },
  {
    id: 11,
    fase: 'costo',
    tipo: 'escala',
    texto: 'Mostrar fragilidad ante otros, pedir ayuda explícita y depender del soporte de tu red.',
    arquetipoId: 'P3',
    peso: 1.5
  },
  {
    id: 12,
    fase: 'costo',
    tipo: 'escala',
    texto: 'Mantenerme inaccesible, apagar notificaciones y aislarme del ruido para buscar claridad.',
    arquetipoId: 'P4',
    peso: 1.5
  },
  {
    id: 13,
    fase: 'costo',
    tipo: 'escala',
    texto: 'Permitirme habitar la tristeza de una pérdida y procesar el luto de forma consciente.',
    arquetipoId: 'P5',
    peso: 1.5
  },
  {
    id: 14,
    fase: 'costo',
    tipo: 'escala',
    texto: 'Implementar la ironía corrosiva o el sarcasmo frente a la adversidad extrema.',
    arquetipoId: 'P6',
    peso: 1.5
  },
  {
    id: 15,
    fase: 'costo',
    tipo: 'escala',
    texto: 'Persistir de manera monótona en una tarea pesada y cumplir el deber estando exhausto.',
    arquetipoId: 'P7',
    peso: 1.5
  },
  {
    id: 16,
    fase: 'costo',
    tipo: 'escala',
    texto: 'Tomar decisiones viscerales sobre la marcha y actuar rápido antes de tener datos puros.',
    arquetipoId: 'P8',
    peso: 1.5
  },

  // FASE III — FLEXIBILIDAD (Migración Forzada)
  {
    id: 17,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Dilema de escasez absoluta: Solo puedes inyectarle un recurso a tu problema hoy:',
    opciones: [
      { label: 'Más control y capacidad para predecir variables.', arquetipoId: 'P1', peso: 2 },
      { label: 'Más libertad para cambiar de rumbo y romper acuerdos.', arquetipoId: 'P2', peso: 2 },
      { label: 'Más apoyo relacional y colaboradores operando contigo.', arquetipoId: 'P3', peso: 2 },
      { label: 'Más tiempo a solas para aislarte y analizar el trasfondo.', arquetipoId: 'P4', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 18,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Bloqueo táctico: Tu estrategia favorita acaba de fallar y se te prohíbe volver a usarla:',
    opciones: [
      { label: 'Abandonas los objetivos originales y buscas un territorio completamente nuevo.', arquetipoId: 'P2', peso: 2 },
      { label: 'Rompes tu orgullo individual y pides ayuda inmediata a tu red humana.', arquetipoId: 'P3', peso: 2 },
      { label: 'Suspendes toda actividad y te recluyes a esperar recuperar nitidez mental.', arquetipoId: 'P4', peso: 2 },
      { label: 'Duplicas la tenacidad, aprietas los dientes y aguantas el castigo con más fuerza.', arquetipoId: 'P7', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 19,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Despojo total: Pierdes todos tus recursos económicos y estatus profesional. ¿Qué conservas?',
    opciones: [
      { label: 'Mi conocimiento técnico y capacidad metodológica para diseñar un nuevo sistema.', arquetipoId: 'P1', peso: 2 },
      { label: 'Mi agilidad camaleónica para asimilar el cambio drástico y adaptarme.', arquetipoId: 'P2', peso: 2 },
      { label: 'Mis relaciones estratégicas, la lealtad de mi tribu y mi red de contactos.', arquetipoId: 'P3', peso: 2 },
      { label: 'Mi resistencia obrera para morder el polvo, tolerar la fatiga y no quebrarme.', arquetipoId: 'P7', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 20,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Desgaste extendido: Una crisis se extiende por más de un año sin resolución. Te anclas en:',
    opciones: [
      { label: 'El orden micro: mantener rutinas rígidas y planificación del día a día.', arquetipoId: 'P1', peso: 2 },
      { label: 'El lazo comunitario: apoyarte en la reciprocidad grupal y el soporte colectivo.', arquetipoId: 'P3', peso: 2 },
      { label: 'El procesamiento del duelo: aceptar la tragedia, habitar la crisis y asimilar la pérdida.', arquetipoId: 'P5', peso: 2 },
      { label: 'La persistencia estoica: aguantar el desgaste cotidiano por puro compromiso moral.', arquetipoId: 'P7', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 21,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Quiebre relacional: Tu círculo de confianza está demasiado agotado para apoyarte. Tú migras a:',
    opciones: [
      { label: 'Enfocar el 100% de tu atención en optimizar procesos analíticos y trabajar.', arquetipoId: 'P1', peso: 2 },
      { label: 'Cortar toda comunicación, recluirte y procesar las cosas en soledad.', arquetipoId: 'P4', peso: 2 },
      { label: 'Usar el sarcasmo letal y el humor negro para anular el impacto del desamparo.', arquetipoId: 'P6', peso: 2 },
      { label: 'Trabajar de forma mecánica con el cuerpo hasta cansar los músculos y callar la mente.', arquetipoId: 'P7', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 22,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Estructura asfixiante: Atrapado en reglas absurdas que no puedes cambiar, tu supervivencia es:',
    opciones: [
      { label: 'Fingir obediencia mientras planificas en secreto una fuga radical.', arquetipoId: 'P2', peso: 2 },
      { label: 'Desconectarte mentalmente y refugiarte en tus abstracciones intelectuales.', arquetipoId: 'P4', peso: 2 },
      { label: 'Utilizar el cinismo táctico y la burla discreta para restarle autoridad al sistema.', arquetipoId: 'P6', peso: 2 },
      { label: 'Buscar espacios intermitentes de alta intensidad corporal o excesos para liberar presión.', arquetipoId: 'P8', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 23,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Vacío existencial: Nada parece tener valor real. Para romper la parálisis, te obligas a:',
    opciones: [
      { label: 'Cambiar drásticamente de código, rutinas y buscar un escenario desconocido.', arquetipoId: 'P2', peso: 2 },
      { label: 'Conectarte con el dolor, escribir sobre tus grietas y transmutar la herida.', arquetipoId: 'P5', peso: 2 },
      { label: 'Reírte del absurdo de la condición humana y no tomarte nada en serio.', arquetipoId: 'P6', peso: 2 },
      { label: 'Tomar riesgos calculados, mover el cuerpo y actuar antes de que la mente te paralice.', arquetipoId: 'P8', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 24,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Emergencia inmediata: Un problema legal/económico crítico exige definición en horas:',
    opciones: [
      { label: 'Estudiar las reglas del juego, contratos y buscar un vacío metodológico frío.', arquetipoId: 'P1', peso: 2 },
      { label: 'Activar influencias personales y resolver la crisis mediante diplomacia cool.', arquetipoId: 'P3', peso: 2 },
      { label: 'Dar la cara de inmediato, de forma ruda y asumir la responsabilidad del choque.', arquetipoId: 'P7', peso: 2 },
      { label: 'Mandar el asunto al demonio, asumir la pérdida y enfocar energía en otra operación.', arquetipoId: 'P2', peso: 2 }
    ],
    arquetipoId: null,
    peso: 0
  },

  // FASE IV — SOMBRA Y BLOQUEO (Rechazo Proyectivo)
  {
    id: 25,
    fase: 'sombra',
    tipo: 'eleccion',
    texto: 'Utilidad percibida: ¿Cuál estrategia psicológica te parece la MENOS útil para la vida real?',
    opciones: [
      { label: 'Planificar variables lógicas.', arquetipoId: 'P1', peso: 1.5, tipoSombra: true },
      { label: 'Mudar de identidad/adaptarse.', arquetipoId: 'P2', peso: 1.5, tipoSombra: true },
      { label: 'Mostrar vulnerabilidad/pedir ayuda.', arquetipoId: 'P3', peso: 1.5, tipoSombra: true },
      { label: 'Aislarse/guardar silencio contemplativo.', arquetipoId: 'P4', peso: 1.5, tipoSombra: true },
      { label: 'Habitar la tristeza/procesar el duelo.', arquetipoId: 'P5', peso: 1.5, tipoSombra: true },
      { label: 'Usar ironía/reírse del desastre.', arquetipoId: 'P6', peso: 1.5, tipoSombra: true },
      { label: 'Resistir estoicamente la carga pesada.', arquetipoId: 'P7', peso: 1.5, tipoSombra: true },
      { label: 'Operar por impulso instintivo/riesgo.', arquetipoId: 'P8', peso: 1.5, tipoSombra: true }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 26,
    fase: 'sombra',
    tipo: 'eleccion',
    texto: 'Rechazo Visceral: ¿Qué estado te genera más incomodidad experimentar en ti mismo?',
    opciones: [
      { label: 'La necesidad obsesiva de orden y control.', arquetipoId: 'P1', peso: 2, tipoSombra: true },
      { label: 'La inconstancia crónica y tendencia a huir.', arquetipoId: 'P2', peso: 2, tipoSombra: true },
      { label: 'La dependencia emocional y necesidad de aprobación.', arquetipoId: 'P3', peso: 2, tipoSombra: true },
      { label: 'La pasividad contemplativa y aislamiento.', arquetipoId: 'P4', peso: 2, tipoSombra: true },
      { label: 'La rumiación melancólica y drama íntimo.', arquetipoId: 'P5', peso: 2, tipoSombra: true },
      { label: 'El desapego cínico y burla constante.', arquetipoId: 'P6', peso: 2, tipoSombra: true },
      { label: 'La terquedad de aguantar castigos innecesarios.', arquetipoId: 'P7', peso: 2, tipoSombra: true },
      { label: 'La impulsividad animal y actuar sin calcular.', arquetipoId: 'P8', peso: 2, tipoSombra: true }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 27,
    fase: 'sombra',
    tipo: 'eleccion',
    texto: 'Evitación Consciente: ¿Qué herramienta evades incluso sabiendo que podría ayudarte hoy?',
    opciones: [
      { label: 'Trazar presupuestos rígidos o calendarios.', arquetipoId: 'P1', peso: 2, tipoSombra: true },
      { label: 'Cerrar un ciclo obsoleto y mudar de entorno.', arquetipoId: 'P2', peso: 2, tipoSombra: true },
      { label: 'Hacer una llamada incómoda para pedir perdón/ayuda.', arquetipoId: 'P3', peso: 2, tipoSombra: true },
      { label: 'Quedarte en absoluto silencio a solas sin dispositivos.', arquetipoId: 'P4', peso: 2, tipoSombra: true },
      { label: 'Detener la actividad para asimilar y llorar una pérdida.', arquetipoId: 'P5', peso: 2, tipoSombra: true },
      { label: 'Desdramatizar el problema riéndote de ti mismo.', arquetipoId: 'P6', peso: 2, tipoSombra: true },
      { label: 'Trabajar de forma rutinaria aguantando el desgaste.', arquetipoId: 'P7', peso: 2, tipoSombra: true },
      { label: 'Tomar un riesgo físico inmediato y jugar con las tripas.', arquetipoId: 'P8', peso: 2, tipoSombra: true }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 28,
    fase: 'sombra',
    tipo: 'eleccion',
    texto: 'Proyección del éxito: ¿Qué cualidad en la "gente exitosa" te produce mayor rechazo?',
    opciones: [
      { label: 'Su hiper-control corporativo y obsesión por métricas.', arquetipoId: 'P1', peso: 2, tipoSombra: true },
      { label: 'Su descaro para traicionar su pasado y reinventarse.', arquetipoId: 'P2', peso: 2, tipoSombra: true },
      { label: 'Su dependencia de las relaciones públicas y aplauso.', arquetipoId: 'P3', peso: 2, tipoSombra: true },
      { label: 'Su soberbia intelectual y distanciamiento hermético.', arquetipoId: 'P4', peso: 2, tipoSombra: true },
      { label: 'El exhibicionismo de sus crisis íntimas y dolor.', arquetipoId: 'P5', peso: 2, tipoSombra: true },
      { label: 'Su ligereza sarcástica para tratar asuntos críticos.', arquetipoId: 'P6', peso: 2, tipoSombra: true },
      { label: 'Su orgullo por el autosacrificio y cuántas horas trabajan.', arquetipoId: 'P7', peso: 2, tipoSombra: true },
      { label: 'Su impulsividad al tomar riesgos financieros con las tripas.', arquetipoId: 'P8', peso: 2, tipoSombra: true }
    ],
    arquetipoId: null,
    peso: 0
  },

  // FASE V — REACTIVOS ESPEJO (Índice de Congruencia) — Escala 1-5
  {
    id: 29,
    fase: 'espejo',
    tipo: 'escala',
    texto: 'Me considero una persona sumamente independiente y autosuficiente.',
    arquetipoId: 'P1', // P1/P4/P7
    peso: 1,
    arquetiposRelacionados: ['P1', 'P4', 'P7']
  },
  {
    id: 30,
    fase: 'espejo',
    tipo: 'escala',
    texto: 'Cuando las cosas empeoran críticamente, experimento la necesidad imperiosa de buscar apoyo relacional.',
    arquetipoId: 'P3',
    peso: 1,
    arquetiposRelacionados: ['P3']
  },
  {
    id: 31,
    fase: 'espejo',
    tipo: 'escala',
    texto: 'Prefiero ejecutar una acción imperfecta rápido antes que esperar a tener todas las variables controladas.',
    arquetipoId: 'P8',
    peso: 1,
    arquetiposRelacionados: ['P8', 'P2']
  },
  {
    id: 32,
    fase: 'espejo',
    tipo: 'escala',
    texto: 'Prefiero observar el panorama completo con frialdad analítica antes de realizar cualquier movimiento.',
    arquetipoId: 'P4',
    peso: 1,
    arquetiposRelacionados: ['P4', 'P1']
  },

  // VALIDACIÓN FINAL
  {
    id: 33,
    fase: 'validacion',
    tipo: 'eleccion',
    texto: 'El Recurso Prohibido: Si tuvieras que resolver tu crisis usando EXCLUSIVAMENTE uno de estos recursos, ¿Cuál NO elegirías bajo ninguna circunstancia (prefiriendo fracasar antes que usarlo)?',
    opciones: [
      { label: 'El orden, el control y la planificación rígida.', arquetipoId: 'P1', peso: 3, tipoSombra: true },
      { label: 'La huida, el abandono del escenario y la reinvención.', arquetipoId: 'P2', peso: 3, tipoSombra: true },
      { label: 'La dependencia grupal, la vulnerabilidad y la ayuda externa.', arquetipoId: 'P3', peso: 3, tipoSombra: true },
      { label: 'El aislamiento contemplativo, la parálisis y el silencio total.', arquetipoId: 'P4', peso: 3, tipoSombra: true },
      { label: 'El llanto profundo, el luto íntimo y abrazar el dolor puro.', arquetipoId: 'P5', peso: 3, tipoSombra: true },
      { label: 'La sátira absoluta, la burla y el cinismo sin respeto alguno.', arquetipoId: 'P6', peso: 3, tipoSombra: true },
      { label: 'El trabajo bruto, el soportar humillaciones y aguantar callado.', arquetipoId: 'P7', peso: 3, tipoSombra: true },
      { label: 'La impulsividad ciega, la acción irracional y el riesgo animal.', arquetipoId: 'P8', peso: 3, tipoSombra: true }
    ],
    arquetipoId: null,
    peso: 0
  },
  {
    id: 34,
    fase: 'validacion',
    tipo: 'eleccion',
    texto: 'La Llave Perdida: Si una autoridad absoluta te regalara uno de estos recursos en su máxima expresión para destrabar tu futuro, ¿cuál pedirías?',
    opciones: [
      { label: 'Claridad estratégica impecable.', arquetipoId: 'P1', peso: 3 },
      { label: 'Coraje camaleónico para cambiar de piel.', arquetipoId: 'P2', peso: 3 },
      { label: 'Magnetismo relacional para unificar redes.', arquetipoId: 'P3', peso: 3 },
      { label: 'Paz mental soberbiosa para abstraerse del ruido.', arquetipoId: 'P4', peso: 3 },
      { label: 'Capacidad alquímica para transmutar heridas en arte.', arquetipoId: 'P5', peso: 3 },
      { label: 'Bisturí de ironía para relativizar cualquier drama.', arquetipoId: 'P6', peso: 3 },
      { label: 'Fortaleza estoica e incorruptible.', arquetipoId: 'P7', peso: 3 },
      { label: 'Instinto visceral para disfrutar del riesgo biológico.', arquetipoId: 'P8', peso: 3 }
    ],
    arquetipoId: null,
    peso: 0
  }
];

// ─────────────────────────────────────────────────────────────
// GET /api/quiz/questions — público
// ─────────────────────────────────────────────────────────────
router.get('/questions', (req, res) => {
  res.json(QUESTIONS);
});

// ─────────────────────────────────────────────────────────────
// POST /api/quiz/submit — auth opcional
// ─────────────────────────────────────────────────────────────
router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers requerido' });
    }

    // ── Inicializar scores ──
    const scores = {
      P1: { funcional: 0, sombra: 0, total: 0, countFuncional: 0, countSombra: 0 },
      P2: { funcional: 0, sombra: 0, total: 0, countFuncional: 0, countSombra: 0 },
      P3: { funcional: 0, sombra: 0, total: 0, countFuncional: 0, countSombra: 0 },
      P4: { funcional: 0, sombra: 0, total: 0, countFuncional: 0, countSombra: 0 },
      P5: { funcional: 0, sombra: 0, total: 0, countFuncional: 0, countSombra: 0 },
      P6: { funcional: 0, sombra: 0, total: 0, countFuncional: 0, countSombra: 0 },
      P7: { funcional: 0, sombra: 0, total: 0, countFuncional: 0, countSombra: 0 },
      P8: { funcional: 0, sombra: 0, total: 0, countFuncional: 0, countSombra: 0 }
    };

    let cronologiaScore = 0;
    const respuestasProcesadas = [];

    answers.forEach(ans => {
      const question = QUESTIONS.find(q => q.id === ans.questionId);
      if (!question) return;

      const procesada = {
        questionId: ans.questionId,
        fase: question.fase,
        tipo: question.tipo,
        valor: ans.valor !== undefined ? ans.valor : ans.answer,
        arquetipoId: null,
        pesoAplicado: 0,
        esSombra: false
      };

      // FASE 0: Cronología — no afecta scores de arquetipo, solo metadata
      if (question.fase === 'cronologia') {
        cronologiaScore = procesada.valor;
        respuestasProcesadas.push(procesada);
        return;
      }

      // FASE I (Activación), FASE III (Flexibilidad), FASE IV (Sombra), VALIDACIÓN
      if (question.tipo === 'eleccion' && question.opciones) {
        const opcionElegida = question.opciones[ans.valor !== undefined ? ans.valor : ans.answer];
        if (opcionElegida && opcionElegida.arquetipoId) {
          const pid = opcionElegida.arquetipoId;
          const peso = opcionElegida.peso || question.peso || 1;
          const esSombra = opcionElegida.tipoSombra === true;

          procesada.arquetipoId = pid;
          procesada.pesoAplicado = peso;
          procesada.esSombra = esSombra;

          if (esSombra) {
            scores[pid].sombra += peso;
            scores[pid].countSombra++;
          } else {
            scores[pid].funcional += peso;
            scores[pid].countFuncional++;
          }
          scores[pid].total += peso;
        }
      }

      // FASE II (Costo Energético) — Escala 1-4
      if (question.fase === 'costo' && question.tipo === 'escala') {
        const pid = question.arquetipoId;
        const peso = question.peso || 1;
        const valor = procesada.valor; // 1-4

        // Invertir: 1 = Me energiza (funcional alto), 4 = Me agota (sombra alta)
        // Mapeo: 1→3, 2→2, 3→1, 4→0 para funcional
        // Mapeo: 1→0, 2→1, 3→2, 4→3 para sombra
        const funcionalValor = (5 - valor) * peso;
        const sombraValor = (valor - 1) * peso;

        procesada.arquetipoId = pid;
        procesada.pesoAplicado = peso;

        scores[pid].funcional += funcionalValor;
        scores[pid].sombra += sombraValor;
        scores[pid].countFuncional++;
        scores[pid].countSombra++;
        scores[pid].total += (funcionalValor + sombraValor);
      }

      // FASE V (Espejo) — Escala 1-5
      if (question.fase === 'espejo' && question.tipo === 'escala') {
        const valor = procesada.valor; // 1-5
        const peso = question.peso || 1;
        const arquetiposRel = question.arquetiposRelacionados || [question.arquetipoId];

        // Distribuir el valor entre los arquetipos relacionados
        arquetiposRel.forEach(pid => {
          if (scores[pid]) {
            scores[pid].funcional += (valor * peso);
            scores[pid].countFuncional++;
            scores[pid].total += (valor * peso);
          }
        });

        procesada.arquetiposRelacionados = arquetiposRel;
        procesada.pesoAplicado = peso;
      }

      respuestasProcesadas.push(procesada);
    });

    // ── Normalizar scores a 0-100 ──
    const scoresNormalizados = {};
    Object.keys(scores).forEach(pid => {
      const s = scores[pid];
      const maxFuncional = Math.max(s.countFuncional * 3, 1); // aprox max
      const maxSombra = Math.max(s.countSombra * 3, 1);

      scoresNormalizados[pid] = {
        funcional: Math.min(100, Math.round((s.funcional / maxFuncional) * 100)),
        sombra: Math.min(100, Math.round((s.sombra / maxSombra) * 100)),
        total: Math.min(100, Math.round((s.total / (maxFuncional + maxSombra)) * 100)),
        raw: { funcional: s.funcional, sombra: s.sombra, total: s.total }
      };
    });

    // ── Determinar estados ──
    const resultados = Object.keys(scoresNormalizados).map(pid => {
      const s = scoresNormalizados[pid];
      const diff = s.funcional - s.sombra;
      let estado;

      if (s.total < 15) {
        estado = 'dormido';
      } else if (s.sombra > 60 && s.funcional < 40) {
        estado = 'en-sombra';
      } else if (s.funcional > 60 && s.sombra < 40) {
        estado = 'saludable';
      } else if (Math.abs(diff) < 15) {
        estado = 'equilibrado';
      } else {
        estado = 'dominante';
      }

      return {
        arquetipoId: pid,
        ...ARQUETIPOS[pid],
        scores: s,
        estado,
        diff
      };
    }).sort((a, b) => b.scores.total - a.scores.total);

    const dominante = resultados[0];
    const secundario = resultados[1];
    const terciario = resultados[2];
    const enSombra = resultados.find(r => r.estado === 'en-sombra') || null;
    const dormidos = resultados.filter(r => r.estado === 'dormido');

    // ── Alertas ──
    const alertas = {
      burnout: resultados.some(r =>
        (r.arquetipoId === 'P1' || r.arquetipoId === 'P7' || r.arquetipoId === 'P3') &&
        r.estado === 'en-sombra'
      ),
      fuga: resultados.some(r =>
        r.arquetipoId === 'P2' && r.estado === 'en-sombra'
      ),
      paralisis: resultados.some(r =>
        r.arquetipoId === 'P4' && r.estado === 'en-sombra'
      ),
      codependencia: resultados.some(r =>
        r.arquetipoId === 'P3' && r.estado === 'en-sombra'
      ),
      melancolia: resultados.some(r =>
        r.arquetipoId === 'P5' && r.estado === 'en-sombra'
      ),
      cinismo: resultados.some(r =>
        r.arquetipoId === 'P6' && r.estado === 'en-sombra'
      ),
      caos: resultados.some(r =>
        r.arquetipoId === 'P8' && r.estado === 'en-sombra'
      )
    };

    // ── Perfil codificado ──
    const top3 = resultados.slice(0, 3);
    const perfilCodigo = top3.map(r => r.arquetipoId).join('-');
    const perfilNombre = top3.map(r => r.nombre).join(' + ');

    // ── Auth opcional ──
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
      const result = await QuizResult.create({
        userId,
        answers: respuestasProcesadas,
        scores: scoresNormalizados,
        resultados,
        perfil: {
          codigo: perfilCodigo,
          nombre: perfilNombre,
          dominante: { id: dominante.arquetipoId, nombre: dominante.nombre },
          secundario: { id: secundario.arquetipoId, nombre: secundario.nombre },
          terciario: { id: terciario.arquetipoId, nombre: terciario.nombre }
        },
        alertas,
        cronologiaScore,
        createdAt: new Date()
      });
      resultId = result._id;

      await User.findByIdAndUpdate(userId, {
        archetype: dominante.arquetipoId,
        perfilCodigo,
        scores: scoresNormalizados,
        ultimoDiagnostico: new Date()
      });
    }

    return res.json({
      resultId,
      perfil: {
        codigo: perfilCodigo,
        nombre: perfilNombre,
        dominante: {
          id: dominante.arquetipoId,
          nombre: dominante.nombre,
          estado: dominante.estado,
          scores: dominante.scores,
          mecanismo: dominante.mecanismo,
          usoFuncional: dominante.usoFuncional,
          sombra: dominante.sombra,
          sombraLabel: dominante.sombraLabel,
          color: dominante.color,
          colorSombra: dominante.colorSombra,
          rockstarPrincipal: dominante.rockstarPrincipal
        },
        secundario: {
          id: secundario.arquetipoId,
          nombre: secundario.nombre,
          estado: secundario.estado,
          scores: secundario.scores
        },
        terciario: {
          id: terciario.arquetipoId,
          nombre: terciario.nombre,
          estado: terciario.estado
        },
        enSombra: enSombra ? {
          id: enSombra.arquetipoId,
          nombre: enSombra.nombre,
          sombraLabel: enSombra.sombraLabel,
          sombra: enSombra.sombra,
          colorSombra: enSombra.colorSombra
        } : null,
        dormidos: dormidos.map(r => ({ id: r.arquetipoId, nombre: r.nombre }))
      },
      resultados,
      alertas,
      cronologiaScore
    });

  } catch (err) {
    console.error('Quiz submit error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/quiz/results/:resultId — obtener resultado guardado
// ─────────────────────────────────────────────────────────────
router.get('/results/:resultId', async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.resultId);
    if (!result) return res.status(404).json({ error: 'Resultado no encontrado' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/quiz/my-results — historial del usuario autenticado
// ─────────────────────────────────────────────────────────────
router.get('/my-results', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Auth requerido' });
    }

    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    const results = await QuizResult.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(results);
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;
