import type { DniData, Sexo } from "./dni";

// Un registro del listado: los datos del DNI más cuándo se escaneó
export interface Scan extends DniData {
    id:        string;
    scannedAt: string; // ISO
}

export interface ScanFilters {
    search?: string;
    sexo?:   Sexo | null;
    limit?:  number;
}
