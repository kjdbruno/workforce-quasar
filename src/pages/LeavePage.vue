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
        <div class="card-main-grid">
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="() => { OpenDialog('LeaveDialog'); LeaveStore.isEdit = false; }" >
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
                <q-card @click="() => { OpenDialog('LeaveInfoDialog'); LeaveStore.data = data; }" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm">
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ FormatName(data?.employee) }}</div>
                        <div class="text-caption text-capitalize text-grey">{{ data?.status }}</div>
                    </q-card-section>
                    <q-card-section class="text-center full-width q-pa-sm">
                        <div class="text-caption text-uppercase">{{ data?.leaveType?.name }}</div>
                        <div class="text-caption">{{ FormatLeaveDate(data?.date_from, data?.date_to) }}</div>
                        <div class="text-caption text-grey">{{ ComputeLeaveDays(data?.date_from, data?.date_to) }} day/s</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
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
        <leave-dialog v-model="activeDialog" dialog-name="LeaveDialog" @saved="() => { LoadAll(); }"/>
        <leave-info-dialog v-model="activeDialog" dialog-name="LeaveInfoDialog" @saved="() => { LoadAll(); }"/>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, computed, reactive, watch } from 'vue';
import { api } from 'src/boot/axios';
import { Toast } from 'src/boot/sweetalert'; 
import moment from 'moment';

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore()

import { useLeaveStore } from 'src/stores/leave-store';
const LeaveStore = useLeaveStore();

import LeaveDialog from 'src/components/Leave/LeaveDialog.vue';
import LeaveInfoDialog from 'src/components/Leave/LeaveInfoDialog.vue';


const today = new Date();
const month = ref(String(today.getMonth() + 1).padStart(2, '0'));
const year = ref(String(today.getFullYear()));

const months = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(0, i).toLocaleString("en-US", { month: "short" });
    const monthValue = String(i + 1).padStart(2, "0");
    return { label: monthName, value: monthValue };
})

const loading = ref(false);

const rows = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);
const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/leave`, {
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
onMounted(() => {
    LoadAll()
})

const activeDialog = ref(null)
const OpenDialog = (dialogName) => {
    activeDialog.value = dialogName
}

</script>

<style scoped>

</style>