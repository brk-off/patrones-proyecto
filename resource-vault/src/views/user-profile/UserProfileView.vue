<!-- src/views/user-profile/UserProfileView.vue -->

<script setup>

import { ref, computed } from 'vue';

import MainHeader from '@/components/layout/MainHeader.vue';
import MainFooter from '@/components/layout/MainFooter.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import ContextMenu from '@/components/ui/ContextMenu.vue';
import { formatDate } from '@/utils/format';

import { useVault } from '@/composables/useVault';

const {
    resourceList,
    collectionList,
    tagList,
    resourcesCountByCollection,
    resourcesCountByTag
} = useVault()


const LIST_PREVIEW_LIMIT = 4;


/* NAV ITEMS */
const navItems = [
    {id: 'section-activity', label: 'Resumen de actividad', icon: 'fa-solid fa-chart-simple', danger: false},
    {id: 'section-export', label: 'Exportar datos', icon: 'fa-solid fa-file-export', danger: false},
    {id: 'section-import', label: 'Importar datos', icon: 'fa-solid fa-file-import', danger: false},
    {id: 'section-resources', label: 'Recursos', icon: 'fa-solid fa-link', danger: false},
    {id: 'section-collections', label: 'Colecciones', icon: 'fa-regular fa-folder', danger: false},
    {id: 'section-tags', label: 'Etiquetas', icon: 'fa-solid fa-tags', danger: false},
    {id: 'section-logout', label: 'Cerrar sesión', icon: 'fa-solid fa-right-from-bracket', danger: true}
]


/**============== */
/**RESOURCES LIST */
/**============== */

const resourcesSearch = ref('')
const showAllResources = ref(false)

const filteredResources = computed(() => {
    const search = resourcesSearch.value.trim().toLocaleLowerCase();
    if(showAllResources.value){
        if(!search){
            return resourceList.value
        }
        return resourceList.value.filter(res => res.title.toLocaleLowerCase().includes(search));
    }else{ 
        if(!search){
            return resourceList.value.slice(0, 4);
        }
        return resourceList.value.filter(res => res.title.toLocaleLowerCase().includes(search)).slice(0, 4);
    }  
})

/**========= */
/**TAGS LIST */
/**========= */

const tagsSearch = ref('')
const showAllTags = ref(false)

const filteredTags = computed(() => {
    const search = tagsSearch.value.trim().toLocaleLowerCase();
    if(showAllTags.value){
        if(!search){
            return tagList.value
        }
        return tagList.value.filter(res => res.title.toLocaleLowerCase().includes(search));
    }else{ 
        if(!search){
            return resourceList.value.slice(0, 4);
        }
        return resourceList.value.filter(res => res.title.toLocaleLowerCase().includes(search)).slice(0, 4);
    }  
})

/**=============== */
/**COLLECTION LIST */
/**=============== */

const collectionsSearch = ref('')
const showAllCollections = ref(false)

const filteredCollections = computed(() => {
    const search = collectionsSearch.value.trim().toLocaleLowerCase();
    if(!search){
        return collectionList.value
    }
    return collectionList.value.filter(col => col.name.toLocaleLowerCase().includes(search));
})

</script>

