<template>
  <v-app-bar flat>
    <span class="text-subtitle-1 font-weight-bold"
      >{{ date.getHours().toString().padStart(2, "0")
      }}<span class="blink">:</span
      >{{ date.getMinutes().toString().padStart(2, "0") }}</span
    >
  </v-app-bar>
</template>

<script setup>
import { ref } from "vue";

const date = ref(new Date());
setInterval(() => {
  date.value = new Date();
}, 1000);
</script>
<style scoped>
.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
