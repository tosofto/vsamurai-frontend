<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<script>
import routes from './routes.vue'
import Layout from './components/Layout.vue';

// @ts-check
export default {
  components: { Layout },
  data() {
    return {
      routes: routes,
      listRoutes: [],
      userType: "",
    };
  },
  methods: {},
  computed: {},
  mounted() {window.test=this;},
};
</script>
