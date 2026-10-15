<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import CameraScanner from '../components/CameraScanner.vue';
import ScanResultDialog from '../components/ScanResultDialog.vue';
import RecentScans from '../components/RecentScans.vue';
import type { DniData } from '../interfaces/dni';

const cameraScanner = useTemplateRef<InstanceType<typeof CameraScanner>>('cameraScanner')

const scannedDni = ref<DniData | null>(null)
const isDialogOpen = ref<boolean>(false)

const onDetected = (dni: DniData) => {
    scannedDni.value = dni
    isDialogOpen.value = true
}

// guardado o descartado, la cámara vuelve a escanear el siguiente DNI
const onCloseDialog = () => {
    isDialogOpen.value = false
    void cameraScanner.value?.start()
}
</script>

<template>
    <div class="row q-col-gutter-lg">
        <div class="col-12">
            <span class="text-h4">Escanear DNI</span>
            <p class="text-grey-7 q-mb-none">
                Iniciá la cámara y acercá el frente del DNI. Los datos leídos se confirman antes de pasar al listado.
            </p>
        </div>

        <div class="col-12 col-md-7">
            <CameraScanner ref="cameraScanner" @on-detected="onDetected" />
        </div>

        <div class="col-12 col-md-5">
            <RecentScans />
        </div>
    </div>

    <ScanResultDialog
        :is-open="isDialogOpen"
        :dni="scannedDni"
        @on-close="onCloseDialog"
    />
</template>

<style scoped>

</style>
