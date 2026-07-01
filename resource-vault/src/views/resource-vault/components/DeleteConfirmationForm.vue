<!-- src/views/resource-vault/components/DeleteConfirmationModal.vue -->

<script setup>

import { useVault } from '@/composables/useVault';

const {getCollection, getTag, getResource, resourcesCountByCollection, resourcesCountByTag} = useVault();


// props
const props = defineProps({
    vaultCategory: {
        type: String,
        required: true,
        validator: (value) => ['collection', 'tag', 'resource'].includes(value)
    },
    entityId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['confirm-deletion', 'cancel-deletion'])


const label = () => {
    switch(props.vaultCategory){
        case 'collection': {
            const resourcesCount = resourcesCountByCollection.value[props.entityId];

            return {
                question: `la Colección`,
                itemName: getCollection(props.entityId).name,
                alertMsg:
                    resourcesCount <= 0
                        ? 'Esta Colección no tiene ningún Recurso asociado.'
                        : `Esta Colección tiene ${resourcesCount} Recurso(s) asociado(s). Al eliminarla, los Recursos asociados se perderán.`
            };
        }
        case 'tag': {
            const resourcesCount = resourcesCountByTag.value[props.entityId];

            return {
                question: `la Etiqueta`,
                itemName: getTag(props.entityId).name,
                alertMsg:
                    resourcesCount <= 0
                        ? 'Esta Etiqueta no tiene ningún Recurso asociado.'
                        : `Esta Etiqueta tiene ${resourcesCount} Recurso(s) asociado(s). Al eliminarla, los Recursos asociados dejarán de tener la respectiva Etiqueta.`
            };
        }
        case 'resource': {
            return {
                question: 'el Recurso',
                itemName: getResource(props.entityId).title,
                alertMsg: 'Si borra este Recurso, no pasará nada con la Colección y Etiquetas que tenga asociada'
            }
        }
        default: 
            console.log(props.vaultCategory);
            return "What the hell?"
    }
}


const handleCancelDeletion = () => {
    emit('cancel-deletion');
}
const handleConfirmDeletion = () => {
    emit('confirm-deletion', props.entityId);
}

</script>

<template>

    <form
        class="delete-form"
        @submit.prevent="handleConfirmDeletion"
    >
        <div class="form-group">
            <p>¿Está seguro de que desea eliminar {{ label().question }} <b>{{ label().itemName }}</b></p>
            <p>{{label().alertMsg}}</p>
        </div>
    
        <!-- BUTTONS CONTAINER -->
        <div class="buttons-container">
            <button
                type="button"
                class="btn secondary-btn"
                @click="handleCancelDeletion"
            >
                Cancelar
            </button>
            <button
                type="submit"
                class="btn danger-btn"
            >
                Eliminar
            </button>
        </div>
    </form>
</template>

<style scoped>

/* ==================== */
/* FORM (BODY + FOOTER) */
/* ==================== */

.form{
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    height: 100%;
}


/* ============ */
/* FORM GROUP */
/* ============ */

.form-group{
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.fa-circle-exclamation{
    color: var(--danger);
    font-size: 2.4em;
    opacity: 0.9;
}


/* ==================== */
/* BUTTONS CONTAINER */
/* ==================== */

.buttons-container {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
    margin-top: 20px;
}

.buttons-container .btn {
    padding: 10px;
    font-size: 0.9rem;
}
.buttons-container .btn.secondary-btn:hover{
    border-color: var(--border-color-hover);
}

</style>
