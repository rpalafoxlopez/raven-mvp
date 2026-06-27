<template>
  <div class="min-h-screen bg-loriga text-folsom">

    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-iron bg-loriga/90 backdrop-blur-md">
      <div class="flex items-center justify-between px-5 py-4 mx-auto max-w-7xl md:px-16">
        <div class="flex items-center gap-4">
          <router-link to="/dashboard" class="font-mono text-xs tracking-wider transition-colors text-halford hover:text-solstis">
            ← Dashboard
          </router-link>
          <span class="text-iron">|</span>
          <span class="font-mono text-xs tracking-widest uppercase text-solstis">Agente Raven</span>
        </div>
      </div>
    </header>

    <div class="px-5 py-10 mx-auto max-w-7xl md:px-16">
      <div class="grid gap-8 lg:grid-cols-3">

        <!-- Chat -->
        <div class="lg:col-span-2">
          <ChatInterface />
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <ActionPlan />

          <!-- Metas -->
          <div class="p-6 border border-iron bg-loriga-soft">
            <h4 class="mb-4 font-mono text-xs tracking-widest uppercase text-halford">Metas</h4>
            <div v-if="coachingStore.plan?.goals?.length" class="space-y-2">
              <div v-for="(goal, i) in coachingStore.plan.goals" :key="i" class="flex items-start gap-2">
                <span class="mt-1 text-[10px] text-solstis">›</span>
                <span class="font-body text-sm text-folsom">{{ goal }}</span>
              </div>
            </div>
            <div v-else class="font-mono text-xs text-halford">
              No tienes metas definidas.<br>Chatea con Raven para establecerlas.
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
onMounted(() => { coachingStore.fetchPlan() })
</script>
