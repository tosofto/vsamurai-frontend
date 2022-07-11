// @ts-check
import { createApp } from "vue";
import App from "./app.vue";
import router from './router.vue';
import { store } from './store';
import Toaster from '@meforma/vue-toaster';

const app = createApp(App);

app.use(store).use(router).use(Toaster).mount("#app");
