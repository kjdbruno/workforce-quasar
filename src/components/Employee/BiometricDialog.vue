<!-- <template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">face recognition</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <SimpleVueCamera @loading="() => { SubmitLoading = true; }" @started="() => { SubmitLoading = false; }" ref="camera" />
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="RegisterFace()" />
                    <q-btn unelevated size="md" color="secondary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }"/>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="SubmitLoading">
                <q-card class="no-shadow radius-md q-pa-md">
                    <q-card-section class="text-center">
                        <div>
                            <q-spinner-ios color="dark"/>
                        </div>
                        <div class="text-dark text-uppercase text-caption">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

import { useEmployeeStore } from 'src/stores/employee-store'
const EmployeeStore = useEmployeeStore();

const props = defineProps({
    modelValue: String,
    dialogName: String
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => {
        if (!val) emit('update:modelValue', null)
    }
})

const SubmitLoading = ref(false);

import * as faceapi from 'face-api.js';
import SimpleVueCamera from 'simple-vue-camera';

const camera = ref(null);
const name = ref('');
const lastResult = ref(null);
const faceDialog = ref(false);

async function loadModels() {
    const MODEL_URL = '/models'; // put face-api models here
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}

async function captureFrame() {
    if (!camera.value) return null;
    try {
        const blob = await camera.value.snapshot(); // returns Blob
        // Convert Blob to Image (HTMLImageElement) for face-api.js
        const img = await createImageFromBlob(blob);
        return img;
    } catch (err) {
        console.error("Error capturing snapshot:", err);
        return null;
    }
}

// helper function
function createImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

// usage in registerFace or scanFace
async function detectDescriptor() {
    const img = await captureFrame();
    if (!img) return null;
    const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
    if (!detection) return null;
    return { descriptor: detection.descriptor, img };
}

