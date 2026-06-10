import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useQuizStore = defineStore('quiz', () => {
  const questions = ref([])
  const currentQuestion = ref(0)
  const answers = ref([])
  const loading = ref(false)
  const result = ref(null)

  const progress = computed(() => {
    if (!questions.value.length) return 0
    return Math.round((currentQuestion.value / questions.value.length) * 100)
  })

  const isComplete = computed(() => {
    return answers.value.length === questions.value.length
  })

  async function fetchQuestions() {
    loading.value = true
    try {
      const authStore = useAuthStore()
      const { data } = await authStore.api.get('/api/quiz/questions')
      questions.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  function answerQuestion(answerIndex) {
    const question = questions.value[currentQuestion.value]
    answers.value.push({
      questionId: question.id,
      answer: answerIndex,
      pillar: question.pillar
    })

    if (currentQuestion.value < questions.value.length - 1) {
      currentQuestion.value++
    }
  }

  function goBack() {
    if (currentQuestion.value > 0) {
      currentQuestion.value--
      answers.value.pop()
    }
  }

  async function submitQuiz() {
    loading.value = true
    try {
      const authStore = useAuthStore()
      const { data } = await authStore.api.post('/api/quiz/submit', {
        answers: answers.value
      })
      result.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  function reset() {
    currentQuestion.value = 0
    answers.value = []
    result.value = null
  }

  return {
    questions,
    currentQuestion,
    answers,
    loading,
    result,
    progress,
    isComplete,
    fetchQuestions,
    answerQuestion,
    goBack,
    submitQuiz,
    reset
  }
})