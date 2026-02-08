<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">vacancy information</div>
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
                        <div class="text-caption text-uppercase text-grey">{{ dt?.status == 'Pending' ? 'unsigned' : (dt?.setting?.description) }}</div>
                        <div v-if="dt?.status == 'Pending'">
                            <div class="text-h6 text-uppercase">{{ dt?.original_approver_name }}</div>
                            <div class="text-body1 text-uppercase text-italic">{{ dt?.original_approver_position }}</div>
                        </div>
                        <div v-if="dt?.status == 'Approved'">
                            <div v-if="dt?.is_overide">
                                <div class="text-grey q-mb-lg">
                                    <div class="text-h6 text-uppercase">{{ dt?.original_approver_name }}</div>
                                    <div class="text-body1 text-uppercase text-italic">{{ dt?.original_approver_position }}</div>
                                </div>
                                <div class="text-caption text-uppercase text-italic text-bold q-mb-lg">overiden by</div>
                                <img :src="FormatSignature(dt?.override_signature)" width="150"/>
                                <div class="text-h6 text-uppercase">{{ dt?.override_name }}</div>
                                <div class="text-body1 text-uppercase text-italic">{{ dt?.override_position }}</div>
                                <div class="text-caption text-uppercase text-italic">{{ FormatSigned(dt?.signed_at) }}</div>
                            </div>
                            <div v-if="!dt?.is_overide">
                                <img :src="FormatSignature(dt?.original_signature)" width="150"/>
                                <div class="text-h6 text-uppercase">{{ dt?.original_approver_name }}</div>
                                <div class="text-body1 text-uppercase text-italic">{{ dt?.original_approver_position }}</div>
                                <div class="text-caption text-uppercase text-italic">{{ FormatSigned(dt?.signed_at) }}</div>
                            </div>
                        </div>
                        <div v-if="dt?.status == 'Pending' && AuthStore.hasRole(['SuperAdmin', 'Management'])" class="q-mt-md">
                            <q-checkbox v-model="overide_signatories" :val="dt?.id" label="Overide" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" size="sm" class="tex-caption"/>
                        </div>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="canApprove && AuthStore.hasRole(['SuperAdmin', 'Management', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="approve" >
                        <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                <q-card-section>
                                    <div class="text-h6 text-center text-uppercase">
                                        proceed to approve
                                    </div>
                                </q-card-section>
                                <q-card-actions>
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Approve(RecruitmentStore.data?.id)"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
                    <q-btn v-if="RecruitmentStore.data?.status == 'Pending' && AuthStore.hasRole(['SuperAdmin', 'Management'])" :disable="!HasOverrideSignatories" unelevated size="md" color="primary" class="btn text-capitalize" label="overide" >
                        <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                <q-card-section>
                                    <div class="text-h6 text-center text-uppercase">
                                        proceed to overide signature
                                    </div>
                                </q-card-section>
                                <q-card-actions>
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Overide(RecruitmentStore.data?.id)"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="() => { Print(RecruitmentStore.data?.id) }"/>
                    <!-- <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="cancel" @click="Toggle"/> -->
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
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed, nextTick } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

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

const info = ref(null)

const PopulateData = () => {
    LoadVacancy();
}

const SubmitLoading = ref(false);

const LoadVacancy = async () => {
    SubmitLoading.value = true;
    try {
        const response  = await api.get(`/recruitment/${RecruitmentStore.data?.id}`);
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
        SubmitLoading.value = false;
    }
}

const canApprove = computed(() => {
    if (!info.value?.approvals || info.value.approvals.length === 0) return false;

    // Sort approvals by setting order
    const sorted = [...info.value.approvals].sort(
        (a, b) => a.order - b.order
    );

    // Find the first pending approval
    const nextPending = sorted.find(req => req.status === 'Pending');
    if (!nextPending) return false;

    // Check if the current user is the approver of the next pending approval
    return nextPending.approver_id === AuthStore.user?.id;
});

const Approve = async (id) => {
    SubmitLoading.value = true;
    const userId = Number(AuthStore.user.id);
    const vacancy = info.value;
    const myRequest = vacancy.approvals.find(approval =>
    Number(
            approval?.approver_id
        ) === Number(userId)
    );
    const approvalid = myRequest?.id ?? null;
    try {
        const response = await api.post(`recruitment/${id}/approve`, {
            approvalid: approvalid
        })
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
        emit('saved');
        emit('update:modelValue', null);
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
        SubmitLoading.value = false;
    }
}

const UpdateList = (data) => {
    const index = rows.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        rows.value[index] = data
    }
}

const Toggle = async () => {
    SubmitLoading.value = true;
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
        SubmitLoading.value = false;
    }
}

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

const formatDate = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY')
}

const formatTime = (time) => {
    if (!time) return ''
    return moment(time, 'HH:mm').format('hh:mm A')
}

const FormatSigned = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY hh:mm A')
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

const printDialog = ref(false);
const pdf = ref(null);

const Print = async (id) => {
    SubmitLoading.value = true;
    try {
        const res = await api.get(`/recruitment/${id}/pdf`, {
            responseType: 'arraybuffer',
        })
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const pdfurl = window.URL.createObjectURL(blob) + "#view=FitW";
        pdf.value = pdfurl
        printDialog.value = true;
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        SubmitLoading.value = false;
    }
}

const overide_signatories = ref([]);

const HasOverrideSignatories = computed(() =>
    Array.isArray(overide_signatories.value) &&
    overide_signatories.value.some(v => String(v).trim() !== '')
)

const Overide = async (id) => {
    SubmitLoading.value = true;
    try {
        const response = await api.post(`recruitment/${id}/overide`, {
            signatories: overide_signatories.value
        })
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
        emit('saved');
        emit('update:modelValue', null);
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
        SubmitLoading.value = false;
    }
}

</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>