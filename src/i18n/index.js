import { createI18n } from "vue-i18n";
import messages from "./message";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("selectedLanguage") || "en",
  fallbackLocale: "en",
  messages,
});

export default i18n;
