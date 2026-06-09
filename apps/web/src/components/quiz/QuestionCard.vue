<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="mb-8">
      <h3 class="font-display text-headline-md md:text-headline-lg text-loriga mb-4 leading-tight">
        {{ question.text }}
      </h3>
      <p v-if="question.subtitle" class="font-body text-body-md text-halford italic">
        {{ question.subtitle }}
      </p>
    </div>

    <div class="space-y-4">
      <button
        v-for="option in question.options"
        :key="option.value"
        @click="selectOption(option.value)"
        class="w-full text-left p-6 border border-outline-variant/30 rounded-lg transition-all duration-300 hover:border-solstis/50 hover:bg-surface-container/50 group"
        :class="{ 
          'border-solstis bg-surface-container/80': selectedValue === option.value,
          'bg-surface-container/20': selectedValue !== option.value
        }"
      >
        <div class="flex items-start gap-4">
          <span 
            class="font-mono text-technical-sm w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 shrink-0 transition-colors"
            :class="{ 'bg-solstis text-folsom border-solstis': selectedValue === option.value }"
          >
            {{ option.label }}
          </span>
          <div>
            <p class="font-body text-body-md text-loriga group-hover:text-solstis transition-colors">
              {{ option.text }}
            </p>
            <p v-if="option.hint" class="font-body text-technical-sm text-halford/60 mt-1">
              {{ option.hint }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string
  text: string
  hint?: string
}

interface Question {
  id: number
  text: string
  subtitle?: string
  options: Option[]
}

interface Props {
  question: Question
  selectedValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

function selectOption(value: string) {
  emit('select', value)
}
</script>
