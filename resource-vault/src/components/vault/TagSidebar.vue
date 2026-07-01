<!-- src/components/vault/TagsSidebar.vue -->

<script setup>
// composables
import { ref, computed } from 'vue'
import { useVault } from '@/composables/useVault.js';
import { useTagForm } from '@/composables/useTagForm.js';

// components
import SearchBar from '../ui/SearchBar.vue';
import TagSelectionForm from '@/views/resource-vault/components/save-resource/TagSelectionForm.vue';
import BaseModal from '../ui/BaseModal.vue';
import ContextMenu from '../ui/ContextMenu.vue';
import VaultCategoryForm from '@/views/resource-vault/components/VaultCategoryForm.vue';
import DeleteConfirmationForm from '@/views/resource-vault/components/DeleteConfirmationForm.vue';

const {tagList, addTag, resourcesCountByTag, updateTag, deleteTag} = useVault();

// Props
const props = defineProps({
    // modelValue
    selectedTagsIds: {
        type: Array,
        default: () => []
    }
})

// Emits
const emit = defineEmits(['update:selectedTagsIds'])

/**==================================== */
/** Seleción de etiquetas (filtrado)*/
/**==================================== */

// model local -> filtrado de etiquetas para el padre
const selectedTagsModel = computed({
    get: () => props.selectedTagsIds,
    set: (value) => emit('update:selectedTagsIds', value)
})

const clearSelection = () => {
    emit('update:selectedTagsIds', [])
}

/**============================== */
/* Búsqueda dinámica de etiquetas */
/**============================== */

const placeholder = "Buscar etiqueta..."

const inputSearch = ref('');
const filteredTags = computed(()=>{
    const query = inputSearch.value.toLowerCase();
    if(query.length === 0){
        return tagList.value;
    }
    return tagList.value.filter(tag => tag.name.toLowerCase().includes(query));
})


/**===================== */
/* Modals de TagSidebar */
/**===================== */

const activeModal = ref(null);

const openModal = (modal) => {
    activeModal.value = modal;
}
const closeModal = () => {
    activeModal.value = null;
}

const addTagModalName = "addTagModal";
const showAllTagsModalName = "showAllModal";
const editTagModalName = "editTagModal"
const deleteTagModalName = "deleteTagModal"

/**========================= */
/* Modal Ver todas etiquetas */
/**========================= */

const handleSubmitTags = (tagIds)=>{
    selectedTagsModel.value = tagIds;
    closeModal();
}

/**============ */
/** ContextMenu */
/**============ */

const contextMenuRef = ref(null);
const menuItems = [
    {label: 'editar', action: 'edit'},
    {label: 'eliminar', action: 'delete', danger: true}
]

const openMenuContext = (event, tag) => {
    contextMenuRef.value?.open(event, tag);
}
const handleMenuContextAction = ({action, target}) => {
    if(action === 'edit'){
        console.log('Editar', target);
        currentTag.value = target;
        openModal(editTagModalName)
    }
    if(action === 'delete'){
        console.log('Eliminar', target);
        currentTag.value = target;
        openModal(deleteTagModalName)
    }
}

/**============================ */
/** Agregar y/o Editar etiqueta */
/**============================ */

const saveTagRef = ref(null);

const currentTag = ref(null);

const isEditing = computed(() => activeModal.value === editTagModalName)

const handleCloseSaveTag = () => {
    currentTag.value = null;
    closeModal();
}
const handleCancelSaveTag = () => {
    handleCloseSaveTag();
}
const handleSubmitSaveTag = (tagPayload) => {
    if(saveTagRef.value?.isEdit()){
        updateTag(tagPayload);
    }else{
        addTag(tagPayload);
    }
    handleCloseSaveTag();
}

/** Agregar etiqueta */
const labelAddTag = "Nombre de la etiqueta";
const submitTextAddTag = "Guardar Etiqueta"

/**Editar etiqueta */
const labelUpdateTag = "Nuevo nombre de la etiqueta"
const submitTextUpdateTag = "Guardar"


/**================== */
/** Eliminar Etiqueta */
/**================== */

// Misma varibale de SAVE
// const currentTag = ref(null);

const handleCancelDeleteTagModal = () => {
    currentTag.value = null;
    closeModal()
} 

const handleConfirmDeleteTagModal = (tagId) => {
    deleteTag(tagId);
    // Actulizar selectedTagsModel para que el padre no filtre por Tags que no existen
    selectedTagsModel.value = selectedTagsModel.value.filter(id => id !== tagId)
    currentTag.value = null;
    closeModal();
}

</script>

