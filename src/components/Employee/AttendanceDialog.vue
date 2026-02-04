<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">daily time record</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
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
                            @click="() => { month = m.value; GetAttendance(EmployeeStore.data?.id); }"
                            size="md"
                            :label="m.label"
                        />
                    </div>
                </div>
                <div class="q-mt-md">
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
                        <div class="col-4">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">attendance</span>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">logs</span>
                            </div>
                        </div>
                    </div>
                    <div class="q-mb-xl">
                        <div class="row q-col-gutter-xs q-mb-xs" v-for="(data, index) in attendances">
                            <div class="col-1">
                                <q-input outlined dense :model-value="FormatLogDate(data.date)" />
                            </div>
                            <div class="col-1">
                                <q-input outlined dense :model-value="FormatLogDay(data.date)" />
                            </div>
                            <div class="col-4">
                                <div class="row items-center q-gutter-xs">
                                    <q-input outlined dense :model-value="FormatLogTime(data.time_in)" :readonly="true" style="width: 100px;"/>
                                    <q-input outlined dense :model-value="FormatLogTime(data.time_out)" :readonly="true" style="width: 100px;"/>
                                    <q-input outlined dense :model-value="FormatMinutes(data.late)" :readonly="true" style="width: 100px;"/>
                                    <q-input outlined dense :model-value="FormatMinutes(data.undertime)" :readonly="true" style="width: 100px;"/>
                                    <q-input outlined dense :model-value="FormatMinutes(data.overtime)" :readonly="true" style="width: 100px;"/>
                                </div>
                            </div>
                            <div class="col">
                                <div class="row items-center q-gutter-xs">
                                    <q-input v-for="(time, index) in data.logs" outlined dense :model-value="FormatLogTime(data.logs[index])" :readonly="true" style="width: 100px;"/>
                                    <q-badge v-if="data.notes.length" v-for="value in data.notes" rounded color="primary" :label="value.type" class="text-uppercase cursor-pointer">
                                        <q-tooltip anchor="top middle" self="center middle" class="text-uppercase">
                                            <div>{{ value.name }}</div>
                                        </q-tooltip>
                                    </q-badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn :disable="!attendance_id" unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="() => { Print() }"/>
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

const SubmitLoading = ref(false);

const status = ref('');
const today = new Date();
const month = ref(String(today.getMonth() + 1).padStart(2, '0'));
const year = ref(String(today.getFullYear()));

const months = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(0, i).toLocaleString("en-US", { month: "short" });
    const monthValue = String(i + 1).padStart(2, "0");
    return { label: monthName, value: monthValue };
});

const attendances = ref([]);
const attendance_id = ref('');

const GetAttendance = async (id) => {
    SubmitLoading.value = true;
    try {
        const response = await api.get(`/employee/attendance`, {
            params: { 
                id: id,
                year: year.value,
                month: month.value
            }
        });
        const app = response.data;
        attendances.value = app.logs;
        attendance_id.value = app.attendance_id;
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

const PopulateData = () => {
    GetAttendance(EmployeeStore.data?.id)
}

const FormatLogDate = (date) => {
    if (!date) return ''
    return moment(date).format('DD')
}

const FormatLogDay = (date) => {
    if (!date) return ''
    return moment(date).format('dddd')
}

const FormatLogTime = (time) => {
    if (!time) return '';
    return moment(time, ['HH:mm', 'HH:mm:ss'], true).format('hh:mm A');
};


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

const printDialog = ref(false);
const pdf = ref(null);

const Print = async () => {
    SubmitLoading.value = true;
    try {
        const res = await api.get(`/attendance/${attendance_id.value}/pdf`, {
            responseType: 'arraybuffer',
        })
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const pdfurl = window.URL.createObjectURL(blob) + "#view=FitW";
        pdf.value = pdfurl
        printDialog.value = true;
        SubmitLoading.value = false;
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        SubmitLoading.value = false;
    }
}

</script>


<style scoped lang="css">
    .card
    {
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px !important;
    }
</style>