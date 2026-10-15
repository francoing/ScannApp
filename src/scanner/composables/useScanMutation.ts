import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { scannerApi } from "@/api/scannerApi"
import type { DniData } from "../interfaces/dni"
import type { Scan } from "../interfaces/scan"


const addScan = async (dni: DniData): Promise<Scan> => {

    const { data } = await scannerApi.post<Scan>('/scans', dni)

    return data
}


const useScanMutation = () => {

    const queryClient = useQueryClient()

    const scanMutation = useMutation({
        mutationFn: addScan,
        onSuccess: async () => {
            // ['scans'] cubre el listado del admin (con cualquier filtro) y los últimos escaneos
            await queryClient.invalidateQueries({ queryKey: ['scans'] })
        },
    })

    return {
        scanMutation,
    }
}

export default useScanMutation
