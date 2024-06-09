<template>
  <v-app>
    <default-bar />

    <default-view />
  </v-app>
</template>

<script setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
</script>
<style scoped>
.v-main {
  padding-top: 0;
  margin-top: var(--v-layout-top);
  padding-bottom: 0;
  margin-bottom: var(--v-layout-bottom);
  height: calc(100vh - var(--v-layout-top) - var(--v-layout-bottom));
  overflow-y: auto;
  transition-property: padding;
}
</style>
