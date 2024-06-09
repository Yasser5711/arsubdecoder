import { defineStore } from "pinia";
import {
  addHistoryItem,
  getHistoryItems,
  deleteHistoryItem,
  deleteAllHistoryItems,
} from "@/api/index";
export const useAppStore = defineStore("app", {
  state: () => ({
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
    selectedExtension: ".srt",
    //selectedLanguage: "en",
    selectedDecoder: "windows-1256",
    history: [],
    decoders: ["utf-8", "windows-1256", "iso-8859-1"],
    outputExtensions: [".txt", ".srt", ".sub", ".ssa", ".ass", ".vtt"],
  }),
  getters: {
    getSelectedExtension() {
      return (
        localStorage.getItem("selectedExtension") || this.selectedExtension
      );
    },
    getSelectedDecoder() {
      return localStorage.getItem("selectedDecoder") || this.selectedDecoder;
    },
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
    },
    detectSystemTheme() {
      this.theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    },
    watchSystemTheme() {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", () => {
        this.detectSystemTheme();
      });
    },
    setSelectedExtension(extension) {
      this.selectedExtension = extension;
      localStorage.setItem("selectedExtension", extension);
    },
    setSelectedDecoder(decoder) {
      this.selectedDecoder = decoder;
      localStorage.setItem("selectedDecoder", decoder);
    },
    async addToHistory(fileName, date, url) {
      const historyItem = { fileName, date, url };
      await addHistoryItem(historyItem);
      this.history.push(historyItem);
    },
    // async fetchHistory() {
    //   this.history = await getHistoryItems();
    // },
    async fetchHistory(search = "", sortBy = "date", sortOrder = "asc") {
      this.history = await getHistoryItems(search, sortBy, sortOrder);
    },
    async deleteHistoryItem(id) {
      await deleteHistoryItem(id);
      this.history = this.history.filter((item) => item.id !== id);
    },
    async deleteAllHistoryItems() {
      await deleteAllHistoryItems();
      this.history = [];
    },
  },
});
