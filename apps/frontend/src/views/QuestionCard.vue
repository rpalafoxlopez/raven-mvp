<!-- src/components/quiz/QuestionCard.vue -->
<template>
  <div class="p-8 border bg-surface-container border-outline-variant/20 md:p-12">
    <div class="font-mono text-xs tracking-[0.2em] uppercase text-solstis mb-6">
      Pregunta {{ questionNumber }}
    </div>
    
    <h3 class="mb-10 text-2xl leading-snug font-display md:text-3xl text-loriga">
      {{ question.text }}
    </h3>

    <div class="space-y-3">
      <button
        v-for="(option, i) in question.options"
        :key="i"
        @click="$emit('answer', i)"
        class="w-full p-5 text-base text-left transition-all duration-300 border font-body group"
        :class="selectedAnswer === i 
          ? 'border-solstis bg-solstis/10 text-loriga' 
          : 'border-outline-variant/20 text-halford hover:border-solstis/40 hover:text-loriga hover:bg-surface'"
      >
        <span class="inline-block w-8 h-8 mr-4 font-mono text-sm leading-7 text-center border border-current rounded-full"
              :class="selectedAnswer === i ? 'bg-solstis text-folsom border-solstis' : 'group-hover:border-solstis group-hover:text-solstis'">
          {{ ['A','B','C','D'][i] }}
        </span>
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: { type: Object, required: true },
  questionNumber: { type: Number, required: true },
  selectedAnswer: { type: Number, default: null }
})

defineEmits(['answer'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@500&display=swap');

.font-display { font-family: 'Playfair Display', serif; }
.font-body { font-family: 'Inter', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.bg-surface-container { background-color: #201f1f; }
.bg-solstis\/10 { background-color: rgba(212, 175, 55, 0.1); }
.bg-surface { background-color: #141313; }
.text-loriga { color: #F0F5F9; }
.text-halford { color: #C0C0C0; }
.text-solstis { color: #D4AF37; }
.text-folsom { color: #050505; }
.border-outline-variant\/20 { border-color: rgba(68, 71, 72, 0.2); }
</style>