<template>
    <div class="view">
        <MainHeader></MainHeader>

        <main class="main">

            <header class="profile-header">
                <div class="icon-container">
                    <i class="fa-solid fa-user"></i>
                </div>

                <div class="title-row">
                    <h2>Mi Perfil</h2>
                    <p>Gestiona tu información y consulta un resumen de tu actividad.</p>
                </div>
            </header>

            <section class="profile-content">
                <aside class="profile-sidebar">
                    <div class="nose user-info">
                        <div class="avatar">
                            <i class="fa-solid fa-user"></i>
                        </div>

                        <div class="user-data">
                            <h3>guest@gmail.com</h3>
                            <p>Guest</p>
                        </div>
                    </div>

                    <div class="nose user-options-nav">
                        <nav class="profile-nav">
                            <button
                                v-for="navItem in navItems"
                                class="btn secondary-btn"
                                :key="navItem.id"
                                type="button"
                                :class="{ 'danger-btn': navItem.danger}"
                                @click=""
                            >
                                <i :class="navItem.icon"></i>
                                <span>{{ navItem.label }}</span>
                            </button>

                        </nav>
                    </div>
                </aside>

                <section class="profile-panel custom-scroll">

                    <!-- RESUMEN DE ACTIVIDAD -->
                    <div class="nose section-option activity-summary" id="section-activity">
                        <header class="nose-header">
                            Resumen de actividad
                        </header>

                        <section class="activity-summary-body">
                            <div class="nose activity-item">
                                <div class="icon">
                                    <i class="fa-solid fa-file"></i>
                                </div>
                                <p class="count">{{ resourceList.length }}</p>
                                <p>Recursos guardados</p>
                                <small class="help-text">Todos tus enlaces almacenados</small>
                            </div>
                            <div class="nose activity-item">
                                <div class="icon">
                                    <i class="fa-solid fa-file"></i>
                                </div>
                                <p class="count">{{ collectionList.length }}</p>
                                <small>Coleciones</small>
                                <small class="help-text">Todos tus enlaces almacenados</small>
                            </div>
                            <div class="nose activity-item">
                                <div class="icon">
                                    <i class="fa-solid fa-file"></i>
                                </div>
                                <p class="count">{{ tagList.length }}</p>
                                <small>Etiquetas</small>
                                <small class="help-text">Todos tus enlaces almacenados</small>
                            </div>
                        </section>
                    </div>

                    <!-- EXPORTAR DATOS -->
                    <div class="nose section-option export-data" id="section-export">
                        <header class="nose-header">
                            Exportar de datos
                        </header>

                        <section class="nose-body">
                            <p class="section-description">
                                Descarga una copia de tus colecciones, etiquetas y recursos en formato JSON.
                            </p>
                            <button type="button" class="btn main-btn export-btn">
                                <i class="fa-solid fa-download"></i>
                                Exportar datos
                            </button>
                        </section>
                    </div>

                    <!-- IMPORTAR DATOS -->
                    <div class="nose section-option import-data" id="section-import">
                        <header class="nose-header">
                            Importar de datos
                        </header>

                        <section class="nose-body">
                            <p class="section-description">
                                Restaura datos desde un archivo JSON exportado previamente.
                            </p>
                            <button type="button" class="btn secondary-btn import-btn">
                                <i class="fa-solid fa-upload"></i>
                                Seleccionar archivo JSON
                                <small class="help-text">o arrastra y suelta el archivo aquí</small>
                            </button>
                            <small>Al importar, se remplazará toda tu información actual (fusión de datos proximamente).</small>
                        </section>
                    </div>

                    <!-- RESOURCES -->
                    <div class="nose section-option resources" id="section-resources">
                        <header class="nose-header">
                            Recursos
                        </header>

                        <section class="nose-body">
                            <SearchBar
                                v-model:search="resourcesSearch"
                                placeholder="Bucar recurso..."
                            ></SearchBar>

                            <!-- RESOURCES LIST -->
                            <ul class="nose-list">
                                <li
                                    v-for="res in filteredResources"
                                    :key="res?.id"
                                    class="nose-item"
                                >
                                    <div class="nose-item-icon">
                                        <i v-if="!res?.icon?.name"    
                                            class="fa-solid fa-link"
                                        ></i>
                                        <i v-else
                                            :class="[
                                                `devicon-${res?.icon?.name}-${res?.icon?.variant}`,
                                                {'colored': res?.icon?.colored}
                                            ]"
                                        ></i>
                                    </div>
                            
                                    <div class="nose-item-text">
                                        <p>{{ res.title }}</p>
                                        <small>collecione y etiquetas...</small>
                                    </div>

                                    <div class="nose-item-date">
                                        <small>Creada o modificada en: </small>
                                        <small>{{ formatDate(res.updatedAt) }}</small>
                                    </div>
                                    <div 
                                        class="nose-item-context-menu-btn"
                                        type="button"    
                                    >
                                        <button class="btn secondary-btn">
                                            <i class="fa-solid fa-ellipsis-vertical"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                            <button 
                                @click="showAllResources = !showAllResources"
                                class="btn secondary-btn show-all-btn"    
                            >
                                <i v-if="!showAllResources" class="fa-solid fa-angle-down"></i>
                                <i v-else class="fa-solid fa-angle-up"></i>
                            </button>
                        </section>
                    </div>

                    <!-- COLLECTIONS -->
                    <div class="nose section-option collections" id="section-collections">
                        <header class="nose-header">
                            Colecciones
                        </header>

                        <section class="nose-body">
                            <SearchBar
                                v-model:search="collectionsSearch"
                                placeholder="Buscar colección..."
                            />

                            <ul class="nose-list">
                                <li
                                    v-for="collection in filteredCollections"
                                    :key="collection.id"
                                    class="nose-item"
                                >
                                    <div class="nose-item-icon">
                                        <i class="fa-regular fa-folder"></i>
                                    </div>
                                    
                                    <div class="nose-item-text">
                                        <p>{{ collection.name }}</p>
                                        <small class="help-text">Recursos que contiene: {{ resourcesCountByCollection[collection.id] }}</small>
                                    </div>
                                    <div
                                        class="nose-item-context-menu-btn"
                                    >
                                        <button
                                            class="btn secondary-btn"
                                            type="button"
                                        >
                                            <i class="fa-solid fa-ellipsis-vertical"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>

                    <!-- TAGS -->
                    <div class="nose section-option tags" id="section-tags">
                        <header class="nose-header">
                            Etiquetas
                        </header>

                        <section class="nose-body">
                            <SearchBar
                                v-model:search="tagsSearch"
                                placeholder="Buscar etiqueta..."
                            />

                            <ul class="nose-list">
                                <li
                                    v-for="tag in filteredTags"
                                    :key="tag.id"
                                    class="nose-item"
                                >
                                    <div class="nose-item-icon">
                                        <i class="fa-solid fa-tag"></i>
                                    </div>
                                    
                                    <div class="nose-item-text">
                                        <p>{{ tag.name }}</p>
                                        <small class="help-text">Recursos asociados: {{ resourcesCountByTag[tag.id] }}</small>
                                    </div>
                                    <div
                                        class="nose-item-context-menu-btn"
                                    >
                                        <button
                                            class="btn secondary-btn"
                                            type="button"
                                        >
                                            <i class="fa-solid fa-ellipsis-vertical"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>

                    <!-- LOG OUT -->
                    <div class="nose section-option nose-danger log-out" id="section-logout">
                        <header class="nose-header">
                            Cerrar sesión
                        </header>

                        <section class="nose-body">
                            <p class="section-description">
                                Cierra la sesión actual y vuelve al modo invitado.
                            </p>
                            <button 
                                type="button" 
                                class="btn danger-btn section-action-btn export-btn">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                Cerrar sesión
                            </button>
                        </section>
                    </div>
                </section>
            </section>

        </main>

        <MainFooter></MainFooter>
    </div>
