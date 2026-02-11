<template>
    <q-layout view="lHh Lpr lFf">

        <q-header class="bg-white no-shadow q-mx-lg q-mt-md q-py-sm radius-xs" v-if="authStore.isAuthenticated && router.currentRoute.value.name != 'login'">
            <q-toolbar class="header">

                <q-btn flat round dense icon="menu" class="text-grey" @click="drawerClick"/>

                <q-toolbar-title class="text-grey text-uppercase">
                    {{ route.name }}
                </q-toolbar-title>

                <div class="q-gutter-sm">
                    <q-btn flat round dense class="text-white">
                        <q-icon name="bi-chat-square" color="secondary" />
                        <q-badge color="red" floating>2</q-badge>
                    </q-btn>

                    <q-btn flat round dense class="text-white">
                        <q-icon name="bi-bell" color="secondary" />
                        <q-badge color="red" floating>2</q-badge>
                    </q-btn>

                    <q-btn flat round dense class="text-white" @click="meDialog = !meDialog">
                        <q-icon name="bi-person" color="secondary" />
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
                            <img src="~assets/ccmi-logo.png">
                        </q-avatar>
                    </div>
                    <div v-if="!miniState" class="q-pl-xl q-pr-xl">
                        <img src="~assets/logo.png" width="100%" height="auto">
                    </div>
                </div>
            </div>

            <q-scroll-area v-if="!miniState" class="fit q-pl-lg q-pr-lg" :horizontal-thumb-style="{ opacity: 0 }">
                <q-list padding>

                    <q-item clickable v-ripple class="q-pa-md q-pb-sm radius-xl" v-for="item in filteredMenuItems" :key="item.label" @click="router.push(item.to)">
                        <q-item-section avatar>
                            <!-- <img :src="isActive(item.label) ? item.iconPrimary : item.iconSecondary" width="20"> -->
                            <q-icon :name="item.icon" :color="isActive(item.label) ? 'primary' : 'secondary'" />
                        </q-item-section>
                        <q-item-section class="text-uppercase text-caption" :class="isActive(item.label) ? 'text-primary' : 'text-secondary'">
                            {{ item.label }}
                        </q-item-section>
                    </q-item>

                </q-list>
            </q-scroll-area>

            <q-scroll-area v-if="miniState" class="fit" :horizontal-thumb-style="{ opacity: 0 }">
                
                <div class="text-center">
                    <div v-for="item in filteredMenuItems" :key="item.label" class="q-pa-sm q-pb-sm">
                        <q-btn flat round @click="router.push(item.to)">
                            <!-- <q-avatar size="sm">
                                <img :src="isActive(item.label) ? item.iconPrimary : item.iconSecondary" width="20">
                            </q-avatar> -->
                            <q-icon :name="item.icon" :color="isActive(item.label) ? 'primary' : 'secondary'" />
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
                                    <img :src="formatPhoto(authStore.user?.avatar)">
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label caption class="text-uppercase text-bold">{{ authStore.user?.name }}</q-item-label>
                                <q-item-label caption lines="1">{{ authStore.user.username }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <div v-if="miniState" class="text-center">
                    <q-avatar class="q-mb-sm">
                        <img :src="formatPhoto(authStore.user?.avatar)">
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

        <q-dialog v-model="meDialog" full-height position="right" square class="dialog profile-dialog">
            <q-card key="data-add" class="card card-profile no-shadow radius-sm q-mb-sm q-pb-lg">
                <div class="cover-photo">
                    <img :src="randomCover" alt="Cover"/>
                </div>
                <q-card-section class="text-center profile-section">
                    <img :src="formatPhoto(authStore.user?.avatar)" alt="Profile" class="profile-img" />
                </q-card-section>
                <q-card-section class="text-center q-pt-sm">
                    <div class="text-caption text-uppercase text-white">{{ authStore.employees[0].employee?.employment?.employee_no }}</div>
                    <div class="text-h5 text-uppercase text-bold text-white">{{ formatName(authStore.employees[0].employee) }}</div>
                    <div class="text-body1 text-uppercase text-white">{{ authStore.employees[0].employee?.employment?.position?.name }}</div>
                    <div class="text-caption text-uppercase text-white">{{ authStore.employees[0].employee?.employment?.employment_status }}</div>
                </q-card-section>
                <q-card-section class="text-center">
                    <div class="text-caption text-uppercase text-white">email address</div>
                    <div class="text-body1 text-bold text-white">{{ authStore.employees[0].employee?.email }}</div>
                </q-card-section>
                <q-card-section class="text-center">
                    <div class="text-caption text-uppercase text-white">contact number</div>
                    <div class="text-body1 text-bold text-white">{{ authStore.employees[0].employee?.contact_number }}</div>
                </q-card-section>
                <q-card-section class="text-center">
                    <div class="text-caption text-uppercase text-white">adderss</div>
                    <div class="text-body1 text-capitalize text-bold text-white">{{ authStore.employees[0].employee?.address }}</div>
                </q-card-section>
                <q-card-section class="text-center">
                    <q-btn unelevated size="sm" label="sign out" text-color="primary" color="white" @click="() => { authStore.logout() }"/>
                </q-card-section>
            </q-card>
        </q-dialog>
        
    </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
// import moment from 'moment';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const drawer = ref(true)
const miniState = ref(true)

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

const meDialog = ref(false);


function drawerClick(e) {
    if (miniState.value) {
        miniState.value = false
        e.stopPropagation()
    }
}

const menuItems = [
    { icon: 'bi-house', label: 'home', to: '/home', roles: ['SuperAdmin', 'Admin', 'Management', 'HR', 'Finance'] },
    { icon: 'bi-search', label: 'recruitment', to: '/recruitment', roles: ['SuperAdmin', 'Management', 'Admin', 'HR'] },
    { icon: 'bi-person', label: 'employee', to: '/employee', roles: ['SuperAdmin', 'Admin', 'Management', 'HR']  },
    { icon: 'bi-heart', label: 'leave', to: '/leave', roles: ['SuperAdmin', 'Admin', 'Management', 'HR']  },
    { icon: 'bi-alarm', label: 'dtr', to: '/dtr', roles: ['SuperAdmin', 'Admin', 'Management', 'HR'] },
    { icon: 'bi-hourglass', label: 'overtime', to: '/overtime', roles: ['SuperAdmin', 'Admin', 'Management', 'HR'] },
    { icon: 'bi-speedometer2', label: 'performance', to: '/performance', roles: ['SuperAdmin', 'Admin', 'Management', 'HR'] },
    { icon: 'bi-shield', label: 'disciplinary', to: '/disciplinary', roles: ['SuperAdmin', 'Admin', 'Management', 'HR'] },
    { icon: 'bi-escape', label: 'separation', to: '/separation', roles: ['SuperAdmin', 'Admin', 'Management', 'HR'] },
    { icon: 'bi-wallet', label: 'payroll', to: '/payroll', roles: ['SuperAdmin', 'Admin', 'Management', 'HR', 'Finance'] },
    { icon: 'bi-gear', label: 'preferences', to: '/preferences', roles: ['SuperAdmin', 'Admin', 'Management', 'HR', 'Finance'] }
]

const isActive = (label) => route.name?.toLowerCase() === label.toLowerCase();

const formatPhoto = (avatar) => {
    return `${process.env.VUE_APP_BACKEND_URL}${avatar}`
}

const userRole = computed(() => String(authStore.user?.role || '').trim())

const filteredMenuItems = computed(() => {
  const role = userRole.value
  if (!role) return []
  return menuItems.filter(i => !i.roles || i.roles.includes(role))
})

onMounted(() => {
    console.log()
})

const TOTAL_COVERS = 25;

const randomCover = ref('');

onBeforeMount(() => {
    const randomNumber = Math.floor(Math.random() * TOTAL_COVERS) + 1;

    randomCover.value = new URL(
        `../assets/cover/${randomNumber}.jpg`,
        import.meta.url
    ).href;
})

</script>

<style lang="css" scoped>
    .profile-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 5px solid #ffffff;
        background: #ffffff;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    }
    .card-profile {
        overflow: hidden;
        background: linear-gradient(
  135deg,
  #c94a4a 0%,
  #a91f1f 65%,
  #900201 100%
);
    }

    /* COVER PHOTO */
    .cover-photo {
        height: 175px;
        width: 100%;
        position: relative;
    }

    .cover-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    }

    /* Optional dark overlay for readability */
    .cover-photo::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.55)
    );
    }

    /* PROFILE IMAGE SECTION */
    .profile-section {
    margin-top: -80px; /* pulls image over cover */
    }

    /* PROFILE IMAGE */
    .profile-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 5px solid #ffffff;
        background: #ffffff;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    }
</style>