<script>
// @ts-check
import { createWebHistory, createRouter } from "vue-router";

import routes from './routes.vue'

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
</script>
