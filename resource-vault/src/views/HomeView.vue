<!-- src/views/HomeView.vue -->

<script setup>

import MainHeader from '@/components/layout/MainHeader.vue';
import MainFooter from '@/components/layout/MainFooter.vue';

</script>

<template>
    <MainHeader></MainHeader>

    <main class="main-container">
        <section class="section-hero">
            <h1>Centraliza tus Recursos Digitales</h1>
            <p>
                Resource Vault es una aplicación web diseñada para organizar, clasificar y acceder eficientemente a tus enlaces académicos, cursos, artículos y documentación desde un solo panel rápido.
            </p>
            <div>
                <router-link
                    :to="{name: 'resource-vault'}"
                >
                    <button class="btn main-btn">Explorar Bóveda</button>
                </router-link>
                <button class="btn secondary-btn">Crear Cuenta</button>
            </div>
        </section>
            

        <div class="features-cards">
            <div class="card">
                <div><i class="fa-solid fa-link"></i></div>
                <h3>Solo Links</h3>
                <p>
                    Diseñado exclusivamente para almacenar y redirigir eficientemente sin saturar almacenamiento interno.
                </p>
            </div>
            <div class="card">
                <i class="fa-solid fa-database"></i>
                <h3>Base de Datos Local</h3>
                <p>
                    Utiliza la tecnología de LocalStorage de tu navegador para persistir toda tu información de forma 100% gratuita y offline.
                </p>
            </div>
            <div class="card">
                <i class="fa-solid fa-palette"></i>
                <h3>Estilo minimalista</h3>
                <p>
                    Interfaz oscura inmersiva ideal para desarrolladores y estudiantes de TI, optimizada contra la fatiga visual.
                </p>
            </div>
        </div>
    </main>

    <MainFooter></MainFooter>
</template>

<style scoped>
/* MAIN CONTENT */
.main-container{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 50px;

    padding: 50px 20px 75px 20px;
}
.main-container .section-hero{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    font-size: 1.25rem;

    text-align: center;
}
.main-container .section-hero p{
    color: var(--text-secondary);
}
.main-container .section-hero div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
.main-container .section-hero div button{
    font-size: 1.1rem;
    width: 100%;
}

.main-container .features-cards{
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 15px;
}
.main-container .features-cards .card{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 7.5px;

    text-align: center;

    background: var(--bg-card);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);


    padding: 10px;

    border-radius: 15px;
}
.main-container .features-cards .card .fa-solid{
    color: var(--accent);
    font-size: 2rem;
}
.main-container .features-cards .card h3{
    font-size: 1.3rem;
}
.main-container .features-cards .card p{
    color: var(--text-secondary);
}

/* Phone */
@media (min-width: 600px){
    .main-container .section-hero{
        width: 80%;

    }
    .main-container .section-hero div{
        flex-direction: row;
    }
    .main-container .section-hero div button{
        height: min-content;
        width: max-content;
    }

    .main-container .features-cards{
        width: 80%;
    }
}

/* Tablet */
@media (min-width: 768px){

}

/* Laptops */
@media (min-width: 992px){
    
    /* MAIN CONTENT */
    .main-container .section-hero{
        width: 90%;
        max-width: 900px;
    }

    .main-container .features-cards{
        width: 90%;
        max-width: 900px;
        margin: 0 auto;

        display: grid;
        gap: 20px;

        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
    .main-container .features-cards .card{
        width: auto;
        height: 200px;
        padding: 30px 20px;

        transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .main-container .features-cards .card:hover{
        transform: translateY(-5px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
    }

}

/* Large */
@media (min-width: 1200px){
    
}

</style>
