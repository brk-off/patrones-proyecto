/* src/composables/useResourceForm.js */

import { ref, watch, toRaw } from "vue";
import { isValidHttpUrl, isValidResourceTitle } from "@/utils/validation";


export function useResourceForm(initialRef){

    const getInitialData = () => {
        const initial = initialRef?.value || {}
        return {
            id: initial.id || null,
            title: initial.title || null,
            description: initial.description || null,
            url: initial.url || null,
            tagIds: initial.tagIds || [],
            collectionId: initial.collectionId || null,
            createdAt: initial.createdAt || null,
            updateAt: initial.updateAt || null,
            icon: {
                name: initial.icon?.name || null,
                variant: initial.icon?.variant || null,
                colored: initial.icon?.colored || null,
                color: initial.icon?.color || null
            }
        }
    }

    const form = ref({
        title: getInitialData().title,
        description: getInitialData().description,
        url: getInitialData().url,
        tagIds: getInitialData().tagIds,
        collectionId: getInitialData().collectionId,
        icon: getInitialData().icon
    });
    const errors = ref({});


    function validate(){
        errors.value = {}
        const currentData = getInitialData()
        if(!form.value?.title?.trim()){
            errors.value.title = 'El título es obligatorio'
        }else if(!isValidResourceTitle(currentData.id ,form.value?.title)){
            errors.value.title = 'Ya existe un Recurso con el mismo nombre'
        }
        if(!form.value?.url?.trim()){
            errors.value.url = 'La URL es obligatoria'
        }else if(!isValidHttpUrl(form.value?.url)){
            errors.value.url = 'La URL debe ser válida (empezar con http/https)'
        }
        if(!form.value?.collectionId?.trim()){
            errors.value.collectionId = 'La Colección es obligatoria'
        }

        return Object.keys(errors.value).length === 0;
    }

    function reset(){
        form.value.title = getInitialData().title;
        form.value.description = getInitialData().description;
        form.value.url = getInitialData().url;
        form.value.tagIds = getInitialData().tagIds;
        form.value.collectionId = getInitialData().collectionId;
        form.value.icon = getInitialData().icon;

        errors.value = {};
    }

    function toPayload(){
        const currentData = getInitialData();

        return {
            id: currentData.id,
            title: form.value.title,
            description: form.value.description,
            url: form.value.url,
            tagIds: [...toRaw(form.value.tagIds)],
            collectionId: form.value.collectionId,
            createdAt: currentData.createdAt,
            updateAt: currentData.updateAt,
            icon: {...toRaw(form.value.icon)}
        }
    }

    /** watch para el intialRef
     * para un guardar un resource (nuevo o ya existente)
     */
    watch(
        () => initialRef?.value,
        () => reset(),
        {deep: true}
    )

    /** watch para la reactividad de los campos y errores */
    watch(
        () => form.value.title,
        () => {if(errors.value.title) delete errors.value.title}
    )
    watch(
        () => form.value.url,
        () => {if(errors.value.url) delete errors.value.url}
    )
    watch(
        () => form.value.collectionId,
        () => {if(errors.value.collectionId) delete errors.value.collectionId}
    )

    const isEdit = () => {
        return !!initialRef.value?.id
    }

    return {
        form,
        errors,
        validate,
        reset,
        toPayload,
        isEdit
    }
}