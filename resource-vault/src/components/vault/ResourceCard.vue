<!-- src/components/vault/ResourceCard.vue -->

<script setup>

import {computed} from 'vue';

import { useVault } from '@/composables/useVault';
import { formatDate } from '@/utils/format';

const { getCollection, getTag } = useVault();

const props = defineProps({
    resource: Object
})


const borderColorStyle = computed(()=>{
    return{
        borderColor: props.resource.icon?.name 
                    ? props.resource.icon.color 
    	            : 'var(--border-color)'
    }
})

</script>

<template>
    <article
        class="resource-card"
        :style="borderColorStyle"
    >
        <!-- BODY -->
        <div
            class="card-body"
        >
            <!-- TOP CONTENT -->
            <div
                class="content"
                :class="{'no-icon': !resource.icon?.name}"
            >
                <!-- ICON -->
                <div
                    v-if="resource.icon?.name"
                    class="content-icon"
                >
                    <i :class="[`devicon-${resource.icon.name}-${resource.icon.variant}`, {'colored': resource.icon.colored}]"></i>
                </div>

                <!-- INFO -->
                <div
                    class="content-info"
                >
                    <p class="title">
                        {{ resource.title }}
                    </p>
                    <small class="desc">
                        {{ resource.description }}
                    </small>
                </div>
            </div>

            <!-- TAGS & COLLECTIONS -->
            <div
                class="tags-collections"
            >
                <small class="badge collection">
                    {{ getCollection(resource.collectionId)?.name }}
                </small>
                
                <small 
                    v-for="tagId in resource.tagIds"
                    :key="tagId"
                    class="badge tag"
                >
                    {{ getTag(tagId)?.name }}
                </small>
            </div>
        </div>

        <!-- FOOTER -->
        <footer
            class="card-footer"
            :style="borderColorStyle"
        >
            <div
                class="date"
            >
                <small>{{ formatDate(resource.createdAt) }}</small>
            </div>

            <div
                class="buttons-container"
            >
                <a
                    :href="resource.url"
                    target="_blank"
                    class="btn-icon"
                    rel="noopener noreferrer"
                    title="Abir recurso"
                >
                    <i class="fa-solid fa-up-right-from-square"></i>
                </a>
            </div>
        </footer>
    </article>
</template>

<style scoped>

/* =================== */
/* RESOURCE CARD */
/* =================== */

.resource-card{
    width: 100%;
    height: 200px;

    background: transparent;

    border-radius: 14px;
    border: 1px solid var(--border-color);

    display: flex;
    flex-direction: column;
    overflow: hidden;

    transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}
.resource-card:hover{
    transform: translateY(-3px);

    border-color: var(--border-color-hover);
    background-color: var(--bg-card-hover);
}

/* =================== */
/* CARD BODY */
/* =================== */

.card-body{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;

    font-size: 1.1rem;

    padding: 15px 15px 8px 15px;
    flex: 1;
}

/* =================== */
/* CARD FOOTER */
/* =================== */

.card-footer{
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px 15px;

    border-top: 1px solid var(--border-color);
}
.date{
    color: var(--text-secondary);
    font-size: 0.8rem;
}
.buttons-container {
    display: flex;
    gap: 6px;
}

/* ========================== */
/* CARD CONTENT (icon + info) */
/* ========================== */

.content{
    display: flex;
    align-items: flex-start;

    gap: 12px;
}

/* ========================== */
/* CONTENT ICON */
/* ========================== */
.content-icon{
    width: 30%;

    display: flex;
    justify-content: center;
    align-items: center;
}
.content-icon i{
    font-size: 4em;
}

/* =================== */
/* CONTENT INFO */
/* =================== */

.content-info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;

    width: 70%;
}

/* No hay ícono */
.content.no-icon .content-info{
    width: 100%;
}

.content-info .title{
    font-weight: bolder;

    /* Limita a 2 líneas */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.content-info .desc{
    color: var(--text-secondary);

    /* Limita a 2 líneas */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* =================== */
/* TAGS & COLLECTIONS */
/* =================== */

.tags-collections{
    display: flex;
    flex-wrap: nowrap;
    gap: 5px;

    overflow-x: auto;
    overflow-x: overlay;

    scrollbar-width: none;

    padding-bottom: 4px;
}
.tags-collections .badge{
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--border-color);
    border: 1px solid var(--border-color-hover);
    border-radius: 6px;
    padding: 2px 8px;
    white-space: nowrap;
}
.badge.collection{
    border-color: var(--accent);
    background-color: var(--accent-hover);
}
/* ========================================================== */
/* CONFIGURACIÓN DEL SCROLL SUTIL (SIN FLECHAS Y LÍNEA ULTRA FINA) */
/* ========================================================== */

/* 1. Definimos el tamaño del scrollbar (2px para que sea una línea súper fina) */
/* Al dejarlo fijo aquí, nunca empujará el footer al hacer hover */
.tags-collections::-webkit-scrollbar {
    height: 2px; 
    background-color: transparent;
}

/* 2. EL TRUCO: Ocultar por completo las flechas de izquierda y derecha */
.tags-collections::-webkit-scrollbar-button {
    display: none;
}

/* 3. El "palo" o indicador del scroll (Invisible por defecto) */
.tags-collections::-webkit-scrollbar-thumb {
    background-color: transparent; 
    border-radius: 10px;
    transition: background-color 0.2s ease; 
}

/* 4. Soporte para Firefox (Oculto por defecto) */
.tags-collections {
    scrollbar-width: none;
}

/* 5. Al hacer Hover en la CARD completa, mostramos la línea fina */
.resource-card:hover .tags-collections {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.resource-card:hover .tags-collections::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2); /* Blanco muy sutil con opacidad */
}

/* Opcional: Si el usuario pasa el mouse exactamente sobre la línea, brilla un poco más */
.tags-collections::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.45) !important; 
}


</style>
