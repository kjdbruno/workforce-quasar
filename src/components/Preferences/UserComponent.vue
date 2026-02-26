<template>
    <div>
        <div class="card-grid">
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="loading">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section>
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
            <div v-for="(data, index) in rows" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }"   v-else>
                <q-card :class="{ 'disabled-card': isSuperAdmin(data) }" @click="!isSuperAdmin(data) && Toggle(data)" v-ripple="!isSuperAdmin(data)" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section>
                        <div class="text-subtitle2 text-uppercase">{{ data.name }}</div>
                        <div class="text-caption text-uppercase">{{ data.role }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-caption text-grey text-uppercase">{{ data.status }}</div>
                    </q-card-section>
                    <div class="absolute-right" v-if="AuthStore.hasRole(['SuperAdmin', 'Admin']) && data.role !== 'SuperAdmin'">
                        <q-checkbox :model-value="isActive(data)" @update:model-value="(val) => onStatusToggle(data, val)" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle"/>
                    </div>
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
import { 
    reactive,
    computed,
    onMounted,
    ref, 
    watch,
    onBeforeMount
} from 'vue';

import moment from 'moment'

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore()

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/user`, {
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

const applyBackendErrors = (backendErrors) => {
    const errorsArray = Array.isArray(backendErrors)
        ? backendErrors
        : backendErrors?.errors || []

    Object.keys(Errors).forEach(key => {
        Errors[key].type = null
        Errors[key].msg = ''     // ✅ string
    })

    errorsArray.forEach(err => {
        if (Errors[err.path] !== undefined) {
            Errors[err.path].type = true
            Errors[err.path].msg = err.msg  // ✅ assign string
        }
    })
}


const UpdateList = (data) => {
    const index = rows.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        rows.value[index] = data
    }
}

// const Toggle = async () => {
//     submitLoading.value = true;
//     try {
//         const response = isActive.value
//             ? await api.post(`/user/${id.value}/disable`)
//             : await api.post(`/user/${id.value}/enable`)
//         dialog.value = false;
//         UpdateList(response.data.user)
//         Toast.fire({
//             icon: "success",
//             html: `
//                 <div class="text-h6 text-bold text-uppercase">granted!</div>
//                 <div class="text-caption text-capitalize;">${response.data.message}<div>
//             `
//         });
//     } catch (e) {
//         if (e.response && e.response.data) {
//             applyBackendErrors(e.response.data);
//             Toast.fire({
//                 icon: "error",
//                 html: `
//                     <div class="text-h6 text-bold text-uppercase">Request Failed</div>
//                     <div class="text-caption">Something went wrong.</div>
//                 `
//             })
//         }
//     } finally {
//         submitLoading.value = false;
//     }
// }

const isActive = (row) => row?.status === "Active";

// click anywhere on card toggles the checkbox too
const Toggle = (row) => {
    if (isSuperAdmin(row)) return
    const next = row.status !== "Active";
    onStatusToggle(row, next);
};
const isSuperAdmin = (row) => row.role === "SuperAdmin"

const onStatusToggle = async (row, checked) => {

    const prev = row.status;
    // set your inactive status here
    const nextStatus = checked ? "Active" : "Suspended"; // or "Inactive"

    // Optimistic UI update
    row.status = nextStatus;

    try {
        // replace endpoint with yours
        await api.post(`/user/${row.id}/status`, {
            status: nextStatus,
        });
        LoadAll()
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">Status updated to ${nextStatus}<div>
            `
        });
    } catch (e) {
        // rollback
        row.status = prev;
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
    }
};

onBeforeMount(() => {
    LoadAll();
})

const PageLoading = ref(true);
onMounted(() => {
    setTimeout(() => {
        PageLoading.value = false
    }, 1000)
})

</script>

<style scoped>
.disabled-card {
  opacity: 0.8;
  cursor: not-allowed;
}
</style>