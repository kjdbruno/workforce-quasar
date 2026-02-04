<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">create recruitment</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <transition name="fade-slide" mode="out-in">
                    <div :key="step">
                        <div v-if="step === 0"></div>
                    </div>
                </transition>
                <div class="q-mb-md">
                    <div class="card-grid">
                        <div class="card-anim-wrapper" :style="{ animationDelay: `100ms` }">
                            <q-card class="card card-menu custom-border card-hover-animate q-pa-md no-shadow cursor-pointer radius-sm" v-if="!displayedPositions.length">
                                <q-card-section class="text-center">
                                    <div class="text-caption text-dark text-uppercase">no record found</div>
                                </q-card-section>
                            </q-card>
                        </div>
                        <div v-for="(data, index) in displayedPositions" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 100}ms` }" v-if="displayedPositions.length">
                            <q-card @click="() => { position = data }" class="card card-menu custom-border card-hover-animate q-pa-md no-shadow cursor-pointer radius-sm" :class="{ 'card--active': position === data }">
                                <q-card-section class="text-center">
                                    <div class="text-caption text-dark text-uppercase">{{ data.label }}</div>
                                </q-card-section>
                                <div class="absolute-left">
                                    <q-radio v-model="position" :val="data" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" size="xs" />
                                </div>
                            </q-card>
                        </div>
                    </div>
                </div>
                <div class="q-mb-md">
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">salary range</div>
                        <div class="text-caption">{{ formatSalaryRange(position?.amount) || 'N/A' }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">job description</div>
                        <div class="text-caption">{{ position?.description || 'N/A' }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">job qualification</div>
                        <div class="text-caption">
                            <template v-if="Array.isArray(position?.qualification) && position?.qualification.length">
                                <div v-for="(dt, index) in position?.qualification" :key="index">
                                {{ index + 1 }}. {{ dt }}
                                </div>
                            </template>
                            <div v-else>
                                N/A
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row q-col-gutter-md">
                    <div class="col-6">
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase" :class="Errors.employmentStatus.type ? 'text-negative' : 'text-grey'">{{ Errors.employmentStatus.type ? Errors.employmentStatus.msg : 'employment status' }}</div>
                            <div class="q-gutter-sm">
                                <q-radio v-for="value in employmentstatuses" v-model="employmentStatus" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="value" :label="value" />
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-md">
                            <div class="col-4">
                                <div class="text-caption text-uppercase" :class="Errors.date.type ? 'text-negative' : 'text-grey'">{{ Errors.date.type ? Errors.date.msg : 'date needed (YYYY-MM-DD)' }}</div>
                                <q-input outlined v-model="date" label="Enter Date" :error="Errors.date.type" :no-error-icon="true">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                        <q-date v-model="date" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                                    </q-popup-proxy>
                                </q-input>
                            </div>
                            <div class="col-4">
                                <div class="text-caption text-uppercase" :class="Errors.departmentId.type ? 'text-negative' : 'text-grey'">{{ Errors.departmentId.type ? Errors.departmentId.msg : 'department' }}</div>
                                <q-select
                                    outlined
                                    v-model="departmentId"
                                    label="Choose Department"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredDepartments"
                                    @filter="filterDepartmentFn"
                                    :error="Errors.departmentId.type"
                                    dropdown-icon="keyboard_arrow_down"
                                    :no-error-icon="true"
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
                            <div class="col-4">
                                <div class="text-caption text-uppercase" :class="Errors.shiftId.type ? 'text-negative' : 'text-grey'">{{ Errors.shiftId.type ? Errors.shiftId.msg : 'Shift' }}</div>
                                <q-select
                                    outlined
                                    v-model="shiftId"
                                    label="Choose Shift"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredShifts"
                                    @filter="filterShiftFn"
                                    :error="Errors.shiftId.type"
                                    dropdown-icon="keyboard_arrow_down"
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
                                                <q-item-label caption>{{ formatTimeRange(scope.opt) }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase" :class="Errors.location.type ? 'text-negative' : 'text-grey'">{{ Errors.location.type ? Errors.location.msg : 'location' }}</div>
                            <q-input 
                                v-model="location" 
                                label="Enter Location"
                                outlined
                                :error="Errors.location.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">background check</div>
                            <q-checkbox right-label v-model="needBackgroundCheck" label="need background check?" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" class="text-uppercase"/>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase" :class="Errors.movement.type ? 'text-negative' : 'text-grey'">{{ Errors.movement.type ? Errors.movement.msg : 'movement' }}</div>
                            <div class="q-gutter-sm">
                                <q-radio v-model="movement" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Addition" label="addition to department"  class="text-uppercase" />
                                <q-radio v-model="movement" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Replacement" label="replacement"  class="text-uppercase" />
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase" :class="Errors.justification.type ? 'text-negative' : 'text-grey'">{{ Errors.justification.type ? Errors.justification.msg : 'justification' }}</div>
                            <q-input 
                                v-model="justification" 
                                label="Enter Justification"
                                outlined
                                :error="Errors.justification.type"
                                :no-error-icon="true"
                                type="textarea"
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="row q-gutter-sm">
                    <q-btn v-if="step > 0" unelevated size="md" color="primary" class="btn text-capitalize" label="previous" @click="() => { PreviousStep() }" />
                    <q-btn v-if="step < totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="next" @click="() => { NextStep() }" />
                    <q-btn v-if="step === totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                    <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="clear" @click="() => { ResetForm(); ResetErrors(); }" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { dialog = false; }" outline/>
                    <q-input outlined dense debounce="1000" v-model="searchPosition" placeholder="Search...">
                        <template v-slot:prepend>
                            <q-icon name="search" style="font-size: 1rem;" />
                        </template>
                        <template v-slot:after>
                            <div class="text-caption text-uppercase text-grey">{{ displayCount }} of {{ totalCount }}</div>
                        </template>
                    </q-input>
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

const PopulateData = () => {
    ResetForm();
    LoadPositions();
    LoadDepartments();
    LoadShifts();
}

const SubmitLoading = ref(false);

const id = ref('');
const position = ref('');
const departmentId = ref('');
const shiftId = ref('');
const date = ref(new Date().toISOString().split('T')[0]);
const location = ref('');
const employmentStatus = ref('');
const movement = ref('');
const justification = ref('');
const needBackgroundCheck = ref(false);
const isActive = ref(false);

const Errors = reactive({
    position: { type: null, msg: '' },
    departmentId: { type: null, msg: '' },
    shiftId: { type: null, msg: '' },
    employmentStatus: { type: null, msg: '' },
    date: { type: null, msg: '' },
    location: { type: null, msg: '' },
    movement: { type: null, msg: '' },
    justification: { type: null, msg: '' },

});

const Validations = () => {

    let isError = false;

    if (!position.value) { Errors.position = { type: true, msg: 'Position is required' }; isError = true } else Errors.position.type = null
    if (!departmentId.value) { Errors.departmentId = { type: true, msg: 'Department is required' }; isError = true } else Errors.departmentId.type = null
    if (!shiftId.value) { Errors.shiftId = { type: true, msg: 'Schedule shift is required' }; isError = true } else Errors.shiftId.type = null
    if (!employmentStatus.value) { Errors.employmentStatus = { type: true, msg: 'Employment status is required' }; isError = true } else Errors.employmentStatus.type = null
    if (!date.value) { Errors.date = { type: true, msg: 'Date is required' }; isError = true } else Errors.date.type = null
    if (!location.value) { Errors.location = { type: true, msg: 'Location is required' }; isError = true } else Errors.location.type = null
    if (!movement.value) { Errors.movement = { type: true, msg: 'Movement is required' }; isError = true } else Errors.movement.type = null
    if (!justification.value) { Errors.justification = { type: true, msg: 'Justification is required' }; isError = true } else Errors.justification.type = null


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

const qualifications = ref([]);

const ResetForm = () => {
    position.value = '';
    departmentId.value = '';
    shiftId.value = '';
    date.value = new Date().toISOString().split('T')[0];
    location.value = '';
    movement.value = '';
    justification.value = '';
    needBackgroundCheck.value = false;
    employmentStatus.value = '';
    qualifications.value = [];
    ResetErrors();
}

const ResetErrors = () =>
    Object.values(Errors).forEach(e => {
        e.type = null;
        e.msg = null;
});

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

const positions = ref([]);
const departments = ref([]);
const shifts = ref([]);

const filteredDepartments = ref([]);
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

const filterDepartmentFn = createFilterFn(departments, filteredDepartments);
const filterShiftFn = createFilterFn(shifts, filteredShifts);

const LoadDepartments = async () => {
    try {
        const { data } = await api.get(`/recruitment/option/department`);
        departments.value = (data || []).map(d => {
            const baseLabel = d.label ?? d.name ?? String(d.text ?? d.value ?? '');
            return {
                label: baseLabel,
                value: Number(d.value ?? d.id)
            };
        });
        filteredDepartments.value = [...departments.value];
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadShifts = async () => {
    try {
        const { data } = await api.get(`/recruitment/option/shift`);
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

const LoadPositions = async () => {
    try {
        const response = await api.get(`/recruitment/option/position`);
        positions.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const search = ref('')

const filteredPositions = computed(() => {
    const q = search.value.trim().toLowerCase()
    return q
        ? positions.value.filter(p =>
            String(p.label || '').toLowerCase().includes(q)
        )
        : positions.value
})

const displayedPositions = computed(() => filteredPositions.value)

const displayCount = computed(() => displayedPositions.value.length)
const totalCount = computed(() => filteredPositions.value.length)

const step = ref(0)
const totalSteps = 3;

const validators = [
    // ValidateEmployee,
    // ValidateLeaveType
]

const NextStep = () => {
    // const validate = validators[step.value];
    // if (validate && !validate()) return;
    step.value++;
};

const PreviousStep = () => {
    if (step.value > 0) step.value--;
};

const formatSalaryRange = (val) => {
    if (!val) return ''

    // allow digits, commas, dots, dash, spaces
    const clean = String(val).replace(/[^\d.,\- ]/g, '')

    const parts = clean
        .split('-')
        .map(v => v.trim())
        .slice(0, 2)

    const format = (v) => {
        if (!v) return ''
        const num = Number(v.replace(/,/g, ''))
        return isNaN(num) ? '' : peso.format(num)
    }

    const min = format(parts[0])
    const max = parts[1] ? format(parts[1]) : ''

    return max ? `${min} - ${max}` : min
}
</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>