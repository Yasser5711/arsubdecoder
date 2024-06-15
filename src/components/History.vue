<template>
  <v-dialog v-model="internalDialog" width="auto" scrollable>
    <v-card v-if="history.length">
      <v-card-title class="my-3">{{
        $t("$vuetify.conversionHistory")
      }}</v-card-title>
      <v-card-text>
        <v-list lines="two">
          <v-list-item
            v-for="item in history"
            :key="item.id"
            :title="item.fileName"
            :subtitle="item.date"
          >
            <template v-slot:append>
              <v-btn icon @click="downloadFile(item)">
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-btn icon @click="deleteHistoryItem(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          @click="deleteAllHistoryItems"
          :text="$t('$vuetify.clearAllHistory')"
        ></v-btn
        ><v-spacer></v-spacer>
        <v-btn
          @click="internalDialog = false"
          :text="$t('$vuetify.close')"
        ></v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else
      ><v-empty-state
        :headline="$t('$vuetify.whoops')"
        :title="$t('$vuetify.noHistoryFound')"
        :text="$t('$vuetify.noConvertedFiles')"
      >
        <template v-slot:media
          ><Icon icon="line-md:alert-circle-loop" width="192" height="192"
        /></template> </v-empty-state
    ></v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "HistoryComponent",
  props: {
    history: Array,
    dialog: Boolean,
  },
  data() {
    return {
      internalDialog: this.dialog,
    };
  },
  watch: {
    dialog(newVal) {
      this.internalDialog = newVal;
    },
    internalDialog(newVal) {
      this.$emit("update:dialog", newVal);
    },
  },
  methods: {
    downloadFile(item) {
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async deleteHistoryItem(id) {
      this.$emit("deleteHistoryItem", id);
    },
    async deleteAllHistoryItems() {
      this.$emit("deleteAllHistoryItems");
    },
  },
};
</script>
