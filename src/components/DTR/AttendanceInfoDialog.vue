<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">daily time records</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey">employee</div>
                    <div class="text-body1 text-uppercase">{{ FormatName(DTRStore.data?.employee) }}</div>
                </div>
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey">status</div>
                    <div class="text-body1 text-uppercase">{{ DTRStore.data?.status }}</div>
                </div>
                <div class="q-mb-sm">
                    <span class="text-subtitle1 text-uppercase text-bold q-mr-md">daily time record</span>
                </div>
                <div class="row q-col-gutter-xs">
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">date</span>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">day</span>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">time in</span>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">time out</span>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">late</span>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">undertime</span>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">overtime</span>
                        </div>
                    </div>
                </div>
                <div class="q-mb-xl">
                    <div class="row q-col-gutter-xs q-mb-xs" v-for="(data, index) in dtr">
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatLogDate(data.date)" />
                        </div>
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatLogDay(data.date)" />
                        </div>
                        <div class="col-1">
                            <q-input outlined dense v-model="data.time_in">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" mask="##:##" fill-mask ref="popup" class="no-shadow custom-border radius-sm">
                                    <q-time v-model="data.time_in" mask="HH:mm" >
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Okay" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-input>
                        </div>
                        <div class="col-1">
                            <q-input outlined dense v-model="data.time_out" >
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale" mask="##:##" fill-mask ref="popup" class="no-shadow custom-border radius-sm">
                                    <q-time v-model="data.time_out" mask="HH:mm" >
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Okay" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-input>
                        </div>
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatMinutes(data.late)" :readonly="true"/>
                        </div>
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatMinutes(data.undertime)" :readonly="true"/>
                        </div>
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatMinutes(data.overtime)" :readonly="true"/>
                        </div>
                        <div class="col">
                            <div class="q-gutter-xs q-mt-sm">
                                <q-badge v-if="data.notes.length" v-for="value in data.notes" rounded color="primary" :label="value.type" class="text-uppercase cursor-pointer">
                                    <q-tooltip anchor="top middle" self="center middle" class="text-uppercase">
                                        <div>{{ value.name }}</div>
                                    </q-tooltip>
                                </q-badge>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row q-col-gutter-xl q-mb-md q-mt-xl">
                    <div v-for="(dt, index) in signatories">
                        <div class="text-caption text-uppercase text-grey">{{ dt?.status == 'Pending' ? 'unsigned' : (dt?.description) }}</div>
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
                            <q-checkbox v-model="overide_signatories" :val="dt?.id" label="Overide" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" size="sm" class="tex-caption"/>
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="DTRStore.data?.status != 'Approved'" unelevated size="md" color="primary" class="btn text-capitalize" label="save">
                        <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                <q-card-section>
                                    <div class="text-h6 text-center text-uppercase">
                                        proceed to save
                                    </div>
                                </q-card-section>
                                <q-card-actions>
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="() => { Update(); }"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
                    <q-btn v-if="canApprove" unelevated size="md" color="primary" class="btn text-capitalize" label="approve">
                        <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                <q-card-section>
                                    <div class="text-h6 text-center text-uppercase">
                                        proceed to approve
                                    </div>
                                </q-card-section>
                                <q-card-actions>
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Approve(attendanceId)"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
                    <q-btn v-if="DTRStore.data?.status == 'Pending' && AuthStore.hasRole(['SuperAdmin', 'Management'])" :disable="!HasOverrideSignatories" unelevated size="md" color="primary" class="btn text-capitalize" label="overide" >
                        <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                <q-card-section>
                                    <div class="text-h6 text-center text-uppercase">
                                        proceed to overide signature
                                    </div>
                                </q-card-section>
                                <q-card-actions>
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Overide(DTRStore.data?.id)"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="Print(attendanceId)" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null) }"  outline/>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="SubmitLoading">
                <q-card class="no-shadow radius-md q-pa-md">
                    <q-card-section class="text-center">
                        <div>
                            <q-spinner-ios color="dark"/>
                        </div>
                        <div class="text-dark text-uppercase text-caption">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </q-inner-loading>
        </q-card>
    </q-dialog>
    <q-dialog v-model="printDialog" full-height full-width class="pdf">
        <q-card class="bg-white q-pa-none" style="height: 100vh; overflow: hidden;">
            <q-btn
                icon="bi-x"
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

import { useDTRStore } from 'src/stores/dtr-store';
const DTRStore = useDTRStore();

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
    LoadAttendance()
}

const attendanceId = ref('');
const dtr = ref([]);
const signatories = ref([]);

const LoadAttendance = async () => {
    SubmitLoading.value = true;
    try {
        const response = await api.get(`/attendance/${DTRStore.data?.id}`, {
            params: { 
                month: DTRStore.month,
                year: DTRStore.year
            }
        });
        const { logs, approvals, id } = response.data;
        dtr.value = logs;
        attendanceId.value = id;
        signatories.value = approvals;
        console.log('approvals', signatories.value)
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

const FormatSignature = (sign) => {
    return `${process.env.VUE_APP_BACKEND_URL}${sign.signature}`
}

const FormatLogDate = (date) => {
    if (!date) return ''
    return moment(date).format('DD')
}

const FormatSigned = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY hh:mm A')
}

const FormatLogDay = (date) => {
    if (!date) return ''
    return moment(date).format('dddd')
}

const FormatMinutes = (value) => {
    const total = Number(value) || 0;
    if (total <= 0) return '0 min';

    const minutesInDay = 24 * 60;

    const days = Math.floor(total / minutesInDay);
    const hours = Math.floor((total % minutesInDay) / 60);
    const minutes = total % 60;

    const parts = [];

    if (days) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    if (hours) parts.push(`${hours} ${hours === 1 ? 'hr' : 'hrs'}`);
    if (minutes) parts.push(`${minutes} ${minutes === 1 ? 'min' : 'mins'}`);

    return parts.join(' ');
};

const canApprove = computed(() => {
    const list = signatories.value || [];
    if (!list.length) return false;

    // Sort by order
    const sorted = [...list].sort((a, b) => Number(a.order) - Number(b.order));

    // First pending
    const nextPending = sorted.find(a => a.status === 'Pending');
    if (!nextPending) return false;

    // Current user can approve only if they are the approver_id of the next pending
    return Number(nextPending.approver_id) === Number(AuthStore.user?.id);
});


const Approve = async (id) => {
    SubmitLoading.value = true;
    const userId = Number(AuthStore.user.id);
    const s = signatories.value;
    const myRequest = s.find(approval =>
    Number(
            approval?.approver_id
        ) === Number(userId)
    );
    const approvalid = myRequest?.id ?? null;

    try {
        const response = await api.post(`/attendance/${id}/approve`, {
            approvalid
        });
        emit('saved');
        emit('update:modelValue', null)
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

const Update = async () => {
    SubmitLoading.value = true;
    try {
        const response = await api.post(`/attendance/${attendanceId.value}/update`, {
            logs: logs.value
        });
        LoadAttendance()
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
        const res = await api.get(`/attendance/${id}/pdf`, {
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
        const response = await api.post(`attendance/${id}/overide`, {
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