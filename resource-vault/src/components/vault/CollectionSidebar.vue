<!-- src/components/vault/CollectionSidebar.vue -->

<script setup>

// Vue utilities
import { ref, computed } from 'vue';

// Composables
import { useVault } from '@/composables/useVault';
import { useCollectionForm } from '@/composables/useCollectionForm.js';

// Components
import BaseModal from '../ui/BaseModal.vue';
import SearchBar from '../ui/SearchBar.vue';
import ContextMenu from '../ui/ContextMenu.vue';
import VaultCategoryForm from '@/views/resource-vault/components/VaultCategoryForm.vue';
import DeleteConfirmationForm from '@/views/resource-vault/components/DeleteConfirmationForm.vue';

// 
const { getCollection, collectionList, addCollection, resourcesCountByCollection, updateCollection, deleteCollection } = useVault();

// props
const props = defineProps({
    // modelValue
    selectedCollectionsIds: {
        type: Array,
        default: () => []
    }
})

// emits
const emit = defineEmits(['update:selectedCollectionsIds'])

/**============================ */
/** Modals en CollectionSidebar */
/**============================ */

const addCollectionModalName = "addCollectionModal";
const showAllCollectionsModalName = "showAllCollectionsModal"; // future feature
const editCollectionModalName = "editCollectionModal"; 
const deleteCollectionModalName = "deleteCollectionModal";

const activeModal = ref(null);

const openModal = (modalName) => {
    activeModal.value = modalName;
}
const closeModal = () => {
    activeModal.value = null;
}

/**==================================== */
/** Seleción de colleciones (filtrado) */
/**==================================== */

// model local -> filtrado de colecciones para el padre
const selectedCollectionsModel = computed({
    get: () => props.selectedCollectionsIds,
    set: (value) => emit('update:selectedCollectionsIds', value)
})

// Limpiar selección de colecciones
function clearSelection(){
    emit('update:selectedCollectionsIds', [])
}

/**================== */
/** Búsqueda dinámica */
/**================== */

const inputSearch = ref('');
const placeholder = "Buscar colección...";

const filteredCollections = computed(()=>{
    const query = inputSearch.value
    if(!query){
        return collectionList.value;
    }
    return collectionList.value.filter(collection => {
        return collection.name.trim().toLowerCase().includes(query.toLowerCase()) ;
    });
});

/**============= */
/** ContextMenu */
/**============= */

const contextMenuRef = ref(null)

const menuItems = [
    {label: 'editar', action: 'edit'},
    {label: 'eliminar', action: 'delete', danger: true}
]

const openContextMenu = (event, collection) => {
    console.log("openContextMenu() de CollectionSidebar.vue");
    console.log("collection recibida: ", collection);
    contextMenuRef.value?.open(event, collection)
}

const handleContextMenuAction = ({action, target}) => {
    if(action === 'edit'){
        console.log('Editar', target);

        // actualziar currentCollection (no sé si buscar por id o trabajar con el target)
        currentCollection.value = getCollection(target.id)

        console.log("currentCollection.value: ", currentCollection.value);

        // activar modal de editar collection
        openModal(editCollectionModalName)
    }
    if(action === 'delete'){
        console.log('Eliminar', target);

        // actualziar currentCollection
        currentCollection.value = getCollection(target.id)

        console.log("currentCollection para el modal de delete:", currentCollection.value);

        // activar modal de eliminar collection
        openModal(deleteCollectionModalName)
    }
}

/**======================= */
/* Crear/Editar Collection */
/**======================= */

const saveFormRef = ref(null)

/** collection: null => crear nueva collection
 * collection: Object obtenido del v-for => editar collection existente
 */
const currentCollection = ref(null);

/** Boolean para los valores del respectivo Modal que se abre */
const isEditing = computed(() => activeModal.value === editCollectionModalName)


/** Agregar collecion */
const labelAddCollection = "Nombre de la colección";
const submitTextAddCollection = "Guardar Colección"

/* Editar Tag */
const labelUpdateCollection = "Nuevo nombre de la Colleción"
const submitTextUpdateCollection = "Guardar"

// ADD y/o UPDATE => SAVE
const handleCloseSaveCollectionModal = () => {
    /**Devolver estado a currentCollection
     * - Watch en el composable ejecuta el reset() del form
     */
    currentCollection.value = null;

    closeModal();
}

const handleCancelSaveCollection = () => {
    handleCloseSaveCollectionModal();
}
const handleSubmitSaveCollection = (colelctionPayload) => {
    if(saveFormRef.value?.isEdit()){
        updateCollection(colelctionPayload);
    }else{
        addCollection(colelctionPayload)
    }
    handleCloseSaveCollectionModal();
}


/**============ */
/* Eliminar Tag */
/**============ */

// Misma variable de SAVE
// const currentCollection = ref(null);

const handleCancelDeleteModal = () => {
    currentCollection.value = null;
    closeModal();
}
const handleSubmitDeleteModal = (collectionId) => {
    deleteCollection(collectionId);
    selectedCollectionsModel.value = selectedCollectionsModel.value.filter(id => id !== collectionId);
    currentCollection.value = null;
    closeModal();
}

