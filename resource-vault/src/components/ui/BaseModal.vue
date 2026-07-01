<!-- src/views/resource-vault/components/BaseModal.vue -->

<script setup>

// props
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    /** Modales secundarios (colección, tags) encima del principal */
    nested: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        // Considerar un mejor nombre para 'none'
        default: 'none',
        validator: (value) => ['create', 'edit', 'delete', 'none'].includes(value)
    }
})

// emits
const emit = defineEmits(['close'])

function closeModal() {
    emit('close')
}

function closeOnBackdrop(e) {
    if (e.target === e.currentTarget) {
        closeModal()
    }
}


const modalModes = {
    create: {
        icon: 'fa-plus',
        class: 'modal-icon-save'
    },
    edit: {
        icon: 'fa-pen',
        class: 'modal-icon-save'
    },
    delete: {
        icon: 'fa-trash',
        class: 'modal-icon-delete'
    },
    none: {
        icon: 'none',
        class: 'none'
    }
}

</script>

<template>
    <Teleport to="body">
        <Transition name="modal" appear>
            <div
                v-if="props.show"
                class="modal-mask"
                :class="{ 'modal-mask--nested': props.nested }"
                @click="closeOnBackdrop"
            >
                <div
                    class="modal-container"
                    role="dialog"
                    aria-modal="true"
                    @click.stop
                >
                    <header class="modal-header">
                        <div class="modal-title-wrapper">
                            <div
                                class="modal-icon"
                                :class="modalModes[mode].class"
                                v-if="mode !== 'none'"    
                            >
                                <i
                                    class="fa-solid"
                                    :class="modalModes[mode].icon"
                                ></i>
                            </div>
                            <slot name="title">Título por defecto</slot>
                        </div>

                        <button
                            type="button"
                            class="btn secondary-btn"
                            aria-label="Cerrar"
                            @click="closeModal"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </header>

                    <div class="modal-body">
                        <slot name="body"></slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>

/* ==================== */
/* MODAL MASK (OVERLAY) */
/* ==================== */

.modal-mask {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-mask--nested {
    z-index: 10050;
    background-color: rgba(0, 0, 0, 0.35);
}

/* ==================== */
/* MODAL CONTAINER */
/* ==================== */

.modal-container {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 0;
    border-radius: 14px;
    width: 95%;
    max-width: 750px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    height: min-content;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* ==================== */
/* MODAL HEADER */
/* ==================== */

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding: 20px;
    gap: 15px;
    flex-shrink: 0;

    font-size: 1.3rem;
}

.modal-title-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-icon{
    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid var(--border-color);
    border-radius: 7.5px;

    padding: 5px 7.5px;
}

.modal-icon-save{
    /* background-color: var(--accent-hover); */
    border-color: var(--accent);
    color: var(--accent)
}

.modal-icon-delete{
    /* background-color: var(--danger-hover); */
    border-color: var(--danger);
    color: var(--danger)
}


/* ==================== */
/* MODAL BODY */
/* ==================== */

.modal-body {
    padding: 20px;
    overflow-y: auto;
}


/* ========================================== */
/* TRANSICIÓN (overlay + panel sincronizados) */
/* ========================================== */

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.22s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
    transition:
        transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
}

</style>
