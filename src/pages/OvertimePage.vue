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
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="AuthStore.hasRole(['SuperAdmin', 'Management'])">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple @click="() => { OpenDialog('OvertimeDialog'); OvertimeStore.isEdit = false; }" >
                    <q-card-section>
                        <q-icon name="bi-plus-circle" color="grey" size="xl" />
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="loading">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section class="text-center">
                        <q-spinner-ios color="dark"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-else-if="!loading && rows.length === 0">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section>
                        <div class="text-caption text-uppercase text-grey">no data found</div>
                    </q-card-section>
                </q-card>
            </div>
            <div v-for="(data, index) in rows" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" v-else>
                <q-card @click="() => { OpenDialog('OvertimeInfoDialog'); OvertimeStore.data = data; }" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm">
                    <q-card-section>
                        <div class="text-subtitle2 text-uppercase">{{ FormatDate(data?.date) }}</div>
                        <div class="text-caption text-capitalize">{{ FormatTimeRange(data) }}</div>
                    </q-card-section>
                    <q-card-section class="text-center full-width q-pa-sm">
                        <div class="text-caption text-capitalize text-grey">{{ data?.status }}</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <overtime-dialog v-model="activeDialog" dialog-name="OvertimeDialog" @saved="() => { LoadAll(); }"/>
        <overtime-info-dialog v-model="activeDialog" dialog-name="OvertimeInfoDialog" @saved="() => { LoadAll(); }"/>
        <transition name="glass-fade">
            <div id="glass-overlay" v-show="PageLoading">
                <q-card class="no-shadow radius-md q-pa-md">
                    <q-card-section class="text-center">
                        <div>
                            <q-spinner-ios color="dark"/>
                        </div>
                        <div class="text-dark text-uppercase text-caption">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, computed, reactive, watch } from 'vue';
import { api } from 'src/boot/axios';
import { Toast } from 'src/boot/sweetalert'; 
import moment from 'moment';

import { useOvertimeStore } from 'src/stores/overtime-store';
const OvertimeStore = useOvertimeStore();

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

import OvertimeDialog from 'src/components/Overtime/OvertimeDialog.vue';
import OvertimeInfoDialog from 'src/components/Overtime/OvertimeInfoDialog.vue';

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

onBeforeMount(() => {
    LoadAll()
})

const activeDialog = ref(null)
const OpenDialog = (dialogName) => {
    activeDialog.value = dialogName
}

const PageLoading = ref(true);
onMounted(() => {
    setTimeout(() => {
        PageLoading.value = false
    }, 1000)
})


</script>

<style scoped>

</style>