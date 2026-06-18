// Cuestionario RAVEN 3.0 completo: 34 preguntas, 5 fases + validación final.
// Cada pregunta tiene: id, fase, tipo ('eleccion' | 'escala'), texto, opciones (si eleccion)
// Las opciones de tipo 'eleccion' llevan { label, pilar } donde pilar es P1-P8 o null (preguntas de costo/espejo)

const QUESTIONS = [

  // ===== FASE 0: CRONOLOGÍA (1 pregunta, escala 1-5) =====
  {
    id: 0,
    fase: 'cronologia',
    tipo: 'escala',
    texto: '¿Cuánto tiempo llevas sintiendo de manera continua que tu situación o proyecto principal se encuentra bloqueado, estancado o bajo una presión que no logras resolver?'
  },

  // ===== FASE I: ACTIVACIÓN AUTOMÁTICA (8 preguntas, eleccion A-D) =====
  {
    id: 1,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Tu principal fuente de ingresos sufre un recorte del 80% y te quedan exactamente dos semanas de margen operativo. La conducta que aparece de manera automática en las primeras 24 horas es:',
    opciones: [
      { label: 'Abrir la computadora, generar hojas de cálculo, desglosar gastos fijos y trazar un cronograma de recortes.', pilar: 'P1' },
      { label: 'Llamar a clientes antiguos, programar reuniones de emergencia y buscar socios comerciales inmediatos.', pilar: 'P3' },
      { label: 'Cancelar todas las suscripciones, guardar los proyectos actuales en una carpeta y salir a caminar durante horas en silencio.', pilar: 'P4' },
      { label: 'Diseñar un producto o servicio diferente, cambiar de nicho de mercado y lanzar una oferta piloto en redes esa misma noche.', pilar: 'P2' }
    ]
  },
  {
    id: 2,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Un socio estratégico o un colaborador indispensable te notifica que abandona el proyecto a mitad de la ejecución más crítica. Tu primera acción física es:',
    opciones: [
      { label: 'Sentarte a solas a redactar un documento analítico donde se enumeren las fallas del proceso y las responsabilidades legales.', pilar: 'P1' },
      { label: 'Modificar las metas del mes, ajustar el plan general a mis capacidades individuales actuales y continuar operando sin sustituto.', pilar: 'P2' },
      { label: 'Marcar el teléfono de mi red de contactos de confianza para buscar un relevo inmediato o pedir respaldo operativo.', pilar: 'P3' },
      { label: 'Apagar el monitor, cancelar las llamadas del día y recluirme en mi espacio sin emitir ninguna respuesta inmediata.', pilar: 'P4' }
    ]
  },
  {
    id: 3,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Llegas al viernes por la tarde tras una semana donde absolutamente todo lo que intentaste ejecutar fue bloqueado por la burocracia, errores ajenos o factores externos. Al cerrar la puerta, tú:',
    opciones: [
      { label: 'Abres la agenda y planificas jornadas dobles de trabajo para el fin de semana con el fin de corregir el desfase.', pilar: 'P7' },
      { label: 'Buscas un estímulo corporal intenso de manera inmediata: entrenamiento de alta carga, consumo directo, alcohol o sexo.', pilar: 'P8' },
      { label: 'Te sientas en silencio a procesar la frustración, permitiéndote conectar con el cansancio o escribir sobre la herida del fracaso.', pilar: 'P5' },
      { label: 'Envías un meme ácido al chat del equipo, haces un comentario satírico sobre la situación y te desentiendes del asunto.', pilar: 'P6' }
    ]
  },
  {
    id: 4,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'El grupo humano que lideras o al que perteneces entra en un bucle de discusiones estériles y acusaciones mutuas ante un error grave:',
    opciones: [
      { label: 'Intervengo para delimitar las tareas individuales, fijar un nuevo organigrama lógico y exigir el cumplimiento de plazos.', pilar: 'P1' },
      { label: 'Propongo suspender las reuniones actuales, disolver la mesa de trabajo y abordar el problema desde una metodología nueva.', pilar: 'P2' },
      { label: 'Interrumpo la discusión para hablar individualmente con los afectados, calmar las fricciones y restaurar la cohesión del grupo.', pilar: 'P3' },
      { label: 'Me retiro físicamente de la mesa o apago la cámara para observar la interacción desde fuera, sin emitir opinión alguna.', pilar: 'P4' }
    ]
  },
  {
    id: 5,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Recibes una notificación personal de alto impacto emocional negativo en mitad de tu jornada laboral más saturada. Tu cuerpo ejecuta:',
    opciones: [
      { label: 'Bloquear el impacto de manera inmediata, colocar el asunto en una carpeta mental y continuar con las tareas del día de forma mecánica.', pilar: 'P7' },
      { label: 'Abandonar el lugar de trabajo de inmediato, cambiar de entorno físico y buscar una actividad distractora de alta velocidad.', pilar: 'P8' },
      { label: 'Buscar un espacio aislado o un cubículo vacío para llorar, asimilar el golpe y procesar el malestar de forma consciente.', pilar: 'P5' },
      { label: 'Utilizar una respuesta sarcástica o un comentario cínico ante el entorno para restarle gravedad al impacto y seguir operando.', pilar: 'P6' }
    ]
  },
  {
    id: 6,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Un error grave en tu desempeño operativo o en tu comunicación se expone públicamente ante tus pares o clientes. Tu conducta es:',
    opciones: [
      { label: 'Desglosar técnicamente el error, emitir un informe de control de daños con datos puros y corregir la falla del sistema.', pilar: 'P1' },
      { label: 'Dar por terminada la relación con ese nicho o mercado, cambiar el nombre del proyecto e iniciar un desarrollo diferente.', pilar: 'P2' },
      { label: 'Convocar a mis aliados y comunidad más cercana para recibir su respaldo y validar la contención del grupo humano.', pilar: 'P3' },
      { label: 'Soportar el impacto de las críticas en silencio, asumir la culpa operativa completa y usar el desierto para aprender de la falla.', pilar: 'P5' }
    ]
  },
  {
    id: 7,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'El entorno incrementa las exigencias de entrega al doble y reduce los plazos a la mitad. Tu sistema psicofísico se ancla de forma espontánea en:',
    opciones: [
      { label: 'Soportar la carga: Sostener el ritmo, duplicar las horas de esfuerzo y trabajar de manera mecánica sacrificando el descanso.', pilar: 'P7' },
      { label: 'Velocidad reactiva: Tomar decisiones viscerales sobre la marcha, acelerar el motor físico y ejecutar de manera impulsiva.', pilar: 'P8' },
      { label: 'Cinismo defensivo: Ridiculizar la exigencia de los líderes, usar el humor negro ante el desastre y restarle solemnidad al plazo.', pilar: 'P6' },
      { label: 'Distancia analítica: Detener el ritmo de producción, aislarme del ruido operativo y buscar claridad conceptual sobre el panorama completo.', pilar: 'P4' }
    ]
  },
  {
    id: 8,
    fase: 'activacion',
    tipo: 'eleccion',
    texto: 'Te encuentras atrapado en una etapa donde la rutina se ha vuelto monótona, predecible y carente de estímulos reales, pero no puedes salir debido a contratos vigentes. Tu inercia base es:',
    opciones: [
      { label: 'Optimización micro: Organizar minuciosamente mi escritorio, mis carpetas digitales y las variables que dependen estrictamente de mí.', pilar: 'P1' },
      { label: 'Mutación perimetral: Cambiar constantemente de estilo visual, modificar mis horarios o alternar mis rutas físicas de manera aleatoria.', pilar: 'P2' },
      { label: 'Soporte colectivo: Enfocar mi energía en fortalecer los lazos de reciprocidad, armar reuniones informales y cuidar a mi red.', pilar: 'P3' },
      { label: 'Persistencia dura: Aceptar el aburrimiento como parte del proceso, aguantar el desgaste diario de manera estoica y cumplir el horario.', pilar: 'P7' }
    ]
  },

  // ===== FASE II: COSTO ENERGÉTICO (8 preguntas, escala 1-4) =====
  { id: 9,  fase: 'costo', tipo: 'escala', arquetipoId: 'P1', texto: 'Diseñar metodologías de orden, desglosar datos, estructurar presupuestos y planificar variables logísticas a mediano plazo.' },
  { id: 10, fase: 'costo', tipo: 'escala', arquetipoId: 'P2', texto: 'Cerrar ciclos de forma abrupta, abandonar identidades u objetivos obsoletos y mudar de entorno físico sin mirar atrás.' },
  { id: 11, fase: 'costo', tipo: 'escala', arquetipoId: 'P3', texto: 'Mostrar fragilidad ante otros, pedir ayuda explícita, delegar el control y depender del soporte de la red social.' },
  { id: 12, fase: 'costo', tipo: 'escala', arquetipoId: 'P4', texto: 'Mantenerme inaccesible, guardar silencio estratégico, apagar notificaciones y aislarme del ruido para buscar claridad mental.' },
  { id: 13, fase: 'costo', tipo: 'escala', arquetipoId: 'P5', texto: 'Permitirme habitar la tristeza de una pérdida, procesar el dolor del luto de forma consciente y transmutar la crisis en significado.' },
  { id: 14, fase: 'costo', tipo: 'escala', arquetipoId: 'P6', texto: 'Implementar la sátira, la ironía corrosiva o el sarcasmo frente a la adversidad extrema para restarle poder al sufrimiento.' },
  { id: 15, fase: 'costo', tipo: 'escala', arquetipoId: 'P7', texto: 'Persistir de manera monótona en una tarea pesada, soportar el desgaste físico y cumplir el deber estando exhausto.' },
  { id: 16, fase: 'costo', tipo: 'escala', arquetipoId: 'P8', texto: 'Tomar decisiones sobre la marcha con las tripas, actuar de forma veloz y asumir riesgos viscerales antes de tener datos puros.' },

  // ===== FASE III: FLEXIBILIDAD (8 preguntas, eleccion A-D) =====
  {
    id: 17,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Te encuentras en una encrucijada crítica y la situación actual te obliga a inyectarle un solo recurso al problema para evitar el colapso definitivo. Solo puedes elegir uno:',
    opciones: [
      { label: 'Más control: Mayor capacidad para organizar las variables, medir los datos y predecir el comportamiento del sistema.', pilar: 'P1' },
      { label: 'Más libertad: Mayor margen para cambiar de rumbo, romper acuerdos y desatender la inercia del plan original.', pilar: 'P2' },
      { label: 'Más apoyo: Mayor respaldo relacional, reciprocidad humana y colaboradores operando en bloque conmigo.', pilar: 'P3' },
      { label: 'Más tiempo para pensar: Un espacio de aislamiento radical para tomar distancia conceptual y analizar el trasfondo del caos.', pilar: 'P4' }
    ]
  },
  {
    id: 18,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'La herramienta estratégica que más has utilizado durante esta crisis acaba de fallar de manera rotunda. El entorno te prohíbe volver a implementarla para resolver este problema. ¿Qué haces?',
    opciones: [
      { label: 'Abandonar los objetivos originales del proyecto y buscar un territorio o mercado completamente diferente de manera inmediata.', pilar: 'P2' },
      { label: 'Romper mi postura de autosuficiencia individual, tragarme el orgullo y pedir ayuda inmediata a mi red humana.', pilar: 'P3' },
      { label: 'Suspender toda actividad operativa, recluirme en el hermetismo y esperar de manera contemplativa a recuperar nitidez mental.', pilar: 'P4' },
      { label: 'Duplicar la tenacidad sobre la misma posición, apretar los dientes y aguantar el castigo con más fuerza estoica.', pilar: 'P7' }
    ]
  },
  {
    id: 19,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Un colapso imprevisto borra tus recursos financieros, tus herramientas materiales y tu estatus profesional en un solo día. ¿Qué es lo único que te aseguras de conservar intacto en tu interior?',
    opciones: [
      { label: 'Mi conocimiento técnico: Mi capacidad analítica y metodológica para volver a diseñar un proceso eficiente desde cero.', pilar: 'P1' },
      { label: 'Mi agilidad camaleónica: Mi destreza para asimilar el cambio drástico y adaptarme a cualquier escenario hostil.', pilar: 'P2' },
      { label: 'Mis relaciones estratégicas: Mi red de contactos reales, la lealtad de mi tribu y el lazo con mi comunidad humana.', pilar: 'P3' },
      { label: 'Mi resistencia obrera: Mi fortaleza moral para morder el polvo, tolerar la fatiga del esfuerzo diario y no quebrarme.', pilar: 'P7' }
    ]
  },
  {
    id: 20,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Una situación compleja, legal o relacional en tu vida se extiende por más de un año sin mostrar ninguna señal de resolución. Para evitar el colapso psicológico, decides anclar tu conducta diaria en:',
    opciones: [
      { label: 'El orden micro: Mantener rutinas rígidas de limpieza, organización de archivos y planificación del día a día.', pilar: 'P1' },
      { label: 'El lazo comunitario: Apoyarme constantemente en la reciprocidad grupal, las reuniones informales y el soporte colectivo.', pilar: 'P3' },
      { label: 'El procesamiento del duelo: Aceptar de frente la belleza trágica de la situación, habitar la crisis y asimilar la pérdida.', pilar: 'P5' },
      { label: 'La persistencia estoica: Aguantar el desgaste cotidiano por mero compromiso moral, dignidad íntima e integridad personal.', pilar: 'P7' }
    ]
  },
  {
    id: 21,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Te percatas de que tu círculo de confianza (socios, pareja, amigos) se encuentra demasiado desgastado para darte contención en esta etapa. Al quedarte desamparado a nivel humano, tu psicología migra hacia:',
    opciones: [
      { label: 'El refugio logístico: Enfocar el 100% de mi atención diaria en optimizar mi código, mis números y mis procesos analíticos.', pilar: 'P1' },
      { label: 'El aislamiento hermético: Cortar la comunicación con el exterior, recluirme en mis lecturas y procesar las cosas en soledad.', pilar: 'P4' },
      { label: 'La insensibilización satírica: Usar el sarcasmo letal, la ironía corrosiva y el humor negro para anular el impacto del desamparo.', pilar: 'P6' },
      { label: 'La fuerza bruta afectiva: Ponerme a trabajar de forma mecánica con las manos o el cuerpo hasta cansar los músculos y callar la mente.', pilar: 'P7' }
    ]
  },
  {
    id: 22,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Te encuentras atrapado en una corporación, familia o dinámica legal sumamente rígida que limita tus movimientos y te impone normas obsoletas que no puedes modificar. Tu mecanismo de supervivencia es:',
    opciones: [
      { label: 'El camuflaje elusivo: Fingir obediencia absoluta con las reglas del lugar mientras planifico en secreto una fuga radical.', pilar: 'P2' },
      { label: 'El retiro conceptual: Desconectarme mentalmente del ruido del entorno y refugiarme en mis abstracciones intelectuales particulares.', pilar: 'P4' },
      { label: 'La deconstrucción satírica: Utilizar el humor ácido, la burla discreta y el cinismo táctico para restarle autoridad a los líderes.', pilar: 'P6' },
      { label: 'La descarga dionisíaca: Buscar espacios intermitentes de alta intensidad corporal, velocidad, juego o excesos para liberar la presión.', pilar: 'P8' }
    ]
  },
  {
    id: 23,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'En mitad del estancamiento, experimentas una crisis existencial profunda: nada de lo que ejecutas parece tener valor real y la monotonía te abruma. Para romper esta parálisis, te obligas a:',
    opciones: [
      { label: 'Forzar un quiebre identitario: Modificar drásticamente mis rutinas, cambiar de código y buscar un escenario desconocido.', pilar: 'P2' },
      { label: 'Buscar catarsis profunda: Conectarme con el dolor íntimo, escribir sobre mis grietas y transmutar la herida en significado.', pilar: 'P5' },
      { label: 'Activar la ironía existencial: Reírme del absurdo de la condición humana, adoptar un cinismo saludable y no tomarme nada en serio.', pilar: 'P6' },
      { label: 'Operar por impulso instintivo: Tomar riesgos calculados, mover el cuerpo, acelerar la marcha y actuar antes de que la mente me paralice.', pilar: 'P8' }
    ]
  },
  {
    id: 24,
    fase: 'flexibilidad',
    tipo: 'eleccion',
    texto: 'Un problema grave, hostil y con consecuencias críticas a nivel económico o legal exige una definición en las próximas horas. Tu sistema se ve forzado a:',
    opciones: [
      { label: 'El análisis frío de procesos: Sentarme a estudiar las reglas del juego, desglosar contratos y buscar el vacío metodológico de forma quirúrgica.', pilar: 'P1' },
      { label: 'La negociación relacional: Utilizar mis contactos clave, activar influencias personales y resolver la crisis mediante diplomacia cool.', pilar: 'P3' },
      { label: 'La confrontación directa: Dar la cara de inmediato, de forma ruda y sin intermediarios burocráticos, asumiendo la responsabilidad del choque.', pilar: 'P7' },
      { label: 'El movimiento de escape: Mandar el asunto al demonio, asumir la pérdida financiera y enfocar mi energía en levantar una operación diferente.', pilar: 'P2' }
    ]
  },

  // ===== FASE IV: SOMBRA Y BLOQUEO (4 preguntas, eleccion A-H) =====
  {
    id: 25,
    fase: 'sombra',
    tipo: 'eleccion',
    texto: '¿Cuál de las siguientes operaciones psicológicas te parece la MENOS útil, efectiva o relevante para resolver un verdadero problema de vida?',
    opciones: [
      { label: 'Planificar: Organizar variables, estructurar agendas y diseñar sistemas lógicos.', pilar: 'P1' },
      { label: 'Adaptarse: Cambiar de piel, cerrar ciclos con frialdad y mudar de identidad.', pilar: 'P2' },
      { label: 'Pedir ayuda: Buscar contención humana, mostrar vulnerabilidad y apoyarse en la red social.', pilar: 'P3' },
      { label: 'Reflexionar: Detener el motor, tomar distancia conceptual y guardar silencio.', pilar: 'P4' },
      { label: 'Sentir el dolor: Habitar la tristeza, procesar el duelo íntimo y transmutar la herida.', pilar: 'P5' },
      { label: 'Usar humor: Utilizar la ironía defensiva, el sarcasmo y reírse del desastre.', pilar: 'P6' },
      { label: 'Resistir: Morder el polvo, aguantar la carga estoicamente y persistir con cansancio.', pilar: 'P7' },
      { label: 'Actuar: Operar por impulso instintivo, velocidad corporal y riesgo visceral.', pilar: 'P8' }
    ]
  },
  {
    id: 26,
    fase: 'sombra',
    tipo: 'eleccion',
    texto: '¿Cuál de las siguientes conductas o estados mentales te genera más rechazo, incomodidad o fastidio interno cuando la experimentas en ti mismo?',
    opciones: [
      { label: 'La necesidad obsesiva de control, orden de procesos e incapacidad para relajarme.', pilar: 'P1' },
      { label: 'La inconstancia crónica, la inestabilidad de objetivos y la tendencia a huir de los lugares.', pilar: 'P2' },
      { label: 'La dependencia emocional de otros, la fragilidad expuesta y la necesidad de aprobación grupal.', pilar: 'P3' },
      { label: 'La pasividad contemplativa, la inmovilidad aparente y el aislamiento del radar social.', pilar: 'P4' },
      { label: 'La rumiación melancólica, el apego al sufrimiento pasado y la densificación dramática de la crisis.', pilar: 'P5' },
      { label: 'El desapego cínico, la burla constante de las cosas serias y la incapacidad para ser solemne.', pilar: 'P6' },
      { label: 'La terquedad estoica, el autosacrificio innecesario y el aguantar castigo sin buscar salidas.', pilar: 'P7' },
      { label: 'La impulsividad animal, la falta de planeación técnica y el actuar de forma desordenada con las tripas.', pilar: 'P8' }
    ]
  },
  {
    id: 27,
    fase: 'sombra',
    tipo: 'eleccion',
    texto: '¿De cuál de estas herramientas estratégicas tiendes a alejarte, postergar o evadir de forma sistemática, incluso cuando eres consciente en tu frío análisis de que podría ayudarte a destrabar tu situación actual?',
    opciones: [
      { label: 'Sentarme a trazar un presupuesto rígido, un mapa de procesos técnicos o un calendario operativo.', pilar: 'P1' },
      { label: 'Ejecutar un quiebre radical de planes, cerrar un ciclo obsoleto y mudar de entorno físico.', pilar: 'P2' },
      { label: 'Romper el orgullo individualista, hacer una llamada incómoda y pedir ayuda o perdón de manera directa.', pilar: 'P3' },
      { label: 'Apagar los dispositivos, cancelar compromisos externos y quedarme en absoluto silencio a solas.', pilar: 'P4' },
      { label: 'Detener la actividad mecánica para llorar mi pérdida, asimilar el luto de lo roto y escribir sobre mi herida.', pilar: 'P5' },
      { label: 'Desdramatizar mis problemas cotidianos mediante la deconstrucción humorística o la sátira de mí mismo.', pilar: 'P6' },
      { label: 'Ponerme a trabajar de manera rutinaria y monótona, aguantando el desgaste sin buscar soluciones mágicas.', pilar: 'P7' },
      { label: 'Tomar un riesgo instintivo inmediato, mover el cuerpo, jugar y actuar antes de calcular las consecuencias.', pilar: 'P8' }
    ]
  },
  {
    id: 28,
    fase: 'sombra',
    tipo: 'eleccion',
    texto: '¿Cuál de las siguientes cualidades te produce mayor incomodidad, escepticismo o rechazo intelectual cuando la observas de forma evidente en personas que el sistema cataloga como "exitosas"?',
    opciones: [
      { label: 'Su rigidez metodológica, su obsesión por las métricas organizacionales y su hiper-control corporativo.', pilar: 'P1' },
      { label: 'Su descaro para cambiar de opinión, traicionar discursos previos y reinventar su marca sin lealtad a su pasado.', pilar: 'P2' },
      { label: 'Su dependencia de las relaciones públicas, su necesidad de aplauso masivo y el uso constante de su red social.', pilar: 'P3' },
      { label: 'Su soberbia intelectual elusiva, su distanciamiento hermético y su rechazo a participar del ruido del mercado.', pilar: 'P4' },
      { label: 'Su explotación del drama personal, el exhibicionismo de sus crisis íntimas y la comercialización de su dolor.', pilar: 'P5' },
      { label: 'Su falta de seriedad corporativa, su ligereza para tratar asuntos críticos y el uso constante del sarcasmo.', pilar: 'P6' },
      { label: 'Su orgullo obrero por el autosacrificio, el presumir cuántas horas trabajan y el glorificar el desgaste físico.', pilar: 'P7' },
      { label: 'Su impulsividad audaz, el operar por pura energía biológica visceral y el tomar riesgos financieros con las tripas.', pilar: 'P8' }
    ]
  },

  // ===== FASE V: REACTIVOS ESPEJO (4 preguntas, escala 1-5) =====
  { id: 29, fase: 'espejo', tipo: 'escala', arquetipoId: 'P3', texto: 'Me considero una persona sumamente independiente y autosuficiente para operar ante las crisis de la vida diaria.' },
  { id: 30, fase: 'espejo', tipo: 'escala', arquetipoId: 'P3', texto: 'Cuando las circunstancias de mi entorno empeoran críticamente, experimento la necesidad imperiosa de buscar apoyo relacional.' },
  { id: 31, fase: 'espejo', tipo: 'escala', arquetipoId: 'P8', texto: 'Prefiero ejecutar de inmediato una acción imperfecta antes que quedarme esperando a tener todas las variables controladas por el análisis.' },
  { id: 32, fase: 'espejo', tipo: 'escala', arquetipoId: 'P4', texto: 'Prefiero observar el panorama completo con distancia y frialdad analítica antes de realizar cualquier movimiento operativo.' },

  // ===== VALIDACIÓN FINAL (2 preguntas, eleccion A-H) =====
  {
    id: 33,
    fase: 'validacion',
    tipo: 'eleccion',
    texto: 'Imagina que mañana por la mañana debes resolver obligatoriamente la crisis, el estancamiento o el problema que te trajo hoy aquí usando exclusivamente uno de estos recursos psicológicos. ¿Cuál NO elegirías bajo ninguna circunstancia, prefiriendo prolongar el conflicto antes que activar esa herramienta?',
    opciones: [
      { label: 'Control: Sentarme a planificar variables, cuadrar números, ordenar horarios y estructurar un plan rígido.', pilar: 'P1' },
      { label: 'Transformación: Romper con mi escenario actual, cerrar el ciclo de golpe, cambiar de código y reinventarme en otra parte.', pilar: 'P2' },
      { label: 'Comunidad: Romper el aislamiento, tragarme el orgullo, pedir ayuda humana y depender de la lealtad grupal.', pilar: 'P3' },
      { label: 'Retiro: Suspender la actividad operativa, aislarme en absoluto hermetismo acústico y quedarme en silencio contemplativo.', pilar: 'P4' },
      { label: 'Duelo: Detener el ruido mental para llorar mis pérdidas, habitar la melancolía de lo roto y procesar la herida en canal.', pilar: 'P5' },
      { label: 'Humor: Desmitificar mi tragedia mediante el sarcasmo letal, la ironía corrosiva y reír de mi propia ruina cotidiana.', pilar: 'P6' },
      { label: 'Resistencia: Ponerme a trabajar de forma monótona y ruda, morder el polvo, soportar el cansancio y aguantar la carga a largo plazo.', pilar: 'P7' },
      { label: 'Vitalidad: Actuar de forma visceral por impulso corporal, jugar, tomar velocidad y ejecutar riesgos sin calcular consecuencias.', pilar: 'P8' }
    ]
  },
  {
    id: 34,
    fase: 'validacion',
    tipo: 'eleccion',
    texto: 'Si una autoridad absoluta pudiera regalarte en este instante uno de estos recursos psicológicos desarrollado en su máxima expresión biológica, ¿cuál consideras que transformaría más profundamente tu realidad actual y destrabaría tu futuro?',
    opciones: [
      { label: 'Control: Una claridad estratégica absoluta para estructurar sistemas lógicos impecables y predictivos.', pilar: 'P1' },
      { label: 'Transformación: El coraje camaleónico para destruir identidades obsoletas y mutar de piel sin resistencia emocional.', pilar: 'P2' },
      { label: 'Comunidad: Una competencia relacional magnética para unificar comunidades, sanar lazos y operar en bloque cohesionado.', pilar: 'P3' },
      { label: 'Retiro: Una soberbiosa paz mental e íntima para aislarme del ruido del mercado y recuperar nitidez conceptual.', pilar: 'P4' },
      { label: 'Duelo: La capacidad alquímica para transmutar el dolor denso de las heridas pasadas en arte, potencia y significado profundo.', pilar: 'P5' },
      { label: 'Humor: Un bisturí de ironía iconoclasta tan afilado que relativice cualquier drama externo, quitándole poder al sufrimiento.', pilar: 'P6' },
      { label: 'Resistencia: Una fortaleza estoica e incorruptible para tolerar fatigas extremas, soportar pesos y continuar de pie pase lo que pase.', pilar: 'P7' },
      { label: 'Vitalidad: Un impulso animal e instintivo de energía biológica pura para jugar, acelerar la marcha y disfrutar del riesgo.', pilar: 'P8' }
    ]
  }
];

export default QUESTIONS;