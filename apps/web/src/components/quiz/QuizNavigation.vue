<template>
  <div class="flex justify-between items-center max-w-3xl mx-auto mt-12">
    <button
      @click="$emit('prev')"
      :disabled="currentQuestion === 0"
      class="px-6 py-3 font-body text-label-caps text-halford border border-outline-variant/30 hover:border-solstis hover:text-solstis transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <span class="material-symbols-outlined inline-block mr-2" style="font-size: 18px;">arrow_back</span>
      ANTERIOR
    </button>

    <button
      @click="$emit('next')"
      :disabled="!canProceed"
      class="px-8 py-3 font-body text-label-caps bg-solstis text-folsom hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed gold-glow interactive-button"
    >
      <span class="button-glow"></span>
      <span class="relative z-20">
        {{ isLast ? 'VER RESULTADO' : 'SIGUIENTE' }}
        <span class="material-symbols-outlined inline-block ml-2" style="font-size: 18px;">
          {{ isLast ? 'check_circle' : 'arrow_forward' }}
        </span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentQuestion: number
  totalQuestions: number
  canProceed: boolean
}

const props = defineProps<Props>()
const isLast = props.currentQuestion === props.totalQuestions - 1

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>
