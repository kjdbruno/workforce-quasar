<template>
    <div class="wrapper">
        <div class="card-main-grid">
            <div class="card-anim-wrapper" v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="() => { OpenDialog('EmployeeDialog') }" >
                    <q-card-section class="text-center">
                        <q-avatar size="75px" font-size="52px" color="grey" text-color="white" icon="add" />
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="loading">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" >
                    <q-card-section class="text-center">
                        <q-spinner-puff size="md"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-else-if="!loading && rows.length === 0">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" >
                    <q-card-section class="text-center">
                        <div class="text-caption text-uppercase text-grey">no data found</div>
                    </q-card-section>
                </q-card>
            </div>
            <div v-for="(data, index) in rows" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" >
                <q-card @click="() => { EmployeeStore.component = 'ProfileComponent'; EmployeeStore.data = data; }" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" >
                    <q-card-section class="text-center full-width">
                        <div class="text-caption text-uppercase">{{ data?.employment?.employee_no }}</div>
                        <div class="text-subtitle2 text-uppercase">{{ formatName(data) }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-uppercase">{{ data?.employment?.position?.name }}</div>
                        <div class="text-caption text-grey">{{ data?.employment?.employment_status }}</div>
                        <div class="text-caption text-grey text-italic">{{ formatCurrency(data?.employment?.position?.amount) }}</div>
                    </q-card-section>
                    <div class="absolute-top-left q-ma-sm" style="width: 7px; height: 7px; border-radius: 50%;" :class="data.status == 'Active' ? 'bg-positive' : 'bg-negative'"></div>
                </q-card>
            </div>
        </div>
        <q-footer class="bg-white no-shadow q-mx-lg q-mb-md q-py-sm radius-xs text-grey">
            <q-toolbar>
                <q-toolbar-title class="text-caption text-uppercase">
                    <div>© 2025 WORKFORCE. All Rights Reserved.</div>
                </q-toolbar-title>
                <q-input outlined dense debounce="1000" v-model="filter" placeholder="Search...">
                    <template v-slot:before>
                        <div class="text-caption text-uppercase">{{ `page ${meta.CurrentPage} of ${meta.TotalPages}` }}</div>
                    </template>
                    <template v-slot:after>
                        <q-btn unelevated size="xs" round color="primary" icon="first_page" :disable="page <= 1" @click="FirstPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">First Page</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="arrow_back" :disable="page <= 1" @click="PreviousPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Previous</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="arrow_forward" :disable="page >= meta.TotalPages" @click="NextPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Next</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="last_page" :disable="page >= meta.TotalPages" @click="LastPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Last Page</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-slot:prepend>
                        <q-icon name="search" style="font-size: 1rem;" />
                    </template>
                </q-input>
                <q-inner-loading :showing="loading">
                    <q-spinner-puff size="md" />
                </q-inner-loading>
            </q-toolbar>
        </q-footer>
        <employee-dialog v-model="activeDialog" dialog-name="EmployeeDialog" @saved="() => { LoadAll(); }"/>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

import { useEmployeeStore } from 'src/stores/employee-store';
import EmployeeDialog from './EmployeeDialog.vue';
const EmployeeStore = useEmployeeStore();

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/employee`, {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value || ''
            }
        });
        rows.value = data.data;
        meta.value = data.meta;
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
        loading.value = false;
    }
}

watch(filter, () => {
    page.value = 1;
    LoadAll();
})

const NextPage = () => {
    if (page.value < meta.value.TotalPages) {
        page.value++
        LoadAll()
    }
}

const PreviousPage = () => {
    if (page.value > 1) {
        page.value--
        LoadAll()
    }
}

const FirstPage = () => {
    if (page.value > 1) {
        page.value = 1
        LoadAll()
    }
}

const LastPage = () => {
    if (page.value < meta.value.TotalPages) {
        page.value = meta.value.TotalPages
        LoadAll()
    }
}

const formatName = (profile) => {
    if (!profile) return '';
    const firstname = profile.first_name || '';
    const middlename = profile.middle_name
        ? profile.middle_name.charAt(0).toUpperCase() + '.'
        : '';
    const lastname = profile.last_name || '';
    const suffix = profile.suffix ? ` ${profile.suffix}` : '';
    return `${firstname} ${middlename} ${lastname}${suffix}`.trim();
}

onMounted(() => {
    LoadAll();
});

const modal = ref(false);
const ApplicationSubmitting = ref(false);

const applicant = ref(null);
const firstname = ref('');
const middlename = ref('');
const lastname = ref('');
const suffix = ref('');
const sex = ref('');
const civilstatus = ref('');
const birthdate = ref(new Date().toISOString().split('T')[0]);
const birthplace = ref('');
const address = ref('');
const email = ref('');
const contactNo = ref('');

const employeeNo = ref('');
const dateHired = ref(new Date().toISOString().split('T')[0]);
const employmentstatus = ref('');
const departmentId = ref('');
const positionId = ref('');
const tin = ref('');
const sssNo = ref('');
const philhealthNo = ref('');
const pagibigNo = ref('');
const salarygroup = ref('');
const payrollgroup = ref('');
const taxstatus = ref('');

const shiftId = ref('');
const effectiveFrom = ref(new Date().toISOString().split('T')[0]);
const effectiveTo = ref('');
const notes = ref('');

const Errors = reactive({
    firstname: { type: null, msg: '' },
    middlename: { type: null, msg: '' },
    lastname: { type: null, msg: '' },
    suffix: { type: null, msg: '' },
    sex: { type: null, msg: '' },
    civilstatus: { type: null, msg: '' },
    birthdate: { type: null, msg: '' },
    birthplace: { type: null, msg: '' },
    address: { type: null, msg: '' },
    email: { type: null, msg: '' },
    contactNo: { type: null, msg: '' },

    employeeNo: { type: null, msg: '' },
    dateHired: { type: null, msg: '' },
    employmentstatus: { type: null, msg: '' },
    departmentId: { type: null, msg: '' },
    positionId: { type: null, msg: '' },
    tin: { type: null, msg: '' },
    sssNo: { type: null, msg: '' },
    philhealthNo: { type: null, msg: '' },
    pagibigNo: { type: null, msg: '' },

    salarygroup: { type: null, msg: '' },
    payrollgroup: { type: null, msg: '' },
    taxstatus: { type: null, msg: '' },
    
    shiftId: { type: null, msg: '' },
    effectiveFrom: { type: null, msg: '' }
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
const isAtLeast15YearsOld = (birthdate) => {
    if (!birthdate) return false;

    const today = new Date();
    const dob = new Date(birthdate);

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age >= 15;
};

const ValidateEmployee = () => {
    const allowedSuffixes = ['SR','JR','II','III','IV','V','VI','VII','VIII','IX','X']
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phMobileRegex = /^09\d{9}$/

    let isError = false

    isError ||= req('firstname', firstname.value)
    isError ||= req('middlename', middlename.value)
    isError ||= req('lastname', lastname.value)

    isError ||= (suffix.value && !allowedSuffixes.includes(suffix.value.trim().toUpperCase()))
        ? setErr('suffix', 'invalid')
        : clearErr('suffix')

    isError ||= req('sex', sex.value)
    isError ||= req('civilstatus', civilstatus.value)

    if (!birthdate.value) isError ||= setErr('birthdate', 'required')
    else if (!isAtLeast15YearsOld(birthdate.value))
    isError ||= setErr('birthdate', 'invalid')
    else clearErr('birthdate')

    isError ||= req('birthplace', birthplace.value)

    // email: required + format + max length
    if (!email.value) isError ||= setErr('email', 'required')
    else if (!emailRegex.test(email.value)) isError ||= setErr('email', 'invalid')
    else if (email.value.length > 100) isError ||= setErr('email', 'invalid')
    else clearErr('email')

    // PH mobile number
    if (!contactNo.value) isError ||= setErr('contactNo', 'required')
    else if (!phMobileRegex.test(contactNo.value)) isError ||= setErr('contactNo', 'invalid')
    else clearErr('contactNo')

    isError ||= req('address', address.value)

    if (isError) failToast()
    return !isError
}

const ValidateEmployment = () => {
  let isError = false

  isError ||= req('positionId', positionId.value)
  isError ||= req('employmentstatus', employmentstatus.value)
  isError ||= req('departmentId', departmentId.value)
  isError ||= req('dateHired', dateHired.value)

  isError ||= maxLen('tin', tin.value, 15, 'invalid')
  isError ||= maxLen('sssNo', sssNo.value, 15, 'invalid')
  isError ||= maxLen('philhealthNo', philhealthNo.value, 15, 'invalid')
  isError ||= maxLen('pagibigNo', pagibigNo.value, 15, 'invalid')

  if (isError) failToast()
  return !isError
}

const ValidateSalary = () => {
  let isError = false

  isError ||= req('payrollgroup', payrollgroup.value)
  isError ||= req('salarygroup', salarygroup.value)
  isError ||= req('taxstatus', taxstatus.value)

  if (isError) failToast()
  return !isError
}

const ValidateShift = () => {
  let isError = false

  isError ||= req('shiftId', shiftId.value)
  isError ||= req('effectiveFrom', effectiveFrom.value)

  if (isError) failToast()
  return !isError
}


const ResetForm = () => {
    /**Employee */
    applicant.value = null;
    firstname.value = '';
    middlename.value = '';
    lastname.value = '';
    suffix.value = '';
    sex.value = '';
    civilstatus.value = '';
    birthdate.value = new Date().toISOString().split('T')[0];
    birthplace.value = '';
    address.value = '';
    email.value = '';
    contactNo.value = '';
    /**Employment */
    employeeNo.value = '';
    dateHired.value = new Date().toISOString().split('T')[0]; // today
    employmentstatus.value = '';
    departmentId.value = '';
    positionId.value = '';
    tin.value = '';
    sssNo.value = '';
    philhealthNo.value = '';
    pagibigNo.value = '';
    /**Salary */
    salarygroup.value = '';
    payrollgroup.value = '';
    taxstatus.value = '';
    /**Shift */
    shiftId.value = '';
    effectiveFrom.value = new Date().toISOString().split('T')[0];
    effectiveTo.value = '';
    notes.value = '';
}

const ResetAllErrors = () => {
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].msg = '';
    });
}

const ShowModal = () => {
    LoadDepartments();
    LoadShifts();
    LoadPositions();
    LoadApplicants();
    ResetForm();
    ResetAllErrors();
}

const applicants = ref([]);
const sexes = ref(["Male","Female"]);
const civilstatuses = ref(["Single","Married","Widowed","Divorced","Separated"]);
const employmentstatuses = ref(["Regular","Probationary","Contractual","Temporary","Intern"]);
const positions = ref([]);
const departments = ref([]);
const shifts = ref([]);
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
const payrollgroups = ref(["Monthly", "Semi-Monthly", "Weekly"]);
const taxstatuses = ref(['S', 'ME', 'S1', 'S2', 'S3', 'S4', 'ME1', 'ME2', 'ME3', 'ME4', 'Z']);

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

function formatCurrency(amountStr, currency = 'PHP') {
        if (!amountStr) return '';

        // Extract numeric value (handles "16,500.00 | Monthly")
        const numeric = amountStr.split('|')[0].trim();

        const num = parseFloat(numeric.replace(/,/g, ''));

        if (isNaN(num)) return amountStr; // fallback

        return num.toLocaleString('en-PH', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2
        });
}

const filterDepartmentFn = createFilterFn(departments, filteredDepartments);
const filterShiftFn = createFilterFn(shifts, filteredShifts);

const LoadApplicants = async () => {
    try {
        const response = await api.get(`/employee/option/applicant`);
        applicants.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadDepartments = async () => {
    try {
        const { data } = await api.get(`/employee/option/department`);
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

const LoadPositions = async () => {
    try {
        const response = await api.get(`/employee/option/position`);
        positions.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const PopulateData = (app) => {
    firstname.value = app.first_name;
    middlename.value = app.middle_name;
    lastname.value = app.last_name;
    suffix.value = app.suffix;
    sex.value = app.sex;
    civilstatus.value = app.civil_status;
    birthdate.value = app.birthdate;
    birthplace.value = app.birthplace;
    address.value = app.address;
    email.value = app.email;
    contactNo.value = app.contact_number;
    employmentstatus.value = app.vacancy.employment_status;
    departmentId.value = app.vacancy.department_id;
    positionId.value = app.vacancy.position_id;
    shiftId.value = app.vacancy.shift_id;
}

const Save = async () => {
    ApplicationSubmitting.value = true;
    const applicantId = applicant.value?.id ?? null;
    try {
        const response = await api.post('/employee', {
            //employee
            applicantId,
            firstname: firstname.value,
            middlename: middlename.value,
            lastname: lastname.value,
            suffix: suffix.value,
            sex: sex.value,
            civilstatus: civilstatus.value,
            birthdate: birthdate.value,
            birthplace: birthplace.value,
            address: address.value,
            email: email.value,
            contactNo: contactNo.value,
            //employment
            employeeNo: employeeNo.value,
            dateHired: dateHired.value,
            tin: tin.value,
            sssNo: sssNo.value,
            philhealthNo: philhealthNo.value,
            pagibigNo: pagibigNo.value,
            positionId: positionId.value,
            departmentId: departmentId.value,
            employmentstatus: employmentstatus.value,
            //salary
            salarygroup: salarygroup.value,
            payrollgroup: payrollgroup.value,
            taxstatus: taxstatus.value,
            //shift
            shiftId: shiftId.value,
            effectiveFrom: effectiveFrom.value,
            effectiveTo: effectiveTo.value,
            notes: notes.value
        });
        modal.value = false;
        LoadAll()
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
        ApplicationSubmitting.value = false;
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

const step = ref(0)
const totalSteps = 4;

const validators = [
    ValidateEmployee,
    ValidateEmployment,
    ValidateSalary,
    ValidateShift
]

const NextStep = () => {
  const validate = validators[step.value];
  if (validate && !validate()) return;

  step.value++;
};

const PreviousStep = () => {
    if (step.value > 0) step.value--;
};

const activeDialog = ref(null)
const OpenDialog = (dialogName) => {
    activeDialog.value = dialogName
}

</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>