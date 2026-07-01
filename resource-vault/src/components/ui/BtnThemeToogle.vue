<!-- src/components/ui/BtnThemeToogle.vue -->

<script setup>
import { useTheme } from '@/composables/useTheme';

const { toggleTheme, isDark } = useTheme();

</script>

<template>
    <button
        @click="toggleTheme"
        class="btn secondary-btn"
        aria-label="Cambiar tema"
    >
        <i 
            v-if="!isDark"
            class="fa-solid fa-moon icon-dark"
        ></i>
        <i 
            v-else
            class="fa-solid fa-sun icon-light"
        ></i>
    </button>
</template>

<style scoped>

</style>
