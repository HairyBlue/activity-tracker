import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const basePath = import.meta.env.VITE_NODE_ENV !== "production" ? "" : (import.meta.env.VITE_PUBLIC_PATH ? `/${import.meta.env.VITE_PUBLIC_PATH}` : "");

if (typeof window !== 'undefined') {
    const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    const preLoadWebp = document.querySelector('link[data="building-webp"]') as HTMLLinkElement;
    const preLoadFont = document.querySelector('link[data-font="font-inter"]') as HTMLLinkElement;
    // const preLoadPng = document.querySelector('link[data="building-png"]') as HTMLLinkElement;
   
    if (faviconLink) {
        faviconLink.href = `${basePath}/favicon.ico`;
    }
    if (preLoadWebp) {
        preLoadWebp.href = `${basePath}/building.webp`
    }
    // if (preLoadPng) {
    //     preLoadPng.href = `${basePath}/building.png`
    // }
    if (preLoadFont) {
        preLoadFont.href= `${basePath}/fonts/Inter-Regular.ttf`
    }

}

const pinia = createPinia();
const app = createApp(App);
app.use(VCalendar, {});
app.use(pinia);
app.use(router);
app.mount('#app');
