<template>
  <div class="min-h-screen bg-neutral-950 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">Descubre tu Arquetipo</h2>
          <span class="text-neutral-500">{{ quizStore.currentQuestion + 1 }} / {{ quizStore.questions.length }}</span>
        </div>
        <ProgressBar :progress="quizStore.progress" />
      </div>

      <!-- Question Card -->
      <QuestionCard
        v-if="quizStore.questions.length && !quizStore.isComplete"
        :question="quizStore.questions[quizStore.currentQuestion]"
        :questionNumber="quizStore.currentQuestion + 1"
        @answer="quizStore.answerQuestion"
      />

      <!-- Navigation -->
      <div v-if="!quizStore.isComplete" class="flex justify-between mt-6">
        <button 
          @click="quizStore.goBack"
          :disabled="quizStore.currentQuestion === 0"
          class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': quizStore.currentQuestion === 0 }"
        >
          ← Anterior
        </button>
      </div>

      <!-- Submit -->
      <div v-if="quizStore.isComplete" class="text-center mt-8">
        <h3 class="text-2xl font-bold mb-4">¡Listo para descubrir tu arquetipo!</h3>
        <button 
          @click="submitQuiz"
          class="btn-primary text-lg px-8 py-4"
          :disabled="quizStore.loading"
        >
          <span v-if="quizStore.loading">Analizando...</span>
          <span v-else>🎸 Revelar mi Arquetipo</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import QuestionCard from '../components/quiz/QuestionCard.vue'
import ProgressBar from '../components/quiz/ProgressBar.vue'

const quizStore = useQuizStore()
const router = useRouter()

onMounted(() => {
  if (!quizStore.questions.length) {
    quizStore.fetchQuestions()
  }
})

async function submitQuiz() {
  await quizStore.submitQuiz()
  router.push('/results')
}
</script>