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
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="() => { Dialog = true; LoadPersonnels(); isEdit = false; }" >
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
                <q-card @click="() => { Modify(data); Dialog = true; LoadPersonnels(); isEdit = true; GetOvertime(data.id) ;}" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm">
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ FormatDate(data?.date) }}</div>
                        <div class="text-caption text-capitalize text-grey">{{ data?.status }}</div>
                    </q-card-section>
                    <q-card-section class="text-center full-width q-pa-sm">
                        <div class="text-caption text-capitalize">{{ FormatTimeRange(data) }}</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <q-dialog v-model="Dialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isEdit ? 'modify overtime application' : 'create new overtime application' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.date.type ? 'text-negative' : 'text-grey'">{{ Errors.date.type ? Errors.date.msg : 'date' }}</div>
                            <q-input outlined v-model="date" label="Enter Date" :error="Errors.date.type" :no-error-icon="true">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                    <q-date v-model="date" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                                </q-popup-proxy>
                            </q-input>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.timeStart.type ? 'text-negative' : 'text-grey'">{{ Errors.timeStart.type ? Errors.timeStart.msg : 'start time' }}</div>
                            <q-input outlined v-model="timeStart" label="Enter Time" :error="Errors.timeStart.type" :no-error-icon="true">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                    <q-time v-model="timeStart" mask="HH:mm" >
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Okay" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-input>
                        </div>
                        <div class="col-2">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.timeEnd.type ? 'text-negative' : 'text-grey'">{{ Errors.timeEnd.type ? Errors.timeEnd.msg : 'time end' }}</div>
                            <q-input outlined v-model="timeEnd" label="Enter Time" :error="Errors.timeEnd.type" :no-error-icon="true">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                    <q-time v-model="timeEnd" mask="HH:mm" >
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Okay" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-input>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-xl">
                        <div class="col-6">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.description.type ? 'text-negative' : 'text-grey'">{{ Errors.description.type ? Errors.description.msg : 'description' }}</div>
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
                    <div v-for="(value, index) in employees" :key="index" class="q-mb-md">
                        <div>
                            <span class="text-uppercase text-body1 text-bold">employee {{ index+1 }}</span>
                            <q-btn 
                                v-if="employees.length > 1" 
                                round 
                                icon="delete" 
                                flat 
                                unelevated 
                                color="grey" 
                                @click="RemoveEmployee(index)" 
                                size="sm"
                                class="q-ml-sm"
                            />
                        </div>
                        <div class="row q-col-gutter-xs q-mb-md" >
                            <div class="col-3">
                                <q-select 
                                    outlined 
                                    v-model="value.employeeid" 
                                    emit-value 
                                    map-options 
                                    use-input 
                                    input-debounce="300" 
                                    :options="filteredPersonnels" 
                                    @filter="filterPersonnelFn" 
                                    :error="Errors.employees.employeeid.type[index]"
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
                        </div>
                    </div>
                    <div class="row q-col-gutter-xl q-mb-md q-mt-xl">
                        <div v-for="(dt, index) in info?.approvals">
                            <div class="text-caption text-uppercase text-grey">{{ dt?.status == 'Pending' ? 'unsigned' : 'signed' }}</div>
                            <div v-if="dt?.status == 'Approved'">
                                <img :src="FormatSignature(dt?.setting)" width="150"/>
                            </div>
                            <div class="text-h6 text-uppercase">{{ FormatName(dt?.setting?.approver?.employeeAccount?.employee) }}</div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
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
                        <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="add" @click="AddEmployee" outline/>
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
const submitLoading = ref(false);

const rows = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);
const filter = ref('');

const Dialog = ref(false);
const isEdit = ref(false)

const id = ref('');
const date = ref('');
const timeStart = ref('');
const timeEnd = ref('');
const description = ref('');

const employees = ref([
    {
        id: '',
        employeeid: ""
    }
]);

const EmptyEmployees = () => ({
    id: '',
    employeeid: ""
})

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/overtime`, {
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

const Errors = reactive({
    date: {
        type: null, msg: ''
    },
    timeStart: {
        type: null, msg: ''
    },
    timeEnd: {
        type: null, msg: ''
    },
    description: {
        type: null, msg: ''
    },
    employees: {
        employeeid: {
            type: [], msg: ''
        }
    }
});

const initErrors = () => {
    Errors.employees.employeeid.type = employees.value.map(() => null);
}

const Validations = () => {

    let isError = false;
    
    Errors.employees.employeeid = { type: null, msg: '' }

    if (!date.value) {
        Errors.date.type = true;
        Errors.date.msg = 'employee is required';
        isError = true;
    }

    if (!timeStart.value) {
        Errors.timeStart.type = true;
        Errors.timeStart.msg = 'time start is required';
        isError = true;
    }

    if (!timeEnd.value) {
        Errors.timeEnd.type = true;
        Errors.timeEnd.msg = 'time end is required';
        isError = true;
    }

    if (!description.value) {
        Errors.description.type = true;
        Errors.description.msg = 'description is required';
        isError = true;
    }

    initErrors()
    
    employees.value.forEach((e, index) => {
        if (!e.employeeid) {
            Errors.employees.employeeid.type[index] = true;
            Errors.employees.employeeid.msg = 'employee is required';
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

const personnels = ref([]);

const filteredPersonnels = ref([]);

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

const filterPersonnelFn = createFilterFn(personnels, filteredPersonnels);

const LoadPersonnels = async () => {
    try {
        const { data } = await api.get(`/overtime/option/employee`);
        personnels.value = data.map(d => ({
            label: [ d?.first_name, d?.middle_name, d?.last_name, d?.suffix ].filter(Boolean).join(" "),
            value: Number(d?.id)
        }))
        filteredPersonnels.value = [...personnels.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const AddEmployee = () => {
    const e = employees.value;
    e.push({
        id: '',
        employeeid: ""
    });
}

const RemoveEmployee = (index) => {
    employees.value.splice(index, 1);
}

const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = id.value && isEdit
            ? await api.post(`/overtime/${id.value}/update`, {
                date: date.value,
                timeStart: timeStart.value,
                timeEnd: timeEnd.value,
                description: description.value,
                employees: employees.value
            })
            : await api.post('/overtime', {
                date: date.value,
                timeStart: timeStart.value,
                timeEnd: timeEnd.value,
                description: description.value,
                employees: employees.value
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

const Modify = (app) => {
    date.value = app.date;
    timeStart.value = app.time_start;
    timeEnd.value = app.time_end;
    description.value = app.description;
    MapApplicants(app.applications)
}

const MapApplicants = (data = []) => {
    employees.value = data.map(item => ({
        id: item.id ?? '',
        employeeid: Number(item.employee_id) ?? '',
    }))
}

const info = ref([])

const GetOvertime = async (id) => {
    submitLoading.value = true;
    try {
        const response  = await api.get(`/overtime/${id}`);
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
        submitLoading.value = false;
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

const FormatSignature = (sign) => {
    return `${process.env.VUE_APP_BACKEND_URL}${sign.signature}`
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

const FormatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });
};

const FormatTimeRange = (data) => {
    if (!data?.time_start || !data?.time_end) return '';

    // Optional: format to 12-hour AM/PM
    const start = new Date(`1970-01-01T${data.time_start}Z`);
    const end = new Date(`1970-01-01T${data.time_end}Z`);

    const options = { hour: '2-digit', minute: '2-digit', hour12: true };

    return `${start.toLocaleTimeString('en-PH', options)} - ${end.toLocaleTimeString('en-PH', options)}`;
};


const popup = ref(null);

onMounted(() => {
    LoadAll()
})

</script>

<style scoped>

</style>