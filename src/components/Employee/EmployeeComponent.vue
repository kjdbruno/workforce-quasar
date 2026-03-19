<template>
    <div class="wrapper">
        <div class="q-mb-sm">
            <q-card class="no-shadow radius-xs">
                <q-card-section>
                    <div class="q-gutter-xs">
                        <q-btn
                            v-for="(btn, index) in departments"
                            :key="index"
                            unelevated
                            size="xs"
                            :label="btn.name"
                            :class="filterDepartment === btn.id ? 'bg-primary text-white' : 'bg-accent'"
                            @click="filterDepartment = btn.id"
                            />
                    </div>
                </q-card-section>
            </q-card>
        </div>
        <div class="card-grid">
            <div class="card-anim-wrapper" v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple @click="() => { OpenDialog('EmployeeDialog') }" >
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
                    <q-card-section class="text-center">
                        <div class="text-caption text-uppercase text-grey">no data found</div>
                    </q-card-section>
                </q-card>
            </div>
            <div v-for="(data, index) in filteredEmployees" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" >
                <q-card @click="() => { OpenDialog('MenuDialog'); EmployeeStore.data = data; }" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section>
                        <div class="text-caption text-uppercase">{{ data?.employment?.employee_no }}</div>
                        <div class="text-subtitle2 text-uppercase">{{ formatName(data) }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-caption text-uppercase">{{ data?.employment?.position?.name }}</div>
                        <div class="text-caption text-grey">{{ data?.employment?.employment_status }}</div>
                        <div class="text-caption text-grey text-italic">{{ formatCurrency(data?.employment?.position?.amount) }}</div>
                    </q-card-section>
                    <div class="absolute-top-left q-ma-sm" style="width: 7px; height: 7px; border-radius: 50%;" :class="data.status == 'Active' ? 'bg-positive' : 'bg-negative'"></div>
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
        <employee-dialog v-model="activeDialog" dialog-name="EmployeeDialog" @saved="() => { LoadAll(); }"/>
        <menu-dialog v-model="activeDialog" dialog-name="MenuDialog"/>
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
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

import { useEmployeeStore } from 'src/stores/employee-store';
import EmployeeDialog from './EmployeeDialog.vue';
import MenuDialog from './MenuDialog.vue';
const EmployeeStore = useEmployeeStore();

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/employee`, {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value || ''
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

const departments = ref([]);

function formatCurrency(amountStr, currency = 'PHP') {
        if (!amountStr) return '';

        // Extract numeric value (handles "16,500.00 | Monthly")
        const numeric = amountStr.split('|')[0].trim();

        const num = parseFloat(numeric.replace(/,/g, ''));

        if (isNaN(num)) return amountStr; // fallback

        return num.toLocaleString('en-PH', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2
        });
}

const LoadDepartments = async () => {
    try {
        const { data } = await api.get(`/employee/option/department`);
        departments.value = [
            {
                name: 'ALL',
                id: null
            },
            ...(data || []).map(d => ({
                name: d.name,
                id: Number(d.id)
            }))
        ];
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

onBeforeMount(() => {
    LoadDepartments();
    LoadAll();
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

const filterDepartment = ref(null);

const filteredEmployees = computed(() => {
    if (filterDepartment.value === null) {
        return rows.value
    }

    return rows.value.filter(employee => {
        return employee.employment?.position?.department_id === filterDepartment.value
    })
})

</script>

<style lang="css" scoped>
.card-menu
{
    width: 200px;
    height: 75px;
}
</style>