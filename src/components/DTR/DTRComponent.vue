<template>
    <div class="dtr-wrapper">
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
            <div class="card-anim-wrapper" v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple @click="() => { openDialog('AttendanceDialog') }" >
                    <q-card-section>
                        <q-icon name="bi-plus-circle" color="grey" size="xl" />
                    </q-card-section>
                </q-card>
            </div>
            <div v-if="rows.length === 0" class="card-anim-wrapper" :style="{ animationDelay: `120ms` }">
                <q-card class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" tag="label">
                    <q-card-section>
                        <div class="text-caption text-grey text-uppercase">no data found</div>
                    </q-card-section>
                </q-card>
            </div>
            <div v-for="(data, index) in rows" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }">
                <q-card @click="() => { openDialog('AttendanceInfoDialog'); DTRStore.data = data; DTRStore.month = month; DTRStore.year = year }" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple>
                    <q-card-section>
                        <div class="text-subtitle2 text-uppercase">{{ FormatName(data?.employee) }}</div>
                        <div class="text-caption text-capitalized">{{ data?.status }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-caption">{{ FormatDateRange(data) }}</div>
                        <div class="text-caption text-grey">{{ FormatDay(data) }}</div>
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
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-bar-left" :disable="page <= 1" @click="FirstPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">First Page</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-left-short" :disable="page <= 1" @click="PreviousPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Previous</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-right-short" :disable="page >= meta.TotalPages" @click="NextPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Next</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-bar-right" :disable="page >= meta.TotalPages" @click="LastPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Last Page</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-slot:prepend>
                        <q-icon name="bi-search" style="font-size: 1rem;" />
                    </template>
                </q-input>
            </q-toolbar>
        </q-footer>
        <attendance-dialog v-model="activeDialog" dialog-name="AttendanceDialog" @saved="LoadAll"/>
        <AttendanceInfoDialog v-model="activeDialog" dialog-name="AttendanceInfoDialog" @saved="LoadAll"/>
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
import { useDTRStore } from 'src/stores/dtr-store';

import AttendanceDialog from './AttendanceDialog.vue';
import AttendanceInfoDialog from './AttendanceInfoDialog.vue';

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

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore()

const DTRStore = useDTRStore();

const today = new Date();
const month = ref(String(today.getMonth() + 1).padStart(2, '0'));
const year = ref(String(today.getFullYear()));

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/attendance`, {
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

const FormatDateRange = (app) => {
    const from = new Date(app.date_from);
    const to = new Date(app.date_to);

    const options = { month: 'short', day: 'numeric' };
    const year = from.getFullYear();

    const fromText = from.toLocaleDateString('en-US', options);
    const toText = to.toLocaleDateString('en-US', options);

    // Same month
    if (from.getMonth() === to.getMonth()) {
        return `${fromText}–${to.getDate()}, ${year}`;
    }

    return `${fromText} – ${toText}, ${year}`;
};

const FormatDay = (app) => {
    let count = 0;

    const start = new Date(app.date_from);
    const end = new Date(app.date_to);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay(); // 0 = Sunday, 6 = Saturday

        if (day !== 0 && day !== 6) {
        count++;
        }
    }

    // 👇 format label
    return `${count} ${count === 1 ? 'day' : 'days'}`;
};

const months = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(0, i).toLocaleString("en-US", { month: "short" });
    const monthValue = String(i + 1).padStart(2, "0");
    return { label: monthName, value: monthValue };
})

onBeforeMount(() => {
    LoadAll();
})

const activeDialog = ref(null)
const openDialog = (dialogName) => {
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