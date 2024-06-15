/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import setupVuetify from "./vuetify";
import pinia from "../store";
import router from "../router";
import iconify from "./iconify";
import { VSonner } from "vuetify-sonner";
import "vuetify-sonner/style.css";
import i18n from "@/i18n/index";
export function registerPlugins(app) {
  app.use(pinia);
  const vuetify = setupVuetify();
  app
    .use(i18n)
    .use(vuetify)
    .component("VSonner", VSonner)
    .use(router)
    .use(iconify);
}
