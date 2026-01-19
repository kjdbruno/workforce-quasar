<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">salary schedule</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="row q-col-gutter-xs q-mb-xl">
                    <div class="col-3">
                        <div class="text-caption text-uppercase q-mb-xs" :class="Errors.position.type ? 'text-negative' : 'text-grey'">{{ Errors.position.type ? Errors.position.msg : 'position' }}</div>
                        <q-select
                            outlined
                            v-model="position"
                            label="Choose Position"
                            use-input
                            input-debounce="300"
                            :options="filteredPositions"
                            @filter="filterPositionFn"
                            :error="Errors.position.type"
                            dropdown-icon="keyboard_arrow_down"
                            :no-error-icon="true"
                            class="text-capitalize"
                            @update:model-value="() => { amount = position.amount; salarytype = position.salarytype }"
                        >
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-italic text-grey">
                                    No options
                                    </q-item-section>
                                </q-item>
                            </template>
                            <template v-slot:option="scope">
                                <q-item v-bind="scope.itemProps" :disable="scope.opt.status !== 'Vacant'">
                                    <q-item-section>
                                        <q-item-label>{{ $CapitalizeWords(scope.opt.label) }} - {{ scope.opt.status }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                </div>
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase q-mb-xs" :class="Errors.salarytype.type ? 'text-negative' : 'text-grey'">{{ Errors.salarytype.type ? Errors.salarytype.msg : 'salary type' }}</div>
                    <div class="q-gutter-sm">
                        <q-radio v-for="value in salarytypes" v-model="salarytype" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="value" :label="value" />
                    </div>
                </div>
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
                        <div class="text-caption text-uppercase q-mb-xs" :class="Errors.amount.msg ? 'text-negative' : 'text-grey'">{{ Errors.amount.msg ? Errors.amount.msg : 'amount' }}</div>
                        <q-input 
                            v-model="amount" 
                            label="Enter Amount"
                            outlined 
                            :error="Errors.amount.type"
                            :no-error-icon="true"
                        />
                    </div>
                </div>
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
                        <div class="text-caption text-uppercase q-mb-xs" :class="Errors.effectiveDate.msg ? 'text-negative' : 'text-grey'">{{ Errors.effectiveDate.msg ? Errors.effectiveDate.msg : 'effectivity date (YYYY-MM-DD)' }}</div>
                        <q-input 
                            v-model="effectiveDate" 
                            label="Enter Date"
                            outlined 
                            :error="Errors.effectiveDate.type"
                            :no-error-icon="true"
                            @update:model-value="formatDateEffective"
                        />
                    </div>
                </div>
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
                        <div class="text-caption text-uppercase q-mb-xs" :class="Errors.salarygroup.msg ? 'text-negative' : 'text-grey'">{{ Errors.salarygroup.msg ? Errors.salarygroup.msg : 'salary group' }}</div>
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
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save()" />
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
const payrollgroups = ref([]);
const salarytypes = ref(["Monthly", "Daily", "Hourly"]);
const filteredPositions = ref([]);
const filteredPayrollGroups = ref([]);
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
const normalizeOptions = (data = []) => data.map(d => {
    const baseLabel = d.label ?? d.name ?? String(d.text ?? d.value ?? '')

    // With amount (fees, salary, rates, etc)
    if (d.amount !== undefined && d.amount !== null) {
        const cost = formatCurrency(d.amount) ?? '';

        const rawAmount = d.amount !== undefined && d.amount !== null
            ? Number(String(d.amount).replace(/,/g, ''))
            : null

        return {
            label: `${baseLabel} (${cost})`,
            value: Number(d.value ?? d.id),
            status: d.status ?? null,
            amount: rawAmount ?? null,
            salarytype: d.salary_type ?? null
        }
    }

    // Default
    return {
        label: baseLabel,
        value: Number(d.value ?? d.id),
        status: d.status ?? null,
        amount: d.amount ?? null,
        salarytype: d.salarytype
    }
})
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
const filterPositionFn = createFilterFn(positions, filteredPositions);
const LoadPositions = async () => {
    try {
        const { data } = await api.get(`/salary/option/position`);
        positions.value = normalizeOptions(data)
        filteredPositions.value = [...positions.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};
const LoadPayrollGroups = async () => {
    try {
        const { data } = await api.get(`/salary/option/payrollgroup`);
        payrollgroups.value = normalizeOptions(data)
        filteredPayrollGroups.value = [...payrollgroups.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const position = ref('');
const effectiveDate = ref('');
const salarygroup = ref('');
const salarytype = ref('');
const payrollgroupId = ref('');
const amount = ref('');

const Errors = reactive({
    effectiveDate: { type: null, msg: '' },
    position: { type: null, msg: '' },
    salarygroup: { type: null, msg: '' },
    salarytype: { type: null, msg: '' },
    payrollgroupId: { type: null, msg: '' },
    amount: { type: null, msg: '' },
});

const Validations = () => {

    let isError = false;

    if (!position.value) {
        Errors.position.type = true;
        Errors.position.msg = ('position is required');
        isError = true;
    } else {
        Errors.position.type = null;
    }

    if (!effectiveDate.value) {
        Errors.effectiveDate.type = true;
        Errors.effectiveDate.msg = ('date is required');
        isError = true;
    } else {
        Errors.effectiveDate.type = null;
    }

    if (!salarygroup.value) {
        Errors.salarygroup.type = true;
        Errors.salarygroup.msg = ('salary group is required');
        isError = true;
    } else {
        Errors.salarygroup.type = null;
    }

    if (!payrollgroupId.value) {
        Errors.payrollgroupId.type = true;
        Errors.payrollgroupId.msg = ('payroll group is required');
        isError = true;
    } else {
        Errors.payrollgroupId.type = null;
    }

    if (!amount.value) {
        Errors.amount.type = true;
        Errors.amount.msg = ('amount is required');
        isError = true;
    } else {
        Errors.amount.type = null;
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

const formatDateEffective = (val) => {
    if (!val) {
        effectiveDate.value = ''
        return
    }

    // keep digits only
    const digits = val.replace(/\D/g, '')

    let formatted = digits

    // YYYY-MM-DD
    if (digits.length > 4 && digits.length <= 6) {
        formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`
    } else if (digits.length > 6) {
        formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
    }

    effectiveDate.value = formatted
}

const SubmitLoading = ref(false);

const PopulateData = () => {
    LoadPositions();
    LoadPayrollGroups();
}

const Save = async () => {
    if (!Validations()) return;
    SubmitLoading.value = true;
    try {
        const response = await api.post(`/employee/${EmployeeStore.data?.employment?.id}/salary`, {
            positionid: position.value.id,
            effectivedate: effectiveDate.value,
            salarygroup: salarygroup.value,
            payrollgroupid: payrollgroupId.value,
            amount: amount.value
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

</script>