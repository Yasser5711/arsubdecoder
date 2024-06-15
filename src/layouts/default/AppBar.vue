<template>
  <v-app-bar>
    <template v-slot:prepend>
      <v-btn
        @click="toggleTheme"
        icon
        v-tooltip:bottom.eager="$t('$vuetify.changeTheme')"
      >
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
      <v-btn
        :text="selectedLanguageName"
        @click="changeLanguage"
        v-tooltip:bottom.eager="$t('$vuetify.changeLanguage')"
      ></v-btn>
      <v-btn
        icon="mdi-history"
        @click="dialog = true"
        v-tooltip:bottom.eager="$t('$vuetify.openHistory')"
      ></v-btn>
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
import { useLocale } from "vuetify";

const { current } = useLocale();
import { useTheme } from "vuetify";

const date = ref(new Date());
const dialog = ref(false);
const appStore = useAppStore();
const theme = useTheme();

const history = computed(() => appStore.history);
const selectedLanguage = ref(appStore.getSelectedLanguage);
const selectedLanguageName = computed(() => {
  const language = appStore.getLanguages.find(
    (lang) => lang.code === current.value
  );
  return language ? language.name : "English";
});

function changeLanguage() {
  const currentIndex = appStore.getLanguages.findIndex(
    (lang) => lang.code === selectedLanguage.value
  );
  const nextIndex = (currentIndex + 1) % appStore.getLanguages.length;
  selectedLanguage.value = appStore.getLanguages[nextIndex].code;
  current.value = selectedLanguage.value;
  appStore.setSelectedLanguage(selectedLanguage.value);
}
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
