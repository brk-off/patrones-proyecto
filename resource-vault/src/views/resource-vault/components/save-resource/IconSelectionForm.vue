/*  */

<script setup>

import { ref, computed } from 'vue';

import SearchBar from '@/components/ui/SearchBar.vue';

import deviconList from '@/data/devicon.json'

const props = defineProps({
    modelValue:{
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelValue', 'submitIcon', 'selectNone'])

// modelValue local
const selectedIcon = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

function confirmSelection(){
    emit('submitIcon', props.modelValue);
}

// Considerar enviar objeto con campos vacios o un null
function selectNone(){
    const emptyIcon = {
        name: '',
        variant: '',
        colored: true,
        color: ''
    }
    emit('update:modelValue', emptyIcon)
    emit('selectNone', emptyIcon)
}

/**============== */
/** BÚSQUEDA */
/**============== */

const inputSearch = ref('');
const placeholder = "Buscar ícono..."

const filteredIcons = computed(() => {
    const query = inputSearch.value.toLowerCase().trim();

    // Si el buscador está vacío, devolvemos la lista completa tal cual
    if (query === '') {
        return deviconList;
    }

    // 1. Filtramos y calculamos la prioridad al mismo tiempo
    const matchedIcons = deviconList.reduce((acc, icon) => {
        const nameMatch = icon.name.toLowerCase().includes(query);
        const altNameMatch = icon.altnames.some(altName => altName.toLowerCase().includes(query));
        const tagsMatch = icon.tags.some(tag => tag.toLowerCase().includes(query));

        // Si coincide con algo, calculamos su peso de prioridad
        if (nameMatch || altNameMatch || tagsMatch) {
            let priority = 0;

            if (nameMatch) {
                priority = 3; // Máxima prioridad si coincide el nombre
            } else if (altNameMatch) {
                priority = 2; // Prioridad media si coincide el nombre alternativo
            } else if (tagsMatch) {
                priority = 1; // Prioridad baja si solo coincide en los tags
            }

            acc.push({ ...icon, _priority: priority });
        }

        return acc;
    }, []);

    // 2. Ordenamos de mayor a menor prioridad
    return matchedIcons.sort((a, b) => b._priority - a._priority);
});

</script>

<template>
    <div class="modal-container">
        <div class="search-container">
            <SearchBar
                :placeholder="placeholder"
                v-model:search="inputSearch"
            ></SearchBar>
        </div>
        <div class="icons-container">
            <ul class="icons-list">
                <li 
                    v-for="icon in filteredIcons"
                    :key="icon.name"
                    :class="{selected:  selectedIcon.name === icon.name}"      
                >
                    <label class="icon-item">
                        <input 
                            type="radio"
                            name="icons"
                            :value="{ 
                                name: icon.name,
                                variant: icon.versions.font[0],
                                colored: true,
                                color: icon.color
                            }"
                            v-model="selectedIcon"
                        >
                        <div class="icon-info">
                            <i
                                :class="[ `devicon-${icon?.name}-${icon?.versions.font[0]}`, 'colored']"
                            ></i>
                            <span class="icon-name">
                                {{ icon.name }}
                            </span>
                        </div>
                    </label>
                </li>
            </ul>
        </div>
        <div class="buttons-container">
            <button
                class="btn secondary-btn"
                @click="selectNone"
            >
                Sin Ícono
            </button>
            <button
                class="btn main-btn"
                @click="confirmSelection"
            >
                Confirmar
            </button>
        </div>
    </div>
</template>

<style scoped>

.modal-container{
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.icons-list{
    list-style: none;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;

    max-height: calc(3 * 100px);
    overflow-y: auto;

    padding: 2px;
    padding-right: 4px;
}
/* Estilos personalizados para la barra de scroll (Opcional) */
.icons-list::-webkit-scrollbar {
    width: 6px; /* Barra delgada */
}
.icons-list::-webkit-scrollbar-track {
    background: transparent; /* Fondo invisible para que no ensucie */
}
.icons-list::-webkit-scrollbar-thumb {
    background-color: var(--border-color); /* Usa el mismo color de tus bordes */
    border-radius: 4px;
}
.icons-list::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-secondary); /* Se oscurece/aclara al pasar el mouse */
}

.icons-list li{
    background-color: var(--bg-card);

    border-radius: 8px;
    border: 1px solid var(--border-color);

    overflow: hidden;

    flex-shrink: 0;

    transition: all 0.3s ease;

    width: max-content;
}

/* =================== */
/* ICON ITEM (LABEL) */
/* =================== */

.icon-item{
    display: flex;
    justify-content: space-between;

    width: 100%;

    cursor: pointer;
}
.icon-item input[type="radio"]{
    display: none;
}

.icon-info{
    width: 100%;

    display: flex;
    justify-content: space-between;
    gap: 15px;

    font-size: 1rem;

    padding: 12px;
}

.icon-info i{
    font-size: 1.5em;
}
.icon-name{
    font-weight: 500;
}

/* hover de etiquetas */
.icons-list li:hover{
    border-color: var(--border-color-hover);
    
    /* glow super sutil */
    box-shadow:
        0 0 0 1px rgba(63, 63, 70, 0.35),
        0 0 8px rgba(63, 63, 70, 0.18);
}

/* active de etiquetas */
.icons-list li.selected{
    border-color: var(--accent-hover);
}

/* ==================== */
/* BUTTONS CONTAINER */
/* ==================== */ 

.buttons-container{
    border-top: 1px solid var(--border-color);

    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;

    margin-top: 10px;

    padding: 15px 15px 5px;
}

</style>
