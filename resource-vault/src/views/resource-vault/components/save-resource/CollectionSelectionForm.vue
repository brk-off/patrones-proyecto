<!-- src/views/resource-vault/components/add-new-resource/CollectionSellectionForm.vue -->

<script setup>
// utils
import { computed } from 'vue';
import { useVault } from '@/composables/useVault';

const {collectionList, resourcesCountByCollection} = useVault();

// Props
const props = defineProps({
    // collection seleccionada
    modelValue: {
        type: String,
        default: ''
    }
});

// Emits
const emit = defineEmits(['update:modelValue', 'submitCollection', 'cancel'])

/**======================= */
/** Seleción de Collection */
/**======================= */

const selectedCollection = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

// Cancelar selección
function cancelSelection(){
    emit('cancel');
}

// Confirmar selección de Collection
function confirmSelection(){
    emit('submitCollection', props.modelValue);
}

</script>

<template>
    <div class="collections-container">
        <ul class="collections-list">
            <li 
                v-for="collection in collectionList"
                :key="collection.id"
                :class="{selected: modelValue === collection.id}"      
            >
                <label class="collection-item">
                    <input 
                        type="radio"
                        name="collections"
                        :value="collection.id"
                        v-model="selectedCollection"
                    >
                    <div class="collection-info">
                        <span class="collection-name">
                            {{ collection.name }}
                        </span>
                        <span 
                            class="collection-count"
                            :class="{selected: modelValue === collection.id}"                        
                        >
                            {{ resourcesCountByCollection[collection.id] }}
                        </span>
                    </div>
                </label>
            </li>
        </ul>
    </div>
    <div class="buttons-container">
        <button
            class="btn secondary-btn"
            @click="cancelSelection"
        >
            Cancelar
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
.collections-list{
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
.collections-list::-webkit-scrollbar {
    width: 6px; /* Barra delgada */
}
.collections-list::-webkit-scrollbar-track {
    background: transparent; /* Fondo invisible para que no ensucie */
}
.collections-list::-webkit-scrollbar-thumb {
    background-color: var(--border-color); /* Usa el mismo color de tus bordes */
    border-radius: 4px;
}
.collections-list::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-secondary); /* Se oscurece/aclara al pasar el mouse */
}

.collections-list li{
    background-color: var(--bg-card);

    border-radius: 8px;
    border: 1px solid var(--border-color);

    overflow: hidden;

    flex-shrink: 0;

    transition: all 0.3s ease;

    width: max-content;
}

.collection-item{
    display: flex;
    justify-content: space-between;

    width: 100%;

    cursor: pointer;
}
.collection-item input[type="radio"]{
    display: none;
}

.collection-info{
    width: 100%;

    display: flex;
    justify-content: space-between;
    gap: 15px;

    padding: 14px;
}
.collection-name{
    font-weight: 500;
}
.collection-count{
    transition: all 0.3s ease;

    color: var(--text-secondary);
}

/* hover de etiquetas */
.collections-list li:hover{
    border-color: var(--border-color-hover);
    
    /* glow super sutil */
    box-shadow:
        0 0 0 1px rgba(63, 63, 70, 0.35),
        0 0 8px rgba(63, 63, 70, 0.18);
}

/* active de etiquetas */
.collections-list li.selected{
    color: var(--accent);
    border-color: var(--accent-hover);
}
.collection-count.selected{
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
