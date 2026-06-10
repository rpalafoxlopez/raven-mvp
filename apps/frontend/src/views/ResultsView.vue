<template>
  <div class="min-h-screen bg-neutral-950 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div v-if="loading" class="text-center py-20">
        <div class="text-4xl mb-4">🎸</div>
        <p class="text-neutral-400">Analizando tu perfil...</p>
      </div>

      <div v-else-if="result">
        <ArchetypeReveal :archetype="result.archetype" :archetypeData="result.archetypeData" />

        <div class="mt-12">
          <h3 class="text-2xl font-bold mb-6">Tus 8 Pilares</h3>
          <PillarChart :scores="result.scores" />
        </div>

        <div class="mt-12 text-center">
          <router-link to="/dashboard" class="btn-primary text-lg px-8 py-4">
            🚀 Ir al Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import ArchetypeReveal from '../components/results/ArchetypeReveal.vue'
import PillarChart from '../components/results/PillarChart.vue'

const authStore = useAuthStore()
const result = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await authStore.api.get('/api/results/latest')
    result.value = data
  } catch (err) {
    console.error('Error fetching results:', err)
  } finally {
    loading.value = false
  }
})
</script>