<template>
  <div class="min-h-screen bg-folsom text-loriga">
    <!-- Header -->
    <nav class="fixed top-0 w-full z-50 bg-folsom/90 backdrop-blur-md border-b border-outline-variant/20">
      <div class="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
        <router-link to="/" class="font-display text-2xl tracking-tighter text-solstis italic uppercase">
          ROCKYOURSELF
        </router-link>
        <div class="font-mono text-solstis text-sm">
          FASE {{ faseActual + 1 }} / 6
        </div>
      </div>
    </nav>

    <div class="pt-24 pb-20 px-5 md:px-16 max-w-[900px] mx-auto">
      <!-- Progress -->
      <div class="mb-12">
        <div class="flex justify-between mb-2">
          <span class="font-mono text-xs tracking-[0.1em] uppercase text-solstis">
            {{ fases[faseActual].titulo }}
          </span>
          <span class="font-mono text-xs text-halford">
            {{ progresoFase }} / {{ fases[faseActual].preguntas.length }}
          </span>
        </div>
        <div class="h-1 bg-surface-container-high rounded-full overflow-hidden">
          <div 
            class="h-full bg-solstis transition-all duration-500"
            :style="`width: ${(progresoFase / fases[faseActual].preguntas.length) * 100}%`"
          ></div>
        </div>
      </div>

      <!-- Pregunta actual -->
      <div v-if="preguntaActual" class="reveal active">
        <div class="mb-8">
          <span class="font-mono text-xs text-halford mb-2 block">
            PREGUNTA {{ preguntaGlobalIndex + 1 }} / 34
          </span>
          <h2 class="font-display text-2xl md:text-3xl text-loriga leading-tight">
            {{ preguntaActual.titulo }}
          </h2>
          <p v-if="preguntaActual.descripcion" class="font-body text-base text-halford mt-4">
            {{ preguntaActual.descripcion }}
          </p>
        </div>

        <!-- Opciones -->
        <div class="space-y-4">
          <button
            v-for="opcion in preguntaActual.opciones"
            :key="opcion.id"
            @click="seleccionarOpcion(opcion.id)"
            class="w-full text-left p-6 border border-outline-variant/30 rounded-lg transition-all duration-300 hover:border-solstis/50 hover:bg-surface-container/50 group"
            :class="{ 
              'border-solstis bg-solstis/10': respuestaSeleccionada === opcion.id,
              'border-outline-variant/30': respuestaSeleccionada !== opcion.id
            }"
          >
            <div class="flex items-start gap-4">
              <div 
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300"
                :class="respuestaSeleccionada === opcion.id ? 'border-solstis bg-solstis text-folsom' : 'border-halford/30 text-halford'"
              >
                <span class="font-mono text-sm font-bold">{{ opcion.id }}</span>
              </div>
              <div class="flex-1">
                <p class="font-body text-base text-loriga group-hover:text-solstis transition-colors">
                  {{ opcion.texto }}
                </p>
                <span v-if="opcion.pilar" class="font-mono text-xs text-halford/60 mt-1 block">
                  {{ getPilarLabel(opcion.pilar) }}
                </span>
              </div>
            </div>
          </button>
        </div>

        <!-- Escala 1-4 o 1-5 para fases 2 y 5 -->
        <div v-if="preguntaActual.tipo === 'costo' || preguntaActual.tipo === 'scale'" class="mt-8">
          <div class="flex justify-between items-center gap-2">
            <button
              v-for="n in preguntaActual.tipo === 'costo' ? 4 : 5"
              :key="n"
              @click="seleccionarOpcion(n.toString())"
              class="flex-1 py-4 border border-outline-variant/30 rounded-lg font-mono text-lg transition-all duration-300 hover:border-solstis hover:text-solstis"
              :class="respuestaSeleccionada === n.toString() ? 'border-solstis bg-solstis/10 text-solstis' : 'text-halford'"
            >
              {{ n }}
            </button>
          </div>
          <div class="flex justify-between mt-2 text-xs font-mono text-halford/60">
            <span>{{ preguntaActual.tipo === 'costo' ? 'Me energiza' : 'Total desacuerdo' }}</span>
            <span>{{ preguntaActual.tipo === 'costo' ? 'Me vacía' : 'Total acuerdo' }}</span>
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <div class="flex justify-between mt-12">
        <button
          v-if="faseActual > 0 || preguntaIndex > 0"
          @click="anterior"
          class="px-6 py-3 border border-halford/30 text-halford font-body text-sm hover:border-solstis hover:text-solstis transition-all"
        >
          ← Anterior
        </button>
        <button
          v-if="respuestaSeleccionada"
          @click="siguiente"
          class="px-8 py-3 bg-solstis text-folsom font-body text-sm hover:scale-105 transition-all gold-glow interactive-button"
          :disabled="quizStore.loading"
        >
          <span class="button-glow"></span>
          <span class="relative z-20">
            {{ esUltimaPregunta ? (quizStore.loading ? 'Analizando...' : 'Ver mi diagnóstico →') : 'Siguiente →' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'
import { PILARES_INFO } from '@raven/shared-types'

const router = useRouter()
const quizStore = useQuizStore()

const faseActual = ref(0)
const preguntaIndex = ref(0)

// Definición de las 6 fases + 2 filtros = 34 preguntas
const fases = [
  {
    titulo: 'FASE 0 — CRONOLOGÍA',
    descripcion: 'Filtro Temporal de Desgaste',
    preguntas: [
      {
        id: 0,
        titulo: '¿Cuánto tiempo llevas sintiendo de manera continua que tu situación o proyecto principal se encuentra bloqueado, estancado o bajo una presión que no logras resolver?',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Menos de una semana.', pilar: 'P1' },
          { id: 'B', texto: 'Entre 1 y 4 semanas.', pilar: 'P2' },
          { id: 'C', texto: 'Entre 1 y 3 meses.', pilar: 'P3' },
          { id: 'D', texto: 'Entre 3 y 12 meses.', pilar: 'P4' },
          { id: 'E', texto: 'Más de un año.', pilar: 'P5' }
        ]
      }
    ]
  },
  {
    titulo: 'FASE I — ACTIVACIÓN AUTOMÁTICA',
    descripcion: 'Conductas Desnudas ante el colapso',
    preguntas: [
      {
        id: 1,
        titulo: 'Colapso financiero inmediato. Tu principal fuente de ingresos sufre un recorte del 80% y te quedan exactamente dos semanas de margen operativo. La conducta que aparece de manera automática en las primeras 24 horas es:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Abrir la computadora, generar hojas de cálculo, desglosar gastos fijos y trazar un cronograma de recortes.', pilar: 'P1' },
          { id: 'B', texto: 'Llamar a clientes antiguos, programar reuniones de emergencia y buscar socios comerciales inmediatos.', pilar: 'P3' },
          { id: 'C', texto: 'Cancelar todas las suscripciones, guardar los proyectos actuales en una carpeta y salir a caminar durante horas en silencio.', pilar: 'P4' },
          { id: 'D', texto: 'Diseñar un producto o servicio diferente, cambiar de nicho de mercado y lanzar una oferta piloto en redes esa misma noche.', pilar: 'P2' }
        ]
      },
      {
        id: 2,
        titulo: 'Quiebre de un acuerdo clave. Un socio estratégico o un colaborador indispensable te notifica que abandona el proyecto a mitad de la ejecución más crítica. Tu primera acción física es:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Sentarte a solas a redactar un documento analítico donde se enumeren las fallas del proceso y las responsabilidades legales.', pilar: 'P1' },
          { id: 'B', texto: 'Modificar las metas del mes, ajustar el plan general a mis capacidades individuales actuales y continuar operando sin sustituto.', pilar: 'P2' },
          { id: 'C', texto: 'Marcar el teléfono de mi red de contactos de confianza para buscar un relevo inmediato o pedir respaldo operativo.', pilar: 'P3' },
          { id: 'D', texto: 'Apagar el monitor, cancelar las llamadas del día y recluirme en mi espacio sin emitir ninguna respuesta inmediata.', pilar: 'P4' }
        ]
      },
      {
        id: 3,
        titulo: 'Fricción por estancamiento operativo. Llegas al viernes por la tarde tras una semana donde absolutamente todo lo que intentaste ejecutar fue bloqueado por la burocracia, errores ajenos o factores externos. Al cerrar la puerta, tú:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Abres la agenda y planificas jornadas dobles de trabajo para el fin de semana con el fin de corregir el desfase.', pilar: 'P7' },
          { id: 'B', texto: 'Buscas un estímulo corporal intenso de manera inmediata: entrenamiento de alta carga, consumo directo, alcohol o sexo.', pilar: 'P8' },
          { id: 'C', texto: 'Te sientas en silencio a procesar la frustración, permitiéndote conectar con el cansancio o escribir sobre la herida del fracaso.', pilar: 'P5' },
          { id: 'D', texto: 'Envías un meme ácido al chat del equipo, haces un comentario satírico sobre la situación y te desentiendes del asunto.', pilar: 'P6' }
        ]
      },
      {
        id: 4,
        titulo: 'Parálisis de equipo. El grupo humano que lideras o al que perteneces entra en un bucle de discusiones estériles y acusaciones mutuas ante un error grave:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Intervengo para delimitar las tareas individuales, fijar un nuevo organigrama lógico y exigir el cumplimiento de plazos.', pilar: 'P1' },
          { id: 'B', texto: 'Propongo suspender las reuniones actuales, disolver la mesa de trabajo y abordar el problema desde una metodología nueva.', pilar: 'P2' },
          { id: 'C', texto: 'Interrumpo la discusión para hablar individualmente con los afectados, calmar las fricciones y restaurar la cohesión del grupo.', pilar: 'P3' },
          { id: 'D', texto: 'Me retiro físicamente de la mesa o apago la cámara para observar la interacción desde fuera, sin emitir opinión alguna.', pilar: 'P4' }
        ]
      },
      {
        id: 5,
        titulo: 'Impacto de una mala noticia personal. Recibes una notificación personal de alto impacto emocional negativo en mitad de tu jornada laboral más saturada. Tu cuerpo ejecuta:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Bloquear el impacto de manera inmediata, colocar el asunto en una carpeta mental y continuar con las tareas del día de forma mecánica.', pilar: 'P7' },
          { id: 'B', texto: 'Abandonar el lugar de trabajo de inmediato, cambiar de entorno físico y buscar una actividad distractora de alta velocidad.', pilar: 'P8' },
          { id: 'C', texto: 'Buscar un espacio aislado o un cubículo vacío para llorar, asimilar el golpe y procesar el malestar de forma consciente.', pilar: 'P5' },
          { id: 'D', texto: 'Utilizar una respuesta sarcástica o un comentario cínico ante el entorno para restarle gravedad al impacto y seguir operando.', pilar: 'P6' }
        ]
      },
      {
        id: 6,
        titulo: 'Ruina de reputación pública. Un error grave en tu desempeño operativo o en tu comunicación se expone públicamente ante tus pares o clientes. Tu conducta es:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Desglosar técnicamente el error, emitir un informe de control de daños con datos puros y corregir la falla del sistema.', pilar: 'P1' },
          { id: 'B', texto: 'Dar por terminada la relación con ese nicho o mercado, cambiar el nombre del proyecto e iniciar un desarrollo diferente.', pilar: 'P2' },
          { id: 'C', texto: 'Convocar a mis aliados y comunidad más cercana para recibir su respaldo y validar la contención del grupo humano.', pilar: 'P3' },
          { id: 'D', texto: 'Soportar el impacto de las críticas en silencio, asumir la culpa operativa completa y usar el desierto para aprender de la falla.', pilar: 'P5' }
        ]
      },
      {
        id: 7,
        titulo: 'Ultimátum logístico. El entorno incrementa las exigencias de entrega al doble y reduce los plazos a la mitad. Tu sistema psicofísico se ancla de forma espontánea en:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Soportar la carga: Sostener el ritmo, duplicar las horas de esfuerzo y trabajar de manera mecánica sacrificando el descanso.', pilar: 'P7' },
          { id: 'B', texto: 'Velocidad reactiva: Tomar decisiones viscerales sobre la marcha, acelerar el motor físico y ejecutar de manera impulsiva.', pilar: 'P8' },
          { id: 'C', texto: 'Cinismo defensivo: Ridiculizar la exigencia de los líderes, usar el humor negro ante el desastre y restarle solemnidad al plazo.', pilar: 'P6' },
          { id: 'D', texto: 'Distancia analítica: Detener el ritmo de producción, aislarme del ruido operativo y buscar claridad conceptual sobre el panorama completo.', pilar: 'P4' }
        ]
      },
      {
        id: 8,
        titulo: 'Desgaste por inercia. Te encuentras atrapado en una etapa donde la rutina se ha vuelto monótona, predecible y carente de estímulos reales, pero no puedes salir debido a contratos vigentes. Tu inercia base es:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Optimización micro: Organizar minuciosamente mi escritorio, mis carpetas digitales y las variables que dependen estrictamente de mí.', pilar: 'P1' },
          { id: 'B', texto: 'Mutación perimetral: Cambiar constantemente de estilo visual, modificar mis horarios o alternar mis rutas físicas de manera aleatoria.', pilar: 'P2' },
          { id: 'C', texto: 'Soporte colectivo: Enfocar mi energía en fortalecer los lazos de reciprocidad, armar reuniones informales y cuidar a mi red.', pilar: 'P3' },
          { id: 'D', texto: 'Persistencia dura: Aceptar el aburrimiento como parte del proceso, aguantar el desgaste diario de manera estoica y cumplir el horario.', pilar: 'P7' }
        ]
      }
    ]
  },
  {
    titulo: 'FASE II — COSTO ENERGÉTICO',
    descripcion: 'Fricción del Recurso (1=Me energiza / 4=Me vacía)',
    preguntas: [
      { id: 9, titulo: 'Diseñar metodologías de orden, desglosar datos, estructurar presupuestos y planificar variables logísticas a mediano plazo.', tipo: 'costo', pilar: 'P1' },
      { id: 10, titulo: 'Cerrar ciclos de forma abrupta, abandonar identidades u objetivos obsoletos y mudar de entorno físico sin mirar atrás.', tipo: 'costo', pilar: 'P2' },
      { id: 11, titulo: 'Mostrar fragilidad ante otros, pedir ayuda explícita, delegar el control y depender del soporte de la red social.', tipo: 'costo', pilar: 'P3' },
      { id: 12, titulo: 'Mantenerme inaccesible, guardar silencio estratégico, apagar notificaciones y aislarme del ruido para buscar claridad mental.', tipo: 'costo', pilar: 'P4' },
      { id: 13, titulo: 'Permitirme habitar la tristeza de una pérdida, procesar el dolor del luto de forma consciente y transmutar la crisis en significado.', tipo: 'costo', pilar: 'P5' },
      { id: 14, titulo: 'Implementar la sátira, la ironía corrosiva o el sarcasmo frente a la adversidad extrema para restarle poder al sufrimiento.', tipo: 'costo', pilar: 'P6' },
      { id: 15, titulo: 'Persistir de manera monótona en una tarea pesada, soportar el desgaste físico y cumplir el deber estando exhausto.', tipo: 'costo', pilar: 'P7' },
      { id: 16, titulo: 'Tomar decisiones sobre la marcha con las tripas, actuar de forma veloz y asumir riesgos viscerales antes de tener datos puros.', tipo: 'costo', pilar: 'P8' }
    ]
  },
  {
    titulo: 'FASE III — FLEXIBILIDAD',
    descripcion: 'Dilemas de Migración Forzada',
    preguntas: [
      {
        id: 17,
        titulo: 'Dilema de escasez absoluta. Te encuentras en una encrucijada crítica y la situación actual te obliga a inyectarle un solo recurso al problema para evitar el colapso definitivo. Solo puedes elegir uno:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Más control: Mayor capacidad para organizar las variables, medir los datos y predecir el comportamiento del sistema.', pilar: 'P1' },
          { id: 'B', texto: 'Más libertad: Mayor margen para cambiar de rumbo, romper acuerdos y desatender la inercia del plan original.', pilar: 'P2' },
          { id: 'C', texto: 'Más apoyo: Mayor respaldo relacional, reciprocidad humana y colaboradores operando en bloque conmigo.', pilar: 'P3' },
          { id: 'D', texto: 'Más tiempo para pensar: Un espacio de aislamiento radical para tomar distancia conceptual y analizar el trasfondo del caos.', pilar: 'P4' }
        ]
      },
      {
        id: 18,
        titulo: 'Bloqueo de repetición táctica. La herramienta estratégica que más has utilizado durante esta crisis acaba de fallar de manera rotunda. El entorno te prohíbe volver a implementarla. ¿Qué haces?',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Abandonar los objetivos originales del proyecto y buscar un territorio o mercado completamente diferente de manera inmediata.', pilar: 'P2' },
          { id: 'B', texto: 'Romper mi postura de autosuficiencia individual, tragarme el orgullo y pedir ayuda inmediata a mi red humana.', pilar: 'P3' },
          { id: 'C', texto: 'Suspender toda actividad operativa, recluirme en el hermetismo y esperar de manera contemplativa a recuperar nitidez mental.', pilar: 'P4' },
          { id: 'D', texto: 'Duplicar la tenacidad sobre la misma posición, apretar los dientes y aguantar el castigo con más fuerza estoica.', pilar: 'P7' }
        ]
      },
      {
        id: 19,
        titulo: 'Despojo total de capital. Un colapso imprevisto borra tus recursos financieros, tus herramientas materiales y tu estatus profesional en un solo día. ¿Qué es lo único que te aseguras de conservar intacto en tu interior?',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Mi conocimiento técnico: Mi capacidad analítica y metodológica para volver a diseñar un proceso eficiente desde cero.', pilar: 'P1' },
          { id: 'B', texto: 'Mi agilidad camaleónica: Mi destreza para asimilar el cambio drástico y adaptarme a cualquier escenario hostil.', pilar: 'P2' },
          { id: 'C', texto: 'Mis relaciones estratégicas: Mi red de contactos reales, la lealtad de mi tribu y el lazo con mi comunidad humana.', pilar: 'P3' },
          { id: 'D', texto: 'Mi resistencia obrera: Mi fortaleza moral para morder el polvo, tolerar la fatiga del esfuerzo diario y no quebrarme.', pilar: 'P7' }
        ]
      },
      {
        id: 20,
        titulo: 'El factor desgaste temporal extendido. Una situación compleja, legal o relacional en tu vida se extiende por más de un año sin mostrar ninguna señal de resolución. Para evitar el colapso psicológico, decides anclar tu conducta diaria en:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'El orden micro: Mantener rutinas rígidas de limpieza, organización de archivos y planificación del día a día.', pilar: 'P1' },
          { id: 'B', texto: 'El lazo comunitario: Apoyarme constantemente en la reciprocidad grupal, las reuniones informales y el soporte colectivo.', pilar: 'P3' },
          { id: 'C', texto: 'El procesamiento del duelo: Aceptar de frente la belleza trágica de la situación, habitar la crisis y asimilar la pérdida.', pilar: 'P5' },
          { id: 'D', texto: 'La persistencia estoica: Aguantar el desgaste cotidiano por mero compromiso moral, dignidad íntima e integridad personal.', pilar: 'P7' }
        ]
      },
      {
        id: 21,
        titulo: 'Quiebre de la red relacional. Te percatas de que tu círculo de confianza (socios, pareja, amigos) se encuentra demasiado desgastado para darte contención en esta etapa. Al quedarte desamparado a nivel humano, tu psicología migra hacia:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'El refugio logístico: Enfocar el 100% de mi atención diaria en optimizar mi código, mis números y mis procesos analíticos.', pilar: 'P1' },
          { id: 'B', texto: 'El aislamiento hermético: Cortar la comunicación con el exterior, recluirme en mis lecturas y procesar las cosas en soledad.', pilar: 'P4' },
          { id: 'C', texto: 'La insensibilización satírica: Usar el sarcasmo letal, la ironía corrosiva y el humor negro para anular el impacto del desamparo.', pilar: 'P6' },
          { id: 'D', texto: 'La fuerza bruta afectiva: Ponerme a trabajar de forma mecánica con las manos o el cuerpo hasta cansar los músculos y callar la mente.', pilar: 'P7' }
        ]
      },
      {
        id: 22,
        titulo: 'Estructura hiper-controlada asfixiante. Te encuentras atrapado en una corporación, familia o dinámica legal sumamente rígida que limita tus movimientos y te impone normas obsoletas que no puedes modificar. Tu mecanismo de supervivencia es:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'El camuflaje elusivo: Fingir obediencia absoluta con las reglas del lugar mientras planifico en secreto una fuga radical.', pilar: 'P2' },
          { id: 'B', texto: 'El retiro conceptual: Desconectarme mentalmente del ruido del entorno y refugiarme en mis abstracciones intelectuales particulares.', pilar: 'P4' },
          { id: 'C', texto: 'La deconstrucción satírica: Utilizar el humor ácido, la burla discreta y el cinismo táctico para restarle autoridad a los líderes.', pilar: 'P6' },
          { id: 'D', texto: 'La descarga dionisíaca: Buscar espacios intermitentes de alta intensidad corporal, velocidad, juego o excesos para liberar la presión.', pilar: 'P8' }
        ]
      },
      {
        id: 23,
        titulo: 'Vacío de significado. En mitad del estancamiento, experimentas una crisis existencial profunda: nada de lo que ejecutas parece tener valor real y la monotonía te abruma. Para romper esta parálisis, te obligas a:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Forzar un quiebre identitario: Modificar drásticamente mis rutinas, cambiar de código y buscar un escenario desconocido.', pilar: 'P2' },
          { id: 'B', texto: 'Buscar catarsis profunda: Conectarme con el dolor íntimo, escribir sobre mis grietas y transmutar la herida en significado.', pilar: 'P5' },
          { id: 'C', texto: 'Activar la ironía existencial: Reírme del absurdo de la condición humana, adoptar un cinismo saludable y no tomarme nada en serio.', pilar: 'P6' },
          { id: 'D', texto: 'Operar por impulso instintivo: Tomar riesgos calculados, mover el cuerpo, acelerar la marcha y actuar antes de que la mente me paralice.', pilar: 'P8' }
        ]
      },
      {
        id: 24,
        titulo: 'Emergencia de resolución inmediata. Un problema grave, hostil y con consecuencias críticas a nivel económico o legal exige una definición en las próximas horas. Tu sistema se ve forzado a:',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'El análisis frío de procesos: Sentarme a estudiar las reglas del juego, desglosar contratos y buscar el vacío metodológico de forma quirúrgica.', pilar: 'P1' },
          { id: 'B', texto: 'La negociación relacional: Utilizar mis contactos clave, activar influencias personales y resolver la crisis mediante diplomacia cool.', pilar: 'P3' },
          { id: 'C', texto: 'La confrontación directa: Dar la cara de inmediato, de forma ruda y sin intermediarios burocráticos, asumiendo la responsabilidad del choque.', pilar: 'P7' },
          { id: 'D', texto: 'El movimiento de escape: Mandar el asunto al demonio, asumir la pérdida financiera y enfocar mi energía en levantar una operación diferente.', pilar: 'P2' }
        ]
      }
    ]
  },
  {
    titulo: 'FASE IV — SOMBRA Y BLOQUEO',
    descripcion: 'Sesgos de Rechazo Proyectivo',
    preguntas: [
      {
        id: 25,
        titulo: 'Utilidad percibida en crisis. ¿Cuál de las siguientes operaciones psicológicas te parece la MENOS útil, efectiva o relevante para resolver un verdadero problema de vida?',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Planificar: Organizar variables, estructurar agendas y diseñar sistemas lógicos.', pilar: 'P1' },
          { id: 'B', texto: 'Adaptarse: Cambiar de piel, cerrar ciclos con frialdad y mudar de identidad.', pilar: 'P2' },
          { id: 'C', texto: 'Pedir ayuda: Buscar contención humana, mostrar vulnerabilidad y apoyarse en la red social.', pilar: 'P3' },
          { id: 'D', texto: 'Reflexionar: Detener el motor, tomar distancia conceptual y guardar silencio.', pilar: 'P4' },
          { id: 'E', texto: 'Sentir el dolor: Habitar la tristeza, procesar el duelo íntimo y transmutar la herida.', pilar: 'P5' },
          { id: 'F', texto: 'Usar humor: Utilizar la ironía defensiva, el sarcasmo y reírse del desastre.', pilar: 'P6' },
          { id: 'G', texto: 'Resistir: Morder el polvo, aguantar la carga estoicamente y persistir con cansancio.', pilar: 'P7' },
          { id: 'H', texto: 'Actuar: Operar por impulso instintivo, velocidad corporal y riesgo visceral.', pilar: 'P8' }
        ]
      },
      {
        id: 26,
        titulo: 'Índice de Rechazo Visceral. ¿Cuál de las siguientes conductas o estados mentales te genera más rechazo, incomodidad o fastidio interno cuando la experimentas en ti mismo?',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'La necesidad obsesiva de control, orden de procesos e incapacidad para relajarme.', pilar: 'P1' },
          { id: 'B', texto: 'La inconstancia crónica, la inestabilidad de objetivos y la tendencia a huir de los lugares.', pilar: 'P2' },
          { id: 'C', texto: 'La dependencia emocional de otros, la fragilidad expuesta y la necesidad de aprobación grupal.', pilar: 'P3' },
          { id: 'D', texto: 'La pasividad contemplativa, la inmovilidad aparente y el aislamiento del radar social.', pilar: 'P4' },
          { id: 'E', texto: 'La rumiación melancólica, el apego al sufrimiento pasado y la densificación dramática de la crisis.', pilar: 'P5' },
          { id: 'F', texto: 'El desapego cínico, la burla constante de las cosas serias y la incapacidad para ser solemne.', pilar: 'P6' },
          { id: 'G', texto: 'La terquedad estoica, el autosacrificio innecesario y el aguantar castigo sin buscar salidas.', pilar: 'P7' },
          { id: 'H', texto: 'La impulsividad animal, la falta de planeación técnica y el actuar de forma desordenada con las tripas.', pilar: 'P8' }
        ]
      },
      {
        id: 27,
        titulo: 'Evitación consciente de recursos. ¿De cuál de estas herramientas estratégicas tiendes a alejarte, postergar o evadir de forma sistemática, incluso cuando eres consciente de que podría ayudarte?',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Sentarme a trazar un presupuesto rígido, un mapa de procesos técnicos o un calendario operativo.', pilar: 'P1' },
          { id: 'B', texto: 'Ejecutar un quiebre radical de planes, cerrar un ciclo obsoleto y mudar de entorno físico.', pilar: 'P2' },
          { id: 'C', texto: 'Romper el orgullo individualista, hacer una llamada incómoda y pedir ayuda o perdón de manera directa.', pilar: 'P3' },
          { id: 'D', texto: 'Apagar los dispositivos, cancelar compromisos externos y quedarme en absoluto silencio a solas.', pilar: 'P4' },
          { id: 'E', texto: 'Detener la actividad mecánica para llorar mi pérdida, asimilar el luto de lo roto y escribir sobre mi herida.', pilar: 'P5' },
          { id: 'F', texto: 'Desdramatizar mis problemas cotidianos mediante la deconstrucción humorística o la sátira de mí mismo.', pilar: 'P6' },
          { id: 'G', texto: 'Ponerme a trabajar de manera rutinaria y monótona, aguantando el desgaste sin buscar soluciones mágicas.', pilar: 'P7' },
          { id: 'H', texto: 'Tomar un riesgo instintivo inmediato, mover el cuerpo, jugar y actuar antes de calcular las consecuencias.', pilar: 'P8' }
        ]
      },
      {
        id: 28,
        titulo: 'Proyección del éxito ajeno. ¿Cuál de las siguientes cualidades te produce mayor incomodidad cuando la observas en personas que el sistema cataloga como "exitosas"?',
        tipo: 'single',
        opciones: [
          { id: 'A', texto: 'Su rigidez metodológica, su obsesión por las métricas organizacionales y su hiper-control corporativo.', pilar: 'P1' },
          { id: 'B', texto: 'Su descaro para cambiar de opinión, traicionar discursos previos y reinventar su marca sin lealtad a su pasado.', pilar: 'P2' },
          { id: 'C', texto: 'Su dependencia de las relaciones públicas, su necesidad de aplauso masivo y el uso constante de su red social.', pilar: 'P3' },
          { id: 'D', texto: 'Su soberbia intelectual elusiva, su distanciamiento hermético y su rechazo a participar del ruido del mercado.', pilar: 'P4' },
          { id: 'E', texto: 'Su explotación del drama personal, el exhibicionismo de sus crisis íntimas y la comercialización de su dolor.', pilar: 'P5' },
          { id: 'F', texto: 'Su falta de seriedad corporativa, su ligereza para tratar asuntos críticos y el uso constante del sarcasmo.', pilar: 'P6' },
          { id: 'G', texto: 'Su orgullo obrero por el autosacrificio, el presumir cuántas horas trabajan y el glorificar el desgaste físico.', pilar: 'P7' },
          { id: 'H', texto: 'Su impulsividad audaz, el operar por pura energía biológica visceral y el tomar riesgos financieros con las tripas.', pilar: 'P8' }
        ]
      }
    ]
  },
  {
    titulo: 'FASE V — REACTIVOS ESPEJO',
    descripcion: 'Índice de Congruencia (1=Desacuerdo total / 5=Acuerdo total)',
    preguntas: [
      { id: 29, titulo: 'Me considero una persona sumamente independiente y autosuficiente para operar ante las crisis de la vida diaria.', tipo: 'scale' },
      { id: 30, titulo: 'Cuando las circunstancias de mi entorno empeoran críticamente, experimento la necesidad imperiosa de buscar apoyo relacional.', tipo: 'scale' },
      { id: 31, titulo: 'Prefiero ejecutar de inmediato una acción imperfecta antes que quedarme esperando a tener todas las variables controladas por el análisis.', tipo: 'scale' },
      { id: 32, titulo: 'Prefiero observar el panorama completo con distancia y frialdad analítica antes de realizar cualquier movimiento operativo.', tipo: 'scale' }
    ]
  },
  {
    titulo: 'VALIDACIÓN FINAL',
    descripcion: 'Filtro de Elección Forzada',
    preguntas: [
      {
        id: 33,
        titulo: 'El recurso prohibido. Imagina que mañana por la mañana debes resolver obligatoriamente la crisis usando exclusivamente uno de estos recursos psicológicos. ¿Cuál NO elegirías bajo ninguna circunstancia?',
        tipo: 'single',
        opciones: [
          { id: 'P1', texto: 'Control: Sentarme a planificar variables, cuadrar números, ordenar horarios y estructurar un plan rígido.', pilar: 'P1' },
          { id: 'P2', texto: 'Transformación: Romper con mi escenario actual, cerrar el ciclo de golpe, cambiar de código y reinventarme en otra parte.', pilar: 'P2' },
          { id: 'P3', texto: 'Comunidad: Romper el aislamiento, tragarme el orgullo, pedir ayuda humana y depender de la lealtad grupal.', pilar: 'P3' },
          { id: 'P4', texto: 'Retiro: Suspender la actividad operativa, aislarme en absoluto hermetismo acústico y quedarme en silencio contemplativo.', pilar: 'P4' },
          { id: 'P5', texto: 'Duelo: Detener el ruido mental para llorar mis pérdidas, habitar la melancolía de lo roto y procesar la herida en canal.', pilar: 'P5' },
          { id: 'P6', texto: 'Humor: Desmitificar mi tragedia mediante el sarcasmo letal, la ironía corrosiva y reír de mi propia ruina cotidiana.', pilar: 'P6' },
          { id: 'P7', texto: 'Resistencia: Ponerme a trabajar de forma monótona y ruda, morder el polvo, soportar el cansancio y aguantar la carga a largo plazo.', pilar: 'P7' },
          { id: 'P8', texto: 'Vitalidad: Actuar de forma visceral por impulso corporal, jugar, tomar velocidad y ejecutar riesgos sin calcular consecuencias.', pilar: 'P8' }
        ]
      },
      {
        id: 34,
        titulo: 'La llave perdida. Si una autoridad absoluta pudiera regalarte en este instante uno de estos recursos psicológicos desarrollado en su máxima expresión biológica, ¿cuál transformaría más profundamente tu realidad actual?',
        tipo: 'single',
        opciones: [
          { id: 'P1', texto: 'Control: Una claridad estratégica absoluta para estructurar sistemas lógicos impecables y predictivos.', pilar: 'P1' },
          { id: 'P2', texto: 'Transformación: El coraje camaleónico para destruir identidades obsoletas y mutar de piel sin resistencia emocional.', pilar: 'P2' },
          { id: 'P3', texto: 'Comunidad: Una competencia relacional magnética para unificar comunidades, sanar lazos y operar en bloque cohesionado.', pilar: 'P3' },
          { id: 'P4', texto: 'Retiro: Una soberbiosa paz mental e íntima para aislarme del ruido del mercado y recuperar nitidez conceptual.', pilar: 'P4' },
          { id: 'P5', texto: 'Duelo: La capacidad alquímica para transmutar el dolor denso de las heridas pasadas en arte, potencia y significado profundo.', pilar: 'P5' },
          { id: 'P6', texto: 'Humor: Un bisturí de ironía iconoclasta tan afilado que relativice cualquier drama externo, quitándole poder al sufrimiento.', pilar: 'P6' },
          { id: 'P7', texto: 'Resistencia: Una fortaleza estoica e incorruptible para tolerar fatigas extremas, soportar pesos y continuar de pie pase lo que pase.', pilar: 'P7' },
          { id: 'P8', texto: 'Vitalidad: Un impulso animal e instintivo de energía biológica pura para jugar, acelerar la marcha y disfrutar del riesgo.', pilar: 'P8' }
        ]
      }
    ]
  }
]

