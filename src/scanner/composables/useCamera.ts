import { computed, onUnmounted, ref, type Ref } from "vue"
import { Notify } from "quasar"
import { BrowserCodeReader, BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser"
import { BarcodeFormat, DecodeHintType } from "@zxing/library"
import { parseDni } from "../helpers/parse-dni"
import type { DniData } from "../interfaces/dni"


interface Options {
    onDetected: (dni: DniData) => void
}

// El PDF417 del DNI es denso: solo se busca ese formato y zxing lo intenta más a fondo
const hints = new Map<DecodeHintType, unknown>([
    [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]],
    [DecodeHintType.TRY_HARDER, true],
])

const WARNING_INTERVAL = 3000
const REPEAT_INTERVAL = 2000

const getErrorMessage = (error: unknown): string => {

    if (!window.isSecureContext) {
        return 'La cámara solo funciona en localhost o con HTTPS.'
    }

    if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') return 'Se denegó el permiso de cámara. Habilitalo desde el ícono del candado en la barra de direcciones.'
        if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') return 'No se encontró ninguna cámara.'
        if (error.name === 'NotReadableError') return 'La cámara está siendo usada por otra aplicación.'
    }

    return 'No se pudo iniciar la cámara.'
}


const useCamera = (videoRef: Readonly<Ref<HTMLVideoElement | null>>, { onDetected }: Options) => {

    const reader = new BrowserMultiFormatReader(hints)
    let controls: IScannerControls | null = null
    let lastWarningAt = 0
    let isUnmounted = false
    let lastCode: string | null = null
    let ignoreLastCodeUntil = 0

    const devices = ref<MediaDeviceInfo[]>([])
    const selectedDeviceId = ref<string | null>(null)
    const isScanning = ref<boolean>(false)
    const isStarting = ref<boolean>(false)
    const error = ref<string | null>(null)


    // Los nombres de las cámaras recién aparecen después de dar el permiso
    const loadDevices = async () => {
        try {
            devices.value = await BrowserCodeReader.listVideoInputDevices()
        } catch {
            devices.value = []
        }
    }

    // Se leyó un código pero no es un DNI: avisa como mucho cada 3 segundos para no repetirlo en cada frame
    const warnInvalidCode = () => {
        if (Date.now() - lastWarningAt < WARNING_INTERVAL) return
        lastWarningAt = Date.now()
        Notify.create({ type: 'warning', message: 'Se leyó un código pero no es un DNI argentino válido' })
    }

    const stop = () => {
        controls?.stop()
        controls = null
        isScanning.value = false
    }

    const start = async () => {

        if (!videoRef.value || isScanning.value || isStarting.value) return

        error.value = null
        isStarting.value = true

        // Alta resolución: con menos el PDF417 no se llega a leer
        const video: MediaTrackConstraints = {
            width:  { ideal: 1920 },
            height: { ideal: 1080 },
        }

        if (selectedDeviceId.value) {
            video.deviceId = { exact: selectedDeviceId.value }
        } else {
            video.facingMode = 'environment' // en el celular, la cámara trasera
        }

        let detected = false
        ignoreLastCodeUntil = Date.now() + REPEAT_INTERVAL

        try {
            const scanControls = await reader.decodeFromConstraints({ video }, videoRef.value, (result, _error, currentControls) => {
                // zxing llama en cada frame; sin result es que todavía no encontró nada
                if (!result || detected) return

                const code = result.getText()

                // al reanudar, el DNI recién guardado suele seguir frente a la cámara:
                // se ignora mientras siga a la vista y se puede volver a leer cuando sale del cuadro
                if (code === lastCode && Date.now() < ignoreLastCodeUntil) {
                    ignoreLastCodeUntil = Date.now() + REPEAT_INTERVAL
                    return
                }

                const dni = parseDni(code)

                if (!dni) {
                    warnInvalidCode()
                    return
                }

                // ojo: el primer frame se decodifica antes de que termine decodeFromConstraints,
                // por eso se corta con los controls que llegan al callback y no con `controls`
                detected = true
                lastCode = code
                currentControls.stop()
                controls = null
                isScanning.value = false
                onDetected(dni)
            })

            // ya se detectó en el primer frame: la cámara quedó apagada
            if (detected) return

            // se salió de la página mientras arrancaba la cámara
            if (isUnmounted) {
                scanControls.stop()
                return
            }

            controls = scanControls
            isScanning.value = true
            await loadDevices()

        } catch (err) {
            error.value = getErrorMessage(err)
        } finally {
            isStarting.value = false
        }
    }

    const changeDevice = async (deviceId: string) => {

        selectedDeviceId.value = deviceId

        if (isScanning.value) {
            stop()
            await start()
        }
    }

    void loadDevices()

    onUnmounted(() => {
        isUnmounted = true
        stop()
    })

    return {
        //properties
        selectedDeviceId,
        isScanning,
        isStarting,
        error,

        //methods
        start,
        stop,
        changeDevice,

        //getters
        deviceOptions: computed(() => devices.value.map((device, index) => ({
            label: device.label || `Cámara ${index + 1}`,
            value: device.deviceId,
        }))),
    }
}

export default useCamera
