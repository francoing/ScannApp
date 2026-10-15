import { useQuery } from "@tanstack/vue-query"
import { getScans } from "./useScans"


const useRecentScans = (limit: number = 5) => {

    // sin filtros: los del store son del listado del admin
    const recentScansQuery = useQuery({
        queryKey: ['scans', 'recent', limit],
        queryFn: () => getScans({ limit }),
    })

    return {
        recentScansQuery,
    }
}

export default useRecentScans
