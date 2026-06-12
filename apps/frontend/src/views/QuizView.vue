<template>
  <div class="min-h-screen px-4 py-12 bg-folsom text-loriga">
    <div class="max-w-2xl mx-auto">
      <!-- Loading -->
      <div v-if="quizStore.loading" class="py-20 text-center">
        <div class="mb-4 text-4xl animate-pulse">🎸</div>
        <p class="font-mono text-sm text-halford">Cargando el cuestionario...</p>
      </div>

      <!-- Error -->
      <div v-else-if="quizStore.error" class="py-20 text-center">
        <div class="mb-4 text-4xl">⚠️</div>
        <p class="mb-4 font-body text-halford">{{ quizStore.error }}</p>
        <button @click="retryFetch" class="px-6 py-3 text-sm tracking-wider uppercase transition-all bg-solstis text-folsom font-body hover:scale-105">
          Reintentar
        </button>
      </div>

      <!-- Header -->
      <div v-else-if="quizStore.questions.length && !quizStore.isComplete" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-display text-loriga">Descubre tu Arquetipo</h2>
          <span class="font-mono text-xs tracking-wider text-halford">
            {{ quizStore.currentQuestion + 1 }} / {{ quizStore.questions.length }}
          </span>
        </div>
        <div class="h-1 overflow-hidden rounded-full bg-surface-container">
          <div class="h-full transition-all duration-500 bg-solstis" :style="`width: ${quizStore.progress}%`"></div>
        </div>
      </div>

      <!-- Question Card -->
      <QuestionCard
        v-if="quizStore.questions.length && !quizStore.isComplete && !quizStore.loading"
        :question="quizStore.questions[quizStore.currentQuestion]"
        :questionNumber="quizStore.currentQuestion + 1"
        :selectedAnswer="quizStore.answers[quizStore.currentQuestion]"
        @answer="handleAnswer"
      />

      <!-- Navigation -->
      <div v-if="!quizStore.isComplete && quizStore.questions.length" class="flex justify-between mt-6">
        <button 
          @click="quizStore.goBack"
          :disabled="quizStore.currentQuestion === 0"
          class="px-6 py-3 text-sm tracking-wider uppercase transition-all border border-halford/30 text-halford font-body hover:border-solstis hover:text-solstis disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>
        <span class="self-center font-mono text-xs text-halford">
          Pregunta {{ quizStore.currentQuestion + 1 }} de {{ quizStore.questions.length }}
        </span>
      </div>

      <!-- Submit -->
      <div v-if="quizStore.isComplete" class="mt-12 text-center">
        <h3 class="mb-4 text-2xl font-display text-loriga">¡Listo para descubrir tu arquetipo!</h3>
        <p class="mb-8 font-body text-halford">Has respondido todas las preguntas. Preparando tu diagnóstico...</p>
        <button 
          @click="submitQuiz"
          class="bg-solstis text-folsom px-10 py-5 font-body text-lg uppercase tracking-wider hover:scale-105 transition-all duration-300 gold-glow interactive-button shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          :disabled="quizStore.submitting"
        >
          <span class="button-glow"></span>
          <span class="relative z-20">
            <span v-if="quizStore.submitting">Analizando...</span>
            <span v-else>🎸 Revelar mi Arquetipo</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'           // ← AJUSTA ESTO
import QuestionCard from '@/components/quiz/QuestionCard.vue'

const router = useRouter()
const quizStore = useQuizStore()

onMounted(() => {
  quizStore.loadFromStorage()
  if (!quizStore.questions.length) {
    quizStore.fetchQuestions()
  }
  attachButtonListeners()
})

onUnmounted(() => {
  detachButtonListeners()
})

const handleAnswer = (answer) => {
  quizStore.answerQuestion(answer)
  quizStore.saveToStorage()
}

const retryFetch = () => {
  quizStore.clearError()
  quizStore.fetchQuestions()
}

async function submitQuiz() {
  const success = await quizStore.submitQuiz()
  if (success || quizStore.diagnostico) {
    router.push({
      path: '/results',
      state: { diagnostico: quizStore.diagnostico }
    })
  }
}

// Button glow
const handleButtonMouseMove = (e) => {
  const btn = e.currentTarget
  const glow = btn.querySelector('.button-glow')
  if (!glow) return
  const rect = btn.getBoundingClientRect()
  glow.style.left = (e.clientX - rect.left) + 'px'
  glow.style.top = (e.clientY - rect.top) + 'px'
}

const attachButtonListeners = () => {
  document.querySelectorAll('.interactive-button').forEach(btn => {
    btn.addEventListener('mousemove', handleButtonMouseMove)
  })
}

const detachButtonListeners = () => {
  document.querySelectorAll('.interactive-button').forEach(btn => {
    btn.removeEventListener('mousemove', handleButtonMouseMove)
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@500&display=swap');

.font-display { font-family: 'Playfair Display', serif; }
.font-body { font-family: 'Inter', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.bg-folsom { background-color: #050505; }
.bg-surface-container { background-color: #201f1f; }