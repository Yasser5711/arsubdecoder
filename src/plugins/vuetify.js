/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";
// Composables
import { createVuetify } from "vuetify";
import i18n from "@/i18n/index";
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

export default function setupVuetify() {
  const vuetify = createVuetify({
    locale: {
      adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
    defaults: {
      VTextField: {
        variant: "underlined",
        clearable: true,
      },
      VBtn: { color: undefined, variant: "text" },
      VFileInput: {
        variant: "underlined",
      },
      VTextarea: {
        variant: "underlined",
        readonly: true,
        noResize: true,
        rows: 10,
      },
      VSelect: {
        variant: "underlined",
      },
    },
    theme: {
      // defaultTheme:
      //   themeStore.theme === "dark" ||
      //   (themeStore.theme === "system" &&
      //     window.matchMedia("(prefers-color-scheme: dark)").matches)
      //     ? "dark"
      //     : "light",

      themes: {
        light: {
          colors: {
            primary: "#1867C0",
            secondary: "#5CBBF6",
          },
        },
      },
    },
  });

  return vuetify;
}
