<template>
    <q-layout view="lHh Lpr lFf">

        <q-header class="bg-white no-shadow q-mx-lg q-mt-md q-py-sm radius-xs" v-if="authStore.isAuthenticated && router.currentRoute.value.name != 'login'">
            <q-toolbar class="header">

                <q-btn flat round dense icon="menu" class="text-grey custom-border" @click="drawerClick"/>

                <q-toolbar-title class="text-grey text-uppercase">
                    {{ route.name }}
                </q-toolbar-title>

                <div class="q-gutter-sm">
                    <q-btn flat round dense class="text-white">
                        <q-avatar size="md" text-color="grey-8">
                            <img :src="messageSecondary" />
                            <q-badge color="red" floating>2</q-badge>
                        </q-avatar>
                    </q-btn>

                    <q-btn flat round dense class="text-white">
                        <q-avatar size="md" text-color="grey-8">
                            <img :src="notificationSecondary" />
                            <q-badge color="red" floating>2</q-badge>
                        </q-avatar>
                    </q-btn>

                    <q-btn flat round dense class="text-white" @click="meDialog = !meDialog">
                        <q-avatar size="md">
                            <img :src="account" />
                        </q-avatar>
                        <q-badge color="positive" rounded floating />
                    </q-btn>
                </div>

            </q-toolbar>
        </q-header>
        
        <q-drawer v-model="drawer" show-if-above :mini="!drawer || miniState" :width="300" :mini-width="125" :breakpoint="500" bordered v-if="authStore.isAuthenticated && router.currentRoute.value.name != 'login'">

            <div class="text-center">
                <div class="q-pt-lg q-pb-lg">
                    <div v-if="miniState">
                        <q-avatar>
                            <img :src="logo">
                        </q-avatar>
                    </div>
                    <div v-if="!miniState">
                        <q-avatar>
                            <img :src="logo">
                        </q-avatar>
                        <span class="text-primary">workforce</span>
                    </div>
                </div>
            </div>

            <q-scroll-area v-if="!miniState" class="fit q-pl-lg q-pr-lg" :horizontal-thumb-style="{ opacity: 0 }">
                <q-list padding>

                    <q-item clickable v-ripple class="q-pa-md q-pb-sm radius-xl" v-for="item in menuItems" :key="item.label" @click="router.push(item.to)">
                        <q-item-section avatar>
                            <img :src="isActive(item.label) ? item.iconPrimary : item.iconSecondary" width="20">
                        </q-item-section>
                        <q-item-section class="text-uppercase text-caption" :class="isActive(item.label) ? 'text-primary' : 'text-secondary'">
                            {{ item.label }}
                        </q-item-section>
                    </q-item>

                </q-list>
            </q-scroll-area>

            <q-scroll-area v-if="miniState" class="fit" :horizontal-thumb-style="{ opacity: 0 }">
                
                <div class="text-center">
                    <div v-for="item in menuItems" :key="item.label" class="q-pa-sm q-pb-sm">
                        <q-btn flat round @click="router.push(item.to)">
                            <q-avatar size="sm">
                                <img :src="isActive(item.label) ? item.iconPrimary : item.iconSecondary" width="20">
                            </q-avatar>
                        </q-btn>
                    </div>
                </div>

            </q-scroll-area>

            <div class="absolute-bottom q-pa-md">
                <div v-if="!miniState">
                    <q-list>
                        <q-item class="q-mb-sm">
                            <q-item-section avatar>
                                <q-avatar>
                                    <img :src="formatPhoto(authStore.user?.profile?.photos.photo)">
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label caption class="text-uppercase text-bold">{{ formatName(authStore.user?.profile) }}</q-item-label>
                                <q-item-label caption lines="1">{{ authStore.user.username }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <div v-if="miniState" class="text-center">
                    <q-avatar class="q-mb-sm">
                        <img :src="formatPhoto(authStore.user?.profile?.photos.photo)">
                    </q-avatar>
                </div>
            </div>

            <div class="absolute" style="top: 30px; right: -17px">
                <q-btn dense round unelevated color="primary" style="border: 6px solid #f2f2f7" :icon="miniState ? 'chevron_right' : 'chevron_left'" @click="miniState = !miniState"/>
            </div>
        </q-drawer>

        <q-page-container>
            
            <div class="q-mx-lg q-mt-lg">
                <router-view />
            </div>
                
        </q-page-container>

        <q-dialog v-model="meDialog" full-height position="right" square class="profile-dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <q-avatar>
                        <img :src="authStore.user?.profile?.photos.photo">
                    </q-avatar>
                </q-card-section>
                <q-separator inset />
                
            </q-card>
        </q-dialog>
        
    </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useIndexStore } from 'src/stores/index-store';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
