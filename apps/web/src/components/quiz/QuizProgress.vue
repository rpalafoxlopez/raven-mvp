<template>
  <div class="w-full max-w-2xl mx-auto mb-8">
    <div class="flex justify-between items-center mb-2">
      <span class="font-mono text-label-caps text-solstis">
        PASO {{ String(currentQuestion + 1).padStart(2, '0') }} / {{ String(totalQuestions).padStart(2, '0') }}
      </span>
      <span class="font-mono text-technical-sm text-halford">
        {{ phaseLabels[currentPhase] }}
      </span>
    </div>
    <div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
      <div 
        class="h-full bg-solstis transition-all duration-500 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentQuestion: number
  totalQuestions: number
  currentPhase: number
  progress: number
  phaseLabels: string[]
}

defineProps<Props>()
</script>
