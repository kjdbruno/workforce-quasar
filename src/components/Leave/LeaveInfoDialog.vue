<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
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
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Approve(LeaveStore.data?.id)"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
                    <q-btn v-if="LeaveStore.data?.status !== 'Cancelled'" unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="Print(LeaveStore.data?.id)" />
                    <q-btn v-if="LeaveStore.data?.status !== 'Cancelled'" unelevated size="md" color="primary" class="btn text-capitalize" label="cancel">
                        <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                <q-card-section>
                                    <div class="text-h6 text-center text-uppercase">
                                        proceed to approve
                                    </div>
                                </q-card-section>
                                <q-card-actions>
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Cancel(LeaveStore.data?.id)"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
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
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 

import { useLeaveStore } from 'src/stores/leave-store';
const LeaveStore = useLeaveStore();

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

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
    GetLeave(LeaveStore.data?.id)
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

const FormatSigned = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY hh:mm A')
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

const info = ref(null);

const GetLeave = async (id) => {
    SubmitLoading.value = true;
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
        SubmitLoading.value = false;
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
    SubmitLoading.value = true;
    const userId = Number(AuthStore.user.id);
    const leave = info.value;
    const myRequest = leave.approvals.find(approval =>
    Number(
            approval?.setting?.approver_id
        ) === Number(userId)
    );
    const approvalid = myRequest?.id ?? null;

    try {
        const response = await api.post(`/leave/${id}/approve`, {
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

    SubmitLoading.value = true;

    try {

        const response = await api.post(`/leave/${id}/cancel`)
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

const printDialog = ref(false);
const pdf = ref(null);

const Print = async (id) => {
    SubmitLoading.value = true;
    try {
        const res = await api.get(`/leave/${id}/pdf`, {
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

</script>