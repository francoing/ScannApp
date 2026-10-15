import { uid } from "quasar"
import { Sexo } from "@/scanner/interfaces/dni"
import type { Scan } from "@/scanner/interfaces/scan"


// Datos ficticios para que el listado y los exports se puedan probar sin escanear
export const seedScans = (): Scan[] => {

    const now = Date.now()
    const hoursAgo = (hours: number) => new Date(now - hours * 60 * 60 * 1000).toISOString()

    return [
        { id: uid(), scannedAt: hoursAgo(1),   numeroTramite: '00512345678', apellido: 'GONZALEZ',  nombre: 'MARIA LAURA',   sexo: Sexo.Femenino,  dni: '32456789', ejemplar: 'B', fechaNacimiento: '14/02/1987', fechaEmision: '03/08/2019' },
        { id: uid(), scannedAt: hoursAgo(3),   numeroTramite: '00498765432', apellido: 'RODRIGUEZ', nombre: 'JUAN PABLO',    sexo: Sexo.Masculino, dni: '28765432', ejemplar: 'C', fechaNacimiento: '02/11/1981', fechaEmision: '15/03/2017' },
        { id: uid(), scannedAt: hoursAgo(26),  numeroTramite: '00634567891', apellido: 'FERNANDEZ', nombre: 'LUCIA',         sexo: Sexo.Femenino,  dni: '40123987', ejemplar: 'A', fechaNacimiento: '23/06/1997', fechaEmision: '10/01/2021' },
        { id: uid(), scannedAt: hoursAgo(30),  numeroTramite: '00587654321', apellido: 'LOPEZ',     nombre: 'MARTIN ALEJANDRO', sexo: Sexo.Masculino, dni: '35678123', ejemplar: 'B', fechaNacimiento: '09/09/1990', fechaEmision: '22/07/2018' },
        { id: uid(), scannedAt: hoursAgo(50),  numeroTramite: '00701234567', apellido: 'MARTINEZ',  nombre: 'ALEX',          sexo: Sexo.X,         dni: '43219876', ejemplar: 'A', fechaNacimiento: '30/04/2001', fechaEmision: '05/05/2022' },
        { id: uid(), scannedAt: hoursAgo(75),  numeroTramite: '00356789012', apellido: 'PEREZ',     nombre: 'CARLOS ALBERTO', sexo: Sexo.Masculino, dni: '17345678', ejemplar: 'D', fechaNacimiento: '17/12/1965', fechaEmision: '28/02/2016' },
    ]
}
