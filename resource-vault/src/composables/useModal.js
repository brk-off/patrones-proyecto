
import { ref } from "vue";

/**Solo sirve para Components que cuentan con un sólo Modal :u, 
 * o sea, ninguno hasta el momento xd
 */

export function useModal(){
    const isVisible = ref(false);

    const show = () => {
        isVisible.value = true;
    }
    const hide = () => {
        isVisible.value = false;
    }

    return{
        isVisible,
        show,
        hide
    }
}
