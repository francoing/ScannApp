import { defineStore } from "pinia"
import { ref } from "vue"
import type { Sexo } from "@/scanner/interfaces/dni"

export const useScansStore = defineStore('scans', () => {

    const search = ref<string>('')
    const sexo = ref<Sexo | null>(null)

    return {
        //state
        search,
        sexo,

        //getters


        //actions
        setSearch(value: string) {
            search.value = value
        },

        setSexo(value: Sexo | null) {
            sexo.value = value
        },
    }
})
