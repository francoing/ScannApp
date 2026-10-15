<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar, type QTableColumn } from 'quasar';
import { useScansStore } from '@/stores/scans';
import { sexoOptions } from '@/scanner/helpers/sexo';
import type { Scan } from '@/scanner/interfaces/scan';
import { scanColumns } from '../helpers/scan-columns';
import useDeleteScan from '../composables/useDeleteScan';
import ExportButtons from './ExportButtons.vue';

interface Props {
    scans: Scan[],
    loading: boolean
}

const props = defineProps<Props>()

const $q = useQuasar()

const scansStore = useScansStore()
const { search, sexo } = storeToRefs(scansStore)

const { deleteScanMutation } = useDeleteScan()

const columns: QTableColumn<Scan>[] = [
    ...scanColumns,
    { name: 'actions', label: '', field: 'id', align: 'right' },
]

const initialPagination = { sortBy: 'scannedAt', descending: true, rowsPerPage: 10 }

const confirmDelete = (scan: Scan) => {
    $q.dialog({
        title: 'Eliminar del listado',
        message: `¿Eliminar a ${scan.apellido}, ${scan.nombre} (DNI ${scan.dni})?`,
        cancel: { flat: true, noCaps: true, label: 'Cancelar', color: 'grey-8' },
        ok: { unelevated: true, noCaps: true, label: 'Eliminar', color: 'negative' },
        persistent: true,
    }).onOk(() => {
        deleteScanMutation.mutate(scan.id, {
            onSuccess: () => $q.notify({ type: 'positive', message: 'Registro eliminado' }),
            onError: () => $q.notify({ type: 'negative', message: 'No se pudo eliminar el registro' }),
        })
    })
}

const isDeleting = (scan: Scan): boolean => {
    return deleteScanMutation.isPending.value && deleteScanMutation.variables.value === scan.id
}
</script>

<template>
    <q-table
        flat
        bordered
        row-key="id"
        :rows="props.scans"
        :columns="columns"
        :loading="props.loading"
        :pagination="initialPagination"
        :rows-per-page-options="[10, 25, 50, 0]"
        no-data-label="Todavía no hay escaneos"
    >
        <template #top>
            <div class="row items-center q-col-gutter-sm full-width">
                <div class="col-12 col-md-5">
                    <q-input
                        :model-value="search"
                        dense
                        outlined
                        clearable
                        debounce="400"
                        placeholder="Buscar por apellido, nombre o DNI"
                        @update:model-value="(value) => scansStore.setSearch(value ? String(value) : '')"
                    >
                        <template #prepend>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
                <div class="col-12 col-sm-5 col-md-3">
                    <q-select
                        :model-value="sexo"
                        :options="sexoOptions"
                        label="Sexo"
                        dense
                        outlined
                        emit-value
                        map-options
                        @update:model-value="scansStore.setSexo"
                    />
                </div>
                <div class="col-12 col-sm-7 col-md-4 row justify-end">
                    <ExportButtons :scans="props.scans" />
                </div>
            </div>
        </template>

        <template #body-cell-actions="slotProps">
            <q-td :props="slotProps">
                <q-btn
                    flat
                    round
                    dense
                    color="negative"
                    icon="delete_outline"
                    :loading="isDeleting(slotProps.row)"
                    @click="confirmDelete(slotProps.row)"
                >
                    <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
            </q-td>
        </template>
    </q-table>
</template>

<style scoped>

</style>
