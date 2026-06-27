<template>
  <div id="app" class="min-h-screen bg-folsom text-loriga">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
onMounted(() => { authStore.initAuth() })
</script>

<style>
.bg-folsom { background-color: #FFFFFF; }
.text-loriga { color: #0A0A0A; }
</style>
