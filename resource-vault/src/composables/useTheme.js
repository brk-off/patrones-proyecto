/* src/composables/useTheme.js */

import { ref } from 'vue';

// crear varibale reactiva
const isDark = ref(localStorage.getItem('theme') === 'dark');

export function useTheme(){
    // función para aplicar tema
    const applyTheme = () => {
        if(isDark.value){
            // obtener el <html>
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }else{
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    }

    // función para intercambiar estado
    const toggleTheme = () => {
        isDark.value = !isDark.value;
        applyTheme();
    }

    // aplicar tema guardado al cargar app
    const initTheme = () => {
        applyTheme();
    }

    return {
        isDark,
        toggleTheme,
        initTheme
    }
}
