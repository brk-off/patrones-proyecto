<!-- src/components/vault/ResurcePanel.vue -->

<script setup>
// vue utilities
import { ref, computed } from 'vue';

// composables
import { useVault } from '@/composables/useVault.js';

// components
import SearchBar from '../ui/SearchBar.vue';
import ResourceCard from './ResourceCard.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import SaveResourceForm from '@/views/resource-vault/components/save-resource/SaveResourceForm.vue';
import ContextMenu from '../ui/ContextMenu.vue';
import DeleteConfirmationForm from '@/views/resource-vault/components/DeleteConfirmationForm.vue';

const { collectionList, tagList, addResource, resourceList, updateResource, deleteResource } = useVault()

// Props
const props = defineProps({
    // Resources con/sin filtros del padre
    filteredResources: Array,
});


/**================= */
// Búsqueda dinámica
/**================= */

const placeholder = "Buscar recurso ignorando colecciones y etiquetas seleccionadas..."

const inputSearch = ref('');

const filteredResources = computed(() => {
    const query = inputSearch.value.toLowerCase();
    if(query.length === 0){
        return props.filteredResources;
    }
    return resourceList.value.filter(resource => resource.title.toLowerCase().includes(query));
})

/**====== */
// Modals */ 
/**====== */

const addResourceModalName = "addResourceModal";
const editResourceModalName = "editResourceModal";
const deleteResourceModalName = "deleteResourceModal";

const activeModal = ref(null)

const closeModal = () => {
    activeModal.value = null;
}
const openModal = (modalName) => {
    activeModal.value = modalName;
}


/**============ */
// ContextMenu
/**============ */

const contextMenuRef = ref(null);
const menuItems =  [
    {label: 'editar', action: 'edit'},
    {label: 'eliminar', action: 'delete', danger: true}
]

const openMenuContext = (event, resource) => {contextMenuRef.value?.open(event, resource)}
const handleMenuContextAction = ({action, target}) => {
    if(action === 'edit'){
        console.log('Editar', target);
        currentResource.value = target
        openModal(editResourceModalName)
    }
    if(action === 'delete'){
        console.log('Eliminar', target);
        currentResource.value = target
        openModal(deleteResourceModalName)
    }
}

/**=================== */
/**SAVE Resource Modal */
/**=================== */

const saveResourceFormRef = ref(null);
const currentResource = ref(null);

const isEditing = computed(() => activeModal.value === editResourceModalName)


const handleCloseSaveResourceModal = () => {
    closeModal()
    currentResource.value = null
};

const handleCancelSaveResource = () => {
    handleCloseSaveResourceModal();
}

const handleSubmitSaveResource = (resourcePayload) => {
    if(saveResourceFormRef?.value?.isEdit()){
        updateResource(resourcePayload)
    }else{
        addResource(resourcePayload)
    }
    handleCloseSaveResourceModal();
};

/**================== */
/**Eliminar Resource  */
/**================== */

const handleCloseDeleteResourceModal = () => {
    currentResource.value = null
    closeModal()
}

const handleCancelDeleteResource = () => {
    handleCloseDeleteResourceModal()
}
const handleConfirmDeleteResource = (resourceId) => {
    deleteResource(resourceId)
    handleCloseDeleteResourceModal()
}

</script>

<template>

    <!-- DELETE RESOURCE MODAL -->
    <BaseModal
        :show="activeModal === deleteResourceModalName"
        @close="handleCloseDeleteResourceModal"
        mode="delete"
    >
        <template #title>
            Eliminar Recurso
        </template>

        <template #body>
            <DeleteConfirmationForm
                vault-category="resource"
                :entity-id="currentResource?.id"
                @confirm-deletion="handleConfirmDeleteResource"
                @cancel-deletion="handleCancelDeleteResource"
            ></DeleteConfirmationForm>
        </template>
    </BaseModal>

    <!-- SAVE RESOURCE MODAL -->
    <BaseModal
        :show="activeModal === addResourceModalName || activeModal === editResourceModalName"
        @close="handleCloseSaveResourceModal"
        :mode="isEditing ? 'edit' : 'create'"
    >
        <template #title>
            {{ isEditing ? 'Editar Recurso' : 'Nuevo Recuros' }}
        </template>
        <template #body>
            <SaveResourceForm
                ref="saveResourceFormRef"
                :currentResource="currentResource"
                @cancel="handleCancelSaveResource"
                @submit="handleSubmitSaveResource"
            ></SaveResourceForm>
        </template>
    </BaseModal>

    <!-- RESOURCE PANEL -->
    <section class="resource-panel">
        
        <!-- HEADER -->
        <header class="header">
            <div class="title-row">
                <h2>
                    Mi Bóveda de Recursos
                </h2>
                <p>Organiza, filtra y accede rápidamente a tus enlaces guardados</p>
            </div>
            <button 
                class="btn main-btn"
                @click="openModal(addResourceModalName)"
            >
                <i class="fa-solid fa-plus"></i> Nuevo Recurso
            </button>
        </header>

        <!-- PANEL / DASHBOARD -->
        <section class="panel">
            
            <!-- SEARCH -->
            <SearchBar
                :placeholder="placeholder"
                v-model:search="inputSearch"
            >
            </SearchBar>

            <!-- CARDS CONTAINER -->
            <div 
                v-if="filteredResources.length===0"
                class="cards-container"
            >
                <small>No hay recursos que coincidan con la búsqueda o filtrados.</small>
            </div>
            <div
                v-else-if="inputSearch.length!==0"
                class="cards-container"
            >
                <ResourceCard
                    v-for="resource in filteredResources"
                    :key="resource.id"
                    :resource="resource"
                ></ResourceCard>
            </div>
            <div 
                v-else
                class="cards-container"
            >
                <ResourceCard
                    v-for="resource in filteredResources"
                    :key="resource.id"
                    :resource="resource"
                    @contextmenu="openMenuContext($event, resource)"
                ></ResourceCard>
            </div>
        </section>
    </section>

    <!-- CONTEXTMENU -->
    <ContextMenu
        ref="contextMenuRef"
        :items="menuItems"
        @select="handleMenuContextAction"
    ></ContextMenu>
</template>

<style scoped>

.resource-panel{
    display: flex;
    flex-direction: column;
    gap: 20px;

    padding: 20px;
}

small{
    color: var(--text-secondary);
}

/* ============= */
/* HEADER */
/* ============= */

.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title-row{
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.title-row p{
    color: var(--text-secondary);
}

.header button{
    font-size: 1.05rem;
}

/* ============= */
/* PANEL */
/* ============= */

.panel{
    border: 1px solid var(--border-color);
    border-radius: 14px;

    display: flex;
    flex-direction: column;
    gap: 20px;

    padding: 20px;

    background-color: var(--bg-card);
}

/* =============== */
/* CARDS CONTAINER*/
/* =============== */
.cards-container{
    display: grid;
    /* 3 columnas con el mismo ancho (1 fracción cada una) */
    grid-template-columns: repeat(3, 1fr); 
    gap: 20px;
    
    /* CONTROL DE ALTURA */
    /* CÁLCULO: 3 filas => (3 filas * 200px de tarjeta)  */
    max-height: calc(3 * 200px);
    overflow-y: auto; 
    overflow-x: hidden; 

    padding: 15px;

    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding-right: 8px; /* Un pequeño espacio para que las tarjetas no peguen con la barra de scroll */
}
.cards-container::-webkit-scrollbar {
    width: 6px;   
}
.cards-container::-webkit-scrollbar-thumb {
    background-color: var(--border-color, #ccc); 
    border-radius: 3px;
    cursor: pointer;
}

</style>