const preguntaActual = computed(() => {
  return fases[faseActual.value].preguntas[preguntaIndex.value]
})

const respuestaSeleccionada = computed(() => {
  return quizStore.getRespuesta(preguntaActual.value?.id ?? -1)
})

const progresoFase = computed(() => {
  return preguntaIndex.value + 1
})

const preguntaGlobalIndex = computed(() => {
  let count = 0
  for (let i = 0; i < faseActual.value; i++) {
    count += fases[i].preguntas.length
  }
  return count + preguntaIndex.value
})

const esUltimaPregunta = computed(() => {
  return faseActual.value === fases.length - 1 && 
         preguntaIndex.value === fases[faseActual.value].preguntas.length - 1
})

const getPilarLabel = (pilarId: string) => {
  const info = PILARES_INFO[pilarId as any]
  return info ? `${info.nombre} (${info.rockstars[0]})` : pilarId
}

const seleccionarOpcion = (opcionId: string) => {
  if (!preguntaActual.value) return
  quizStore.setRespuesta(preguntaActual.value.id, opcionId)
}

const siguiente = async () => {
  if (esUltimaPregunta.value) {
    const result = await quizStore.submitQuiz()
    if (result?.success) {
      router.push('/resultado')
    }
  } else if (preguntaIndex.value < fases[faseActual.value].preguntas.length - 1) {
    preguntaIndex.value++
  } else if (faseActual.value < fases.length - 1) {
    faseActual.value++
    preguntaIndex.value = 0
  }
}

const anterior = () => {
  if (preguntaIndex.value > 0) {
    preguntaIndex.value--
  } else if (faseActual.value > 0) {
    faseActual.value--
    preguntaIndex.value = fases[faseActual.value].preguntas.length - 1
  }
}

onMounted(() => {
  quizStore.reset()
})
</script>
