import { keepPreviousData, useQuery } from "@tanstack/vue-query"
import { storeToRefs } from "pinia"
import { scannerApi } from "@/api/scannerApi"
import { useScansStore } from "@/stores/scans"
import type { Scan, ScanFilters } from "../interfaces/scan"


export const getScans = async ({ search, sexo, limit }: ScanFilters): Promise<Scan[]> => {

    const params = new URLSearchParams()

    if (search) {
        params.append('search', search)
    }

    if (sexo) {
        params.append('sexo', sexo)
    }

    if (limit) {
        params.append('limit', `${limit}`)
    }

    const { data } = await scannerApi.get<Scan[]>('/scans', { params })

    return data
}


const useScans = () => {

    const store = useScansStore()
    const { search, sexo } = storeToRefs(store)

    const scansQuery = useQuery({
        queryKey: ['scans', { search, sexo }],
        queryFn: () => getScans({ search: search.value, sexo: sexo.value }),
        // mientras se busca, la tabla sigue mostrando el resultado anterior en vez de vaciarse
        placeholderData: keepPreviousData,
    })

    return {
        scansQuery,
    }
}

export default useScans
