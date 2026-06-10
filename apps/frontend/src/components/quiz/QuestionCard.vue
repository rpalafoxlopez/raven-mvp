<template>
  <div class="card animate-fade-in">
    <div class="mb-2">
      <span class="text-xs font-semibold text-rock-400 uppercase tracking-wider">
        Pregunta {{ questionNumber }}
      </span>
    </div>

    <h3 class="text-xl font-bold mb-6">{{ question.text }}</h3>

    <div class="space-y-3">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        @click="$emit('answer', index)"
        class="w-full text-left p-4 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:border-rock-500 hover:bg-rock-500/10 transition-all duration-200 group"
      >
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-neutral-700 group-hover:bg-rock-500 flex items-center justify-center text-sm font-bold transition-colors">
            {{ ['A', 'B', 'C', 'D'][index] }}
          </span>
          <span class="text-neutral-300 group-hover:text-white">{{ option }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: { type: Object, required: true },
  questionNumber: { type: Number, required: true }
})

defineEmits(['answer'])
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>