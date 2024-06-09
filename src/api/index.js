// utils/indexedDB.js
import { openDB } from "idb";

const DB_NAME = "FileHistoryDB";
const DB_VERSION = 2;
const STORE_NAME = "history";

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (oldVersion < 1) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("date", "date");
      store.createIndex("fileName", "fileName");
    }
    if (oldVersion < 2) {
      const store = transaction.objectStore(STORE_NAME);
      if (!store.indexNames.contains("date")) {
        store.createIndex("date", "date");
      }
      if (!store.indexNames.contains("fileName")) {
        store.createIndex("fileName", "fileName");
      }
    }
  },
});

export async function addHistoryItem(item) {
  const db = await dbPromise;
  return db.add(STORE_NAME, item);
}

export async function getHistoryItems(
  search = "",
  sortBy = "date",
  sortOrder = "asc"
) {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index(sortBy);

  let direction = sortOrder === "asc" ? "next" : "prev";
  let items = [];

  let cursor = await index.openCursor(null, direction);
  while (cursor) {
    if (
      !search ||
      cursor.value.fileName.toLowerCase().includes(search.toLowerCase())
    ) {
      items.push(cursor.value);
    }
    cursor = await cursor.continue();
  }

  return items;
}

export async function deleteHistoryItem(id) {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
}

export async function deleteAllHistoryItems() {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  return tx.done;
}
