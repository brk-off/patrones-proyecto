import { createApp } from 'vue'
import App from './App.vue'

// importaciones de styles (src/assets/css/...)
import.meta.glob('@/assets/css/base/*.css', {eager: true});
import.meta.glob('@/assets/css/components/*.css', {eager: true});

// router
import router from './router'

const app = createApp(App);

app.use(router)

app.mount('#app')