</script>

<template>

    <!-- DELETE COLLECTION-->
    <BaseModal
        :show="activeModal === deleteCollectionModalName"
        @close="closeModal"
        mode="delete"
    >
        <template #title>
            Eliminar Colección
        </template>
        <template #body>
            <DeleteConfirmationForm
                vaultCategory="collection"
                :entity-id="currentCollection.id"
                @cancel-deletion="handleCancelDeleteModal"
                @confirm-deletion="handleSubmitDeleteModal"
            ></DeleteConfirmationForm>
        </template>
    </BaseModal>


    <!-- SAVE COLLECTION (CREATE AND EDIT) -->
    <BaseModal
        :show="activeModal === editCollectionModalName || activeModal === addCollectionModalName"
        @close="handleCloseSaveCollectionModal"
        :mode="isEditing ? 'edit' : 'create'"
    >
        <template #title>
            {{ isEditing ? 'Editar Colección' : 'Agregar nueva Colección' }}
        </template>
        <template #body>
            <VaultCategoryForm
                ref="saveFormRef"
                :current-vault-category="currentCollection"
                :form-composable="useCollectionForm"
                :label="isEditing
                    ? labelUpdateCollection
                    : labelAddCollection"
                :submit-text="isEditing
                    ? submitTextUpdateCollection
                    : submitTextAddCollection"
                @submit="handleSubmitSaveCollection"
                @cancel="handleCancelSaveCollection"
            ></VaultCategoryForm>
        </template>
    </BaseModal>

    <!-- CONTEXTMENU -->
    <ContextMenu
        ref="contextMenuRef"
        :items="menuItems"
        @select="handleContextMenuAction"
    ></ContextMenu>

    <aside class="collections-sidebar">
        <!-- HEADER -->
        <header class="sidebar-header">
            <div class="title-row">
                <h2>
                    <i class="fa-regular fa-folder"></i> Colecciones
                </h2>
                <button 
                    class="add-btn"
                    @click="openModal(addCollectionModalName)"    
                >
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <small>Selecciona una o más colecciones</small>
        </header>

        <SearchBar
            v-model:search="inputSearch"
            :placeholder="placeholder"
        ></SearchBar>

            
        <!-- COLLECTIONS -->
        <ul class="collections-list">
            <li 
                v-for="collection in filteredCollections" 
                :key="collection.id"
                :class="{selected: selectedCollectionsIds.includes(collection.id)}"
                @contextmenu="openContextMenu($event, collection)"
            >
                <label 
                    class="collection-item"    
                >
                    <input 
                        type="checkbox"
                        class="collection-checkbox"
                        :value="collection.id"
                        v-model="selectedCollectionsModel"
                    >
                    <div class="collection-info">
                        <span 
                            class="collection-name"
                            :class="{selected: selectedCollectionsIds.includes(collection.id)}"
                        >
                            {{ collection.name }}
                        </span>
                        <span 
                            class="collection-count"
                            :class="{selected: selectedCollectionsIds.includes(collection.id)}"    
                        >
                            {{ resourcesCountByCollection[collection.id] }}
                        </span>
                    </div>
                </label>
            </li>
        </ul>

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

.collections-sidebar{
    width: 100%;
    max-width: 250px;
    
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 20px;

    padding: 20px 16px 40px 16px;

    border-right: 1px solid var(--border-color);
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

/* =============== */
/* COLLECTIONS */
/* =============== */

.collections-list{
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

    flex-shrink: 0;
    transition:
        transform .1s ease,
        border-color .25s ease,
        background-color .25s ease,
        box-shadow .25s ease;
}

.collection-item{
    display: flex;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;

    padding: 14px;
}

.collection-item input[type="checkbox"]{
    display: none;
    /* 
    width: 0;
    height: 0;
    opacity: 0;
    */
}

.collection-info{
    display: flex;
    justify-content: space-between;

    width: 100%;    
}
.collection-name{
    font-weight: 500;     
    transition: color 0.25s ease;
}
.collection-count{
    border: none;
    border-radius: 5px;
    padding: 2px;

    background-color: var(--border-color);
    color: var(--text-secondary);

    transition:
        background-color 0.25s ease,
        color 0.25s ease,
        transform 0.15s ease;
}

/* hover de collections */
.collections-list li:hover{
    border-color: var(--border-color-hover);
    
    box-shadow:
        0 0 0 1px rgba(63,63,70,.2),
        0 4px 12px rgba(0,0,0,.08);
}
.collections-list li:hover .collection-count{
    transform: scale(1.05);
}

/* active de collections */
.collections-list li:active{
    transform: scale(0.985);
}
.collections-list li.selected{ 
    border-left: 3px solid var(--accent);
}
.collections-list li.selected:hover{
    border-color: var(--accent-hover);

    box-shadow:
        0 0 0 1px rgba(99,102,241,.15),
        0 4px 12px rgba(99,102,241,.12);
}
.collection-name.selected{
    color: var(--accent);
}
.collection-count.selected{
    color: var(--accent-hover);
}
</style>