// import moment from 'moment';
import logo from 'src/assets/workforce-logo.png';
import homePrimary from 'src/assets/icons/home_primary.png';
import homeSecondary from 'src/assets/icons/home_secondary.png';
import recruitmentPrimary from 'src/assets/icons/recruitment_primary.png';
import recruitmentSecondary from 'src/assets/icons/recruitment_secondary.png';
import employeePrimary from 'src/assets/icons/employee_primary.png';
import employeeSecondary from 'src/assets/icons/employee_secondary.png';
import leavePrimary from 'src/assets/icons/leave_primary.png';
import leaveSecondary from 'src/assets/icons/leave_secondary.png';
import dtrPrimary from 'src/assets/icons/dtr_primary.png';
import dtrSecondary from 'src/assets/icons/dtr_secondary.png';
import performancePrimary from 'src/assets/icons/performance_primary.png';
import performanceSecondary from 'src/assets/icons/performance_secondary.png';
import trainingPrimary from 'src/assets/icons/training_primary.png';
import trainingSecondary from 'src/assets/icons/training_secondary.png';
import disciplinaryPrimary from 'src/assets/icons/disciplinary_primary.png';
import disciplinarySecondary from 'src/assets/icons/disciplinary_secondary.png';
import exitPrimary from 'src/assets/icons/exit_primary.png';
import exitSecondary from 'src/assets/icons/exit_secondary.png';
import payrollPrimary from 'src/assets/icons/payroll_primary.png';
import payrollSecondary from 'src/assets/icons/payroll_secondary.png';
import preferencePrimary from 'src/assets/icons/preference_primary.png';
import preferenceSecondary from 'src/assets/icons/preference_secondary.png';
import notificationPrimary from 'src/assets/icons/notification_primary.png';
import notificationSecondary from 'src/assets/icons/notification_secondary.png';
import messagePrimary from 'src/assets/icons/message_primary.png';
import messageSecondary from 'src/assets/icons/message_secondary.png';
import logoutPrimary from 'src/assets/icons/logout_primary.png';
import logoutSecondary from 'src/assets/icons/logout_secondary.png';
import account from 'src/assets/icons/account.png';

const indexStore = useIndexStore();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
// const socketStore = useSocketStore();

// const baseURL = process.env.VUE_APP_BACKEND_URL;

// const leftDrawerOpen = ref(false)

// function toggleLeftDrawer () {
//     leftDrawerOpen.value = !leftDrawerOpen.value
// }

// // const isOnline = computed(() => socketStore.isOnline(authStore.id));

// const formatDate = (timestamp) => {
//     return moment(timestamp).fromNow();
// };

// const readNotification = () => {
//     authStore.readNotification();
// }

// onMounted(() => {
//     console.log(process.env.VUE_APP_BACKEND_URL);
// });

const drawer = ref(true)
const miniState = ref(true)

const formatName = (profile) => {
    if (!profile) return '';
    const firstname = profile.firstname || '';
    const middlename = profile.middlename
        ? profile.middlename.charAt(0).toUpperCase() + '.'
        : '';
    const lastname = profile.lastname || '';
    const suffix = profile.suffix ? ` ${profile.suffix}` : '';
    return `${firstname} ${middlename} ${lastname}${suffix}`.trim();
}

const meDialog = ref(false);


function drawerClick(e) {
    if (miniState.value) {
        miniState.value = false
        e.stopPropagation()
    }
}

const menuItems = [
    { iconPrimary: homePrimary, iconSecondary: homeSecondary, label: 'home', to: '/home' },
    { iconPrimary: recruitmentPrimary, iconSecondary: recruitmentSecondary, label: 'recruitment', to: '/recruitment'},
    { iconPrimary: employeePrimary, iconSecondary: employeeSecondary, label: 'employee', to: '/employee' },
    { iconPrimary: leavePrimary, iconSecondary: leaveSecondary, label: 'leave', to: '/leave' },
    { iconPrimary: dtrPrimary, iconSecondary: dtrSecondary, label: 'dtr', to: '/dtr' },
    { iconPrimary: performancePrimary, iconSecondary: performanceSecondary, label: 'performance', to: '/performance' },
    { iconPrimary: trainingPrimary, iconSecondary: trainingSecondary, label: 'training', to: '/training' },
    { iconPrimary: disciplinaryPrimary, iconSecondary: disciplinarySecondary, label: 'disciplinary', to: '/disciplinary' },
    { iconPrimary: exitPrimary, iconSecondary: exitSecondary, label: 'separation', to: '/separation' },
    { iconPrimary: payrollPrimary, iconSecondary: payrollSecondary, label: 'payroll', to: '/payroll' },
    { iconPrimary: preferencePrimary, iconSecondary: preferenceSecondary, label: 'preferences', to: '/preferences' }
]

const isActive = (label) => route.name?.toLowerCase() === label.toLowerCase();

const formatPhoto = (photo) => {
    return `${process.env.VUE_APP_BACKEND_URL}${photo}`
}

</script>
