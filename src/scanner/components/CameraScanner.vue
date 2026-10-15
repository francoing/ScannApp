<script setup lang="ts">
import { useTemplateRef } from 'vue';
import useCamera from '../composables/useCamera';
import type { DniData } from '../interfaces/dni';

interface Emits {
    (e: 'onDetected', dni: DniData): void
}

const emits = defineEmits<Emits>()

const video = useTemplateRef<HTMLVideoElement>('video')

const { deviceOptions, selectedDeviceId, isScanning, isStarting, error, start, stop, changeDevice } = useCamera(video, {
    onDetected: (dni) => emits('onDetected', dni)
})

// la página vuelve a encender la cámara cuando se cierra el diálogo del resultado
defineExpose({ start, stop })
</script>

<template>
    <q-card flat bordered>
        <q-card-section class="row items-center q-col-gutter-sm">
            <div class="col-12 col-sm">
                <q-select
                    :model-value="selectedDeviceId"
                    :options="deviceOptions"
                    label="Cámara"
                    dense
                    outlined
                    emit-value
                    map-options
                    :disable="deviceOptions.length === 0"
                    @update:model-value="changeDevice"
                />
            </div>
            <div class="col-12 col-sm-auto">
                <q-btn
                    v-if="!isScanning"
                    color="primary"
                    icon="photo_camera"
                    label="Iniciar cámara"
                    unelevated
                    no-caps
                    :loading="isStarting"
                    @click="start"
                />
                <q-btn
                    v-else
                    color="negative"
                    icon="stop"
                    label="Detener"
                    outline
                    no-caps
                    @click="stop"
                />
            </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <div class="viewer">
                <video ref="video" class="viewer__video" muted playsinline />

                <!-- recuadro guía: el PDF417 es ancho y bajo -->
                <div v-if="isScanning" class="viewer__guide">
                    <div class="viewer__line" />
                </div>

                <div v-else class="viewer__placeholder column flex-center text-grey-5">
                    <q-icon name="qr_code_scanner" size="64px" />
                    <span class="q-mt-sm">La cámara está apagada</span>
                </div>
            </div>

            <p class="text-caption text-grey-7 q-mt-sm q-mb-none">
                Encuadrá el código de barras ancho del frente del DNI dentro del recuadro, con buena luz y sin reflejos.
            </p>
        </q-card-section>

        <q-card-section v-if="error" class="q-pt-none">
            <q-banner dense rounded class="bg-red-1 text-negative">
                <template #avatar>
                    <q-icon name="error_outline" />
                </template>
                {{ error }}
            </q-banner>
        </q-card-section>
    </q-card>
</template>

<style scoped>
.viewer {
    position: relative;
    aspect-ratio: 16 / 9;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
}

.viewer__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.viewer__guide {
    position: absolute;
    inset: 32% 8%;
    border: 3px solid rgba(255, 255, 255, 0.9);
    border-radius: 6px;
    /* oscurece todo lo que queda fuera del recuadro */
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
    overflow: hidden;
}

.viewer__line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #21ba45;
    box-shadow: 0 0 8px #21ba45;
    animation: scan 2s ease-in-out infinite alternate;
}

.viewer__placeholder {
    position: absolute;
    inset: 0;
}

@keyframes scan {
    from { top: 0; }
    to   { top: calc(100% - 2px); }
}
</style>
