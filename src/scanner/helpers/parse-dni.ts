import { Sexo, type DniData } from "../interfaces/dni"

const SEXOS: string[] = Object.values(Sexo)

const clean = (value: string | undefined): string => (value ?? '').trim().replace(/\s+/g, ' ')

const isValid = (data: DniData): boolean => {
    return /^\d{7,8}$/.test(data.dni)
        && SEXOS.includes(data.sexo)
        && data.apellido.length > 0
        && data.nombre.length > 0
}

// DNI tarjeta (formato actual):
// 00512345678@GONZALEZ@MARIA LAURA@F@32456789@B@14/02/1987@03/08/2019@239
const parseFormatoNuevo = (fields: string[]): DniData => ({
    numeroTramite:   clean(fields[0]),
    apellido:        clean(fields[1]),
    nombre:          clean(fields[2]),
    sexo:            clean(fields[3]).toUpperCase() as Sexo,
    dni:             clean(fields[4]),
    ejemplar:        clean(fields[5]),
    fechaNacimiento: clean(fields[6]),
    fechaEmision:    clean(fields[7]),
})

// DNI de formato viejo (empieza con @ y el número viene con espacios):
// @20123456    @A@1@GOMEZ@JUAN CARLOS@ARGENTINA@01/01/1980@M@01/06/2012@00123456789@7999@...
const parseFormatoViejo = (fields: string[]): DniData => ({
    numeroTramite:   clean(fields[10]),
    apellido:        clean(fields[4]),
    nombre:          clean(fields[5]),
    sexo:            clean(fields[8]).toUpperCase() as Sexo,
    dni:             clean(fields[1]),
    ejemplar:        clean(fields[2]),
    fechaNacimiento: clean(fields[7]),
    fechaEmision:    clean(fields[9]),
})

// Devuelve null si el texto leído no es un DNI argentino reconocible
export const parseDni = (raw: string): DniData | null => {

    const text = raw.trim()
    const fields = text.split('@')

    let data: DniData | null = null

    if (text.startsWith('@') && fields.length >= 11) {
        data = parseFormatoViejo(fields)
    } else if (fields.length >= 8) {
        data = parseFormatoNuevo(fields)
    }

    if (!data || !isValid(data)) return null

    return data
}
