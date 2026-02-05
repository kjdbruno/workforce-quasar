<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">{{ LeaveStore.isEdit ? 'modify leave application' : 'create new leave application' }}</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <transition name="fade-slide" mode="out-in">
                    <div :key="step">
                        <div v-if="step === 0">
                            <div class="text-overline text-uppercase text-bold q-mb-md">personnel</div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase q-mb-sm" :class="Errors.employeeid.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.employeeid.type ? Errors.employeeid.msg : 'employee' }}</div>
                                <div class="card-grid">
                                    <div class="inner-card-anim-wrapper" :style="{ animationDelay: `100ms` }">
                                        <q-card class="card card-menu card-hover-animate q-pa-md no-shadow cursor-pointer radius-sm q-mr-xs q-mb-xs" v-if="!displayedEmployees.length">
                                            <q-card-section class="text-center">
                                                <div class="text-caption text-dark text-uppercase">no record found</div>
                                            </q-card-section>
                                        </q-card>
                                    </div>
                                    <div v-for="(data, index) in displayedEmployees" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 100}ms` }" v-if="displayedEmployees.length">
                                        <q-card @click="() => { employeeid = data.id }" class="card card-menu card-hover-animate q-pa-md no-shadow cursor-pointer radius-sm q-mr-xs q-mb-xs" :class="{ 'card--active': employeeid === data.id }">
                                            <q-card-section class="text-center">
                                                <div class="text-caption text-dark text-uppercase">{{ FormatName(data) }}</div>
                                            </q-card-section>
                                            <div class="absolute-left">
                                                <q-radio v-model="employeeid" :val="data.id" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" size="xs" />
                                            </div>
                                        </q-card>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 1">
                            <div class="text-overline text-uppercase text-bold q-mb-md">leave type</div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase q-mb-sm" :class="Errors.typeid.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.typeid.type ? Errors.typeid.msg : 'leave type' }}</div>
                                <div class="card-grid">
                                    <div class="inner-card-anim-wrapper" :style="{ animationDelay: `100ms` }">
                                        <q-card class="card card-menu card-hover-animate q-pa-md no-shadow cursor-pointer radius-sm q-mr-xs q-mb-xs" v-if="!leavetypes.length">
                                            <q-card-section class="text-center">
                                                <div class="text-caption text-dark text-uppercase">no record found</div>
                                            </q-card-section>
                                        </q-card>
                                    </div>
                                    <div v-for="(data, index) in leavetypes" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 100}ms` }" v-if="leavetypes.length">
                                        <q-card @click="() => { typeid = data.id }" class="card card-menu card-hover-animate q-pa-md no-shadow cursor-pointer radius-sm q-mr-xs q-mb-xs" :class="{ 'card--active': typeid === data.id }">
                                            <q-card-section class="text-center">
                                                <div class="text-caption text-dark text-uppercase">{{ data.name }}</div>
                                            </q-card-section>
                                            <div class="absolute-left">
                                                <q-radio v-model="typeid" :val="data.id" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" size="xs" />
                                            </div>
                                        </q-card>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 2">
                            <div class="text-overline text-uppercase text-bold q-mb-md">reason & date</div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-5">
                                    <div class="text-caption text-uppercase" :class="Errors.reason.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.reason.type ? Errors.reason.msg : 'reason' }}</div>
                                    <q-input 
                                        v-model="reason" 
                                        outlined 
                                        type="textarea" 
                                        :error="Errors.reason.type"
                                        :no-error-icon="true"
                                        label="Enter Reason"
                                    />
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.datestart.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.datestart.type ? Errors.datestart.msg : 'date start' }}</div>
                                    <q-input outlined v-model="datestart" label="Enter Date" :error="Errors.datestart.type" no-error-icon>
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" ref="popup">
                                            <q-date v-model="datestart" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide(); } "/>
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.dateend.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.dateend.type ? Errors.dateend.msg : 'date end' }}</div>
                                    <q-input outlined v-model="dateend" label="Enter Date" :error="Errors.dateend.type" no-error-icon>
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" ref="popup">
                                            <q-date v-model="dateend" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide(); } "/>
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                                <div class="col-1">
                                    <div class="text-caption text-uppercase text-grey">day/s</div>
                                    <q-input 
                                        v-model="days" 
                                        outlined 
                                        :no-error-icon="true"
                                        :readonly="true"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="row q-gutter-sm">
                    <q-btn v-if="step > 0" unelevated size="md" color="primary" class="btn text-capitalize" label="previous" @click="() => { PreviousStep() }" />
                    <q-btn v-if="step < totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="next" @click="() => { NextStep() }" />
                    <q-btn v-if="step === totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }" outline/>
                    <q-input v-if="step === 0" outlined dense debounce="1000" v-model="search" placeholder="Search Employee...">
                        <template v-slot:prepend>
                            <q-icon name="search" style="font-size: 1rem;" />
                        </template>
                        <template v-slot:after>
                            <div class="text-caption text-uppercase text-grey">{{ displayCount }} of {{ totalCount }}</div>
                        </template>
                    </q-input>
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

