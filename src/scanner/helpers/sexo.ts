import { Sexo } from "../interfaces/dni"

const labels: Record<Sexo, string> = {
    [Sexo.Masculino]: 'Masculino',
    [Sexo.Femenino]:  'Femenino',
    [Sexo.X]:         'X (no binario)',
}

export const sexoLabel = (sexo: Sexo): string => labels[sexo]

export const sexoOptions = [
    { label: 'Todos', value: null },
    ...Object.values(Sexo).map(value => ({ label: labels[value], value })),
]
