import { date } from "quasar"

export const formatDateTime = (iso: string): string => date.formatDate(iso, 'DD/MM/YYYY HH:mm')
