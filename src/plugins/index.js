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

export function registerPlugins(app) {
  app.use(pinia);
  const vuetify = setupVuetify();
  app.use(vuetify).use(router).use(iconify);
}
