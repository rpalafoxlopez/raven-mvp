<template>
  <div class="card flex flex-col h-[600px]">
    <div class="flex items-center gap-3 mb-4 pb-4 border-b border-iron">
      <div class="w-10 h-10 rounded-full bg-rock-500/15 flex items-center justify-center">
        <span class="text-xl">🎸</span>
      </div>
      <div>
        <h3 class="font-bold text-folsom">Raven</h3>
        <p class="text-xs text-emerald-600">● En línea</p>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
      <div 
        v-for="(msg, index) in coachingStore.chatMessages" 
        :key="index"
        :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
      >
        <div 
          :class="msg.role === 'user' 
            ? 'bg-rock-500 text-white max-w-[80%]' 
            : 'bg-neutral-100 text-neutral-700 max-w-[90%]'"
          class="rounded-2xl px-4 py-3 text-sm leading-relaxed"
        >
          <p v-if="msg.role === 'assistant'" class="whitespace-pre-wrap">{{ msg.content }}</p>
          <p v-else>{{ msg.content }}</p>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="coachingStore.sending" class="flex justify-start">
        <div class="bg-neutral-100 rounded-2xl px-4 py-3">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></span>
            <span class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
            <span class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="flex gap-2">
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="Escribe tu mensaje..."
        class="input flex-1"
        :disabled="coachingStore.sending"
      />
      <button 
        @click="sendMessage"
        :disabled="!message.trim() || coachingStore.sending"
        class="btn-primary px-4"
        :class="{ 'opacity-50 cursor-not-allowed': !message.trim() || coachingStore.sending }"
      >
        ➤
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useCoachingStore } from '../../stores/coaching'

const coachingStore = useCoachingStore()
const message = ref('')
const messagesContainer = ref(null)

async function sendMessage() {
  if (!message.value.trim() || coachingStore.sending) return

  const msg = message.value
  message.value = ''

  await coachingStore.sendMessage(msg)
}

// Auto-scroll to bottom
watch(() => coachingStore.chatMessages.length, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})
</script>