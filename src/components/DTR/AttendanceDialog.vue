<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">generate attendance</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.dateStart.type ? 'text-negative' : 'text-grey'">{{ Errors.dateStart.type ? Errors.dateStart.message : 'date start (YYYY-MM-DD)' }}</div>
                        <q-input outlined v-model="dateStart" label="Enter Date">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                <q-date v-model="dateStart" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                            </q-popup-proxy>
                        </q-input>
                    </div>
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.dateEnd.type ? 'text-negative' : 'text-grey'">{{ Errors.dateEnd.type ? Errors.dateEnd.message : 'date end (YYYY-MM-DD)' }}</div>
                            <q-input outlined v-model="dateEnd" label="Enter Date">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                <q-date v-model="dateEnd" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                            </q-popup-proxy>
                        </q-input>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null) }" outline/>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="submitLoading">
                <div class="text-center">
                    <q-spinner-puff size="md"/>
                    <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                </div>
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 

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

const PopulateData = () => {
    
}

const dateStart = ref(new Date().toISOString().split('T')[0]);
const dateEnd = ref(new Date().toISOString().split('T')[0]);

const Errors = reactive({
    dateStart: { 
        type: null, message: ''
    },
    dateEnd: { 
        type: null, message: ''
    }
});

const Validations = () => {

    let isError = false;
    if (!dateStart.value) {
        Errors.dateStart.type = true;
        Errors.dateStart.message = ('date start is required!')
        isError = true
    } else {
        Errors.dateStart.type = null
    }
    if (!dateEnd.value) {
        Errors.dateEnd.type = true;
        Errors.dateEnd.message = ('date end is required!')
        isError = true
    } else {
        Errors.dateEnd.type = null
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
    SubmitLoading.value = true;
    try {
        const response = await api.post('/attendance', {
                dateStart: dateStart.value,
                dateEnd: dateEnd.value,
            });
        emit('update:modelValue', null);
        emit('saved');
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

const popup = ref(null);
</script>