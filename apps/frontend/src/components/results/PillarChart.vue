<template>
  <div class="card">
    <div class="space-y-4">
      <div v-for="(score, pillar) in scores" :key="pillar" class="flex items-center gap-4">
        <span class="text-sm font-medium text-neutral-400 w-24 capitalize">{{ pillarNames[pillar] }}</span>
        <div class="flex-1 bg-neutral-800 rounded-full h-3">
          <div 
            class="h-3 rounded-full transition-all duration-1000"
            :class="getColorClass(pillar)"
            :style="{ width: `${score}%` }"
          ></div>
        </div>
        <span class="text-sm font-bold w-8 text-right">{{ score }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scores: { type: Object, required: true }
})

const pillarNames = {
  presence: 'Presencia',
  creativity: 'Creatividad',
  resilience: 'Resiliencia',
  charisma: 'Carisma',
  discipline: 'Disciplina',
  intuition: 'Intuición',
  rebellion: 'Rebeldía',
  vision: 'Visión'
}

function getColorClass(pillar) {
  const colors = {
    presence: 'bg-red-500',
    creativity: 'bg-amber-500',
    resilience: 'bg-emerald-500',
    charisma: 'bg-violet-500',
    discipline: 'bg-blue-500',
    intuition: 'bg-cyan-500',
    rebellion: 'bg-rose-500',
    vision: 'bg-orange-500'
  }
  return colors[pillar] || 'bg-neutral-500'
}
</script>