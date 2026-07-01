<!-- src/views/resource-vault/components/save-resource/SaveResourceForm.vue -->

<script setup>
import { computed, ref, toRef } from 'vue';
import { isValidHttpUrl, isValidResourceTitle } from '@/utils/validation.js';
import { useResourceForm } from '@/composables/useResourceForm.js';

// Components
import CollectionSelectionForm from './CollectionSelectionForm.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import TagSelectionForm from './TagSelectionForm.vue';
import IconSelectionForm from './IconSelectionForm.vue';


// props
const props = defineProps({
    currentResource: {
        type: Object,
        default: null
    }
})

// emits
const emit = defineEmits(['submit', 'cancel',])


const currentResourceRef = toRef(props, 'currentResource')
const {form, errors, validate, reset, toPayload, isEdit} = useResourceForm(currentResourceRef);


/**============= */
/**SAVE RESOURCE */
/**============= */

// validation
const titleHelpText = computed(()=> errors.value?.title || "El título identificará tu recurso")
const urlTextHelp = computed(()=> errors.value?.url || 'La dirección web a la que redirige este recurso');
const collectionHelpText = computed(()=> errors.value?.collectionId || 'Elige la colección a la que pertenece este recurso');

const handleCancel = () => {
    reset();
    emit('cancel');
};

const handleSubmitResource = () => {
    if(!validate()){
        console.log("Errores al validar el resourceForm: ", errors);
        return;
    }
    const resourcePayload = toPayload();
    emit('submit', resourcePayload);
    reset();
}

defineExpose({ isEdit })


/**=================== */
/**FIELD SELECTION MODALS
 * - Tag
 * - Collection
 * - Icon */
/**=================== */

const activeModal = ref(null);

const openModal = (modal) => {
    activeModal.value = modal;
}
const closeModal = () => {
    activeModal.value = null;
}

// Recibir etiquetas seleccionadas desde el modal
const handleSubmitTags = (tagIds) => {
    form.value.tagIds = tagIds;
    closeModal();
    console.log("Tags seleccionadas recibidas del modal Tags: ", tagIds);
}
// Recibir colección seleccionada desde el modal 
const handleSubmitCollection = (collectionId)=>{
    form.value.collectionId = collectionId;
    closeModal();
    console.log("Collection seleccionada recibida del modal Collection: ", collectionId);
}
// Recibir icono seleccionado desde el modal 
const handleSubmitIcon = (icon)=>{
    form.value.icon = icon;
    closeModal();
    console.log("Icon recibido del modal: ", icon);
}

</script>

