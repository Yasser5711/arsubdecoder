<script>
export default {
  data: () => ({
    icons_: [
      { icon_: "mdi-github", link: "https://github.com/Yasser5711" },
      { icon_: "mdi-web", link: "http://yassermekhfi.tech/" },
      {
        icon_: "mdi-linkedin",
        link: "https://www.linkedin.com/in/yasser-mekhfi/",
      },
      {
        icon_: "mdi-instagram",
        link: "https://www.instagram.com/yassermekhfi/",
      },
    ],
  }),
};
</script>
<template>
  <v-footer class="text-center d-flex flex-column" color="#FFFFFF00">
    <div class="">
      <div>
        <v-btn
          v-for="(icon, i) in icons_"
          :key="i"
          class="mx-3"
          :icon="icon.icon_"
          variant="text"
        ></v-btn>
      </div>

      <div>
        {{ new Date().getDate().toString().padStart(2, "0") }}.{{
          (new Date().getMonth() + 1).toString().padStart(2, "0")
        }}.{{ new Date().getFullYear() }} — <strong>YasMek@</strong>
      </div>
    </div>
  </v-footer>
</template>
