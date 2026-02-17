<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">employment information</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase" :class="Errors.employmentstatus.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.employmentstatus.type ? Errors.employmentstatus.msg : 'employment status' }}</div>
                    <div class="q-gutter-sm">
                        <q-radio v-for="value in employmentstatuses" v-model="employmentstatus" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" :val="value" :label="value" class="text-capitalize"/>
                    </div>
                </div>
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.dateHired.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.dateHired.msg ? Errors.dateHired.msg : 'date hired (YYYY-MM-DD)' }}</div>
                        <q-input outlined v-model="dateHired" label="Enter Date" :error="Errors.dateHired.type" :no-error-icon="true">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                <q-date v-model="dateHired" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                            </q-popup-proxy>
                        </q-input>
                    </div>
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.employeeNo.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.employeeNo.msg ? Errors.employeeNo.msg : 'id number (YYYY-NNN)' }}</div>
                        <q-input 
                            v-model="employeeNo" 
                            label="Enter ID No."
                            mask="####-###"
                            outlined 
                            :error="Errors.employeeNo.type"
                            :no-error-icon="true"
                        />
                    </div>
                </div>
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.tin.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.tin.type ? Errors.tin.msg : 'TIN' }}</div>
                        <q-input 
                            v-model="tin" 
                            label="Enter TIN"
                            outlined 
                            :error="Errors.tin.type"
                            :no-error-icon="true"
                            class="text-capitalize"
                        />
                    </div>
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.sssNo.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.sssNo.type ? Errors.sssNo.msg : 'SSS no' }}</div> 
                        <q-input 
                            v-model="sssNo" 
                            label="Enter SSS No."
                            outlined 
                            :error="Errors.sssNo.type"
                            :no-error-icon="true"
                            class="text-capitalize"
                        />
                    </div>
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.philhealthNo.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.philhealthNo.type ? Errors.philhealthNo.msg : 'Philhealth No.' }}</div>
                        <q-input 
                            v-model="philhealthNo"
                            label="Enter Philhealth No." 
                            outlined 
                            :error="Errors.philhealthNo.type"
                            :no-error-icon="true"
                            class="text-capitalize"
                        />
                    </div>
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.pagibigNo.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.pagibigNo.type ? Errors.pagibigNo.msg : 'pagibig no.' }}</div>
                        <q-input 
                            v-model="pagibigNo" 
                            label="Enter Pagibig No."
                            outlined 
                            :error="Errors.pagibigNo.type"
                            :no-error-icon="true"
                            class="text-capitalize"
                        />
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save()" />
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

const emit = defineEmits(['update:modelValue', 'saved'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => {
        if (!val) emit('update:modelValue', null)
    }
})

const SubmitLoading = ref(false);

const employeeNo = ref('');
const dateHired = ref('');
const employmentstatus = ref('');
const tin = ref('');
const sssNo = ref('');
const philhealthNo = ref('');
const pagibigNo = ref('');

const Errors = reactive({
    employeeNo: { type: null, msg: '' },
    dateHired: { type: null, msg: '' },
    employmentstatus: { type: null, msg: '' },
    tin: { type: null, msg: '' },
    sssNo: { type: null, msg: '' },
    philhealthNo: { type: null, msg: '' },
    pagibigNo: { type: null, msg: '' },
});

const failToast = () =>
  Toast.fire({
    icon: "error",
    html: `
      <div class="text-h6 text-bold text-uppercase">Request Failed</div>
      <div class="text-caption">Something went wrong.</div>
    `
  })

const setErr = (key, msg = 'required') => (Errors[key].type = true, Errors[key].msg = msg, true)
const clearErr = (key) => (Errors[key].type = null, Errors[key].msg = '', false)

const req = (key, val) => (!val ? setErr(key, 'required') : clearErr(key))
const maxLen = (key, val, n, msg = 'invalid') => (val && String(val).length > n ? setErr(key, msg) : clearErr(key))
const match = (key, val, regex, msg = 'invalid') => (!val ? setErr(key, 'required') : (!regex.test(val) ? setErr(key, msg) : clearErr(key)))

const ValidateEmployment = () => {
    let isError = false

    isError ||= req('employmentstatus', employmentstatus.value)
    isError ||= req('dateHired', dateHired.value)

    isError ||= maxLen('tin', tin.value, 15, 'invalid')
    isError ||= maxLen('sssNo', sssNo.value, 15, 'invalid')
    isError ||= maxLen('philhealthNo', philhealthNo.value, 15, 'invalid')
    isError ||= maxLen('pagibigNo', pagibigNo.value, 15, 'invalid')

    if (isError) failToast()
    return !isError
}

const employmentstatuses = ref(["Regular","Probationary","Contractual","Temporary","Intern"]);

const PopulateData = () => {
    const app = EmployeeStore.data;
    employeeNo.value = app.employment?.employee_no;
    dateHired.value = app.employment?.date_hired;
    employmentstatus.value = app.employment.employment_status;
    tin.value = app.employment.tin;
    sssNo.value = app.employment.sss_no;
    philhealthNo.value = app.employment.philhealth_no;
    pagibigNo.value = app.employment.pagibig_no;
}

const Save = async () => {
    if (ValidateEmployment && !ValidateEmployment()) return;
    SubmitLoading.value = true;
    try {
        const response = await api.post(`/employee/${EmployeeStore.data?.employment?.id}/employment`, {
            employeeNo: employeeNo.value,
            dateHired: dateHired.value,
            employmentstatus: employmentstatus.value,
            tin: tin.value,
            sssNo: sssNo.value,
            pagibigNo: pagibigNo.value,
            philhealthNo: philhealthNo.value
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
</script>