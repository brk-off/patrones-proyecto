<!-- src/components/layout/MainFooter.vue -->

<script setup>

</script>

<template>
    <footer class="main-footer">
        <p>&copy; 2026 Resource Vault - Aplicación de Tarea Académica. Desarrollado con HTML, CSS y LocalStorage.</p>
    </footer>
</template>

<style scoped>
.main-footer{
    display: none;
}

@media (min-width: 992px){
    .main-footer{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        height: 50px;

        background-color: var(--bg-header-footer);
        color: var(--text-secondary);
    }
}
</style>
