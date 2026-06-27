<template>
  <div class="w-full">
    <div class="flex justify-between text-xs text-halford mb-2">
      <span>Progreso</span>
      <span>{{ progress }}%</span>
    </div>
    <div class="w-full bg-neutral-200 rounded-full h-2">
      <div 
        class="h-2 rounded-full bg-gradient-to-r from-rock-500 to-amber-500 transition-all duration-500"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progress: { type: Number, default: 0 }
})
</script>