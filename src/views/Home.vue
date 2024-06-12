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
  </v-container>
</template>

<script>
import FileInputComponent from "@/components/FileInput.vue";
import { useAppStore } from "@/store/app";

export default {
  name: "HomeView",
  components: {
    FileInputComponent,
  },
  setup() {
    const appStore = useAppStore();
    return { appStore };
  },
  data() {
    return {
      selectedDecoder: this.appStore.getSelectedDecoder,
      selectedOutputExtension: this.appStore.getSelectedExtension,
      decoders: this.appStore.decoders,
      outputExtensions: this.appStore.outputExtensions,
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
