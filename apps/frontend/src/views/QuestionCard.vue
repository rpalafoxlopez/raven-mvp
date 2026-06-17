<template>
  <div class="card-question">
    <p class="mb-6 font-body text-lg leading-relaxed text-loriga">{{ question.texto }}</p>

    <!-- Tipo: eleccion (A, B, C, D...) -->
    <div v-if="question.tipo === 'eleccion'" class="space-y-3">
      <button
        v-for="(opcion, index) in question.opciones"
        :key="index"
        @click="$emit('answer', index)"
        class="option-btn"
        :class="{ 'option-btn--selected': selectedAnswer === index }"
      >
        <div class="flex items-start gap-3">
          <span class="option-letter">
            {{ ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][index] }}
          </span>
          <span class="flex-1 text-left font-body text-sm leading-relaxed">{{ opcion.label }}</span>
        </div>
      </button>
    </div>

    <!-- Tipo: escala (1-4 o 1-5) -->
    <div v-else-if="question.tipo === 'escala'" class="space-y-3">
      <p class="mb-4 font-mono text-xs tracking-wider uppercase text-halford">
        {{ escalaHint }}
      </p>
      <div class="flex justify-between gap-2">
        <button
          v-for="n in escalaRange"
          :key="n"
          @click="$emit('answer', n)"
          class="escala-btn"
          :class="{ 'escala-btn--selected': selectedAnswer === n }"
        >
          {{ n }}
        </button>
      </div>
      <div class="flex justify-between mt-2 font-mono text-xs text-halford/60">
        <span>{{ escalaLabelMin }}</span>
        <span>{{ escalaLabelMax }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: { type: Object, required: true },
  questionNumber: { type: Number, required: true },
  selectedAnswer: { type: [Number, String], default: null }
})

defineEmits(['answer'])

// Fase cronologia usa escala 1-5 con labels de tiempo; costo y espejo usan 1-4 o 1-5 genericos
const escalaRange = computed(() => {
  if (props.question.fase === 'cronologia') return [1, 2, 3, 4, 5]
  if (props.question.fase === 'costo') return [1, 2, 3, 4]
  if (props.question.fase === 'espejo') return [1, 2, 3, 4, 5]
  return [1, 2, 3, 4]
})

const escalaHint = computed(() => {
  if (props.question.fase === 'cronologia') return 'Selecciona el rango de tiempo'
  if (props.question.fase === 'costo') return 'Que tanto te cuesta esta accion'
  if (props.question.fase === 'espejo') return 'Que tan de acuerdo estas'
  return ''
})

const escalaLabelMin = computed(() => {
  if (props.question.fase === 'cronologia') return 'Menos de 1 semana'
  if (props.question.fase === 'costo') return 'Me energiza'
  if (props.question.fase === 'espejo') return 'Total desacuerdo'
  return ''
})

const escalaLabelMax = computed(() => {
  if (props.question.fase === 'cronologia') return 'Mas de 1 año'
  if (props.question.fase === 'costo') return 'Me agota'
  if (props.question.fase === 'espejo') return 'Total acuerdo'
  return ''
})
</script>

<style scoped>
.card-question {
  background-color: #0A192F;
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  padding: 2rem;
}

.option-btn {
  width: 100%;
  text-align: left;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(192, 192, 192, 0.2);
  background-color: rgba(240, 245, 249, 0.03);
  color: #F0F5F9;
  transition: all 0.2s ease;
  cursor: pointer;
}

.option-btn:hover {
  border-color: #D4AF37;
  background-color: rgba(212, 175, 55, 0.08);
}

.option-btn--selected {
  border-color: #D4AF37;
  background-color: rgba(212, 175, 55, 0.15);
}

.option-letter {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(192, 192, 192, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: monospace;
  color: #C0C0C0;
  transition: all 0.2s ease;
}

.option-btn:hover .option-letter,
.option-btn--selected .option-letter {
  background-color: #D4AF37;
  color: #050505;
}

.escala-btn {
  flex: 1;
  padding: 1rem 0;
  border-radius: 8px;
  border: 1px solid rgba(192, 192, 192, 0.2);
  background-color: rgba(240, 245, 249, 0.03);
  color: #F0F5F9;
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.2s ease;
  cursor: pointer;
}

.escala-btn:hover {
  border-color: #D4AF37;
  background-color: rgba(212, 175, 55, 0.08);
}

.escala-btn--selected {
  border-color: #D4AF37;
  background-color: #D4AF37;
  color: #050505;
}
</style>