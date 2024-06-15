<template>
  <v-container>
    <v-row v-if="inputFilePreview">
      <v-col>
        <v-textarea
          :label="$t('$vuetify.filePreview')"
          v-model="inputFilePreview"
          readonly
          :loading="loadingPreview"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-file-input
          :show-size="true"
          v-model="inputFile"
          :label="$t('$vuetify.selectSubtitleFile')"
          accept=".srt,.sub,.ssa,.ass,.vtt"
          @click:clear="clearPreviews"
          :loading="loadingFile"
          @change="handleFileChange"
          append-icon="mdi-paperclip"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row v-if="inputFile">
      <v-col>
        <v-select
          v-model="selectedDecoder_"
          :items="decoders"
          :label="$t('$vuetify.selectTextDecoder')"
          @update:model-value="updateSelectedDecoder"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="inputFile">
      <v-col>
        <v-select
          v-model="selectedOutputExtension_"
          :items="outputExtensions"
          :label="$t('$vuetify.selectOutputFileExtension')"
          @update:model-value="updateSelectedExtension"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="convertedFilePreview">
      <v-col>
        <v-textarea
          :label="$t('$vuetify.convertedFilePreview')"
          v-model="convertedFilePreview"
          readonly
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row v-if="inputFile && !convertedFilePreview">
      <v-col>
        <v-btn @click="convertFile" :text="$t('$vuetify.convertFile')"></v-btn>
      </v-col>
    </v-row>
    <v-row v-if="convertedFilePreview">
      <v-col>
        <v-btn @click="saveFile" :text="$t('$vuetify.saveAndDownload')"></v-btn>
      </v-col> </v-row
    ><VSonner position="bottom-center" />
  </v-container>
</template>

<script>
import { useAppStore } from "@/store/app";
import { saveAs } from "file-saver";
import { toast } from "vuetify-sonner";
import debounce from "lodash/debounce";
export default {
  name: "FileInputComponent",
  emits: [
    "addToHistory",
    "update:selectedDecoder",
    "update:selectedOutputExtension",
    "clear:inputFile_",
    "update:inputFile_",
  ],
  props: {
    decoders: {
      type: Array,
      default: () => ["utf-8", "windows-1256", "iso-8859-1"],
    },
    outputExtensions: {
      type: Array,
      default: () => [".txt", ".srt", ".sub", ".ssa", ".ass", ".vtt"],
    },
    selectedDecoder: String,
    selectedOutputExtension: String,
    inputFile_: File,
  },
  data() {
    return {
      inputFile: null,
      inputFilePreview: null,
      convertedFilePreview: null,
      convertedContent: null,
      loadingFile: false,
      loadingPreview: false,
      loadingConvert: false,
      loadingSave: false,
      selectedDecoder_: this.$props.selectedDecoder,
      selectedOutputExtension_: this.$props.selectedOutputExtension,
    };
  },
  setup() {
    const appStore = useAppStore();
    return { appStore };
  },
  watch: {
    inputFile_: debounce(function (newVal) {
      if (newVal === null) {
        this.clearPreviews();
        return;
      }

      if (newVal instanceof File) {
        if (newVal.size > 1048576) {
          toast.error(this.$t("$vuetify.fileTooLarge"));
          this.clearPreviews();
          return;
        }

        if (this.appStore.getExtensionFile(newVal)) {
          this.inputFile = newVal;
          //toast.success(this.$t("$vuetify.fileSelectedSuccessfully"));
        } else {
          this.clearPreviews();
          toast.error(this.$t("$vuetify.invalidFileExtension"));
        }
      }
    }, 300),
    inputFile(newVal) {
      this.$emit("update:inputFile_", newVal);
    },
  },
  methods: {
    showNotification() {
      toast.success(this.$t("$vuetify.successNotification"));
    },
    clearPreviews() {
      this.inputFilePreview = null;
      this.convertedFilePreview = null;
      this.$emit("clear:inputFile_");
    },
    handleFileChange() {
      if (this.inputFile) {
        if (this.inputFile.size > 1048576) {
          toast.error(this.$t("$vuetify.fileTooLarge"));
          this.clearPreviews();
          return;
        }

        this.loadingFile = true;
        this.previewFile().finally(() => {
          this.loadingFile = false;
        });
      }
    },

    async previewFile() {
      this.loadingPreview = true;
      try {
        const fileContent = await this.readFile(this.inputFile);

        const outputContent = new TextDecoder("utf-8").decode(
          new Uint8Array(fileContent)
        );
        this.inputFilePreview = this.getFirstNLines(outputContent, 15);
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error(this.$t("$vuetify.errorWhilePreviewing"));
      } finally {
        this.loadingPreview = false;
      }
    },
    async convertFile() {
      if (!this.inputFile) {
        //alert(this.$t('$vuetify.pleaseSelectSubtitleFileFirst'));
        toast.warning(this.$t("$vuetify.pleaseSelectSubtitleFileFirst"));
        return;
      }
      this.loadingConvert = true;
      try {
        const fileContent = await this.readFile(this.inputFile);
        this.convertedContent = new TextDecoder(this.selectedDecoder).decode(
          new Uint8Array(fileContent)
        );

        this.convertedFilePreview = this.getFirstNLines(
          this.convertedContent,
          15
        );
        toast.success(this.$t("$vuetify.fileConvertedSuccessfully"));
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        this.loadingConvert = false;
      }
    },
    async saveFile() {
      if (!this.convertedContent) {
        toast.error(this.$t("$vuetify.pleaseConvertFileFirst"));
        return;
      }
      this.loadingSave = true;
      try {
        const blob = new Blob([this.convertedContent], {
          type: "text/plain;charset=utf-8",
        });
        const fileName = this.inputFile.name.replace(
          /\.\w+$/,
          this.selectedOutputExtension
        );
        saveAs(blob, fileName);

        const url = URL.createObjectURL(blob);
        const date = new Date().toLocaleString();
        await this.$emit("addToHistory", { fileName, date, url });
        toast.success(this.$t("$vuetify.fileSavedSuccessfully"));
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error(this.$t("$vuetify.errorWhileSaving"));
      } finally {
        this.loadingSave = false;
      }
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject(reader.error);
          toast.error(this.$t("$vuetify.errorReadingFile"));
        };
        reader.readAsArrayBuffer(file);
      });
    },
    getFirstNLines(text, n) {
      return text.split("\n").slice(0, n).join("\n");
    },
    updateSelectedDecoder(value) {
      this.$emit("update:selectedDecoder", value);
    },
    updateSelectedExtension(value) {
      this.$emit("update:selectedOutputExtension", value);
    },
  },
};
</script>
