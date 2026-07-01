<!-- src/views/resource-vault/components/VaultCategoryForm.vue -->

<!-- Formulario para CREAR y/o EDITAR una Collection o Tag -->

<script setup>

import { toRef } from 'vue';

// props
const props = defineProps({
    /**Collection o Tag recibida:
     * null -> se tiene que crear una nueva
     * value -> se tiene que editar
     */
    currentVaultCategory: {
        type: Object,
        default: null
    },
    formComposable: {
        type: Function,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    submitText: {
        type: String,
        required: true
    }
})

// emits
const emit = defineEmits(['submit', 'cancel']);

/**Al trabajar con objetos reactivos y desestructurarlos, se 
 * pierde la reactividad. Lo valores desestructurados se quedan
 * con sus valores al momento de la desestructuración, si cambia
 * el objeto reactivo, sus propiedades en la desestructuración 
 * no se enterarán.
 * 
 * Solución: toRef()
 * toRef actúa como un puente o "espejo". Si modificas la nueva 
 * referencia, el objeto original se actualiza. Y si el objeto
 * original cambia, la referencia también.
 */
const currentVaultCategoryRef = toRef(props, 'currentVaultCategory');
const {form, errors, validate, reset, toPayload, isEdit} = props.formComposable(currentVaultCategoryRef);


const handleCancel = () => {reset(); emit('cancel')};
const handleSubmit = () => {
    if(!validate()){
        console.log("Errores al validar el form: ", errors);
        return;
    }
    console.log('Validó OK');
    const formPayload = toPayload();
    emit('submit', formPayload)
    reset();
}

defineExpose({isEdit})

</script>

<template>
    <form
        class="form"
        @submit.prevent="handleSubmit"
        novalidate
    >
        <div class="form-group">
            <label 
                for="form-name"
            >
                {{ label }}
                <small class="required">*</small>
            </label>
            <input 
                class="form-input"
                :class="{
                    'contains-some': form.name !== '',
                    'validation-warning': errors?.name
                }"
                type="text"
                id="form-name"
                v-model="form.name"
            >
            <small
                v-if="errors?.name"
                class="error-msg"
            >
                {{ errors?.name }}
            </small>
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
                {{ submitText }}
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
.form-group label{
    font-size: 1.1rem;
}
.required{
    font-size: 1.1rem;
    color: #ff3b3b
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

/* =========== */
/* FORM INPUTS */
/* =========== */

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

/* ================== */

/* ================== */

.contains-some{
    border-color: var(--accent);
}

/* =========================== */
/* FIELD VALIDATION WARNING */
/* =========================== */

.validation-warning {
    border-color: var(--danger);
}
.error-msg {
    color: var(--danger);
}
</style>
