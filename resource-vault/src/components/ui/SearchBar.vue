<!-- src/components/ui/SearchBar.vue -->

<script setup>

import { computed } from 'vue';

// const search = defineModel('search', {
//     type: String,
//     default: ''   
// })

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Buscar...'
    },
    // modelValue
    search: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:search'])

// model local
const model = computed({
    get: () => props.search,
    set: (value) => emit('update:search', value)
})

</script>

<template>
    <div class="search-box">
        <input 
            type="text"
            :placeholder="placeholder"
            v-model="model"
        >
            <i class="fa-solid fa-magnifying-glass"></i>
    </div>

</template>


<style scoped>

.search-box{
    display: flex;
    justify-content: center;
    align-items: center;

    padding-right: 8px;

    border: 1px solid var(--border-color);
    border-radius: 12px;
}
.search-box:hover{
    border-color: var(--border-color-hover);
    
    /* glow super sutil */
    box-shadow:
        0 0 0 1px rgba(63, 63, 70, 0.35),
        0 0 8px rgba(63, 63, 70, 0.18);
}
.search-box input{
    width: 90%;

    border: none;
    outline: none; 
}
.search-box input::placeholder{
    color: var(--text-secondary);
}
.search-box .fa-solid{
    color: var(--text-secondary);
    width: 10%;

    display: flex;
    justify-content: end;
}

</style>

