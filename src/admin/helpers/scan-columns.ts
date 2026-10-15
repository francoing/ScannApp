import type { QTableColumn } from "quasar"
import type { Sexo } from "@/scanner/interfaces/dni"
import type { Scan } from "@/scanner/interfaces/scan"
import { sexoLabel } from "@/scanner/helpers/sexo"
import { formatDateTime } from "@/shared/helpers/dates"


// Columnas del listado: las usa el q-table y también los exports a PDF y Excel,
// así lo que se ve en pantalla y lo que se exporta es siempre lo mismo
export const scanColumns: QTableColumn<Scan>[] = [
    { name: 'scannedAt',       label: 'Escaneado',     field: 'scannedAt',       align: 'left',   sortable: true, format: (value: string) => formatDateTime(value) },
    { name: 'dni',             label: 'DNI',           field: 'dni',             align: 'left',   sortable: true },
    { name: 'apellido',        label: 'Apellido',      field: 'apellido',        align: 'left',   sortable: true },
    { name: 'nombre',          label: 'Nombre',        field: 'nombre',          align: 'left',   sortable: true },
    { name: 'sexo',            label: 'Sexo',          field: 'sexo',            align: 'left',   format: (value: Sexo) => sexoLabel(value) },
    { name: 'fechaNacimiento', label: 'F. nacimiento', field: 'fechaNacimiento', align: 'left' },
    { name: 'fechaEmision',    label: 'F. emisión',    field: 'fechaEmision',    align: 'left' },
    { name: 'ejemplar',        label: 'Ejemplar',      field: 'ejemplar',        align: 'center' },
    { name: 'numeroTramite',   label: 'Nº trámite',    field: 'numeroTramite',   align: 'left' },
]

// Valor de una celda tal como se muestra en la tabla (aplica field y format)
export const getCellValue = (column: QTableColumn<Scan>, scan: Scan): string => {

    const { field, format } = column

    const value: string = typeof field === 'function' ? String(field(scan)) : field ? scan[field] : ''

    return format ? format(value, scan) : value
}
