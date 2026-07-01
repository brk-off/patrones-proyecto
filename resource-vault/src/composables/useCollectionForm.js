import { ref, watch, computed } from "vue";
import { useVault } from "./useVault";
const { collectionList } = useVault();

export function useCollectionForm(initialRef){

    const getInitialData = () => {
        const initial = initialRef.value || {}
        return{
            id: initial.id || null,
            name: initial.name || '',
            createdAt: initial.createdAt || null,
            updatedAt: initial.updatedAt || null
        };
    };

    const form = ref({name: getInitialData().name})
    const errors = ref({})

    const validateName = (name) => {
        const currentData = getInitialData();

        return !collectionList.value.some(collection => {
            if(currentData.id && collection.id === currentData.id){
                return false;
            }
            return collection.name?.toLowerCase() === name.toLowerCase()
        });
    }

    const validate = () => {
        errors.value = {}
        const nameValue = form.value.name.trim();
        if(!nameValue){
            errors.value.name = 'El nombre es obligatorio'
        }else if(!validateName(nameValue)){
            errors.value.name = 'Ya existe una colección con ese nombre'
        }
        return Object.keys(errors.value).length === 0;
    }
    
    const reset = () => {
        form.value.name = getInitialData().name
        errors.value = {}
    }

    watch(
        () => initialRef.value,
        () => reset(),
        { deep: true }
    )

    const toPayload = () => {
        const currentData = getInitialData();
        return{
            id: currentData.id,
            name: form.value.name.trim(),
            createdAt: currentData.createdAt,
            updatedAt: currentData.updatedAt
        }
    } 

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
