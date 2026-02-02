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
                    <div class="text-body1 text-uppercase">{{ FormatName(DTRStore.data) }}</div>
                </div>
                <div class="q-mb-sm">
                    <span class="text-subtitle1 text-uppercase text-bold q-mr-md">daily time record</span>
                </div>
                <div class="filter-inline q-mb-md">
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
                            @click="() => { month = m.value; LoadLog(); }"
                            size="md"
                            :label="m.label"
                        />
                    </div>
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
                            <span class="text-caption text-uppercase text-grey q-mr-sm">records</span>
                        </div>
                    </div>
                </div>
                <div class="q-mb-xl">
                    <div class="row q-col-gutter-xs q-mb-xs" v-for="(data, index) in logs">
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatLogDate(data.date)" />
                        </div>
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatLogDay(data.date)" />
                        </div>
                        <div class="col-10">
                            <div class="row items-center q-gutter-xs">
                                <q-input v-for="(time, index) in data.times" outlined dense v-model="data.times[index]" style="width: 100px;" >
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale" mask="##:##" fill-mask ref="popup" class="no-shadow custom-border radius-sm">
                                        <q-time v-model="data.times[index]" mask="HH:mm" >
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Okay" color="primary" flat />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-input>
                                <!-- <q-input v-for="(time, index) in data.times" outlined dense v-model="data.times[index]" style="width: 100px;"/> -->
                                <q-badge v-if="data.leaveType" rounded color="primary" :label="data.leaveType" />
                                <q-badge v-if="data.holiday" rounded color="primary" :label="data.holiday" />
                                <q-badge v-if="data.overtimes" rounded color="primary" :label="data.overtimes" />
                            </div>
                        </div>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null) }" outline/>
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
import { useDTRStore } from 'src/stores/dtr-store';
const DTRStore = useDTRStore();

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

const today = new Date();
const month = ref(String(today.getMonth() + 1).padStart(2, '0'));
const year = ref(String(today.getFullYear()));

const months = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(0, i).toLocaleString("en-US", { month: "short" });
    const monthValue = String(i + 1).padStart(2, "0");
    return { label: monthName, value: monthValue };
})

const SubmitLoading = ref(false);

const PopulateData = () => {
    LoadLog()
}

const logs = ref([]);

const LoadLog = async () => {
    SubmitLoading.value = true;
    try {
        const response = await api.get(`/log/${DTRStore.data?.id}`, {
            params: { 
                month: month.value,
                year: year.value
            }
        });
        const { data, employee_id } = response.data;
        logs.value = data
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

const FormatLogDate = (date) => {
    if (!date) return ''
    return moment(date).format('DD')
}

const FormatLogDay = (date) => {
    if (!date) return ''
    return moment(date).format('dddd')
}
</script>