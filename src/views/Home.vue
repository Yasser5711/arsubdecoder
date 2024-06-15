<template>
  <v-container @dragover.prevent @drop="handleDrop">
    <file-input-component
      :inputFile_="inputFile"
      :decoders="decoders"
      :outputExtensions="outputExtensions"
      :selectedDecoder="selectedDecoder"
      :selectedOutputExtension="selectedOutputExtension"
      @addToHistory="addToHistory"
      @update:selectedDecoder="updateSelectedDecoder"
      @update:selectedOutputExtension="updateSelectedExtension"
      @clear:inputFile_="inputFile = null"
      @update:inputFile_="inputFile = $event"
    ></file-input-component>
    <v-empty-state
      v-if="inputFile === null"
      :headline="$t('$vuetify.dropSubtitleFileHere')"
      title=""
      :text="$t('$vuetify.dragAndDropSubtitleFile')"
    >
      <template v-slot:media>
        <Icon icon="line-md:uploading-loop" width="192" height="192" />
      </template>
    </v-empty-state>
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
      inputFile: null,
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
  mounted() {
    window.addEventListener("dragover", this.handleDragOver);
    window.addEventListener("dragleave", this.handleDragLeave);
    window.addEventListener("drop", this.handleDrop);
  },
  beforeUnmount() {
    window.removeEventListener("dragover", this.handleDragOver);
    window.removeEventListener("dragleave", this.handleDragLeave);
    window.removeEventListener("drop", this.handleDrop);
  },
  methods: {
    handleDragOver(event) {
      event.preventDefault();
    },
    handleDragLeave(event) {
      event.preventDefault();
    },
    handleDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length) {
        this.uploadFile(files[0]);
      }
    },
    uploadFile(file) {
      this.inputFile = file;
    },
    addToHistory(file) {
      this.appStore.addToHistory(file.fileName, file.date, file.url);
    },
    updateSelectedDecoder(value) {
      this.selectedDecoder = value;
      this.appStore.setSelectedDecoder(value);
    },
    updateSelectedExtension(value) {
      this.selectedOutputExtension = value;
      this.appStore.setSelectedExtension(value);
    },
  },
};
</script>
