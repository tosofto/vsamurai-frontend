<template>
    <!-- Navbar -->
    <TopBar />
  <div class="">
    <div class="main-panel">
      <!-- Main Content -->
      <div class="div-page-content">
        <slot></slot>
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script>

import Footer from './Footer.vue';
import TopBar from './TopBar.vue';
export default {
	name: "Layout",
  components: {
    
    Footer,
    TopBar,
  },
}
</script>
