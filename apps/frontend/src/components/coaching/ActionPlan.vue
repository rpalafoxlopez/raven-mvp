<template>
  <div class="card">
    <h4 class="font-bold mb-4">Plan de Acción</h4>

    <div v-if="!coachingStore.plan?.actionItems?.length" class="text-sm text-neutral-500 text-center py-4">
      <p>Aún no tienes acciones.</p>
      <p class="mt-1">Pídele a Raven que genere un plan.</p>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="action in coachingStore.plan.actionItems" 
        :key="action._id"
        class="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg"
      >
        <button 
          @click="toggleAction(action._id, !action.completed)"
          class="mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
          :class="action.completed ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600 hover:border-rock-500'"
        >
          <span v-if="action.completed" class="text-xs">✓</span>
        </button>
        <div class="flex-1 min-w-0">
          <p :class="action.completed ? 'line-through text-neutral-500' : 'text-white'" class="text-sm font-medium">
            {{ action.title }}
          </p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ action.description }}</p>
          <p v-if="action.dueDate" class="text-xs text-amber-400 mt-1">
            📅 {{ formatDate(action.dueDate) }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-neutral-800">
      <div class="flex items-center justify-between text-sm">
        <span class="text-neutral-500">Progreso</span>
        <span class="font-bold text-rock-400">{{ completionRate }}%</span>
      </div>
      <div class="w-full bg-neutral-800 rounded-full h-2 mt-2">
        <div 
          class="h-2 rounded-full bg-rock-500 transition-all duration-500"
          :style="{ width: `${completionRate}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCoachingStore } from '../../stores/coaching'

const coachingStore = useCoachingStore()

const completionRate = computed(() => {
  const items = coachingStore.plan?.actionItems || []
  if (!items.length) return 0
  const completed = items.filter(a => a.completed).length
  return Math.round((completed / items.length) * 100)
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
}

async function toggleAction(actionId, completed) {
  await coachingStore.toggleAction(actionId, completed)
}
</script>