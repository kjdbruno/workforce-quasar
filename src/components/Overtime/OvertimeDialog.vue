<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">{{ OvertimeStore.isEdit ? 'modify overtime application' : 'create new overtime application' }}</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <transition name="fade-slide" mode="out-in">
                    <div :key="step">
                        <div v-if="step === 0">
                            <div class="text-overline text-uppercase text-bold q-mb-md">personnel</div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase q-mb-sm" :class="Errors.personnels.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.personnels.type ? Errors.personnels.msg : 'employee' }}</div>
                                <div class="card-grid">
                                    <div class="inner-card-anim-wrapper" :style="{ animationDelay: `100ms` }">
                                        <q-card class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-if="!displayedEmployees.length">
                                            <q-card-section>
                                                <div class="text-caption text-dark text-uppercase">no record found</div>
                                            </q-card-section>
                                        </q-card>
                                    </div>
                                    <div v-if="displayedEmployees?.length" v-for="(data, index) in displayedEmployees" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 100}ms` }" >
                                        <q-card class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" :class="{ 'card--active': IsSelected(data.id) }" @click="TogglePersonnel(data.id)" >
                                            <q-card-section>
                                                <div class="text-caption text-dark text-uppercase">
                                                    {{ FormatName(data) }}
                                                </div>
                                            </q-card-section>
                                            <div class="absolute-left">
                                                <q-checkbox :model-value="IsSelected(data.id)" @update:model-value="(val) => SetSelected(data.id, val)" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" size="xs" @click.stop />
                                            </div>
                                        </q-card>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 1">
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase " :class="Errors.date.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.date.type ? Errors.date.msg : 'date' }}</div>
                                    <q-input outlined v-model="date" label="Enter Date" :error="Errors.date.type" :no-error-icon="true">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                            <q-date v-model="date" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.timeStart.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.timeStart.type ? Errors.timeStart.msg : 'start time' }}</div>
                                    <q-input outlined v-model="timeStart" label="Enter Time" :error="Errors.timeStart.type" :no-error-icon="true" mask="##:##" fill-mask>
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                            <q-time v-model="timeStart" mask="HH:mm" >
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Okay" color="primary" flat size="sm"/>
                                                </div>
                                            </q-time>
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.timeEnd.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.timeEnd.type ? Errors.timeEnd.msg : 'time end' }}</div>
                                    <q-input outlined v-model="timeEnd" label="Enter Time" :error="Errors.timeEnd.type" :no-error-icon="true" mask="##:##" fill-mask>
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                            <q-time v-model="timeEnd" mask="HH:mm" >
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Okay" color="primary" flat size="sm"/>
                                                </div>
                                            </q-time>
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-xl">
                                <div class="col-4">
                                    <div class="text-caption text-uppercase" :class="Errors.description.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.description.type ? Errors.description.msg : 'description' }}</div>
                                    <q-input 
                                        v-model="description" 
                                        outlined 
                                        type="textarea" 
                                        :error="Errors.description.type"
                                        :no-error-icon="true"
                                        label="Enter Content"
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
                            <q-icon name="bi-search" style="font-size: 1rem;" />
                        </template>
                        <template v-slot:after>
                            <div class="text-caption text-uppercase text-grey">{{ displayCount }} of {{ totalCount }}</div>
                        </template>
                    </q-input>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="submitLoading">
                <<q-card class="no-shadow radius-md q-pa-md">
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

import { useOvertimeStore } from 'src/stores/overtime-store';
const OvertimeStore = useOvertimeStore();

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
    ResetForm();
    step.value = 0;
}

const id = ref('');
const date = ref('');
const timeStart = ref('');
const timeEnd = ref('');
const description = ref('');
const personnels = ref([]);

const Errors = reactive({
    date: { 
        type: null, message: ''
    },
    timeStart: { 
        type: null, message: ''
    },
    timeEnd: { 
        type: null, message: ''
    },
    description: { 
        type: null, message: ''
    },
    personnels: { 
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

    if (!Array.isArray(personnels.value) || personnels.value.length === 0) {
        req('personnels', null, 'required')
        isError = true
    }

    if (isError) failToast()
    return !isError
}

const ValidateInfo = () => {

    let isError = false

    isError ||= req('date', date.value)
    isError ||= req('timeStart',timeStart.value)
    isError ||= req('timeEnd',timeEnd.value)
    isError ||= req('description',description.value)

    if (isError) failToast()
    return !isError
}

const Save = async () => {
    if (ValidateInfo && !ValidateInfo()) return;
    SubmitLoading.value = true;
    try {
        const response = id.value && OvertimeStore.isEdit
            ? await api.post(`/overtime/${id.value}/update`, {
                date: date.value,
                timeStart: timeStart.value,
                timeEnd: timeEnd.value,
                description: description.value,
                employees: personnels.value
            })
            : await api.post('/overtime', {
                date: date.value,
                timeStart: timeStart.value,
                timeEnd: timeEnd.value,
                description: description.value,
                employees: personnels.value
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

const LoadEmployees = async () => {
    try {
        const { data } = await api.get(`/leave/option/employee`);
        employees.value = data
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const ResetForm = () => {
    id.value = '';
    date.value = new Date().toISOString().split('T')[0];
    timeStart.value = '';
    timeEnd.value = '';
    description.value = '';
    personnels.value = [];
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
    return employees.value.filter(p => {
        if (!q) return true
        const fullName = [
            p.first_name,
            p.middle_name,
            p.last_name
        ]
        .filter(Boolean)           // remove null / undefined / empty
        .join(' ')
        .toLowerCase()
        return fullName.includes(q)
    })
})

const displayedEmployees = computed(() => filteredEmployees.value)

const displayCount = computed(() => displayedEmployees.value.length)
const totalCount = computed(() => filteredEmployees.value.length)

const step = ref(0)
const totalSteps = 2;

const validators = [
    ValidateEmployee
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

/**
 * selecting checkbox
 */
const NormId = (id) => String(id)

const EnsureArray = () => {
    if (!Array.isArray(personnels.value)) personnels.value = []
    return personnels.value
}

const IsSelected = (id) => {
    const list = EnsureArray()
    return list.includes(NormId(id))
}

const SetSelected = (id, selected) => {
    const list = EnsureArray()
    const key = NormId(id)
    const idx = list.indexOf(key)

    if (selected) {
        if (idx === -1) list.push(key) // no duplicates
    } else {
        if (idx !== -1) list.splice(idx, 1)
    }
}

const TogglePersonnel = (id) => {
    SetSelected(id, !IsSelected(id))
}
</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>