const RegisterFace = async () => {
    SubmitLoading.value = true;
    const result = await detectDescriptor();
    if (!result || !result.img || !result.descriptor) {
        Toast.fire({
            icon: "error",
            title: "No face detected",
            text: "Please align your face and try again."
        });
        SubmitLoading.value = false;
        return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = result.img.width;
    canvas.height = result.img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result.img, 0, 0);

    try {
        const response = await api.post(`/employee/${EmployeeStore.data?.id}/biometric`, {
            descriptor: Array.from(result.descriptor),
            imageBase64: canvas.toDataURL("image/png"),
        });
        emit('update:modelValue', null);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
    } catch (e) {
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">Something went wrong.</div>
                `
            })
        }
    } finally {
        SubmitLoading.value = false;
    }
}

const applyBackendErrors = (backendErrors) => {
    const errorsArray = Array.isArray(backendErrors)
        ? backendErrors
        : backendErrors?.errors || []
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null
        Errors[key].messages = []
    })
    errorsArray.forEach(err => {
        if (Errors[err.path] !== undefined) {
            Errors[err.path].type = true
            Errors[err.path].messages.push(err.msg)
        }
    })
}

// async function registerFace() {
//     lastResult.value = "Registering...";
//     const result = await detectDescriptor();
//     if (!result) return (lastResult.value = "No face detected");

//     const canvas = document.createElement("canvas");
//     canvas.width = result.img.width;
//     canvas.height = result.img.height;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(result.img, 0, 0);

//     const payload = {
//         name: name.value || "unknown",
//         descriptor: Array.from(result.descriptor),
//         imageBase64: canvas.toDataURL("image/png"),
//     };

//     try {
//         const res = await fetch("http://localhost:3000/api/face/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//         });
//         lastResult.value = JSON.stringify(await res.json(), null, 2);
//     } catch (err) {
//         lastResult.value = "Error: " + err.message;
//     }
// }


async function scanFace() {
  lastResult.value = 'Scanning...';
  const result = await detectDescriptor();
  if (!result) return (lastResult.value = 'No face detected');

  const payload = { descriptor: Array.from(result.descriptor) };
  try {
    const res = await fetch('http://localhost:3000/api/faces/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    lastResult.value = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    lastResult.value = 'Error: ' + err.message;
  }
}

const PopulateData = async (app) => {
    await loadModels();
}
</script> -->
<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">face recognition</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <SimpleVueCamera
                    :constraints="cameraConstraints"
                    @loading="() => { CameraLoading = true; }"
                    @started="() => { CameraLoading = false; }"
                    ref="camera"
                />
                <div v-if="captureProgress > 0" class="text-center q-mt-md">
                    <q-linear-progress :value="captureProgress / totalSamples" color="primary" size="10px" rounded />
                    <div class="text-caption q-mt-xs">Capturing sample {{ captureProgress }} / {{ totalSamples }}</div>
                </div>
            </q-card-section>

            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="RegisterFace()" :loading="SubmitLoading" />
                    <q-btn unelevated size="md" color="secondary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }"/>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="SubmitLoading || CameraLoading">
                <q-card class="no-shadow radius-md q-pa-md">
                    <q-card-section class="text-center">
                        <div>
                            <q-spinner-ios color="dark"/>
                        </div>
                        <div class="text-dark text-uppercase text-caption">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, computed } from 'vue';
import { api } from 'src/boot/axios';
import { Toast } from 'src/boot/sweetalert';

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

import { useEmployeeStore } from 'src/stores/employee-store'
const EmployeeStore = useEmployeeStore();

const props = defineProps({
    modelValue: String,
    dialogName: String
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => {
        if (!val) emit('update:modelValue', null)
    }
})

const SubmitLoading = ref(false);
const CameraLoading = ref(false);

import * as faceapi from 'face-api.js';
import SimpleVueCamera from 'simple-vue-camera';

const camera = ref(null);

// IMPORTANT: same constraints used on the scan page so descriptors are
// computed from a consistent camera profile across devices.
const cameraConstraints = ref({
    video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
    }
})

const TOTAL_SAMPLES = 5
const MIN_VALID_SAMPLES = 3
const totalSamples = TOTAL_SAMPLES
const captureProgress = ref(0)

async function loadModels() {
    const MODEL_URL = window.location.origin + '/models';
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ])
}

async function captureFrame() {
    if (!camera.value) return null;
    try {
        const blob = await camera.value.snapshot();
        const img = await createImageFromBlob(blob);
        return { img, blob };
    } catch (err) {
        console.error("Error capturing snapshot:", err);
        return null;
    }
}

function createImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

async function detectDescriptor() {
    const captured = await captureFrame();
    if (!captured) return null;
    const detection = await faceapi
        .detectSingleFace(captured.img) // uses default SsdMobilenetv1Options (minConfidence 0.5)
        .withFaceLandmarks()
        .withFaceDescriptor();
    if (!detection) return null;
    return { descriptor: detection.descriptor, img: captured.img, blob: captured.blob, confidence: detection.detection.score };
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

const RegisterFace = async () => {
    SubmitLoading.value = true;
    captureProgress.value = 0;

    const descriptorSamples = [];
    let lastGoodFrame = null; // keep one representative image to store as the reference photo

    try {
        for (let i = 0; i < TOTAL_SAMPLES; i++) {
            const result = await detectDescriptor();
            if (result?.descriptor) {
                descriptorSamples.push(Array.from(result.descriptor));
                lastGoodFrame = result;
            }
            captureProgress.value = i + 1;
            await new Promise(r => setTimeout(r, 350)); // brief pause so frames aren't near-identical
        }

        if (descriptorSamples.length < MIN_VALID_SAMPLES) {
            Toast.fire({
                icon: "error",
                title: "Face not detected clearly",
                text: `Only captured ${descriptorSamples.length}/${TOTAL_SAMPLES} good samples. Please align your face and try again.`
            });
            return;
        }

        const avgDescriptor = averageDescriptors(descriptorSamples);

        const canvas = document.createElement("canvas");
        canvas.width = lastGoodFrame.img.width;
        canvas.height = lastGoodFrame.img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(lastGoodFrame.img, 0, 0);

        const response = await api.post(`/employee/${EmployeeStore.data?.id}/biometric`, {
            descriptor: avgDescriptor,
            // send every raw sample too, so the backend can store them individually
            // and match against min-distance across samples (more robust than one average)
            samples: descriptorSamples,
            imageBase64: canvas.toDataURL("image/png"),
        });

        emit('update:modelValue', null);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
    } catch (e) {
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
        }
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                <div class="text-caption">Something went wrong.</div>
            `
        })
    } finally {
        SubmitLoading.value = false;
        captureProgress.value = 0;
    }
}

const applyBackendErrors = (backendErrors) => {
    const errorsArray = Array.isArray(backendErrors)
        ? backendErrors
        : backendErrors?.errors || []
    errorsArray.forEach(err => {
        console.warn(`Field error [${err.path}]:`, err.msg)
    })
}

const PopulateData = async () => {
    await loadModels();
}
</script>