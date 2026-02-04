<template>
    <div>
        <div class="card-grid">
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="() => { OpenDialog('VacancyDialog') }" >
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
                <q-card @click="InfoDialog(data)" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm">
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ data?.position?.name }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-uppercase">{{ FormatCurrency(data?.position?.salary_amount) }} {{ data?.position?.salary_type }}</div>
                        <div class="text-caption text-grey">{{ data?.status }}</div>
                    </q-card-section>
                    <div class="absolute-top-left q-ma-sm" style="width: 7px; height: 7px; border-radius: 50%;" :class="data.status === 'Requested' ? 'bg-blue' : (data.status === 'Approved' ? 'bg-positive' : (data.status === 'Rejected' ? 'bg-negative' : (data.status === 'Filled' ? 'bg-primary' : null)))"/>
                </q-card>
            </div>
        </div>
        <vacancy-dialog v-model="activeDialog" dialog-name="VacancyDialog" @saved="() => { LoadAll(); }"/>
        <q-dialog v-model="DetailDialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">requisition information</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">position</div>
                        <div class="text-body1 text-uppercase">{{ info?.position?.name }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">salary</div>
                        <div class="text-body1 text-uppercase">{{ FormatCurrency(info?.position?.salary_amount) }} {{ info?.position?.salary_type }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">status</div>
                        <div class="text-body1 text-uppercase">{{ info?.status }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">job description</div>
                        <div class="text-body1">{{ info?.position?.description }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">job qualifications</div>
                        <div class="text-body1" v-for="(v, index) in info?.position?.qualification" :key="index">{{ (index+1) }}. {{ v || 'N/A' }}</div>
                    </div>
                    <div class="row q-col-gutter-lg q-mb-md">
                        <div>
                            <div class="text-caption text-uppercase text-grey">department</div>
                            <div class="text-body1 text-capitalize">{{ info?.department?.name }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">shift</div>
                            <div class="text-body1 text-capitalize">{{ info?.shift?.name }} {{ formatTime(info?.shift?.start_time) }} to {{ formatTime(info?.shift?.end_time) }}</div>
                            <div class="text-body1 text-capitalize">{{ FormatDays(info?.shift?.days) }}</div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-lg q-mb-md">
                        <div>
                            <div class="text-caption text-uppercase text-grey">date needed</div>
                            <div class="text-body1 text-capitalize">{{ formatDate(info?.date_needed) }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">need background check</div>
                            <div class="text-body1 text-capitalize">{{ info?.need_background_check ? 'Yes' : 'No' }}</div>
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">work location</div>
                        <div class="text-body1 text-capitalize">{{ info?.location }}</div>
                    </div>
                    <div class="row q-col-gutter-lg q-mb-md">
                        <div>
                            <div class="text-caption text-uppercase text-grey">movement</div>
                            <div class="text-body1 text-capitalize">{{ info?.movement }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">justification</div>
                            <div class="text-body1">{{ info?.justification }}</div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xl q-mb-md q-mt-xl">
                        <div v-for="(dt, index) in info?.approvals">
                            <div class="text-caption text-uppercase text-grey">{{ dt?.status == 'Pending' ? 'unsigned' : 'signed' }}</div>
                            <div v-if="dt?.status == 'Approved'">
                                <img :src="formatSignature(dt?.setting)" width="150"/>
                            </div>
                            <div class="text-h6 text-uppercase">{{ formatName(dt?.setting?.approver?.employeeAccount?.employee) }}</div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="canApprove" unelevated size="md" color="primary" class="btn text-capitalize" label="approve" >
                            <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                                <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                    <q-card-section>
                                        <div class="text-h6 text-center text-uppercase">
                                            proceed to approve
                                        </div>
                                    </q-card-section>
                                    <q-card-actions>
                                        <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="ApproveRequisition(info)"/>
                                    </q-card-actions>
                                </q-card>
                            </q-menu>
                        </q-btn>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="PrintManpowerRequisition"/>
                        <q-btn  v-if="isActive" unelevated size="md" color="primary" class="btn text-capitalize" :label="formatToggle(info) ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { DetailDialog = false; }" outline/>
                    </div>
                </q-card-actions>
                <q-inner-loading :showing="DetailSubmitting">
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
    </div>
</template>

<script setup>
import { 
    reactive,
    computed,
    onMounted,
    ref, 
    watch,
    onBeforeMount
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

import moment from 'moment';

import { useAuthStore } from 'src/stores/auth-store';
import VacancyDialog from './VacancyDialog.vue';

const AuthStore = useAuthStore();

const dialog = ref(false);
const popup = ref(null);
const isEdit = ref(false);
const submitLoading = ref(false);

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/recruitment`, {
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



const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = await api.post('/recruitment', {
            positionId: position.value.id,
            departmentId: departmentId.value,
            shiftId: shiftId.value,
            date: date.value,
            location: location.value,
            movement: movement.value,
            justification: justification.value,
            needBackgroundCheck: needBackgroundCheck.value,
            employmentStatus: employmentStatus.value,
        });
        LoadAll();
        dialog.value = false;
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.msg}<div>
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

const applyBackendErrors = (backendErrors) => {

    const errorsArray = Array.isArray(backendErrors)
        ? backendErrors
        : backendErrors?.errors || []
        
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null
        Errors[key].msgs = []
    })
    
    errorsArray.forEach(err => {
        if (Errors[err.path] !== undefined) {
            Errors[err.path].type = true
            Errors[err.path].msgs.push(err.msg)
        }
    })
}

const DetailSubmitting = ref(false);
const DetailDialog = ref(false);
const info = ref(null)

const InfoDialog = (data) => {
    id.value = data.id;
    isActive.value = data.is_active;
    DetailDialog.value = true;
    LoadDetails(data.id);
}

const LoadDetails = async (id) => {
    DetailSubmitting.value = true;
    try {
        const response  = await api.get(`/recruitment/${id}/details`);
        info.value = response.data.data
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

const ApproveRequisition = async (data) => {
    DetailSubmitting.value = true;
    // const authUserId = AuthStore.user?.id;
    // const matchedSignatory = data?.requests?.find(req => req.signatory?.userId === authUserId);
    // const signatoryId = matchedSignatory ? matchedSignatory.signatoryId : null;
    const vacancyId = data?.id;
    try {
        const response = await api.post('recruitment/approve', {
            vacancyId: vacancyId
        })
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.msg}<div>
            `
        });
        LoadAll();
        DetailDialog.value = false;
    } catch (error) {
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
        DetailSubmitting.value = false;
    }
}

const UpdateList = (data) => {
    const index = rows.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        rows.value[index] = data
    }
}

const Toggle = async () => {
    DetailSubmitting.value = true;
    try {
        const response = isActive.value
            ? await api.post(`/recruitment/${id.value}/disable`)
            : await api.post(`/recruitment/${id.value}/enable`)
        DetailDialog.value = false;
        UpdateList(response.data.vacancy);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.msg}<div>
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
        DetailSubmitting.value = false;
    }
}
const sexes = ref(['Male', 'Female']);
const employmentstatuses = ref(['Regular', 'Probationary', 'Contractual', 'Temporary', 'Intern']);


const formatTime = (time) => {
    if (!time) return ''
    return moment(time, 'HH:mm').format('hh:mm A')
}

const formatDate = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY')
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

const formatSignature = (sign) => {
    return `${process.env.VUE_APP_BACKEND_URL}${sign.signature}`
}

const formatTimeRange = (time) => {
    const start = time.time_start;
    const end = time.time_end;
    if (!start && !end) return '';
    const formattedStart = start ? moment(start, 'HH:mm:ss').format('h:mm A') : '';
    const formattedEnd = end ? moment(end, 'HH:mm:ss').format('h:mm A') : '';
    if (formattedStart && formattedEnd) return `${formattedStart} to ${formattedEnd}`;
    return formattedStart || formattedEnd || '';
};

const peso = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
})



