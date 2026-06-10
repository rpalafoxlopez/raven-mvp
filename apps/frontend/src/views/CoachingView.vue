<template>
  <div class="min-h-screen bg-neutral-950">
    <!-- Header -->
    <header class="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="text-neutral-400 hover:text-white">←</router-link>
          <span class="font-bold text-xl">Coach Raven</span>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Chat -->
        <div class="lg:col-span-2">
          <ChatInterface />
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <ActionPlan />

          <div class="card">
            <h4 class="font-bold mb-3">Metas</h4>
            <div v-if="coachingStore.plan?.goals?.length" class="space-y-2">
              <div v-for="(goal, i) in coachingStore.plan.goals" :key="i" class="flex items-center gap-2">
                <span class="text-rock-400">▸</span>
                <span class="text-sm">{{ goal }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-neutral-500">
              No tienes metas definidas. Chatea con Raven para establecerlas.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCoachingStore } from '../stores/coaching'
import ChatInterface from '../components/coaching/ChatInterface.vue'
import ActionPlan from '../components/coaching/ActionPlan.vue'

const coachingStore = useCoachingStore()

onMounted(() => {
  coachingStore.fetchPlan()
})
</script>