import axios from "axios"
import { mockAdapter } from "./mock/mockAdapter"


// Todavía no hay backend: el adapter mock responde las peticiones guardando en LocalStorage.
// Cuando exista la API real, se saca `adapter` y se apunta `baseURL` al servidor;
// los composables no cambian.
export const scannerApi = axios.create({
    baseURL: '/api',
    adapter: mockAdapter,
})
