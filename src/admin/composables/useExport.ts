import { ref } from "vue"
import { date, exportFile, Notify } from "quasar"
import type { Scan } from "@/scanner/interfaces/scan"
import { getCellValue, scanColumns } from "../helpers/scan-columns"


type ExportFormat = 'pdf' | 'excel'

const EXCEL_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const fileName = (extension: string): string => `escaneos-${date.formatDate(Date.now(), 'YYYYMMDD-HHmm')}.${extension}`

const toRows = (scans: Scan[]): string[][] => scans.map(scan => scanColumns.map(column => getCellValue(column, scan)))

const download = (name: string, data: Blob) => {
    const status = exportFile(name, data)
    if (status !== true) throw status
}


// jspdf y exceljs pesan bastante: se cargan recién cuando se exporta
const generatePdf = async (scans: Scan[]) => {

    const { jsPDF } = await import('jspdf')
    const { autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF({ orientation: 'landscape' })

    doc.setFontSize(14)
    doc.text('Listado de escaneos de DNI', 14, 15)
    doc.setFontSize(9)
    doc.text(`Generado el ${date.formatDate(Date.now(), 'DD/MM/YYYY HH:mm')} · ${scans.length} registros`, 14, 21)

    autoTable(doc, {
        startY: 26,
        head: [scanColumns.map(column => column.label)],
        body: toRows(scans),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [25, 118, 210] },
    })

    download(fileName('pdf'), doc.output('blob'))
}

const generateExcel = async (scans: Scan[]) => {

    const { Workbook } = await import('exceljs')

    const workbook = new Workbook()
    const sheet = workbook.addWorksheet('Escaneos')

    sheet.columns = scanColumns.map(column => ({ header: column.label, key: column.name, width: 18 }))
    sheet.addRows(toRows(scans))
    sheet.getRow(1).font = { bold: true }
    sheet.views = [{ state: 'frozen', ySplit: 1 }] // el encabezado queda fijo al hacer scroll

    const buffer = await workbook.xlsx.writeBuffer()

    download(fileName('xlsx'), new Blob([buffer], { type: EXCEL_MIME }))
}


const useExport = () => {

    const exporting = ref<ExportFormat | null>(null)

    const run = async (format: ExportFormat, generate: (scans: Scan[]) => Promise<void>, scans: Scan[]) => {

        exporting.value = format

        try {
            await generate(scans)
        } catch (error) {
            console.error(error)
            Notify.create({ type: 'negative', message: 'No se pudo generar el archivo' })
        } finally {
            exporting.value = null
        }
    }

    return {
        //properties
        exporting,

        //methods
        exportToPdf: (scans: Scan[]) => run('pdf', generatePdf, scans),
        exportToExcel: (scans: Scan[]) => run('excel', generateExcel, scans),
    }
}

export default useExport
