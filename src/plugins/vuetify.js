/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
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
    defaultTheme: "dark",

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
