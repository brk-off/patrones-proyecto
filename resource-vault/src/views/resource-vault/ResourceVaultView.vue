<!-- rsc/views/resource-vault/ResourceVault.vue -->

<script setup>

import { ref, computed } from 'vue';

// components
import TagSidebar from '@/components/vault/TagSidebar.vue';
import ResourcePanel from '@/components/vault/ResourcePanel.vue';
import CollectionSidebar from '@/components/vault/CollectionSidebar.vue';
import MainHeader from '@/components/layout/MainHeader.vue';

import { useVault } from '@/composables/useVault';

const { resourceList } = useVault();

// Collections y Tags seleccionados para el filtrado de recursos
const selectedCollectionsIds = ref([]);
const selectedTagsIds = ref([]);

// Lista de los recursos filtrados
const filteredResources = computed(()=>{
    const collectionsIds = selectedCollectionsIds.value;
    const tagsIds = selectedTagsIds.value;

    if(collectionsIds.length === 0 && tagsIds.length === 0){
        return resourceList.value;
    }

    return [...resourceList.value].filter(resource => {
        const collectionMatch = collectionsIds.length === 0 || collectionsIds.includes(resource.collectionId);

        const tagMatch = tagsIds.length === 0 || tagsIds.some(id => resource.tagIds.includes(id));
        
        return collectionMatch && tagMatch; 
    })
})

</script>

<template>
    <!-- HEADER -->
    <MainHeader></MainHeader>

    <!-- RESOURCE VAULT -->
    <main class="resource-vault">
        <!-- COLLECTION SIDEBAR -->
        <CollectionSidebar
            v-model:selectedCollectionsIds="selectedCollectionsIds"
        ></CollectionSidebar>

        <!-- RESOURCES PANEL -->
        <ResourcePanel
            :filteredResources="filteredResources"
        ></ResourcePanel>

        <!-- TAG SIDEBAR -->
        <TagSidebar
            v-model:selectedTagsIds="selectedTagsIds"
        ></TagSidebar>
    </main>
</template>

<style scoped>

.resource-vault{
    display: grid;

    grid-template-columns: 250px 1fr 250px;
    gap: 20px;

    padding: 20px;
    min-height: calc(100vh - 70px);

    overflow-x: hidden;
}

</style>
