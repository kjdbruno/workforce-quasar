<template>
    <div>
        <q-card class="no-shadow radius-xs q-mb-md">
            <q-card-section>
                <div class="filter-inline">
                    <q-input
                        outlined
                        v-model="year"
                        style="width: 80px"
                        dense
                    />
                    <div class="q-gutter-xs">
                        <q-btn
                            v-for="(m, index) in months"
                            round
                            unelevated
                            :class="month === m.value ? 'active' : 'inactive'"
                            @click="() => { month = m.value; LoadAll(); }"
                            size="md"
                            :label="m.label"
                        />
                    </div>
                </div>
            </q-card-section>
        </q-card>
        <div class="card-grid">
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="() => { Dialog = true; LoadEmployees(); LoadLeaveTypes(); ResetForm(); isEdit = false; }" >
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
            <div v-for="(data, index) in rows" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" v-else>
                <q-card @click="() => { GetLeave(data.id); LeaveDialog = true; }" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm">
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ FormatName(data?.employee) }}</div>
                        <div class="text-caption text-capitalize text-grey">{{ data?.status }}</div>
                    </q-card-section>
                    <q-card-section class="text-center full-width q-pa-sm">
                        <div class="text-caption text-uppercase">{{ data?.leaveType?.name }}</div>
                        <div class="text-caption">{{ FormatLeaveDate(data?.date_from, data?.date_to) }}</div>
                        <div class="text-caption text-grey">{{ ComputeLeaveDays(data?.date_from, data?.date_to) }} day/s</div>
                    </q-card-section>
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
        <q-dialog v-model="Dialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isEdit ? 'modify leave application' : 'create new leave application' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="Errors.employeeid.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.employeeid.type ? Errors.employeeid.msg : 'employee' }}</div>
                            <q-select 
                                outlined 
                                v-model="employeeid" 
                                emit-value 
                                map-options 
                                use-input 
                                input-debounce="300" 
                                :options="filteredEmployees" 
                                @filter="filterEmployeeFn" 
                                :error="Errors.employeeid.type"
                                dropdown-icon="keyboard_arrow_down"
                                :no-error-icon="true"
                                label="Choose Employee"
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
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="Errors.typeid.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.typeid.type ? Errors.typeid.msg : 'leave type' }}</div>
                            <q-select 
                                outlined 
                                v-model="typeid" 
                                emit-value 
                                map-options 
                                use-input 
                                input-debounce="300" 
                                :options="filteredLeaveTypes" 
                                @filter="filterLeaveTypeFn" 
                                :error="Errors.typeid.type"
                                dropdown-icon="keyboard_arrow_down"
                                :no-error-icon="true"
                                label="Choose Leave Type"
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
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-6">
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
                    
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                        <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { Dialog = false; }" outline/>
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
        <q-dialog v-model="LeaveDialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">leave application</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">employee</div>
                        <div class="text-body1 text-uppercase">{{ FormatName(info?.employee) }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">leave type</div>
                        <div class="text-body1 text-uppercase">{{ info?.leaveType?.name }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">leave duration</div>
                        <div class="text-body1 text-uppercase">{{ FormatLeaveDate(info?.date_from, info?.date_to) }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">no of day</div>
                        <div class="text-body1 text-uppercase">{{ ComputeLeaveDays(info?.date_from, info?.date_to) }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">status</div>
                        <div class="text-body1 text-uppercase">{{ info?.status }}</div>
                    </div>
                    <div class="row q-col-gutter-xl q-mb-md q-mt-xl">
                        <div v-for="(dt, index) in info?.approvals">
                            <div class="text-caption text-uppercase text-grey">{{ dt?.status == 'Pending' ? 'unsigned' : 'signed' }}</div>
                            <div v-if="dt?.status == 'Approved'">
                                <img :src="FormatSignature(dt?.setting)" width="150"/>
                            </div>
                            <div class="text-h6 text-uppercase">{{ FormatName(dt?.setting?.approver?.employeeAccount?.employee) }}</div>
                            <div class="text-caption text-uppercase text-italic">{{ dt?.setting?.approver?.employeeAccount?.employee?.employment?.position?.name }}</div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="canApprove" unelevated size="md" color="primary" class="btn text-capitalize" label="approve">
                            <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                                <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                    <q-card-section>
                                        <div class="text-h6 text-center text-uppercase">
                                            proceed to approve
                                        </div>
                                    </q-card-section>
                                    <q-card-actions>
                                        <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Approve(info?.id)"/>
                                    </q-card-actions>
                                </q-card>
                            </q-menu>
                        </q-btn>
                        <q-btn v-if="info?.status !== 'Cancelled'" unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="Print(info?.id)" />
                        <q-btn v-if="info?.status !== 'Cancelled'" unelevated size="md" color="primary" class="btn text-capitalize" label="cancel">
                            <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                                <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                    <q-card-section>
                                        <div class="text-h6 text-center text-uppercase">
                                            proceed to approve
                                        </div>
                                    </q-card-section>
                                    <q-card-actions>
                                        <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Cancel(info?.id)"/>
                                    </q-card-actions>
                                </q-card>
                            </q-menu>
                        </q-btn>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { LeaveDialog = false; }" outline/>
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
        <q-dialog v-model="printDialog" full-height full-width class="pdf">
            <q-card class="bg-white q-pa-none" style="height: 100vh; overflow: hidden;">
                <q-btn
                    icon="close"
                    class="fixed bg-white text-primary shadow-2"
                    round
                    dense
                    v-close-popup
                    style="top: 15px; right: 15px; z-index: 999;"
                />
                <q-card-section class="q-pa-none" style="height: 100%; overflow: hidden;">
                    <div class="iframe-container">
                    <iframe v-if="pdf" :src="pdf" frameborder="0"></iframe>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, computed, reactive, watch } from 'vue';
import { api } from 'src/boot/axios';
import { Toast } from 'src/boot/sweetalert'; 
import moment from 'moment';

import { useLeaveStore } from 'src/stores/leave-store';
const LeaveStore = useLeaveStore();

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

const today = new Date();
const month = ref(String(today.getMonth() + 1).padStart(2, '0'));
const year = ref(String(today.getFullYear()));

const months = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(0, i).toLocaleString("en-US", { month: "short" });
    const monthValue = String(i + 1).padStart(2, "0");
    return { label: monthName, value: monthValue };
})

const loading = ref(false);

const rows = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);
const filter = ref('');

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


