<template>
    <q-dialog
        v-model="isOpen"
        full-height
        position="right"
        persistent
        square
        class="dialog"
        @show="PopulateData"
        @hide="stopCamera"
    >
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">face recognition</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <video ref="video" autoplay playsinline muted class="camera-video"></video>

                <div v-if="captureProgress > 0" class="text-center q-mt-md">
                    <q-linear-progress :value="captureProgress / TOTAL_SAMPLES" color="primary" size="10px" rounded />
                    <div class="text-caption q-mt-xs">Capturing sample {{ captureProgress }} / {{ TOTAL_SAMPLES }}</div>
                </div>
            </q-card-section>

            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn
                        v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])"
                        unelevated
                        size="md"
                        color="primary"
                        class="btn text-capitalize"
                        label="save"
                        @click="RegisterFace"
                    />
                    <q-btn
                        unelevated
                        size="md"
                        color="secondary"
                        class="btn text-capitalize"
                        label="discard"
                        @click="emit('update:modelValue', null)"
                    />
                </div>
            </q-card-actions>

            <q-inner-loading :showing="SubmitLoading || CameraLoading">
                <q-card class="no-shadow radius-md q-pa-md">
                    <q-card-section class="text-center">
                        <q-spinner-ios color="dark" />
                        <div class="text-dark text-uppercase text-caption">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import * as faceapi from 'face-api.js'
import { api } from 'src/boot/axios'
import { Toast } from 'src/boot/sweetalert'
import { useAuthStore } from 'src/stores/auth-store'
import { useEmployeeStore } from 'src/stores/employee-store'

const AuthStore = useAuthStore()
const EmployeeStore = useEmployeeStore()

const props = defineProps({
    modelValue: String,
    dialogName: String
})
const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => { if (!val) emit('update:modelValue', null) }
})

// ---------- Face capture config ----------
const TOTAL_SAMPLES = 5
const MIN_VALID_SAMPLES = 3

const captureProgress = ref(0)
const SubmitLoading = ref(false)
const CameraLoading = ref(false)

// ---------- Face-api models (loaded once, cached) ----------
let modelsLoaded = false

async function loadModels() {
    if (modelsLoaded) return

    const MODEL_URL = `${window.location.origin}/models`
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ])

    modelsLoaded = true
}

// ---------- Camera ----------
const video = ref(null)
let stream = null

async function startCamera() {
    await nextTick() // ensure <video> is rendered

    if (!video.value) {
        console.error('Video element not found')
        return
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
        })
        video.value.srcObject = stream
        await video.value.play()
    } catch (err) {
        console.error(err)
        Toast.fire({ icon: 'error', title: 'Camera unavailable', text: 'Could not access the camera.' })
    }
}

function stopCamera() {
    stream?.getTracks().forEach(track => track.stop())
    stream = null
}

async function PopulateData() {
    CameraLoading.value = true
    try {
        await loadModels()
        await startCamera()
    } finally {
        CameraLoading.value = false
    }
}

// ---------- Capture + descriptor extraction ----------
function captureFrame() {
    if (!video.value) return null

    const canvas = document.createElement('canvas')
    canvas.width = video.value.videoWidth
    canvas.height = video.value.videoHeight
    canvas.getContext('2d').drawImage(video.value, 0, 0)

    return canvas
}

async function detectDescriptor() {
    const canvas = captureFrame()
    if (!canvas) return null

    const detection = await faceapi
        .detectSingleFace(canvas)
        .withFaceLandmarks()
        .withFaceDescriptor()

    if (!detection) return null

    return {
        descriptor: detection.descriptor,
        canvas,
        confidence: detection.detection.score
    }
}

// Element-wise average of multiple 128-length descriptors
function averageDescriptors(samples) {
    const length = samples[0].length
    const avg = new Array(length).fill(0)

    for (const sample of samples) {
        for (let i = 0; i < length; i++) avg[i] += sample[i]
    }

    return avg.map(v => v / samples.length)
}

// ---------- Register ----------
async function RegisterFace() {
    SubmitLoading.value = true
    captureProgress.value = 0

    const descriptorSamples = []
    let lastGoodFrame = null

    try {
        for (let i = 0; i < TOTAL_SAMPLES; i++) {
            const result = await detectDescriptor()

            if (result) {
                descriptorSamples.push(Array.from(result.descriptor))
                lastGoodFrame = result
            }

            captureProgress.value = i + 1
            await new Promise(resolve => setTimeout(resolve, 350))
        }

        if (descriptorSamples.length < MIN_VALID_SAMPLES) {
            Toast.fire({
                icon: 'error',
                title: 'Face not detected clearly',
                text: `Only captured ${descriptorSamples.length}/${TOTAL_SAMPLES} good samples. Please align your face and try again.`
            })
            return
        }

        const response = await api.post(`/employee/${EmployeeStore.data.id}/biometric`, {
            descriptor: averageDescriptors(descriptorSamples),
            samples: descriptorSamples,
            imageBase64: lastGoodFrame.canvas.toDataURL('image/png')
        })

        emit('update:modelValue', null)

        Toast.fire({
            icon: 'success',
            html: `
                <div class="text-h6 text-bold text-uppercase">Granted!</div>
                <div class="text-caption">${response.data.message}</div>
            `
        })
    } catch (e) {
        console.error(e)
        Toast.fire({ icon: 'error', title: 'Request Failed', text: 'Something went wrong.' })
    } finally {
        SubmitLoading.value = false
        captureProgress.value = 0
    }
}
</script>