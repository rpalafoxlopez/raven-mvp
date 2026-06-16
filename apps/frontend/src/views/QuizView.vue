<template>
  <div class="min-h-screen px-4 py-12 bg-folsom text-loriga">
    <div class="max-w-2xl mx-auto">

      <!-- Loading preguntas -->
      <div v-if="quizStore.loading" class="py-20 text-center">
        <div class="mb-4 text-4xl animate-pulse">🎸</div>
        <p class="font-mono text-sm text-halford">Cargando el cuestionario...</p>
      </div>

      <!-- Error -->
      <div v-else-if="quizStore.error" class="py-20 text-center">
        <div class="mb-4 text-4xl">⚠️</div>
        <p class="mb-4 font-body text-halford">{{ quizStore.error }}</p>
        <button @click="retryFetch"
          class="px-6 py-3 text-sm tracking-wider uppercase transition-all bg-solstis text-folsom font-body hover:scale-105">
          Reintentar
        </button>
      </div>

      <!-- Quiz activo -->
      <div v-else-if="quizStore.questions.length && !quizStore.isComplete">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-display text-loriga">Descubre tu Arquetipo</h2>
            <span class="font-mono text-xs tracking-wider text-halford">
              {{ quizStore.currentQuestion + 1 }} / {{ quizStore.questions.length }}
            </span>
          </div>
          <div class="h-1 overflow-hidden rounded-full bg-surface-container">
            <div class="h-full transition-all duration-500 bg-solstis"
              :style="`width: ${quizStore.progress}%`"></div>
          </div>
        </div>

        <!-- Question Card -->
        <QuestionCard
          v-if="quizStore.questions[quizStore.currentQuestion]"
          :question="quizStore.questions[quizStore.currentQuestion]"
          :questionNumber="quizStore.currentQuestion + 1"
          :selectedAnswer="quizStore.currentAnswer"
          @answer="handleAnswer"
        />

        <!-- Navegación -->
        <div class="flex justify-between mt-6">
          <button
            @click="quizStore.goBack()"
            :disabled="quizStore.currentQuestion === 0"
            class="px-6 py-3 text-sm tracking-wider uppercase transition-all border border-halford/30 text-halford font-body hover:border-solstis hover:text-solstis disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          <span class="self-center font-mono text-xs text-halford">
            Pregunta {{ quizStore.currentQuestion + 1 }} de {{ quizStore.questions.length }}
          </span>
        </div>
      </div>

      <!-- Submit — cuando isComplete es true -->
      <div v-else-if="quizStore.isComplete" class="py-20 text-center">
        <h3 class="mb-4 text-2xl font-display text-loriga">
          ¡Listo para descubrir tu arquetipo!
        </h3>
        <p class="mb-8 font-body text-halford">
          Has respondido todas las preguntas. Preparando tu diagnóstico...
        </p>
        <button
          @click="submitQuiz"
          :disabled="quizStore.submitting"
          class="relative overflow-hidden bg-solstis text-folsom px-10 py-5 font-body text-lg uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span v-if="quizStore.submitting">Analizando...</span>
          <span v-else>🎸 Revelar mi Arquetipo</span>
        </button>
        <p v-if="submitError" class="mt-4 font-mono text-xs text-red-400">{{ submitError }}</p>
      </div>

      <!-- No hay preguntas y no está cargando — estado vacío -->
      <div v-else class="py-20 text-center">
        <div class="mb-4 text-4xl">🎸</div>
        <p class="mb-4 font-body text-halford">Iniciando cuestionario...</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import QuestionCard from '@/components/quiz/QuestionCard.vue'

const router = useRouter()
const quizStore = useQuizStore()
const submitError = ref(null)

onMounted(() => {
  quizStore.loadFromStorage()
  if (!quizStore.questions.length) {
    quizStore.fetchQuestions()
  }
})

const handleAnswer = (answerIndex) => {
  quizStore.answerQuestion(answerIndex)
}

const retryFetch = () => {
  quizStore.clearError()
  quizStore.fetchQuestions()
}

async function submitQuiz() {
  submitError.value = null
  const result = await quizStore.submitQuiz()

  if (result || quizStore.diagnostico) {
    router.push({ name: 'Results' })
  } else {
    submitError.value = quizStore.error || 'Error procesando resultados. Intenta de nuevo.'
  }
}
</script>

<style scoped>
.bg-folsom { background-color: #050505; }
.bg-surface-container { background-color: #201f1f; }
.text-loriga { color: #F0F5F9; }
.text-halford { color: #708090; }
.bg-solstis { background-color: #D4AF37; }
.text-folsom { color: #050505; }
</style>
