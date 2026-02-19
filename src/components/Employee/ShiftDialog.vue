<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">shift information</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div v-for="(value, index) in schedules" :key="index" class="q-mb-md">
                    <div>
                        <span class="text-uppercase text-body1 text-bold">shift {{ index+1 }}</span>
                        <q-btn 
                            v-if="schedules.length > 1 && AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" 
                            round 
                            icon="bi-trash3" 
                            flat 
                            unelevated 
                            color="grey" 
                            @click="RemoveSchedule(index)" 
                            size="sm"
                            class="q-ml-sm"
                        />
                    </div>
                    <div class="row q-col-gutter-xs q-mb-sm">
                        <div class="col-2">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.schedules.shiftId.msg ? 'text-negative' : 'text-grey'">{{ Errors.schedules.shiftId.msg ? Errors.schedules.shiftId.msg : 'shift' }}</div>
                            <q-select
                                outlined
                                v-model="value.shiftId"
                                label="Choose Shift"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredShifts"
                                @filter="filterShiftFn"
                                :error="Errors.schedules.shiftId.type[index]"
                                hide-dropdown-icon
                                :no-error-icon="true"
                                class="text-capitalize"
                            >
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-italic text-grey">
                                        No options
                                        </q-item-section>
                                    </q-item>
                                </template>
                                <template v-slot:option="scope">
                                    <q-item v-bind="scope.itemProps">
                                        <q-item-section>
                                            <q-item-label>{{ $CapitalizeWords(scope.opt.label) }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-sm">
                        <div class="col-2">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.schedules.effectiveFrom.msg ? 'text-negative' : 'text-grey'">{{ Errors.schedules.effectiveFrom.msg ? Errors.schedules.effectiveFrom.msg : 'start date (YYYY-MM-DD)' }}</div>
                            <q-input outlined v-model="value.effectiveFrom" label="Enter Date">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" :ref="el => efStartPopups[index] = el">
                                    <q-date v-model="value.effectiveFrom" mask="YYYY-MM-DD" @update:model-value="() => hideEfStartPopup(index)"/>
                                </q-popup-proxy>
                            </q-input>
                        </div>
                        <div class="col-2">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.schedules.effectiveTo.msg ? 'text-negative' : 'text-grey'">{{ Errors.schedules.effectiveTo.msg ? Errors.schedules.effectiveTo.msg : 'end date (YYYY-MM-DD)' }}</div>
                            <q-input outlined v-model="value.effectiveTo" label="Enter Date">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" :ref="el => etEndPopups[index] = el">
                                    <q-date v-model="value.effectiveTo" mask="YYYY-MM-DD" @update:model-value="() => hideEtEndPopup(index)"/>
                                </q-popup-proxy>
                            </q-input>
                        </div>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="() => { Save(); }" />
                    <q-btn v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="add" @click="() => { AddSchedule() }" outline/>
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
const AuthStore = useAuthStore()

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

const schedules = ref([
    {
        id: '',
        shiftId: "",
        effectiveFrom: "",
        effectiveTo: "",
        notes: ''
    }
]);

const EmptySchedule = () => ({
    id: '',
    shiftId: "",
    effectiveFrom: "",
    effectiveTo: "",
    notes: ''
})

const GetSchedule = async (id) => {
    SubmitLoading.value = true;
    try {
        const response = await api.get(`/employee/schedule`, {
            params: { 
                id: id
            }
        });
        !response.data.record.length
            ? [EmptySchedule()]
            : MapSchedules(response.data.record)
        
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

const MapSchedules = (data = []) => {
    schedules.value = data.map(item => ({
        id: item.id ?? '',
        shiftId: Number(item.shift_id) ?? '',
        effectiveFrom: item.effective_from ?? '',
        effectiveTo: item.effective_to ?? '',
        notes: item.notes ?? ''
    }))
}

const PopulateData = () => {
    LoadShifts()
    GetSchedule(EmployeeStore.data?.id)
}

const Errors = reactive({
    schedules: {
        shiftId: {
            type: [], msg: ''
        },
        effectiveFrom: {
            type: [], msg: ''
        },
        effectiveTo: {
            type: [], msg: ''
        }
    }
});

const initErrors = () => {
    Errors.schedules.shiftId.type = schedules.value.map(() => null);
    Errors.schedules.effectiveFrom.type = schedules.value.map(() => null);
    Errors.schedules.effectiveTo.type = schedules.value.map(() => null);
}

const Validations = () => {

    let isError = false;
    
    Errors.schedules.shiftId = { type: null, msg: '' }
    Errors.schedules.effectiveFrom = { type: null, msg: '' }
    Errors.schedules.effectiveTo = { type: null, msg: '' }

    initErrors()
    
    schedules.value.forEach((e, index) => {
        if (!e.shiftId) {
            Errors.schedules.shiftId.type[index] = true;
            Errors.schedules.shiftId.msg = 'required';
            isError = true;
        }
        if (!e.effectiveFrom) {
            Errors.schedules.effectiveFrom.type[index] = true;
            Errors.schedules.effectiveFrom.msg = 'required';
            isError = true;
        } else if (isNaN(new Date(e.effectiveFrom).getTime())) {
            Errors.schedules.effectiveFrom.type[index] = true;
            Errors.schedules.effectiveFrom.msg = 'invalid';
            isError = true;
        }
        if (e.effectiveTo && isNaN(new Date(e.effectiveTo).getTime())) {
            Errors.educations.effectiveTo.type[index] = true;
            Errors.educations.effectiveTo.msg = 'invalid';
            isError = true;
        }
    });

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

const shifts = ref([]);
const filteredShifts = ref([]);

const createFilterFn = (sourceRef, targetRef) => {
    return (val, update) => {
        if (val === '') {
        update(() => { targetRef.value = sourceRef.value; });
            return;
        }
        update(() => {
            const needle = val.toLowerCase();
            targetRef.value = sourceRef.value.filter(v => v.label.toLowerCase().includes(needle));
        });
    };
};

const filterShiftFn = createFilterFn(shifts, filteredShifts);

const LoadShifts = async () => {
    try {
        const { data } = await api.get(`/employee/option/shift`);
        shifts.value = (data || []).map(d => {
            const baseLabel = d.label ?? d.name ?? String(d.text ?? d.value ?? '');
            return {
                label: baseLabel,
                value: Number(d.value ?? d.id)
            };
        });
        filteredShifts.value = [...shifts.value];
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};


const AddSchedule = () => {
    const e = schedules.value;
    e.push({
        id: '',
        shiftId: "",
        effectiveFrom: "",
        effectiveTo: "",
        notes: ''
    });
}

const RemoveSchedule = (index) => {
    schedules.value.splice(index, 1);
}

const Save = async () => {
    if (!Validations()) return;
    SubmitLoading.value = true;
    try {
        const response = await api.post(`/employee/${EmployeeStore.data?.id}/schedule`, {
            schedules: schedules.value
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

const efStartPopups = ref([]);
const etEndPopups = ref([]);
function hideEfStartPopup(index) {
  nextTick(() => {
    if (efStartPopups.value[index]) efStartPopups.value[index].hide();
  });
}
function hideEtEndPopup(index) {
  nextTick(() => {
    if (etEndPopups.value[index]) etEndPopups.value[index].hide();
  });
}
</script>