import { useLeaveStore } from 'src/stores/leave-store';
const LeaveStore = useLeaveStore();

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
    LoadEmployees(); 
    LoadLeaveTypes(); 
    ResetForm();
    step.value = 0;
}

const id = ref('');
const employeeid = ref('');
const typeid = ref('');
const datestart = ref(new Date().toISOString().split('T')[0]);
const dateend = ref(new Date().toISOString().split('T')[0]);
const days = computed(() => {
    if (!datestart.value || !dateend.value) return ''
    const start = moment(datestart.value, 'YYYY-MM-DD')
    const end = moment(dateend.value, 'YYYY-MM-DD')
    // Calculate difference in days
    const diff = end.diff(start, 'days') + 1 // +1 to include both start and end dates
    return diff > 0 ? diff : 0
});
const reason = ref('');
const isactive = ref(false);

const Errors = reactive({
    employeeid: { 
        type: null, message: ''
    },
    typeid: { 
        type: null, message: ''
    },
    datestart: { 
        type: null, message: ''
    },
    dateend: { 
        type: null, message: ''
    },
    reason: { 
        type: null, message: ''
    }
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

const notBefore = (key, end, start, msg = 'invalid') =>
    (end && start && new Date(end) < new Date(start))
        ? setErr(key, msg)
        : clearErr(key)


const ValidateEmployee = () => {

    let isError = false

    isError ||= req('employeeid', employeeid.value)

    if (isError) failToast()
    return !isError
}

const ValidateLeaveType = () => {

    let isError = false

    isError ||= req('typeid', typeid.value)

    if (isError) failToast()
    return !isError
}

const ValidateDate = () => {

    let isError = false

    isError ||= req('datestart', datestart.value)
    isError ||= req('dateend', dateend.value)
    isError ||= notBefore('dateend', dateend.value, datestart.value)
    isError ||= req('reason', reason.value)

    if (isError) failToast()
    return !isError
}

const Save = async () => {
    if (ValidateDate && !ValidateDate()) return;
    SubmitLoading.value = true;
    try {
        const response = id.value && isEdit
            ? await api.post(`/leave/${id.value}/update`, {
                employeeid: employeeid.value,
                typeid: typeid.value,
                datestart: datestart.value,
                dateend: dateend.value,
                reason: reason.value
            })
            : await api.post('/leave', {
                employeeid: employeeid.value,
                typeid: typeid.value,
                datestart: datestart.value,
                dateend: dateend.value,
                reason: reason.value
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


const FormatName = (profile) => {
    if (!profile) return '';
    const firstname = profile.first_name || '';
    const middlename = profile.middle_name
        ? profile.middle_name.charAt(0).toUpperCase() + '.'
        : '';
    const lastname = profile.last_name || '';
    const suffix = profile.suffix ? ` ${profile.suffix}` : '';
    return `${firstname} ${middlename} ${lastname}${suffix}`.trim();
}

const employees = ref([]);
const leavetypes = ref([]);

const LoadEmployees = async () => {
    try {
        const { data } = await api.get(`/leave/option/employee`);
        employees.value = data
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadLeaveTypes = async () => {
    try {
        const { data } = await api.get(`/leave/option/leavetype`);
        leavetypes.value = data
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const ResetForm = () => {
    id.value = '';
    employeeid.value = '';
    typeid.value = '';
    datestart.value = new Date().toISOString().split('T')[0];
    dateend.value = new Date().toISOString().split('T')[0];
    reason.value = '';
    isactive.value = false;
    ResetAllErrors()
}

const ResetAllErrors = () => {
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].msg = '';
    });
}

const search = ref('')

const filteredEmployees = computed(() => {
    const q = search.value.trim().toLowerCase()
    return q
        ? employees.value.filter(p =>
            String(p.label || '').toLowerCase().includes(q)
        )
        : employees.value
})

const displayedEmployees = computed(() => filteredEmployees.value)

const displayCount = computed(() => displayedEmployees.value.length)
const totalCount = computed(() => filteredEmployees.value.length)

const step = ref(0)
const totalSteps = 3;

const validators = [
    ValidateEmployee,
    ValidateLeaveType
]

const NextStep = () => {
    const validate = validators[step.value];
    if (validate && !validate()) return;
    step.value++;
};

const PreviousStep = () => {
    if (step.value > 0) step.value--;
};

const popup = ref(null);
</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>