const ValidateLeave = () => {

    let isError = false

    isError ||= req('employeeid', employeeid.value)
    isError ||= req('typeid', typeid.value)
    isError ||= req('datestart', datestart.value)
    isError ||= req('dateend', dateend.value)
    isError ||= notBefore('dateend', dateend.value, datestart.value)
    isError ||= req('reason', reason.value)

    if (isError) failToast()
    return !isError
}

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/leave`, {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value || '',
                month: month.value,
                year: year.value
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

const FormatLeaveDate = (dateFrom, dateTo, locale = 'en-US') => {
    if (!dateFrom) return ''

    const from = new Date(dateFrom)
    const to = new Date(dateTo || dateFrom)

    const sameDay =
        from.getFullYear() === to.getFullYear() &&
        from.getMonth() === to.getMonth() &&
        from.getDate() === to.getDate()

    const monthName = (d) => d.toLocaleString(locale, { month: 'long' })
    const dayNum = (d) => d.getDate()
    const yearNum = (d) => d.getFullYear()

    if (sameDay) {
        // February 1, 2026
        return `${monthName(from)} ${dayNum(from)}, ${yearNum(from)}`
    }

    // Same month & year: February 1-3, 2026
    if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
        return `${monthName(from)} ${dayNum(from)}-${dayNum(to)}, ${yearNum(from)}`
    }

    // Different month/year: February 28 - March 2, 2026
    return `${monthName(from)} ${dayNum(from)}, ${yearNum(from)} - ${monthName(to)} ${dayNum(to)}, ${yearNum(to)}`
}

const ComputeLeaveDays = (dateFrom, dateTo) => {
    if (!dateFrom) return 0

    const from = new Date(dateFrom)
    const to = new Date(dateTo || dateFrom)

    // normalize to midnight to avoid timezone issues
    from.setHours(0, 0, 0, 0)
    to.setHours(0, 0, 0, 0)

    const diff = Math.round((to - from) / (1000 * 60 * 60 * 24))
    return diff >= 0 ? diff + 1 : 0 // +1 for inclusive
}



const FormatSignature = (sign) => {
    return `${process.env.VUE_APP_BACKEND_URL}${sign.signature}`
}

const employees = ref([]);
const leavetypes = ref([]);

const filteredEmployees = ref([]);
const filteredLeaveTypes = ref([]);

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

const filterEmployeeFn = createFilterFn(employees, filteredEmployees);
const filterLeaveTypeFn = createFilterFn(leavetypes, filteredLeaveTypes);

const LoadEmployees = async () => {
    try {
        const { data } = await api.get(`/leave/option/employee`);
        employees.value = data.map(d => ({
            label: [ d?.first_name, d?.middle_name, d?.last_name, d?.suffix ].filter(Boolean).join(" "),
            value: Number(d?.id)
        }))
        filteredEmployees.value = [...employees.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadLeaveTypes = async () => {
    try {
        const { data } = await api.get(`/leave/option/leavetype`);
        leavetypes.value = data.map(d => ({
            label: d?.name,
            value: Number(d?.id)
        }))
        filteredLeaveTypes.value = [...leavetypes.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const FormatToYMD = (val) => {
  if (!val) return ''

  // Keep only digits and limit to 8 (YYYYMMDD)
  const digits = val.replace(/\D/g, '').slice(0, 8)

  if (digits.length <= 4) {
    // Just year
    return digits
  } else if (digits.length <= 6) {
    // Year + month
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  } else {
    // Year + month + day
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`
  }
}


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

const Dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const Save = async () => {
    if (ValidateLeave && !ValidateLeave()) return;
    submitLoading.value = true;
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
        LoadAll();
        Dialog.value = false;
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
        submitLoading.value = false;
    }
}

const info = ref(null);
const DetailSubmitting = ref(false);
const LeaveDialog = ref(false);

const GetLeave = async (id) => {
    DetailSubmitting.value = true;
    try {
        const response  = await api.get(`/leave/${id}`);
        info.value = response.data.result;
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
        DetailSubmitting.value = false;
    }
}

const canApprove = computed(() => {
    if (!info.value?.approvals || info.value.approvals.length === 0) return false;

    // Sort approvals by setting order
    const sorted = [...info.value.approvals].sort(
        (a, b) => a.setting.order - b.setting.order
    );

    // Find the first pending approval
    const nextPending = sorted.find(req => req.status === 'Pending');
    if (!nextPending) return false;

    // Check if the current user is the approver of the next pending approval
    return nextPending.setting?.approver?.id === AuthStore.user?.id;
});

const Approve = async (id) => {
    submitLoading.value = true;
    const userId = Number(AuthStore.user.id);
    const leave = info.value;
    const myRequest = leave.approvals.find(approval =>
    Number(
            approval?.setting?.approver?.employeeAccount?.user_id
        ) === Number(userId)
    );
    const approvalid = myRequest?.id ?? null;

    try {
        const response = await api.post(`/leave/${id}/approve`, {
            approvalid
        });
        LoadAll()
        LeaveDialog.value = false;
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
        submitLoading.value = false;
    }
}

const Cancel = async (id) => {

    submitLoading.value = true;

    try {

        const response = await api.post(`/leave/${id}/cancel`)
        LoadAll()
        LeaveDialog.value = false;
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

        submitLoading.value = false;

    }
}

const printDialog = ref(false);
const pdf = ref(null);

const Print = async (id) => {
    submitLoading.value = true;
    try {
        const res = await api.get(`/leave/${id}/pdf`, {
            responseType: 'arraybuffer',
        })
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const pdfurl = window.URL.createObjectURL(blob) + "#view=FitW";
        pdf.value = pdfurl
        printDialog.value = true;
        submitLoading.value = false;
    } catch (error) {
        submitLoading.value = false;
        console.error("Error generating PDF:", error);
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

onMounted(() => {
    LoadAll()
})

</script>

<style scoped>

</style>