<template>

    <!-- DELETE TAG  -->
    <BaseModal
        :show="activeModal === deleteTagModalName"
        @close="handleCancelDeleteTagModal"
        mode="delete"
    >
        <template #title>
            Eliminar Etiqueta
        </template>
        <template #body>
            <DeleteConfirmationForm
                vaultCategory="tag"
                :entityId="currentTag.id"
                @cancel-deletion="handleCancelDeleteTagModal"
                @confirm-deletion="handleConfirmDeleteTagModal"
            ></DeleteConfirmationForm>
        </template>
    ></BaseModal>

    <!-- SAVE TAG -->
    <BaseModal
        :show="activeModal === editTagModalName || activeModal === addTagModalName"
        @close="handleCloseSaveTag"
        :mode="isEditing ? 'edit' : 'create'"
    >
        <template #title>
            {{ isEditing ? 'Editar Etiqueta' : 'Agregar nueva Etiqueta' }}
        </template>
        <template #body>
            <VaultCategoryForm
                ref="saveFormRef"
                :currentVaultCategory="currentTag"
                :formComposable="useTagForm"
                :label="isEditing
                    ? labelUpdateTag
                    : labelAddTag"
                :submitText="isEditing
                    ? submitTextUpdateTag
                    : submitTextAddTag"
                @cancel="handleCancelSaveTag"
                @submit="handleSubmitSaveTag"
            ></VaultCategoryForm>
        </template>
    </BaseModal>

     <!-- CONTEXTMENU -->
    <ContextMenu
        ref="contextMenuRef"
        :items="menuItems"
        @select="handleMenuContextAction"
    ></ContextMenu>

    <aside class="tags-sidebar">
        <!-- HEADER -->
        <header class="sidebar-header">
            <div class="title-row">
                <h2>
                    <i class="fa-solid fa-tag"></i> Etiquetas
                </h2>
                <button 
                    class="add-btn"
                    @click="openModal(addTagModalName)"    
                >
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <small>Filtra por una o más etiquetas</small>
        </header>

        <!-- BUSQUEDA -->
        <SearchBar
            :placeholder="placeholder"
            v-model:search="inputSearch"
        ></SearchBar>

        <!-- TAGS -->
        <ul class="tags-list">
            <li v-for="tag in filteredTags" 
                :key="tag.id"
                :class="{selected: selectedTagsIds.includes(tag.id)}"
                @contextmenu="openMenuContext($event, tag)"
            >
                <label class="tag-item">
                    <div class="tag-info">
                        <span class="tag-name">
                            {{ tag.name }}
                        </span>
                        <span 
                            class="tag-count"
                            :class="{selected: selectedTagsIds.includes(tag.id)}"
                        >
                            {{ resourcesCountByTag[tag.id] }}
                        </span>
                    </div>
                    <div 
                        class="checkbox-container"
                    >
                        <input 
                            type="checkbox"
                            :value="tag.id"
                            v-model="selectedTagsModel"
                        >
                    </div>
                </label>
            </li>
        </ul>

        <!-- BTN SHOW ALL -->
        <button 
            class="btn secondary-btn show-all-btn"
            @click="openModal(showAllTagsModalName)"
        >
            Ver todas las etiquetas ({{ tagList.length }})
        </button>

        <!-- SHOW ALL TAGS MODAL -->
        <BaseModal
            :show="activeModal === showAllTagsModalName"
            @close="closeModal"
        >
            <template #title>
                <div class="modal-title">
                    <i class="fa-solid fa-tags"></i>
                    <span> Seleccionar Etiquetas</span>
                </div>
            </template>

            <template #body>
                <TagSelectionForm
                    v-model="selectedTagsModel"
                    @submitTags="handleSubmitTags"
                ></TagSelectionForm>
            </template>
        </BaseModal>

        <!-- BTN  DE-SELECT ALL-->
        <button 
            class="btn secondary-btn"
            @click="clearSelection"
        >
            Deseleccionar todo
        </button>
    </aside>
</template>

<style scoped>

.tags-sidebar{
    width: 100%;
    max-width: 250px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 20px;

    padding: 20px 16px;

    border-left: 1px solid var(--border-color);
}

/* ============ */
/* HEADER */
/* ============ */

.sidebar-header{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
.title-row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
}

.sidebar-header small{
    color: var(--text-secondary);
}

.add-btn{
    width: min-content;
    height: min-content;

    border: none;
    background: transparent;

    cursor: pointer;
}
.add-btn .fa-plus{
    font-size: 1.75rem;

    color: var(--accent);

    transition: 0.2s ease, transform 0.1s ease;
}
.add-btn .fa-plus:hover{
    text-shadow: 0 0 5px var(--accent-hover), 0 0 10px var(--accent-hover);
}
.add-btn .fa-plus:active {
    transform: scale(0.9);
    text-shadow: 0 0 8px var(--accent), 0 0 15px var(--accent);
}

/* ========== */
/* TAGS */
/* ========== */

.tags-list{
    list-style: none;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;

    max-height: calc(3 * 170px);
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
}


.tag-item{
    display: flex;
    justify-content: space-between;

    cursor: pointer;
}

.tag-info{
    width: 80%;

    display: flex;
    justify-content: space-between;

    padding: 14px;
}
.tag-name{
    font-weight: 500;
}
.tag-count{
    color: var(--text-secondary);
}

.checkbox-container{
    width: 20%;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--bg-card-hover);
}
.checkbox-container input[type="checkbox"]{
    border: 1px solid var(--border-color);

    transition: 0.2s;
}

/* hover de etiquetas */
.tags-list li:hover{
    border-color: var(--border-color-hover);
    
    /* glow super sutil */
    box-shadow:
        0 0 0 1px rgba(63, 63, 70, 0.35),
        0 0 8px rgba(63, 63, 70, 0.18);
}
.checkbox-container input:hover{
    border-color: var(--border-color-hover);
}

/* active de etiquetas */
.checkbox-container input[type="checkbox"]:checked{
    background-color: var(--accent-hover);
}
.tags-list li.selected{
    color: var(--accent);
}
.tag-count.selected{
    color: var(--accent-hover);
}


/* ============== */
/* BUTTONS */
/* ============== */

.show-all-btn{
    color: var(--accent-hover);
    padding: 14px 0;
}

</style>
