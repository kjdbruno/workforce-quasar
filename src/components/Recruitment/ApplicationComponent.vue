<template>
    <div>
        <div class="card-main-grid">
            <div class="card-anim-wrapper" v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="() => { OpenDialog('ApplicationDialog') }">
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
                <q-card @click="() => { OpenDialog('ApplicationInfoDialog'); ApplicationStore.data = data; }" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" >
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ formatName(data) }}</div>
                        <div class="text-caption text-uppercase">{{ data?.vacancy?.position?.name }}</div>
                        <div class="text-caption text-grey">{{ data?.vacancy?.salary_range }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-uppercase">{{ data?.status }}</div>
                        <div class="text-caption text-grey">{{ formatDate(data?.createdAt) }}</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <application-dialog v-model="activeDialog" dialog-name="ApplicationDialog" @saved="() => { LoadAll(); }"/>
        <application-info-dialog v-model="activeDialog" dialog-name="ApplicationInfoDialog" @saved="() => { LoadAll(); }"/>

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
    </div>
</template>

<script setup>
import { 
    reactive,
    computed,
    onMounted,
    ref, 
    watch,
    onBeforeMount,
    nextTick
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

import moment from 'moment';

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

import { useApplicationStore } from 'src/stores/application-store';
const ApplicationStore = useApplicationStore();

import ApplicationDialog from './ApplicationDialog.vue';
import ApplicationInfoDialog from './ApplicationInfoDialog.vue';

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/application`, {
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

const formatDate = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY')
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

onMounted(() => {
    LoadAll();
})


const tab = ref('vacancy')

const activeDialog = ref(null)
const OpenDialog = (dialogName) => {
    activeDialog.value = dialogName
}

</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.4s ease;
}
.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>