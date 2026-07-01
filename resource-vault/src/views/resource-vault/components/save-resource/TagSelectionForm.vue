<!-- src/views/resource-vault/components/save-resource/SelectTagsForm.vue -->

<script setup>
// utils
import { computed } from 'vue';
import { useVault } from '@/composables/useVault';
const {tagList, resourcesCountByTag} = useVault();

// Props
const props = defineProps({
    modelValue:{
        type: Array,
        default: () => []
    }
});

// Emits
const emit = defineEmits(['update:modelValue', 'submitTags'])

/**====================== */
/** Seleción de etiquetas */
/**====================== */

const selectedTags = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

// Deseleccionar todas las etiquetas
function clearSelection(){
    selectedTags.value = [];
}

// Confirmar selección de etiquetas
function confirmSelection(){
    emit('submitTags', props.modelValue);
}

</script>

<template>
    <div class="tags-container">
        <ul class="tags-list">
            <li 
                v-for="tag in tagList"
                :key="tag.id"
                :class="{selected: selectedTags?.includes(tag.id)}"      
            >
                <label class="tag-item">
                    <input 
                        type="checkbox"
                        :value="tag.id"
                        v-model="selectedTags"
                    >
                    <div class="tag-info">
                        <span class="tag-name">
                            {{ tag.name }}
                        </span>
                        <span 
                            class="tag-count"
                            :class="{selected: selectedTags.includes(tag.id)}"                        
                        >
                            {{ resourcesCountByTag[tag.id] }}
                        </span>
                    </div>
                </label>
            </li>
        </ul>
    </div>
    <div class="buttons-container">
        <button
            class="btn secondary-btn"
            @click="clearSelection"
        >
            Deseleccionar todo
        </button>
        <button
            class="btn main-btn"
            @click="confirmSelection"
        >
            Confirmar
        </button>
    </div>
</template>

<style scoped>
.tags-list{
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
.tags-list::-webkit-scrollbar {
    width: 6px; /* Barra delgada */
}
.tags-list::-webkit-scrollbar-track {
    background: transparent; /* Fondo invisible para que no ensucie */
}
.tags-list::-webkit-scrollbar-thumb {
    background-color: var(--border-color); /* Usa el mismo color de tus bordes */
    border-radius: 4px;
}
.tags-list::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-secondary); /* Se oscurece/aclara al pasar el mouse */
}

.tags-list li{
    background-color: var(--bg-card);

    border-radius: 8px;
    border: 1px solid var(--border-color);

    overflow: hidden;

    flex-shrink: 0;

    transition: all 0.3s ease;

    width: max-content;
}

.tag-item{
    display: flex;
    justify-content: space-between;

    width: 100%;

    cursor: pointer;
}
.tag-item input[type="checkbox"]{
    display: none;
}

.tag-info{
    width: 100%;

    display: flex;
    justify-content: space-between;
    gap: 15px;

    padding: 14px;
}
.tag-name{
    font-weight: 500;
}
.tag-count{
    transition: all 0.3s ease;

    color: var(--text-secondary);
}

/* hover de etiquetas */
.tags-list li:hover{
    border-color: var(--border-color-hover);
    
    /* glow super sutil */
    box-shadow:
        0 0 0 1px rgba(63, 63, 70, 0.35),
        0 0 8px rgba(63, 63, 70, 0.18);
}

/* active de etiquetas */
.tags-list li.selected{
    color: var(--accent);
    border-color: var(--accent-hover);
}
.tag-count.selected{
    color: var(--accent-hover);
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
