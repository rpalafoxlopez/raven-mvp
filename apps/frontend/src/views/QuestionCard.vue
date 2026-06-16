<template>
  <div class="relative p-6 border border-halford/20 bg-bocanada/40 backdrop-blur-sm">
    <!-- Número de pregunta -->
    <div class="absolute -top-3 left-6">
      <span class="px-3 py-1 font-mono text-xs tracking-wider uppercase bg-solstis text-folsom">
        {{ questionNumber }}
      </span>
    </div>

    <!-- Texto de la pregunta -->
    <div class="mt-4 mb-6">
      <p class="text-lg leading-relaxed font-body text-loriga">
        {{ question.texto }}
      </p>
      <p v-if="question.tipo === 'escala' && question.fase === 'costo'" 
         class="mt-2 font-mono text-xs text-halford/70">
        [1] Me energiza → [2] Natural → [3] Me cuesta → [4] Me agota profundamente
      </p>
      <p v-else-if="question.tipo === 'escala' && question.fase === 'espejo'" 
         class="mt-2 font-mono text-xs text-halford/70">
        1. Total desacuerdo → 5. Total acuerdo
      </p>
      <p v-else-if="question.tipo === 'escala' && question.fase === 'cronologia'" 
         class="mt-2 font-mono text-xs text-halford/70">
        Selecciona el rango de tiempo
      </p>
    </div>

    <!-- TIPO: ELECCIÓN MÚLTIPLE -->
    <div v-if="question.tipo === 'eleccion' && question.opciones" class="space-y-3">
      <button
        v-for="(opcion, index) in question.opciones"
        :key="index"
        @click="selectOption(index)"
        :class="[
          'w-full p-4 text-left transition-all duration-200 border font-body text-sm leading-relaxed',
          selectedAnswer === index
            ? 'border-solstis bg-solstis/10 text-loriga'
            : 'border-halford/20 text-halford hover:border-halford/50 hover:text-loriga hover:bg-halford/5'
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Letra indicadora -->
          <span class="flex-shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center font-mono text-xs border"
            :class="selectedAnswer === index
              ? 'border-solstis text-solstis'
              : 'border-halford/30 text-halford/50'"
          >
            {{ ['A','B','C','D','E','F','G','H'][index] || index + 1 }}
          </span>
          <!-- Texto de la opción -->
          <span>{{ opcion.label }}</span>
        </div>
      </button>
    </div>

    <!-- TIPO: ESCALA (1-4 o 1-5) -->
    <div v-else-if="question.tipo === 'escala'" class="space-y-6">
      <!-- Slider visual -->
      <div class="relative px-2">
        <div class="flex justify-between mb-3">
          <span v-for="n in escalaMax" :key="n"
            class="font-mono text-xs"
            :class="selectedAnswer === n ? 'text-solstis' : 'text-halford/40'"
          >
            {{ n }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            v-for="n in escalaMax"
            :key="n"
            @click="selectOption(n)"
            :class="[
              'flex-1 py-3 text-center transition-all duration-200 border font-mono text-sm',
              selectedAnswer === n
                ? 'border-solstis bg-solstis text-folsom'
                : 'border-halford/20 text-halford hover:border-halford/50 hover:text-loriga'
            ]"
          >
            {{ n }}
          </button>
        </div>

        <!-- Labels de los extremos -->
        <div class="flex justify-between mt-3 font-mono text-xs text-halford/50">
          <span>{{ escalaLabelMin }}</span>
          <span>{{ escalaLabelMax }}</span>
        </div>
      </div>
    </div>

    <!-- Tipo desconocido -->
    <div v-else class="p-4 font-mono text-sm text-center text-red-400 border border-red-500/30">
      Error: tipo de pregunta no reconocido
    </div>

    <!-- Indicador de arquetipo (solo en fases relevantes) -->
    <div v-if="arquetipoHint" class="pt-4 mt-4 border-t border-halford/10">
      <p class="font-mono text-xs text-halford/50">
        {{ arquetipoHint }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ARQUETIPOS } from '@/stores/quiz'

const props = defineProps({
  question: { type: Object, required: true },
  questionNumber: { type: Number, required: true },
  selectedAnswer: { type: Number, default: null }
})

const emit = defineEmits(['answer'])

// Determinar el máximo de la escala según la fase
const escalaMax = computed(() => {
  if (props.question.fase === 'costo') return 4
  if (props.question.fase === 'espejo') return 5
  if (props.question.fase === 'cronologia') return 5
  return 5
})

// Labels para escalas
const escalaLabelMin = computed(() => {
  const labels = {
    costo: 'Me energiza',
    espejo: 'Total desacuerdo',
    cronologia: 'Menos de una semana'
  }
  return labels[props.question.fase] || 'Mínimo'
})

const escalaLabelMax = computed(() => {
  const labels = {
    costo: 'Me agota profundamente',
    espejo: 'Total acuerdo',
    cronologia: 'Más de un año'
  }
  return labels[props.question.fase] || 'Máximo'
})

// Hint de arquetipo (solo para debugging o contexto sutil)
const arquetipoHint = computed(() => {
  // Solo mostrar en fase de costo para dar contexto
  if (props.question.fase === 'costo' && props.question.arquetipoId) {
    const arq = ARQUETIPOS[props.question.arquetipoId]
    if (arq) return `Evaluando: ${arq.nombre}`
  }
  return null
})

function selectOption(index) {
  emit('answer', index)
}
</script>

<style scoped>
.bg-bocanada { background-color: #0A192F; }
.text-loriga { color: #F0F5F9; }
.text-halford { color: #708090; }
.bg-solstis { background-color: #D4AF37; }
.text-solstis { color: #D4AF37; }
.text-folsom { color: #050505; }
</style>