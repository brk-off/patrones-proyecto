/* src/data/db.js */

import { ref, watch } from "vue";
import { vault as initialData } from "./data";

const STORAGE_KEY = "vault_db";

const savedData = localStorage.getItem(STORAGE_KEY);
const dbState = savedData ? JSON.parse(savedData) : initialData;

export const db = ref(dbState);

watch(db, (newState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
    console.log("=================================");
    console.log("Nuevo estado de db ref: ", db);
    console.log("=================================");
    console.log("Estado guardado en localStorage: ", JSON.parse(localStorage.getItem(STORAGE_KEY)));
    console.log("=================================");
}, {deep: true});
