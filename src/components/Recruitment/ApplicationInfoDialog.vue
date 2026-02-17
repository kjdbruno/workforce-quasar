<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">application information</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <q-btn-toggle
                    unelevated
                    size="xs"
                    v-model="tab"
                    toggle-color="primary"
                    :options="[
                        {label: 'vacancy information', value: 'vacancy'},
                        {label: 'applicant information', value: 'applicant'},
                        {label: 'education', value: 'education'},
                        {label: 'experience', value: 'experience'},
                        {label: 'training', value: 'training'},
                        {label: 'document', value: 'document'},
                    ]"
                />
                <div class="q-mt-md">
                    <div  v-if="tab === 'vacancy'">
                        <div class="text-subtitle2 text-uppercase text-bold q-mb-md">vacancy information</div>
                        <div class="row q-col-gutter-xs q-mb-md">
                            <div class="col-4">
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">position</div>
                                    <div class="text-body1 text-uppercase">{{ info?.vacancy?.position?.name }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">salary</div>
                                    <div class="text-body1 text-uppercase">{{ formatCurrency(info?.vacancy?.position?.salary_amount) }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">department</div>
                                    <div class="text-body1 text-uppercase">{{ info?.vacancy?.department?.name }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">shift</div>
                                    <div class="text-body1 text-capitalize">{{ info?.vacancy?.shift?.name }} {{ formatTime(info?.vacancy?.shift?.start_time) }} to {{ formatTime(info?.vacancy?.shift?.end_time) }}</div>
                                    <div class="text-body1 text-capitalize">{{ FormatDays(info?.vacancy?.shift?.days) }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">work location</div>
                                    <div class="text-body1 text-capitalize">{{ info?.vacancy?.location }}</div>
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">job description</div>
                                    <div class="text-body1">{{ info?.vacancy?.position?.description }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">job qualifications</div>
                                    <div class="text-body1" v-for="(v, index) in info?.vacancy?.position?.qualification" :key="index">{{ (index+1) }}. {{ v || 'N/A' }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row q-col-gutter-lg q-mb-md">
                            <div>
                                <div class="text-caption text-uppercase text-grey">date needed</div>
                                <div class="text-body1">{{ formatDate(info?.vacancy?.date_needed) }}</div>
                            </div>
                            <div>
                                <div class="text-caption text-uppercase text-grey">need background check</div>
                                <div class="text-body1">{{ info?.vacancy?.need_background_check ? 'Yes' : 'No' }}</div>
                            </div>
                            <div>
                                <div class="text-caption text-uppercase text-grey">movement</div>
                                <div class="text-body1">{{ info?.vacancy?.movement }}</div>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">justification</div>
                            <div class="text-body1">{{ info?.vacancy?.justification }}</div>
                        </div>
                    </div>
                    <div  v-if="tab === 'applicant'">
                        <div class="text-subtitle2 text-uppercase text-bold q-mb-md">applicant information</div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">name</div>
                            <div class="text-body1 text-uppercase">{{ formatName(info) }}</div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">status</div>
                            <div class="text-body1 text-uppercase">{{ info?.status }}</div>
                        </div>
                        <div class="row q-col-gutter-lg q-mb-mb">
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">sex</div>
                                <div class="text-body1 text-uppercase">{{ info?.sex }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">marital status</div>
                                <div class="text-body1 text-uppercase">{{ info?.civil_status }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">bithdate</div>
                                <div class="text-body1 text-uppercase">{{ info?.birthdate }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">birthplace</div>
                                <div class="text-body1 text-uppercase">{{ info?.birthplace }}</div>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">address</div>
                            <div class="text-body1 text-uppercase">{{ info?.address }}</div>
                        </div>
                        <div class="row q-col-gutter-lg q-mb-mb">
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">email</div>
                                <div class="text-body1 text-uppercase">{{ info?.email }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">contact number</div>
                                <div class="text-body1 text-uppercase">{{ info?.contact_number }}</div>
                            </div>
                        </div>
                    </div>
                    <div  v-if="tab === 'education'">
                        <div class="text-subtitle2 text-uppercase text-bold q-mb-sm">educational attainment</div>
                        <div class="card-grid">
                            <div v-for="(data, index) in info?.educations" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" >
                                <q-card  class="card card-hover-animate flex flex-center no-shadow cursor-pointer radius-sm q-mr-sm q-mb-sm">
                                    <q-card-section class="text-center full-width">
                                        <div class="text-caption text-uppercase">{{ data?.course?.name }}</div>
                                    </q-card-section>
                                    <q-card-section class="text-center full-width">
                                        <div class="text-caption">{{ data?.school_level }}</div>
                                        <div class="text-caption text-grey">{{ data?.start_date }} to {{ data?.end_date }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>
                    <div  v-if="tab === 'experience'">
                        <div class="text-subtitle2 text-uppercase text-bold q-mb-sm">work experiences</div>
                        <div class="card-grid">
                            <div v-for="(data, index) in info?.experiences" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" >
                                <q-card  class="card card-hover-animate flex flex-center no-shadow cursor-pointer radius-sm q-mr-sm q-mb-sm"  >
                                    <q-card-section class="text-center full-width">
                                        <div class="text-subtitle1 text-uppercase">{{ data?.position }}</div>
                                    </q-card-section>
                                    <q-card-section class="text-center full-width">
                                        <div class="text-caption text-grey">{{ data?.start_date }} to {{ data?.end_date }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>
                    <div  v-if="tab === 'training'">
                        <div class="text-subtitle2 text-uppercase text-bold q-mb-sm">trainings</div>
                        <div class="card-grid">
                            <div v-for="(data, index) in info?.trainings" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" >
                                <q-card  class="card card-hover-animate flex flex-center no-shadow cursor-pointer radius-sm q-mr-sm q-mb-sm" >
                                    <q-card-section class="text-center full-width">
                                        <div class="text-subtitle1 text-uppercase">{{ data?.title }}</div>
                                        <div class="text-caption text-uppercase">{{ data?.type }}</div>
                                    </q-card-section>
                                    <q-card-section class="text-center full-width">
                                        <div class="text-caption text-grey">{{ data?.start_date }} to {{ data?.end_date }}</div>
                                        <div class="text-caption text-grey">{{ data?.hour }}hr/s</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>
                    <div  v-if="tab === 'document'">
                        <div class="text-subtitle2 text-uppercase  text-bold q-mb-sm">documents uploaded</div>
                        <div class="card-grid">
                            <div v-for="(data, index) in info?.documents" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" >
                                <q-card  class="card card-hover-animate flex flex-center no-shadow cursor-pointer radius-sm q-mr-sm q-mb-sm" @click="() => { ViewDocument(data); }">
                                    <q-card-section class="text-center">
                                        <div class="text-caption">{{ data?.filename }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions class="q-pa-lg bg">
                <div class="row q-col-gutter-sm">
                    <div v-if="(info?.status !== 'Hired' && info?.status !== 'Rejected' && info?.status !== 'Withdrawn') && (AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])) && ApplicationStore.data?.vacancy?.status === 'Approved'">
                        <q-select
                            outlined
                            v-model="applicationstatus"
                            input-debounce="300"
                            use-input
                            :options="applicationstatuses"
                            hide-dropdown-icon
                            :no-error-icon="true"
                            dense
                        />
                    </div>
                    <div v-if="(info?.status !== 'Hired' && info?.status !== 'Rejected' && info?.status !== 'Withdrawn') && (AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])) && ApplicationStore.data?.vacancy?.status === 'Approved'">
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="update" >
                            <q-menu transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                                <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                    <q-card-section>
                                        <div class="text-h6 text-center text-uppercase">
                                            proceed to update status
                                        </div>
                                    </q-card-section>
                                    <q-card-actions>
                                        <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="() => { Update(); }"/>
                                    </q-card-actions>
                                </q-card>
                            </q-menu>
                        </q-btn>
                    </div>
                    <div class="q-gutter-sm">
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="() => { Print(); }"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }" outline/>
                    </div>
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

import { useApplicationStore } from 'src/stores/application-store';
const ApplicationStore = useApplicationStore();

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

const tab = ref('vacancy')

const applicationstatus = ref('');

const applicationstatuses = ["Pooling", "Shortlisted", "Interview", "Hired", "Rejected", "Withdrawn"];

const SubmitLoading = ref(false);
const info = ref([]);

const LoadApplication = async () => {
    SubmitLoading.value = true
    try {
        const response = await api.get(`/application/${ApplicationStore.data?.id}/details`);
        info.value = response.data.data;
        applicationstatus.value = info.value.status;
    } catch (error) {
        console.error("Error fetching options:", error);
    } finally {
        SubmitLoading.value = false;
    }
};


const PopulateData = () => {
    LoadApplication()
}

const Update = async () => {
    SubmitLoading.value = true;
    try {
        const response = await api.post(`/socket/application/update`, {
            id: ApplicationStore.data?.id,
            status: applicationstatus.value
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

const ViewDocument = (data) => {
    const file = `${process.env.VUE_APP_BACKEND_URL}${data.document}`;
    window.open(file, '_blank');
}

const printDialog = ref(false);
const pdf = ref(null);

const Print = async () => {
    SubmitLoading.value = true;
    try {
        const res = await api.get(`/application/${ApplicationStore.data?.id}/pdf`, {
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

function formatCurrency(value, currency = 'PHP') {
    if (value == null || value === '') return '';

    const num = Number(String(value).replace(/,/g, ''));
    if (isNaN(num)) return '';

    return num.toLocaleString('en-PH', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

const formatDate = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY')
}

const formatTime = (time) => {
    if (!time) return ''
    return moment(time, 'HH:mm').format('hh:mm A')
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
</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>