<template>
    <form 
        class="form"
        @submit.prevent="handleSubmitResource"
        novalidate
    >
        <!-- FIELDS CONTAINER -->
        <div class="fields-container">

            <!-- TITLE FIELD -->
            <div class="form-group">
                <label for="title">
                    Título
                    <small class="required">*</small>
                </label>
                <div class="field-control">
                    <input
                        id="title"
                        v-model="form.title"
                        type="text"
                        placeholder="Ej: Guía completa de Flexbox"
                        class="form-input"
                        :class="{
                            'contains-some': form?.title,
                            'validation-warning': errors?.title && (!form?.title || !isValidResourceTitle(form.id, form?.title))}"
                    >
                    <small 
                        class="help-text"
                        :class="{'validation-warning': errors?.title}"    
                    >{{titleHelpText}}</small>
                </div>
            </div>

            <!-- DESCRIPTION FIELD -->
            <div class="form-group">
                <label for="description">
                    Descripción
                    <small class="optional">(Opcional)</small>
                </label>
                <div class="field-control">
                    <textarea
                        id="description"
                        v-model="form.description"
                        placeholder="Ej: Una guía práctica sobre Flexbox con ejemplos prácticos..."
                        class="form-input form-textarea"
                        :class="{'contains-some': form?.description}"
                    ></textarea>
                    <small class="help-text">Información adicional sobre el recurso</small>
                </div>
            </div>

            <!-- URL FIELD -->
            <div class="form-group">
                <label for="url">
                    URL
                    <small class="required">*</small>
                </label>
                <div class="field-control">
                    <input
                        id="url"
                        v-model="form.url"
                        type="url"
                        placeholder="https://"
                        class="form-input"
                        :class="{
                            'contains-some': form?.url,
                            'validation-warning': errors?.url && (form?.url || !isValidHttpUrl(form?.url))}"
                    >
                    <small 
                        class="help-text"
                        :class="{'validation-warning': errors?.url}"
                    >
                        {{ urlTextHelp }}
                    </small>
                </div>
            </div>

            <!-- COLLECTION FIELD -->
            <div class="form-group">
                <label for="collection">
                    Colección
                    <small class="required">*</small>
                </label>
                <div class="field-control">
                    <button
                        type="button"
                        class="btn form-input"
                        @click="openModal('collection')"
                        :class="{
                            'contains-some': form?.collectionId,
                            'validation-warning': errors?.collectionId && !form?.collectionId}"
                    >
                        Seleccionar colección
                    </button>

                    <!-- COLLECTION SELECTION MODAL -->
                    <BaseModal
                        nested
                        :show="activeModal === 'collection'"
                        @close="closeModal"
                        mode="none"
                    >
                        <template #title>
                            <i class="fa-solid fa-folder"></i>
                            <span> Seleccionar Colección</span>
                        </template>

                        <template #body>
                            <CollectionSelectionForm
                                v-model="form.collectionId"
                                @submitCollection="handleSubmitCollection"
                                @cancel="closeModal"
                            ></CollectionSelectionForm>
                        </template>
                    </BaseModal>
                
                    <small 
                        class="help-text" 
                        :class="{'validation-warning': errors?.collectionId && form?.collectionId}"
                    >{{ collectionHelpText }}</small>
                </div>
            </div>

            <!-- TAGS FIELD -->
            <div class="form-group">
                <label>
                    Etiquetas
                    <small class="optional">(Opcional)</small>
                </label>
                <div class="field-control">
                    <button
                        type="button"
                        class="btn form-input"
                        @click="openModal('tags')"
                        :class="{'contains-some': form?.tagIds?.length > 0}"
                    >
                        Seleccionar etiquetas
                    </button>

                    <!-- TAG SELECTION MODAL -->
                        <BaseModal
                            nested
                            :show="activeModal === 'tags'"
                            @close="closeModal"
                            mode="none"
                        >
                            <template #title>
                                <i class="fa-solid fa-tags"></i>
                                <span>Seleccionar Etiquetas</span>
                            </template>

                            <template #body>
                                <TagSelectionForm
                                    v-model="form.tagIds"
                                    @submitTags="handleSubmitTags"
                                ></TagSelectionForm>
                            </template>
                        </BaseModal>
                    <small class="help-text">Puedes seleccionar varias etiquetas para clasificar mejor tu recurso</small>
                </div>
            </div>

            <!-- ICON FIELD -->
            <div class="form-group">
                <label for="icon">
                    Ícono
                    <small class="optional">(Opcional - Solo Visual)</small>
                </label>
                <div class="field-control">
                    <div class="icon-selector"
                        :class="{'contains-some': form?.icon?.name}"
                    >
                        <div 
                            class="icon-preview"
                            v-if="form?.icon?.name"
                        >
                            <i 
                                :class="[`devicon-${form?.icon?.name}-${form?.icon?.variant}`, {colored: form?.icon?.colored}]"
                            ></i>
                        </div>
                        <small class="help-text">
                            Puede agregar un ícono relacionado con su recurso, esto es una opción solamente visual.
                            Ícono escogido: {{ form?.icon?.name ? form?.icon.name : 'Sin ícono' }}
                        </small>
                    </div>
                    <button
                        type="button"
                        class="btn form-input"
                        @click="openModal('icon')"
                        :class="{'contains-some': form?.icon?.name}"
                    >
                        Seleccionar ícono
                    </button>

                    <!-- ICON SELECTION MODAL -->
                    <BaseModal
                        :show="activeModal === 'icon'"
                        nested
                        @close="closeModal"
                        mode="none"
                    >
                        <template #title>
                            Seleccionar Ícono
                        </template>

                        <template #body>
                            <IconSelectionForm
                                v-model="form.icon"
                                @submitIcon="handleSubmitIcon"
                                @selectNone="handleSubmitIcon"
                            ></IconSelectionForm>
                        </template>
                    </BaseModal>
                </div>
            </div>

        </div>

        <!-- BUTTONS CONTAINER -->
        <div class="buttons-container">
            <button
                type="button"
                class="btn secondary-btn"
                @click="handleCancel"
            >
                Cancelar
            </button>
            <button
                type="submit"
                class="btn main-btn"
            >
                Guardar Recurso
            </button>
        </div>
    </form>
</template>

<style scoped>

/* ==================== */
/* FORM CONTAINER */
/* ==================== */

.form {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;

    height: 100%;

}

/* ==================== */
/* FIELDS CONTAINER */
/* ==================== */

.fields-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0;

    height: 100%;
}

/* ==================== */
/* FORM GROUP */
/* ==================== */

.form-group {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

}

/* Field name */
.form-group label {
    font-weight: 600;
    display: flex;
    gap: 4px;
    align-items: center;
    font-size: 1.1rem;
}
.form-group label small {
    font-weight: 500;
}
.form-group label small.required {
    color: #ff3b3b;
}
.form-group label small.optional {
    color: var(--text-secondary);
    font-weight: 400;
    font-size: 0.85rem;
}

/* ==================== */
/* FIELD CONTROL (input + helper text) */
/* ==================== */

.form-group .field-control{
    width: 70%;

    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* ==================== */
/* FORM INPUTS */
/* ==================== */

.form-input {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--bg-main);
    transition: all 0.2s ease;
}

.form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(65, 184, 131, 0.1);
}

.form-input::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
}

.form-textarea {
    resize: vertical;
    min-height: 60px;
    resize: none;
    color: var(--text-primary);
}
/* Estilos personalizados para la barra de scroll (Opcional) TEXTAREA*/
.form-textarea::-webkit-scrollbar {
    width: 4px; /* Barra delgada */
    height: 2px;
}
.form-textarea::-webkit-scrollbar-track {
    background: transparent; /* Fondo invisible para que no ensucie */
}
.form-textarea::-webkit-scrollbar-thumb {
    background-color: var(--border-color); /* Usa el mismo color de tus bordes */
    border-radius: 4px;
}
.form-textarea::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-secondary); /* Se oscurece/aclara al pasar el mouse */
}

.form-input.btn{
    font-weight: 500;
}


/* ================== */

/* ================== */

.contains-some{
    border-color: var(--accent);
}


/* ==================== */
/* HELP TEXT */
/* ==================== */

.help-text {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 400;
}

/* ==================== */
/* ICON SELECTOR */
/* ==================== */

.icon-selector {
    display: flex;
    gap: 50px;
    padding: 16px;
    background-color: var(--bg-main);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.icon-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30%;
    background-color: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 2rem;
    color: var(--text-primary);
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

/* =========================== */
/* FIELD VALIDATION WARNING */
/* =========================== */

.validation-warning {
    border-color: var(--danger);
}
.help-text.validation-warning {
    color: var(--danger);
}

</style>
