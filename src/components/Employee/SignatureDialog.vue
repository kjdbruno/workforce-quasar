<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="() => { PopulateData(); ResetForm(); }" @show="onShow" @hide="onHide">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">signature information</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="row q-col-gutter-md">
                    <div class="col-3">
                        <div class="q-mb-lg">
                            <div v-if="signature"class="text-body1 text-capitalize text-grey">current signature</div>
                            <img v-if="signature" :src="FormatSignature(signature)" width="200"/>
                            <div v-else class="text-body1 text-capitalize text-grey">no signature found</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="text-caption text-uppercase q-mb-xs" :class="Errors.file.type ? 'text-negative' : 'text-grey'">{{ Errors.file.type ? Errors.file.msg : 'please sign here to continue' }}</div>
                        <div ref="containerRef" class="signature-container">
                            <canvas ref="canvasRef" class="signature-canvas"></canvas>
                        </div>
                    </div>
                </div>
                <!-- <div class="row" v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])">
                    <div>
                        <div class="text-caption text-uppercase q-mb-xs" :class="Errors.file.type ? 'text-negative' : 'text-grey'">{{ Errors.file.type ? Errors.file.msg : 'signature' }}</div>
                        <q-file 
                            v-model="file" 
                            label="Upload Signature"
                            outlined 
                            :error="Errors.file.type"
                            :no-error-icon="true"
                            class="col-2"
                        />
                    </div>
                </div> -->
                
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="() => { Save(); }" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="clear" @click="() => { clear(); }" outline/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }" outline/>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="SubmitLoading">
                <div class="text-center">
                    <q-spinner-puff size="md"/>
                    <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                </div>
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed, nextTick } from 'vue';
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

const emit = defineEmits(['update:modelValue', 'saved'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => {
        if (!val) emit('update:modelValue', null)
    }
})

const SubmitLoading = ref(false);

const signature = ref(null);

const GetSignature = async (id) => {
    SubmitLoading.value = true;
    try {
        const response = await api.get(`/employee/signature`, {
            params: { 
                id: id
            }
        });
        signature.value = response.data.record;

    } catch (error) {
        console.error("Error fetching all data:", error);
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Error</div>
                <div class="text-caption text-capitalize;">Unable to fetch records</div>
            `
        });
    } finally {
        SubmitLoading.value = false;
    }
}

const PopulateData = () => {
    GetSignature(EmployeeStore.data?.id)
}

const file = ref('')

const ResetForm = () => {
    file.value = ''
};

const Errors = reactive({
    file: {
        type: null, msg: ''
    }
});
const Validations = () => {

    let isError = false;
    
    if (!pad || pad.isEmpty()) {
        Errors.file.type = true;
        Errors.file.msg = 'required';
        isError = true;
    }

    if (isError) {
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                <div class="text-caption">Something went wrong.</div>
            `
        })
    }

    return !isError
}

const Save = async () => {
    if (!Validations()) return;
    const dataUrl = pad.toDataURL('image/png')
    const file = base64ToPngFile(dataUrl)
    SubmitLoading.value = true;
    try {
        const Data = new FormData();
        Data.append('file', file);
        const response = await api.post(`/employee/${EmployeeStore.data?.id}/signature`, Data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        emit('saved');
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
};

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

const FormatSignature = (sign) => {
    return `${process.env.VUE_APP_BACKEND_URL}${sign.signature}`
}

import SignaturePad from 'signature_pad'

const containerRef = ref(null)
const canvasRef = ref(null)
let pad = null

const onShow = async () => {
    await nextTick() // wait until canvas is mounted
    initSignaturePad()
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
}

const onHide = () => {
    window.removeEventListener('resize', resizeCanvas)
    pad?.off?.()
    pad = null
}

const initSignaturePad = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    pad = new SignaturePad(canvas, {
        backgroundColor: 'rgba(255,255,255,0)',
        penColor: '#000',
        maxWidth: 4, 
    })
}

const resizeCanvas = () => {
    const canvas = canvasRef.value
    const container = containerRef.value
    if (!canvas || !container) return

    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const { width, height } = container.getBoundingClientRect()

    canvas.width = Math.floor(width * ratio)
    canvas.height = Math.floor(height * ratio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

    pad?.clear()
}

const clear = () => {
    pad?.clear()
}


const base64ToPngFile = (base64, filename = 'signature.png') => {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
}

</script>

<style scoped>
.signature-container {
  border: 1px solid #ccc;
  height: 100%;
  width: 100%;
}
.signature-canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>