import { AxiosError, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import { LocalStorage, uid } from "quasar"
import type { DniData, Sexo } from "@/scanner/interfaces/dni"
import type { Scan } from "@/scanner/interfaces/scan"
import { seedScans } from "./seed"


const STORAGE_KEY = 'scanner-app:scans'
const DELAY = 600 // simula la latencia de un backend


const readScans = (): Scan[] => {

    const scans = LocalStorage.getItem<Scan[]>(STORAGE_KEY)
    if (scans) return scans

    // primera vez que se abre la app: carga los datos de ejemplo
    const seed = seedScans()
    LocalStorage.set(STORAGE_KEY, seed)
    return seed
}

const writeScans = (scans: Scan[]) => {
    LocalStorage.set(STORAGE_KEY, scans)
}


// GET /scans?search=&sexo=&limit=
const getScans = (params: URLSearchParams): Scan[] => {

    const search = (params.get('search') ?? '').trim().toLowerCase()
    const sexo = params.get('sexo') as Sexo | null
    const limit = Number(params.get('limit') ?? 0)

    const scans = readScans()
        .filter(scan => !sexo || scan.sexo === sexo)
        .filter(scan => !search || `${scan.apellido} ${scan.nombre} ${scan.dni}`.toLowerCase().includes(search))
        .sort((a, b) => b.scannedAt.localeCompare(a.scannedAt))

    return limit > 0 ? scans.slice(0, limit) : scans
}

// POST /scans
const addScan = (dni: DniData): Scan => {

    const scan: Scan = { ...dni, id: uid(), scannedAt: new Date().toISOString() }
    writeScans([scan, ...readScans()])
    return scan
}

// DELETE /scans/:id
const deleteScan = (id: string): boolean => {

    const scans = readScans()
    const remaining = scans.filter(scan => scan.id !== id)
    writeScans(remaining)
    return remaining.length < scans.length
}


const response = <T>(config: InternalAxiosRequestConfig, status: number, data: T): AxiosResponse<T> => ({
    data,
    status,
    statusText: status < 400 ? 'OK' : 'Not Found',
    headers: {},
    config,
})

const notFound = (config: InternalAxiosRequestConfig, method: string, url: string): AxiosError => {
    const res = response(config, 404, { message: `${method.toUpperCase()} ${url} no existe en el mock` })
    return new AxiosError('Request failed with status code 404', AxiosError.ERR_BAD_REQUEST, config, null, res)
}


export const mockAdapter: AxiosAdapter = async (config) => {

    await new Promise(resolve => setTimeout(resolve, DELAY))

    const method = (config.method ?? 'get').toLowerCase()
    const url = config.url ?? ''
    const [, resource, id] = url.split('/') // '/scans/abc' → ['', 'scans', 'abc']

    if (resource === 'scans') {

        if (method === 'get' && !id) {
            return response(config, 200, getScans(new URLSearchParams(config.params as URLSearchParams)))
        }

        if (method === 'post' && !id) {
            // axios ya serializó el body a JSON antes de llegar al adapter
            return response(config, 201, addScan(JSON.parse(config.data as string) as DniData))
        }

        if (method === 'delete' && id && deleteScan(id)) {
            return response(config, 200, { id })
        }
    }

    throw notFound(config, method, url)
}
