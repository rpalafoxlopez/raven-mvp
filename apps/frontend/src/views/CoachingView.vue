<template>
  <div class="min-h-screen" style="background:#080808; color:#F8F6F1;">

    <!-- Header -->
    <header class="sticky top-0 z-50 backdrop-blur-md" style="border-bottom:1px solid #2a2a2a; background:rgba(8,8,8,0.9);">
      <div class="flex items-center justify-between px-5 py-4 mx-auto max-w-7xl md:px-16">
        <div class="flex items-center gap-4">
          <router-link to="/dashboard" class="font-mono text-xs tracking-wider transition-colors" style="color:#888880;"
            onmouseenter="this.style.color='#D4AF37'" onmouseleave="this.style.color='#888880'">
            ← Dashboard
          </router-link>
          <span style="color:#2a2a2a;">|</span>
          <span class="font-mono text-xs tracking-widest uppercase" style="color:#D4AF37;">Agente Raven</span>
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
          <div style="background:#111111; border:1px solid #2a2a2a; padding:1.5rem;">
            <h4 class="mb-4 font-mono text-xs tracking-widest uppercase" style="color:#888880;">Metas</h4>
            <div v-if="coachingStore.plan?.goals?.length" class="space-y-2">
              <div v-for="(goal, i) in coachingStore.plan.goals" :key="i" class="flex items-start gap-2">
                <span style="color:#D4AF37; font-size:10px; margin-top:4px;">›</span>
                <span class="font-body text-sm" style="color:#F8F6F1;">{{ goal }}</span>
              </div>
            </div>
            <div v-else class="font-mono text-xs" style="color:#888880;">
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
