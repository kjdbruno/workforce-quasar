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
                        <div v-if="step === 0">
                            <div class="row q-col-gutter-xs">
                                <div class="col-8">
                                    <div class="text-caption text-uppercase q-mb-sm" :class="Errors.position.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.position.type ? Errors.position.msg : 'position' }}</div>
                                    <div class="card-grid">
                                        <div class="inner-card-anim-wrapper" :style="{ animationDelay: `100ms` }">
                                            <q-card class="card card-menu custom-border card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-if="!displayedPositions.length">
                                                <q-card-section class="text-center">
                                                    <div class="text-caption text-dark text-uppercase">no record found</div>
                                                </q-card-section>
                                            </q-card>
                                        </div>
                                        <div v-for="(data, index) in displayedPositions" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 100}ms` }" v-if="displayedPositions.length">
                                            <q-card @click="() => { position = data }" class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" :class="{ 'card--active': position === data }">
                                                <q-card-section class="text-center">
                                                    <div class="text-caption text-dark text-uppercase">{{ data.label }}</div>
                                                </q-card-section>
                                                <div class="absolute-left">
                                                    <q-radio v-model="position" :val="data" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" size="xs" />
                                                </div>
                                            </q-card>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div v-if="position">
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
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 1">
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase" :class="Errors.employmentStatus.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.employmentStatus.type ? Errors.employmentStatus.msg : 'employment status' }}</div>
                                <div class="q-gutter-sm">
                                    <q-radio v-for="value in employmentstatuses" v-model="employmentStatus" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" :val="value" :label="value" />
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.date.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.date.type ? Errors.date.msg : 'date needed (YYYY-MM-DD)' }}</div>
                                    <q-input outlined v-model="date" label="Enter Date" :error="Errors.date.type" :no-error-icon="true">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                            <q-date v-model="date" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.shiftId.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.shiftId.type ? Errors.shiftId.msg : 'Shift' }}</div>
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
                                                    <q-item-label caption>{{ formatTimeRange(scope.opt) }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-4">
                                    <div class="text-caption text-uppercase" :class="Errors.location.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.location.type ? Errors.location.msg : 'location' }}</div>
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
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">background check</div>
                                <q-checkbox right-label v-model="needBackgroundCheck" label="need background check?" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" class="text-uppercase"/>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase" :class="Errors.movement.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.movement.type ? Errors.movement.msg : 'movement' }}</div>
                                <div class="q-gutter-sm">
                                    <q-radio v-model="movement" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" val="Addition" label="addition to department"  class="text-uppercase" />
                                    <q-radio v-model="movement" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" val="Replacement" label="replacement"  class="text-uppercase" />
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs">
                                <div class="col-4">
                                    <div class="text-caption text-uppercase" :class="Errors.justification.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.justification.type ? Errors.justification.msg : 'justification' }}</div>
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
                    </div>
                </transition>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="row q-gutter-sm">
                    <q-btn v-if="step > 0" unelevated size="md" color="primary" class="btn text-capitalize" label="previous" @click="() => { PreviousStep() }" />
                    <q-btn v-if="step < totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="next" @click="() => { NextStep() }" />
                    <q-btn v-if="step === totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="() => { Save(); }" />
                    <!-- <q-btn v-if="RecruitmentStore.data" unelevated size="md" color="primary" class="btn text-capitalize" :label="RecruitmentStore.data?.status ? 'disable' : 'enable'" @click="Toggle"/> -->
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="clear" @click="() => { ResetForm(); ResetErrors(); }" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }" outline/>
                    <q-input v-if="step === 0" outlined dense debounce="1000" v-model="search" placeholder="Search...">
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
import { useRecruitmentStore } from 'src/stores/recruitment-store';
const RecruitmentStore = useRecruitmentStore();

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
    LoadShifts();
    step.value = 0;
}

const SubmitLoading = ref(false);

const position = ref('');
const shiftId = ref('');
const date = ref(new Date().toISOString().split('T')[0]);
const location = ref('');
const employmentStatus = ref('');
const movement = ref('');
const justification = ref('');
const needBackgroundCheck = ref(false);

const Errors = reactive({
    position: { type: null, msg: '' },
    shiftId: { type: null, msg: '' },
    employmentStatus: { type: null, msg: '' },
    date: { type: null, msg: '' },
    location: { type: null, msg: '' },
    movement: { type: null, msg: '' },
    justification: { type: null, msg: '' },

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

const isBeforeMinDate = (val, days = 3) => {
    if (!val) return true

    const selected = moment(val).startOf('day')
    const minDate = moment().add(days, 'days').startOf('day')

    return selected.isBefore(minDate)
}


const ValidatePosition = () => {

    let isError = false

    isError ||= req('position', position.value)

    if (isError) failToast()
    return !isError
}

const ValidateInfo = () => {

    let isError = false

    isError ||= req('employmentStatus', employmentStatus.value)
    isError ||= req('date', date.value)
    if (date.value && isBeforeMinDate(date.value, 3)) {
        isError ||= setErr('date', 'invalid')
    } else if (date.value) {
        clearErr('date')
    }
    isError ||= req('shiftId', shiftId.value)
    isError ||= req('location', location.value)
    isError ||= req('movement', movement.value)
    isError ||= req('justification', justification.value)

    if (isError) failToast()
    return !isError
}

const qualifications = ref([]);

const ResetForm = () => {
    position.value = '';
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

const Save = async () => {
    if (ValidateInfo && !ValidateInfo()) return;
    SubmitLoading.value = true;
    try {
        const response = await api.post('/socket/vacancy/create', {
            positionId: position.value.id,
            shiftId: shiftId.value,
            date: date.value,
            location: location.value,
            movement: movement.value,
            justification: justification.value,
            needBackgroundCheck: needBackgroundCheck.value,
            employmentStatus: employmentStatus.value,
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
        console.error(e.response?.data?.error);
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">${e.response?.data?.error}</div>
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

const employmentstatuses = ref(['Regular', 'Probationary', 'Contractual', 'Temporary', 'Intern']);
const positions = ref([]);
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
const totalSteps = 2;

const validators = [
    ValidatePosition
]

const NextStep = () => {
    const validate = validators[step.value];
    if (validate && !validate()) return;
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

const peso = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
})

const formatTimeRange = (time) => {
    const start = time.time_start;
    const end = time.time_end;
    if (!start && !end) return '';
    const formattedStart = start ? moment(start, 'HH:mm:ss').format('h:mm A') : '';
    const formattedEnd = end ? moment(end, 'HH:mm:ss').format('h:mm A') : '';
    if (formattedStart && formattedEnd) return `${formattedStart} to ${formattedEnd}`;
    return formattedStart || formattedEnd || '';
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