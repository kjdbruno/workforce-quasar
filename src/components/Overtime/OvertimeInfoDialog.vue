<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">{{ OvertimeStore.isEdit ? 'modify overtime application' : 'create new overtime application' }}</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey">date</div>
                    <div class="text-body1 text-uppercase">{{ FormatDate(info?.date) }}</div>
                </div>
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey">time</div>
                    <div class="text-body1 text-uppercase">{{ FormatTimeRange(info) }}</div>
                </div>
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey">status</div>
                    <div class="text-body1 text-uppercase">{{ info?.status }}</div>
                </div>
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey">employee</div>
                    <div v-for="e in info?.applications" class="q-mb-xs">
                        <div class="text-body1 text-uppercase">{{ FormatName(e.employee) }}</div>
                        <div class="text-caption text-uppercase">{{ e?.employee?.employment?.position.name }}</div>
                    </div>
                </div>
                <div class="row q-col-gutter-xl q-mb-md q-mt-xl">
                    <div v-for="(dt, index) in info?.approvals">
                        <div class="text-caption text-uppercase text-grey">{{ dt?.status == 'Pending' ? 'unsigned' : (dt?.setting?.description) }}</div>
                        <div v-if="dt?.status == 'Approved'">
                            <img :src="FormatSignature(dt?.setting?.approver?.employeeAccount?.employee?.signature)" width="150"/>
                        </div>
                        <div class="text-h6 text-uppercase">{{ FormatName(dt?.setting?.approver?.employeeAccount?.employee) }}</div>
                        <div class="text-body1 text-uppercase text-italic">{{ dt?.setting?.approver?.employeeAccount?.employee?.employment?.position?.name }}</div>
                        <div class="text-caption text-uppercase text-italic">{{ FormatSigned(dt?.signed_at) }}</div>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="row q-gutter-sm">
                    <q-btn v-if="canApprove && info?.status !== 'Cancelled'" unelevated size="md" color="primary" class="btn text-capitalize" label="approve">
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
                    <q-btn v-if="info?.status !== 'Cancelled'" unelevated size="md" color="primary" class="btn text-capitalize" label="cancel">
                        <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                <q-card-section>
                                    <div class="text-h6 text-center text-uppercase">
                                        proceed to cancel
                                    </div>
                                </q-card-section>
                                <q-card-actions>
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Cancel(info?.id)"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
                    <q-btn v-if="info?.status !== 'Cancelled'" unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="Print(info?.id)" />
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

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

import { useOvertimeStore } from 'src/stores/overtime-store';
const OvertimeStore = useOvertimeStore();

const props = defineProps({
    modelValue: String,
    dialogName: String
})

const emit = defineEmits(['update:modelValue', 'saved'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => {
        if (!val) emit('update:modelValue', null)
    }
})

const SubmitLoading = ref(false);

const PopulateData = () => {
    GetOvertime();
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

const info = ref([])

const GetOvertime = async () => {
    SubmitLoading.value = true;
    try {
        const response  = await api.get(`/overtime/${OvertimeStore.data?.id}`);
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
        SubmitLoading.value = false;
    }
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
    const start = new Date(`1970-01-01T${data.time_start}`);
    const end = new Date(`1970-01-01T${data.time_end}`);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return `${start.toLocaleTimeString('en-PH', options)} - ${end.toLocaleTimeString('en-PH', options)}`;
};

const FormatSigned = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY hh:mm A')
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
    SubmitLoading.value = true;
    const userId = Number(AuthStore.user.id);
    const overtime = info.value;
    const myRequest = overtime.approvals.find(approval =>
    Number(
            approval?.setting?.approver_id
        ) === Number(userId)
    );
    const approvalid = myRequest?.id ?? null;

    try {
        const response = await api.post(`/overtime/${id}/approve`, {
            approvalid
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

const Cancel = async (id) => {

    submitLoading.value = true;

    try {

        const response = await api.post(`/overtime/${id}/cancel`)
        LoadAll()
        OvertimeDialog.value = false;
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
        const res = await api.get(`/overtime/${id}/pdf`, {
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

</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>