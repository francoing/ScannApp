<script setup lang="ts">
import type { Scan } from '@/scanner/interfaces/scan';
import useExport from '../composables/useExport';

interface Props {
    scans: Scan[]
}

const props = defineProps<Props>()

const { exporting, exportToPdf, exportToExcel } = useExport()
</script>

<template>
    <div class="row q-gutter-sm">
        <q-btn
            outline
            no-caps
            color="red-8"
            icon="picture_as_pdf"
            label="Exportar PDF"
            :disable="props.scans.length === 0 || exporting !== null"
            :loading="exporting === 'pdf'"
            @click="exportToPdf(props.scans)"
        />
        <q-btn
            outline
            no-caps
            color="green-8"
            icon="grid_on"
            label="Exportar Excel"
            :disable="props.scans.length === 0 || exporting !== null"
            :loading="exporting === 'excel'"
            @click="exportToExcel(props.scans)"
        />
    </div>
</template>

<style scoped>

</style>
