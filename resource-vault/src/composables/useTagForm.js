import { ref, watch } from "vue";
import { useVault } from "./useVault";
const { tagList } = useVault();

export function useTagForm(initialRef){

    const getInitialData = () => {
        const initial = initialRef.value || {}
        return{
            id: initial.id || null,
            name: initial.name || '',
            createdAt: initial.createdAt || null,
            updatedAt: initial.updatedAt || null
        }
    }

    const form = ref({name: getInitialData().name})
    const errors = ref({})

    function validateName(name){
        const currentData = getInitialData();
        return !tagList.value.some(tag => {
            if(currentData.id && tag.id === currentData.id) return false;
            return tag.name?.toLowerCase() == name.toLowerCase()
        })
    }
    
    const validate = () => {
        errors.value = {}
        if(!form.value.name.trim()){
            errors.value.name = 'El nombre es obligatorio'
        }else if(!validateName(form.value.name)){
            errors.value.name = 'Ya existe una etiqueta con ese nombre'
        }
        return Object.keys(errors.value).length === 0;
    }
    const reset = () => {
        form.value = getInitialData()
        errors.value = {}
    }
    const toPayload = () => {
        const currentData = getInitialData();
        return{
            id: currentData.id,
            name: form.value.name.trim(),
            createdAt: currentData.createdAt,
            updatedAt: currentData.updatedAt
        }
    } 

    watch(
        () => initialRef.value,
        () => reset(),
        { deep: true }
    )

    const isEdit = () => {
        return !!initialRef.value?.id
    }
 
    return{
        form,
        errors,
        validate,
        reset,
        toPayload,
        isEdit
    }

}
