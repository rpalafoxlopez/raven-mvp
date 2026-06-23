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
.bg-folsom { background-color: #080808; }
.text-loriga { color: #F8F6F1; }
</style>
