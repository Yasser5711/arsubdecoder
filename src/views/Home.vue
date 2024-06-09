<template>
  <v-container>
    <file-input-component
      :decoders="decoders"
      :outputExtensions="outputExtensions"
      :selectedDecoder="selectedDecoder"
      :selectedOutputExtension="selectedOutputExtension"
      @addToHistory="addToHistory"
      @update:selectedDecoder="updateSelectedDecoder"
      @update:selectedOutputExtension="updateSelectedExtension"
    ></file-input-component>
    <v-row>
      <v-col>
        <v-btn @click="dialog = true">Show Conversion History</v-btn>
      </v-col>
    </v-row>
    <history-component
      :history="history"
      v-model:dialog="dialog"
      @deleteHistoryItem="deleteHistoryItem"
      @deleteAllHistoryItems="deleteAllHistoryItems"
    ></history-component>
  </v-container>
</template>

<script>
import HistoryComponent from "@/components/History.vue";
import FileInputComponent from "@/components/FileInput.vue";
import { useAppStore } from "@/store/app";

export default {
  name: "HomeView",
  components: {
    HistoryComponent,
    FileInputComponent,
  },
  setup() {
    const appStore = useAppStore();
    return { appStore };
  },
  data() {
    return {
      dialog: false,
      selectedDecoder: this.appStore.getSelectedDecoder,
      selectedOutputExtension: this.appStore.getSelectedExtension,
      decoders: ["utf-8", "windows-1256", "iso-8859-1"],
      outputExtensions: [".txt", ".srt", ".sub", ".ssa", ".ass", ".vtt"],
    };
  },
  computed: {
    history() {
      return this.appStore.history;
    },
  },
  created() {
    this.appStore.fetchHistory();
  },
  methods: {
    addToHistory(file) {
      this.appStore.addToHistory(file.fileName, file.date, file.url);
    },
    deleteHistoryItem(id) {
      this.appStore.deleteHistoryItem(id);
    },
    deleteAllHistoryItems() {
      this.appStore.deleteAllHistoryItems();
    },
    updateSelectedDecoder(value) {
      this.selectedDecoder = value;
      this.appStore.setSelectedDecoder(value);
    },
    updateSelectedExtension(value) {
      console.log(value);
      this.selectedOutputExtension = value;
      this.appStore.setSelectedExtension(value);
    },
  },
};
</script>
