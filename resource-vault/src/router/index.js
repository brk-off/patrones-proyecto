// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/HomeView.vue'
const ResourceVault = () => import('@/views/resource-vault/ResourceVaultView.vue');
const UserProfile = () => import('@/views/user-profile/UserProfileView.vue')

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/resource-vault',
        name: 'resource-vault',
        component: ResourceVault
    },
    {
        path: '/user-profile',
        name: 'user-profile',
        component: UserProfile
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