</template>

<style scoped>

.view{
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden; /* evita scroll de página */
}
.main{
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

/* ============================ */
/* USER PROFILE CONTAINER (MAIN)*/
/* ============================ */

.main{
    display: flex;
    flex-direction: column;
    gap: 30px;

    width: 1280px;
    max-width: 80vw;

    margin: auto;
    padding: 25px;

    font-size: 1.25rem;
}

/* =========== */
/* HEADER VIEW */
/* =========== */

.profile-header{
    display: flex;
    gap: 20px;

    padding: 5px;

    flex-shrink: 0;
}

.icon-container{
    font-size: 2.5em;

    color: var(--accent);
}
.title-row{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}
.title-row p{
    color: var(--text-secondary);
}

/* ================================== */
/* PROFILE CONENT (SIDEBAR AND PANEL) */
/* ================================== */

.profile-content{
    display: flex;
    justify-content: center;
    gap: 40px;

    flex: 1;
    min-height: 0;
    overflow: hidden;
}

/*  */
.nose{
    background-color: var(--bg-card);

    border: 1px solid var(--border-color);
    border-radius: 15px;

    padding: 20px;
}
/*  */

/* ============================= */
/* SIDEBAR (NAV AND USER AVATAR) */
/* ============================= */

.profile-sidebar{
    display: flex;
    flex-direction: column;
    gap: 20px;

    width: 25%;
}

/* AVATAR */
.user-info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;

    text-align: center;
}

.avatar{

}
.user-data{

}

/* NAV */
.user-options-nav{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.profile-nav{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn{
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;

    font-size: 0.75em;
}
.btn i{
    font-size: 1.5em;
}

/* ============= */
/* OPTIONS PANEL */
/* ============= */

.profile-panel{
    display: flex;
    flex-direction: column;
    gap: 15px;

    width: 65%;

    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
}

.section-option{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
}
.nose-header{
    font-size: 1.25em;
    font-weight: 600;
}

.help-text{
    color: var(--text-secondary);
}

/* ACTIVITY SUMMARY */
.activity-summary-body{
    display: flex;
    justify-content: center;
    gap: 25px;
}

.nose.activity-item{
    background-color: var(--bg-main);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    width: 27.5%;
    max-width: 260px;

    padding: 20px;
}
.icon{
    color: var(--accent);
    font-size: 1.5em;
}
.nose.activity-item .count{
    font-size: 1.5em;
    font-weight: 600;
}

/* EXPORTAR DATOS */
.nose-body{
    display: flex;
    flex-direction: column;
    gap: 25px;

    width: 100%;
}
.export-btn{
    width: 30%;
    max-width: 210px;
}

/* IMPORTAR DATOS */
.import-btn{
    align-self: center;

    display: flex;
    flex-direction: column;

    border-style: dotted;
    border-radius: 20px;

    width: 75%;
    height: 150px;

    font-size: 1.1rem;
}
.import-btn .help-text{
    font-weight: 500;
}

/* NOSE LIST */
.nose-list{
    display: flex;
    flex-direction: column;
    gap: 10px;;
}

/* NOSE ITEM */
.nose-item{
    border: 1px solid var(--border-color);
    border-radius:  10px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;

    width: 100%;
    padding: 10px;

    /* background-color: var(--bg-main); */
}
.nose-item-icon{
    font-size: 1.75em;
}
.nose-item-text{

}
.nose-item-date{
    display: flex;
    flex-direction: column;
    margin-right: auto;

    color: var(--text-secondary);

    font-size: 0.75em;
}
.nose-item-context-menu-btn{
    margin-left: auto;
}
.nose-item-context-menu-btn .btn{
    padding: 5px;

    width: 35px;
    height: 35px;

    border-radius: 50%;
    border: none;

    box-shadow: none;
}

.show-all-btn{
    border: none;
    border-top: 1px solid var(--border-color);
    border-radius: 0;
    box-shadow: none;
}
.show-all-btn:hover{
    background-color: transparent;
}

.nose-danger{
    border-color: var(--danger);
}




</style>
