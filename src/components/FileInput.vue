<template>
  <v-container>
    <v-row v-if="inputFilePreview">
      <v-col>
        <v-textarea
          label="File Preview"
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
          label="Select Subtitle File"
          accept=".srt,.sub,.ssa,.ass,.vtt"
          @click:clear="clearPreviews"
          :loading="loadingFile"
          @change="handleFileChange"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row v-if="inputFile">
      <v-col>
        <v-select
          v-model="selectedDecoder_"
          :items="decoders"
          label="Select Text Decoder"
          @update:model-value="updateSelectedDecoder"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="inputFile">
      <v-col>
        <v-select
          v-model="selectedOutputExtension_"
          :items="outputExtensions"
          label="Select Output File Extension"
          @update:model-value="updateSelectedExtension"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="convertedFilePreview">
      <v-col>
        <v-textarea
          label="Converted File Preview"
          v-model="convertedFilePreview"
          readonly
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row v-if="inputFile && !convertedFilePreview">
      <v-col>
        <v-btn @click="convertFile">Convert File</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="convertedFilePreview">
      <v-col>
        <v-btn @click="saveFile">Save and Download</v-btn>
      </v-col> </v-row
    ><VSonner position="bottom-center" />
  </v-container>
</template>

<script>
import { useAppStore } from "@/store/app";
import { saveAs } from "file-saver";
import { toast } from "vuetify-sonner";
export default {
  name: "FileInputComponent",
  emits: [
    "addToHistory",
    "update:selectedDecoder",
    "update:selectedOutputExtension",
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
  methods: {
    showNotification() {
      toast.success("This is a success notification!");
    },
    clearPreviews() {
      this.inputFilePreview = null;
      this.convertedFilePreview = null;
    },
    handleFileChange() {
      if (this.inputFile) {
        this.clearPreviews();
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
      } finally {
        this.loadingPreview = false;
      }
    },
    async convertFile() {
      if (!this.inputFile) {
        alert("Please select a subtitle file first.");
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
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        this.loadingConvert = false;
      }
    },
    async saveFile() {
      if (!this.convertedContent) {
        alert("Please convert the file first.");
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
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        this.loadingSave = false;
      }
    },
    readFile(file) {
      if (this.appStore.getExtensionFile(file))
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file);
        });
      else {
        toast.error("Invalid file extension");
        throw new Error("Invalid file extension");
      }
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
