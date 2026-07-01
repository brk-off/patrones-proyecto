/* src/composables/useVault.js */

import { computed, toRaw } from "vue";
import { db } from "@/data/db";

export function useVault(){

    // CREATE
    const addResource = (resourcePayload) => {
        const newResource = {
            id: crypto.randomUUID(),
            title: resourcePayload.title,
            description: resourcePayload.description,
            url: resourcePayload.url,
            tagIds: resourcePayload.tagIds,
            collectionId: resourcePayload.collectionId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            icon: resourcePayload.icon
        }
        db.value.resources[newResource.id] = newResource;
        console.log("Recurso guardado en LocalStorage: ", newResource);
        return structuredClone(newResource);
    };
    const addCollection = (collectionPayload) => {
        const newColection = {
            id: crypto.randomUUID(),
            name: collectionPayload.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        db.value.collections[newColection.id] = newColection;
        console.log("Colección guardada en LocalStorage: ", newColection);
        return {...newColection};
    }
    const addTag = (tagPayload) => {
        const newTag = {
            id: crypto.randomUUID(),
            name: tagPayload.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        db.value.tags[newTag.id] = newTag;
        console.log("Tag guardada en LocalStorage: ", newTag);
        return {...newTag};
    }

    // UPDATE
    const updateResource = (resourcePayload) => {
        const id = resourcePayload.id
        if(!db.value.resources[id]){
            console.log("Resource no encontrado");
            return null
        }
        const updatedResource = structuredClone(toRaw(db.value.resources[id]))
        updatedResource.title = resourcePayload.title
        updatedResource.description = resourcePayload.description
        updatedResource.url = resourcePayload.url
        updatedResource.tagIds = [...resourcePayload.tagIds]
        updatedResource.collectionId = resourcePayload.collectionId
        updatedResource.icon = {...resourcePayload.icon}
        updatedResource.updatedAt = new Date().toISOString()

        db.value.resources[id] = updatedResource;
        return structuredClone(updatedResource)
    }
    const updateCollection = (collectionPayload) => {
        const id = collectionPayload.id;
        if(!db.value.collections[id]){
            console.log("Collection no encontrada");
            return null;
        }
        db.value.collections[id] = {
            ...db.value.collections[id],
            name: collectionPayload.name,
            updatedAt: new Date().toISOString()
        }
        console.log("Colección actualizada en LocalStorage: ", db.value.collections[id]);
        return {...db.value.collections[id]};
    }
    const updateTag = (tagPayload) => {
        const id = tagPayload.id;
        if(!db.value.tags[id]){
            console.log("Tag no encontrada");
            return null;
        }
        db.value.tags[id] = {
            ...db.value.tags[id],
            name: tagPayload.name,
            updatedAt: new Date().toISOString()
        }
        console.log("Tag actualizada en LocalStorage: ", db.value.tags[id]);
        return {...db.value.tags[id]};
    }

    // DELETE
    const deleteCollection = (collectionId) => {
        if(!db.value.collections[collectionId]){
            console.log("Collection no encontrada");
            return false;
        }

        Object.values(db.value.resources).forEach(resource => {
            if (resource.collectionId === collectionId) {
                delete db.value.resources[resource.id];
            }
        });

        delete db.value.collections[collectionId];
        
        return true;
    }
    const deleteTag = (tagId) => {
        if(!db.value.tags[tagId]){
            console.log("Tag no encontrada");
            return false;
        }
        Object.values(db.value.resources).forEach(resource => {
            if (resource.tagIds.includes(tagId)) {
                resource.tagIds = resource.tagIds.filter(id => id !== tagId);
            }
        });
        delete db.value.tags[tagId];
        return true;
    }
    const deleteResource = (resourceId) => {
        if(!db.value.resources[resourceId]){
            console.log("Resource no encontrado");
            return false
        }
        delete db.value.resources[resourceId]
        return true
    } 

    // LISTAS COMPUTADAS
    const collectionList = computed(() => {
        return Object.values(db.value.collections)
    })
    const tagList = computed(() => {
        return Object.values(db.value.tags)
    })
    const resourceList = computed(() => {
        return Object.values(db.value.resources)
    })

    // READ
    const getCollection = (collectionId) => {
        return db.value.collections[collectionId] ? {...db.value.collections[collectionId]} : null;
    }
    const getTag = (tagId) => db.value.tags[tagId] ? {...db.value.tags[tagId]} : null;
    const getResource = (resourceId) => db.value.resources[resourceId] ? structuredClone(toRaw(db.value.resources[resourceId])) : null;


    // CONTADORES
    const resourcesCountByCollection = computed(() => {
        const counts = {};
        resourceList.value.forEach(res => {
            if (res.collectionId) {
                counts[res.collectionId] = (counts[res.collectionId] || 0) + 1;
            }
        });
        collectionList.value.forEach(collection => {
            if(!counts[collection.id]){
                counts[collection.id] = 0;
            }
        })
        return counts;
    })
    const resourcesCountByTag = computed(() => {
        const counts = {};
        resourceList.value.forEach(res => {
            res.tagIds?.forEach(tagId => {
                counts[tagId] = (counts[tagId] || 0) + 1;
            });
        });
        tagList.value.forEach(tag => {
            if(!counts[tag.id]){
                counts[tag.id] = 0;
            }
        })
        return counts;
    })

    return {
        addResource,
        addCollection,
        addTag,
        collectionList,
        tagList,
        resourceList,
        getCollection,
        getTag,
        resourcesCountByCollection,
        resourcesCountByTag,
        updateCollection,
        updateTag,
        updateResource,
        getResource,
        deleteCollection,
        deleteTag,
        deleteResource
    }
}
