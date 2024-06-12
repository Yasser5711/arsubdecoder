<template>
  <v-app>
    <div class="app-content">
      <default-bar /><default-view /><default-footer />
    </div>
  </v-app>
</template>

<script setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
import DefaultFooter from "./AppFooter.vue";
</script>