const  FormatCurrency = (amount, currency = 'PHP') => {
    if (amount === null || amount === undefined || amount === '') return 'N/A'

    const num = Number(String(amount).replace(/,/g, ''))
    if (isNaN(num)) return 'N/A'

    return num.toLocaleString('en-PH', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2
    })
}


const formatToggle = (info) => !!info?.isActive;

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

const printDialog = ref(false);
const pdf = ref(null);

const PrintManpowerRequisition = async () => {
    DetailSubmitting.value = true;
    try {
        const res = await api.get(`/recruitment/${id.value}/pdf`, {
            responseType: 'arraybuffer',
        })
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const pdfurl = window.URL.createObjectURL(blob) + "#view=FitW";
        pdf.value = pdfurl
        printDialog.value = true;
        DetailSubmitting.value = false;
    } catch (error) {
        DetailSubmitting.value = false;
        console.error("Error generating PDF:", error);
    }
}

const FormatDays = (days) => {
    if (!Array.isArray(days) || !days.length) return 'N/A'

    const map = ['', 'Mon','Tue','Wed','Thu','Fri','Sat','Sun']

    return days
        .map(d => Number(d.day_of_week))
        .filter(n => n >= 1 && n <= 7)
        .sort((a, b) => a - b)
        .map(n => map[n])
        .join(', ')
}

const activeDialog = ref(null)
const OpenDialog = (dialogName) => {
    activeDialog.value = dialogName
}

onMounted(() => {
    LoadAll();
})
</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>