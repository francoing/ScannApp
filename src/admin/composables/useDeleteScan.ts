import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { scannerApi } from "@/api/scannerApi"


const deleteScan = async (id: string): Promise<void> => {

    await scannerApi.delete(`/scans/${id}`)
}


const useDeleteScan = () => {

    const queryClient = useQueryClient()

    const deleteScanMutation = useMutation({
        mutationFn: deleteScan,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['scans'] })
        },
    })

    return {
        deleteScanMutation,
    }
}

export default useDeleteScan
