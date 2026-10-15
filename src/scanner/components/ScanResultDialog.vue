<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import useScanMutation from '../composables/useScanMutation';
import { sexoLabel } from '../helpers/sexo';
import type { DniData } from '../interfaces/dni';

interface Props {
    isOpen: boolean,
    dni: DniData | null
}

interface Emits {
    (e: 'onClose'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const $q = useQuasar()

const isDialogOpen = ref<boolean>(false)

const { scanMutation } = useScanMutation()

const fields = computed(() => {
    if (!props.dni) return []

    return [
        { label: 'Apellido',            value: props.dni.apellido },
        { label: 'Nombre',              value: props.dni.nombre },
        { label: 'DNI',                 value: props.dni.dni },
        { label: 'Sexo',                value: sexoLabel(props.dni.sexo) },
        { label: 'Fecha de nacimiento', value: props.dni.fechaNacimiento },
        { label: 'Fecha de emisión',    value: props.dni.fechaEmision },
        { label: 'Ejemplar',            value: props.dni.ejemplar },
        { label: 'Nº de trámite',       value: props.dni.numeroTramite },
    ]
})

const save = () => {
    if (!props.dni) return
    scanMutation.mutate(props.dni)
}

watch(() => props.isOpen, (isOpen) => {
    isDialogOpen.value = isOpen
}, { immediate: true })

watch(() => scanMutation.isSuccess.value, (isSuccess) => {
    if (isSuccess) {
        $q.notify({ type: 'positive', icon: 'check', message: `${props.dni?.apellido}, ${props.dni?.nombre} se agregó al listado` })
        scanMutation.reset()
        emits('onClose')
    }
})

watch(() => scanMutation.isError.value, (isError) => {
    if (isError) {
        $q.notify({ type: 'negative', message: 'No se pudo guardar el escaneo, probá de nuevo' })
    }
})
</script>

<template>
    <!-- persistent: solo se cierra con los botones, así la cámara se reanuda una única vez -->
    <q-dialog v-model="isDialogOpen" persistent>
        <q-card class="result-card">
            <q-card-section class="row items-center no-wrap">
                <q-icon name="badge" color="primary" size="md" class="q-mr-sm" />
                <span class="text-h6">DNI detectado</span>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="row q-col-gutter-md">
                    <div v-for="field of fields" :key="field.label" class="col-6">
                        <div class="text-caption text-grey-7">{{ field.label }}</div>
                        <div class="text-body1 text-weight-medium">{{ field.value || '—' }}</div>
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    no-caps
                    color="grey-8"
                    label="Descartar"
                    :disable="scanMutation.isPending.value"
                    @click="emits('onClose')"
                />
                <q-btn
                    unelevated
                    no-caps
                    color="primary"
                    icon="playlist_add"
                    label="Guardar en el listado"
                    :loading="scanMutation.isPending.value"
                    @click="save"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.result-card {
    width: 520px;
    max-width: 92vw;
}
</style>
