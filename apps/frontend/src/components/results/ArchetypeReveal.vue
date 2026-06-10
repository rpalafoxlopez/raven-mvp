<template>
  <div class="text-center animate-reveal">
    <div class="mb-6">
      <span class="text-6xl">{{ emoji }}</span>
    </div>

    <p class="text-rock-400 font-semibold text-lg mb-2">Tu arquetipo es</p>
    <h1 class="text-5xl sm:text-6xl font-black mb-4">{{ archetypeData.name }}</h1>
    <p class="text-xl text-neutral-400 italic mb-8">"{{ archetypeData.tagline }}"</p>

    <div class="card max-w-2xl mx-auto text-left">
      <p class="text-lg text-neutral-300 mb-6">{{ archetypeData.description }}</p>

      <div class="grid sm:grid-cols-2 gap-6">
        <div>
          <h4 class="font-bold text-emerald-400 mb-2">Fortalezas</h4>
          <ul class="space-y-1">
            <li v-for="strength in archetypeData.strengths" :key="strength" class="text-sm text-neutral-400">
              ✦ {{ strength }}
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-amber-400 mb-2">Áreas de crecimiento</h4>
          <ul class="space-y-1">
            <li v-for="weakness in archetypeData.weaknesses" :key="weakness" class="text-sm text-neutral-400">
              ◈ {{ weakness }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-neutral-800">
        <p class="text-sm text-neutral-500">
          Iconos de referencia: {{ archetypeData.rockIcons.join(', ') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  archetype: { type: String, required: true },
  archetypeData: { type: Object, required: true }
})

const emojis = {
  presence: '🎤', creativity: '🎸', resilience: '🔥', charisma: '🤝',
  discipline: '🎛️', intuition: '👁️', rebellion: '⚡', vision: '🌟'
}

const emoji = emojis[props.archetype] || '🎸'
</script>

<style scoped>
@keyframes reveal {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.animate-reveal {
  animation: reveal 0.6s ease-out;
}
</style>