export enum Sexo {
    Masculino = 'M',
    Femenino  = 'F',
    X         = 'X',
}

// Datos que trae el código PDF417 del frente del DNI argentino
export interface DniData {
    numeroTramite:   string;
    apellido:        string;
    nombre:          string;
    sexo:            Sexo;
    dni:             string;
    ejemplar:        string;
    fechaNacimiento: string; // dd/mm/yyyy, tal cual viene en el código
    fechaEmision:    string; // dd/mm/yyyy
}
