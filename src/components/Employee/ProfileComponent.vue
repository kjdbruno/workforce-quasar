<template>
    <div class="card-grid">
        <div class="card-anim-wrapper">
            <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="() => { EmployeeStore.component = 'EmployeeComponent'}" >
                <q-card-section class="text-center">
                    <q-avatar size="75px" font-size="52px" color="grey" text-color="white" icon="arrow_back" />
                </q-card-section>
            </q-card>
        </div>
        <div class="card-anim-wrapper">
            <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm bg-primary" v-ripple >
                <q-card-section class="text-center">
                    <q-avatar>
                        <img :src="formatPhoto(EmployeeStore.profile?.photos)">
                    </q-avatar>
                </q-card-section>
                <q-card-section class="text-center">
                    <div class="text-body1 text-uppercase text-white">{{ formatName(EmployeeStore.profile.profile) }}</div>
                </q-card-section>
                <q-card-section class="text-center">
                    <div class="text-caption text-uppercase text-white">{{ EmployeeStore.profile.employeeNo }}</div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive } from 'vue';
import { api } from 'src/boot/axios';
import { Toast } from 'src/boot/sweetalert'; 

import { useEmployeeStore } from 'src/stores/employee-store';
const EmployeeStore = useEmployeeStore();

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

const formatPhoto = (photo) => {
    return `${process.env.VUE_APP_BACKEND_URL}${photo}`
}

</script>