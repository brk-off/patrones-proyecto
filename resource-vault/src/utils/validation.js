import { useVault } from "@/composables/useVault";

const {resourceList} = useVault()

export function isValidHttpUrl(url) {
    try {
        const parsed = new URL(url);

        return (
            parsed.protocol === 'http:' ||
            parsed.protocol === 'https:'
        );
    } catch {
        return false;
    }
}

export function isValidResourceTitle(id, title){
    return !resourceList.value.some(res => {
        if(res.title.toLowerCase() === title.toLowerCase()) {
            if(id && res.id === id){
                return false
            }
            return true
        }
        return false;
    })
}