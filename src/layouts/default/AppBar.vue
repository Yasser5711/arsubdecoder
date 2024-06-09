<template>
  <v-app-bar>
    <template v-slot:prepend>
      <v-btn @click="toggleTheme" icon>
        <Icon
          width="30"
          icon="line-md:moon-filled-loop"
          v-if="appStore.theme == 'dark'" />
        <Icon
          v-else
          width="30"
          icon="line-md:moon-filled-alt-to-sunny-filled-loop-transition"
      /></v-btn>
    </template>
    <template v-slot:append>
      <v-btn icon="mdi-history" @click="dialog = true"></v-btn>
    </template>
    <span class="text-subtitle-1 font-weight-bold"
      >{{ date.getHours().toString().padStart(2, "0")
      }}<span class="blink">:</span
      >{{ date.getMinutes().toString().padStart(2, "0") }}</span
    >
  </v-app-bar>
  <history-component
    :history="history"
    v-model:dialog="dialog"
    @deleteHistoryItem="deleteHistoryItem"
    @deleteAllHistoryItems="deleteAllHistoryItems"
  ></history-component>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import HistoryComponent from "@/components/History.vue";
import { useAppStore } from "@/store/app";
import { useTheme } from "vuetify";

const date = ref(new Date());
const dialog = ref(false);
const appStore = useAppStore();
const theme = useTheme();

const history = computed(() => appStore.history);

function toggleTheme() {
  appStore.toggleTheme();
}

watch(
  () => appStore.theme,
  (newTheme) => {
    theme.global.name.value = newTheme == "dark" ? "dark" : "light";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  },
  { immediate: true }
);
appStore.watchSystemTheme();
function deleteHistoryItem(id) {
  appStore.deleteHistoryItem(id);
}

function deleteAllHistoryItems() {
  appStore.deleteAllHistoryItems();
}
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
