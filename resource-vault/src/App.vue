<!-- src/App.vue -->

<script setup>
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme.js';

// const initTheme = useTheme.initTheme;
const { initTheme } = useTheme();

onMounted(()=>{
  initTheme();
})

</script>

<template>
  <router-view></router-view>
</template>

<style scoped>

</style>
