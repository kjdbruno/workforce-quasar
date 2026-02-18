<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="() => { PopulateData(); ResetForm(); ResetAllErrors(); }">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">salary schedule</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey" >position</div>
                    <div class="card-grid">
                        <div class="inner-card-anim-wrapper" :style="{ animationDelay: `100ms` }">
                            <q-card class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-if="!displayedPositions.length">
                                <q-card-section class="text-center">
                                    <div class="text-caption text-dark text-uppercase">no record found</div>
                                </q-card-section>
                            </q-card>
                        </div>
                        <div v-for="(data, index) in displayedPositions" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 100}ms` }" v-if="displayedPositions.length">
                            <q-card @click="() => { position = data; salarytype = data.salary_type; amount = data.amount }" class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" :class="{ 'card--active': position === data }">
                                <q-card-section class="text-center">
                                    <div class="text-caption text-dark text-uppercase">{{ data.label }}</div>
                                    <div class="text-caption text-grey text-uppercase">{{ formatCurrency(data?.amount) }}</div>
                                </q-card-section>
                                <div class="absolute-left">
                                    <q-radio v-model="position" :val="data" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" size="xs"/>
                                </div>
                            </q-card>
                        </div>
                    </div>
                </div>
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase" :class="Errors.salarytype.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.salarytype.type ? Errors.salarytype.msg : 'salary type' }}</div>
                    <div class="q-gutter-sm">
                        <q-radio v-for="value in salarytypes" v-model="salarytype" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" :val="value" :label="value"/>
                    </div>
                </div>
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.datestart.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.datestart.msg ? Errors.datestart.msg : 'date start (YYYY-MM-DD)' }}</div>
                        <q-input outlined v-model="datestart" label="Enter Date">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                <q-date v-model="datestart" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                            </q-popup-proxy>
                        </q-input>
                    </div>
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.dateend.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.dateend.msg ? Errors.dateend.msg : 'date end (YYYY-MM-DD)' }}</div>
                        <q-input outlined v-model="dateend" label="Enter Date">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                <q-date v-model="dateend" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                            </q-popup-proxy>
                        </q-input>
                    </div>
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.salarygroup.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.salarygroup.msg ? Errors.salarygroup.msg : 'salary group' }}</div>
                        <q-select
                            outlined
                            v-model="salarygroup"
                            label="Choose Salary Group"
                            emit-value
                            map-options
                            use-input
                            input-debounce="300"
                            :options="salarygroups"
                            :error="Errors.salarygroup.type"
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
                    <div class="col-2" v-if="!position">
                        <div class="text-caption text-uppercase" :class="Errors.amount.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.amount.type ? Errors.amount.msg : 'amount' }}</div>
                        <q-input 
                            v-model="amount" 
                            label="Enter Amount"
                            outlined 
                            :error="Errors.amount.type"
                            :no-error-icon="true"
                        />
                    </div>
                    <div class="col-2">
                        <div class="text-caption text-uppercase text-grey">note</div>
                        <q-input 
                            v-model="notes" 
                            label="Enter Notes"
                            outlined 
                            :no-error-icon="true"
                        />
                    </div>
                </div>
                <div class="q-mb-md q-mt-xl">
                    <div class="text-caption text-uppercase" :class="Errors.payrollgroup.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.payrollgroup.type ? Errors.payrollgroup.msg : 'payroll group' }}</div>
                    <div class="q-gutter-sm">
                        <q-radio v-for="value in payrollgroups" v-model="payrollgroup" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" :val="value" :label="value" class="text-capitalize"/>
                    </div>
                </div>
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
                        <div class="text-caption text-uppercase" :class="Errors.taxstatus.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.taxstatus.type ? Errors.taxstatus.msg : 'tax status' }}</div>
                        <q-select
                            outlined
                            v-model="taxstatus"
                            label="Choose Tax Status"
                            use-input
                            input-debounce="300"
                            :options="taxstatuses"
                            :error="Errors.taxstatus.type"
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
                                        <q-item-label>{{ $CapitalizeWords(scope.opt) }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                </div>
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey'">for premium payment</div>
                    <div class="q-gutter-sm">
                        <q-checkbox v-model="isPremium" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" label="Additional Pay"/>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="row q-gutter-sm">
                    <q-btn v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save()" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="clear" @click="() => { ResetForm() }" outline/>
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }" outline/>
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

const positions = ref([]);
const salarygroups = ref([
    { value: "HIRE", label: "Hiring Rate" },
    { value: "PROMO", label: "Promotion Increase" },
    { value: "MERIT", label: "Merit Increase" },
    { value: "ANNUAL", label: "Annual Increase" },
    { value: "COLA", label: "Cost of Living Allowance" },
    { value: "PROB", label: "Probationary Increase" },
    { value: "ADJUST", label: "Salary Adjustment" },
    { value: "GOVT", label: "Government Mandated Increase" },
]);
const salarytypes = ref(["Monthly", "Daily", "Hourly"]);
const payrollgroups = ref(["Monthly", "Semi-Monthly", "Weekly"]);
const taxstatuses = ref(['S', 'ME', 'S1', 'S2', 'S3', 'S4', 'ME1', 'ME2', 'ME3', 'ME4', 'Z']);

function formatCurrency(salaryRange, currency = 'PHP') {
    if (!salaryRange) return '';

    return salaryRange
        .split('-')
        .map(p => {
            const num = parseFloat(p.replace(/,/g, ''));
            return num.toLocaleString('en-PH', {
                style: 'currency',
                currency,
                minimumFractionDigits: 2
            });
        })
        .join(' - ');
}

const LoadPositions = async () => {
    try {
        const response = await api.get(`/salary/option/position`);
        positions.value = response.data
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const position = ref('');
const datestart = ref(new Date().toISOString().split('T')[0]);
const dateend = ref('');
const salarygroup = ref('');
const salarytype = ref('');
const payrollgroup = ref('');
const taxstatus = ref('');
const amount = ref('');
const notes = ref('');
const isPremium = ref(false);

const Errors = reactive({
    datestart: { type: null, msg: '' },
    dateend: { type: null, msg: '' },
    salarygroup: { type: null, msg: '' },
    salarytype: { type: null, msg: '' },
    amount: { type: null, msg: '' },
    payrollgroup: { type: null, msg: '' },
    taxstatus: { type: null, msg: '' },
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

const ValidateSalary = () => {
    let isError = false

    isError ||= req('salarytype', salarytype.value)
    isError ||= req('datestart', datestart.value)
    isError ||= dateend.value && datestart.value &&
        new Date(dateend.value) < new Date(datestart.value)
        ? setErr('dateend', 'must be after start date')
        : clearErr('dateend')
    isError ||= req('salarygroup', salarygroup.value)
    // amount
    isError ||= !position.value &&
        (!amount.value || isNaN(+amount.value) || +amount.value <= 0)
        ? setErr('amount', !amount.value ? 'required' : 'invalid amount')
        : clearErr('amount')

    isError ||= req('payrollgroup', payrollgroup.value)
    isError ||= req('taxstatus', taxstatus.value)

    if (isError) failToast()
    return !isError
}

const SubmitLoading = ref(false);

const PopulateData = () => {
    const app = EmployeeStore.data;
    LoadPositions();
    payrollgroup.value = app?.employment?.payroll_group;
    taxstatus.value = app?.employment?.tax_status;
}

const Save = async () => {
    if (ValidateSalary && !ValidateSalary()) return;
    SubmitLoading.value = true;
    try {
        const response = await api.post(`/employee/${EmployeeStore.data?.employment?.id}/salary`, {
            positionid: (position.value.id ? position.value.id : EmployeeStore.data?.employment?.position?.id),
            salarytype: salarytype.value,
            datestart: datestart.value,
            dateend: dateend.value,
            salarygroup: salarygroup.value,
            amount: amount.value,
            notes: notes.value,
            payrollgroup: payrollgroup.value,
            taxstatus: taxstatus.value,
            isPremium: isPremium.value
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

const ResetForm = () => {
    position.value = '';
    datestart.value = new Date().toISOString().split('T')[0];
    dateend.value = '';
    salarytype.value = '';
    salarygroup.value = '';
    amount.value = '';
    notes.value = '';
}

const ResetAllErrors = () => {
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].msg = '';
    });
}

const popup = ref(null);

const searchPosition = ref('')

const filteredPositions = computed(() => {
    const q = searchPosition.value.trim().toLowerCase()

    return positions.value
        .filter(p => p.status === 'Vacant') // ✅ only Vacant
        .filter(p =>
        !q || String(p.label || '').toLowerCase().includes(q)
        )
})

const displayedPositions = computed(() =>
  filteredPositions.value.slice(0, 5)
)

const displayCount = computed(() => displayedPositions.value.length)
const totalCount = computed(() => filteredPositions.value.length)

</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>