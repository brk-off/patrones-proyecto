<!-- src/components/layout/MainHeader.vue -->

<script setup>
import BtnThemeToogle from '../ui/BtnThemeToogle.vue';
</script>

<template>
    <header class="main-header">
        <div class="logo">
            <router-link :to="{name: 'home'}" class="nav-logo">
                <i class="fa-solid fa-vault"></i> Resource<span>Vault</span>
            </router-link>
        </div>

        <!-- BTN THEME TOOGLE-->
        <BtnThemeToogle></BtnThemeToogle>

        <nav class="navbar">
            <ul class="nav-links">
                <li>
                    <router-link :to="{name: 'resource-vault'}" class="link">
                        Bóveda
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name: 'resource-vault'}" class="link">
                        + Añadir
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name: 'user-profile'}" class="link">
                        <i class="fa-solid fa-user"></i> Perfil
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name: 'resource-vault'}" class="link">
                        <i class="fa-solid fa-gear"></i> Config
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>

    <!-- NAVBAR MOBILE -->
    <nav class="mobile-navbar">
        <ul>
            <li>
                <router-link href="dashboard.html" class="link">
                    <i class="fa-solid fa-vault"></i>
                    <span>Bóveda</span>
                </router-link>
            </li>
            <li>
                <router-link href="nuevo-recurso.html" class="link">
                    <i class="fa-solid fa-circle-plus"></i>
                    <span>Añadir</span>
                </router-link>
            </li>
            <li>
                <router-link href="login.html" class="link">
                    <i class="fa-solid fa-user"></i>
                    <span>Perfil</span>
                </router-link>
            </li>
            <li>
                <router-link href="configuracion.html" class="link">
                    <i class="fa-solid fa-gear"></i>
                    <span>Config</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.main-header{
    background-color: var(--bg-header-footer);
    
    height: 70px;
    padding: 1rem 1.5rem;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.main-header .logo .nav-logo {
    font-size: 2rem;
    color: var(--text-primary);
}
.main-header .logo .nav-logo span{
    color: var(--accent);
}
.main-header .navbar{
    display: none;
}
.main-header .theme-toogle-btn{
    width: max-content;
    padding: 7.5px;
}
/* MAIN TOOLS MOBILE*/
.mobile-navbar{
    position: fixed;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 70px;

    background-color: var(--bg-header-footer);
    border-top: 1px solid var(--border-color);

    z-index: 1000;
}
.mobile-navbar ul{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    list-style: none;

    width: 100%;
    height: 100%;
    margin: auto;
}
.mobile-navbar ul li .link{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;

    font-size: 1.25rem;

    transition: transform 0.2s ease, color 0.2s ease;
    will-change: transform;

}
.mobile-navbar ul li .link:hover{
    transform: scale(1.1);
}
.mobile-navbar ul li .link:active{
    color: var(--accent-hover);
    transform: scale(0.9);
}

@media (min-width: 992px){
    /* MAIN HEADER */
    .main-header{
        padding: 30px;

        justify-content: space-around;
    }
    .main-header .navbar{
        display: flex;
    }
    .main-header .navbar .nav-links{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;

        list-style: none;
    }
    .main-header .navbar .nav-links li .link{
        display: inline-block;

        transition: transform 0.2s ease, color 0.2s ease;
        will-change: transform;
    }
    .main-header .navbar .nav-links li .link:hover{
        transform: scale(1.1);
    }
    .main-header .navbar .nav-links li .link:active{
        color: var(--accent-hover);
        transform: scale(0.9);
    }

    .mobile-navbar{
        display: none;
    }
}

</style>
