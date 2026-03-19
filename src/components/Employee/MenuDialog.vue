<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card">
            <q-card-section class="col q-pa-none">
                <div class="profile-page">
                    <!-- Top Cover -->
                    <div class="profile-cover">
                        <img :src="randomCover" alt="Cover" />
                        <div class="cover-back-btn">
                        <q-btn
                            round
                            size="sm"
                            icon="bi-arrow-left"
                            color="white"
                            text-color="primary"
                            @click="() => { emit('update:modelValue', null) }"
                        />
                        </div>
                    </div>
                    <!-- Main Content -->
                    <div class="profile-content">
                        <!-- Left Panel -->
                        <div class="profile-sidebar radius-md">
                            <!-- Avatar -->
                            <div class="profile-avatar-wrap">
                                <img :src="employee?.photo" alt="Profile" class="profile-avatar" />
                            </div>
                            <!-- Basic Info -->
                            <div class="profile-basic text-center">
                                <div class="text-h5 text-weight-bold text-capitalize">{{ formatName(employee) }}</div>
                                <div class="text-subtitle1 text-grey-7 text-uppercase q-mt-sm">{{ employee?.employment?.position?.name }}</div>
                                <div class="text-caption text-grey-7 q-mt-xs">{{ employee?.email }}</div>
                                <div class="text-caption text-grey-7">{{ employee?.contact_number }}</div>
                                <div class="text-caption text-grey-7 text-capitalize q-mt-xs">{{ employee?.address }}</div>
                                <div class="text-caption text-grey-6 text-uppercase q-mt-sm">Employee No: {{ employee?.employment?.employee_no }}</div>
                                <div class="text-caption text-grey-6 text-uppercase">{{ employee?.employment?.employment_status }}</div>
                            </div>

                            <!-- Stats -->
                            <div class="profile-stats row text-center q-col-gutter-md q-mt-lg">
                                <div class="col">
                                    <div class="text-h6 text-weight-bold">12</div>
                                    <div class="text-caption text-grey-7">Documents</div>
                                </div>
                                <div class="col">
                                    <div class="text-h6 text-weight-bold">8</div>
                                    <div class="text-caption text-grey-7">Trainings</div>
                                </div>
                                <div class="col">
                                    <div class="text-h6 text-weight-bold">5</div>
                                    <div class="text-caption text-grey-7">Records</div>
                                </div>
                            </div>
                            <div class="q-mt-lg text-center">
                                <q-btn
                                    unelevated
                                    color="primary"
                                    text-color="white"
                                    label="Print Employee Data"
                                />
                            </div>
                        </div>
                        <!-- Right Panel -->
                        <div class="profile-main scroll">
                            <div class="card-grid">
                                <div v-for="(data, index) in tabs" :key="`data-${data.id}`" class="inner-card-anim-wrapper">
                                    <q-card @click="openDialog(data.dialog)" class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm">
                                        <q-card-section class="text-center">
                                            <div class="text-body2 text-grey text-uppercase">{{ data.label }}</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                    </div>

                    <profile-dialog v-model="activeDialog" dialog-name="ProfileDialog" @saved="GetEmployee" />
                    <employment-dialog v-model="activeDialog" dialog-name="EmploymentDialog" @saved="GetEmployee" />
                    <service-dialog v-model="activeDialog" dialog-name="ServiceDialog" />
                    <biometric-dialog v-model="activeDialog" dialog-name="BiometricDialog" />
                    <photo-dialog v-model="activeDialog" dialog-name="PhotoDialog" @saved="GetEmployee" />
                    <education-dialog v-model="activeDialog" dialog-name="EducationDialog" />
                    <training-dialog v-model="activeDialog" dialog-name="TrainingDialog" />
                    <experience-dialog v-model="activeDialog" dialog-name="ExperienceDialog" />
                    <dependent-dialog v-model="activeDialog" dialog-name="DependentDialog" />
                    <document-dialog v-model="activeDialog" dialog-name="DocumentDialog" />
                    <identification-dialog v-model="activeDialog" dialog-name="IdentificationDialog" />
                    <attendance-dialog v-model="activeDialog" dialog-name="AttendanceDialog" />
                    <leave-dialog v-model="activeDialog" dialog-name="LeaveDialog" />
                    <performance-dialog v-model="activeDialog" dialog-name="PerformanceDialog" />
                    <incident-dialog v-model="activeDialog" dialog-name="IncidentDialog" />
                    <payslip-dialog v-model="activeDialog" dialog-name="PayslipDialog" />
                    <overtime-dialog v-model="activeDialog" dialog-name="OvertimeDialog" />
                    <salary-dialog v-model="activeDialog" dialog-name="SalaryDialog" />
                    <account-dialog v-model="activeDialog" dialog-name="AccountDialog" />
                    <signature-dialog v-model="activeDialog" dialog-name="SignatureDialog" />
                    <shift-dialog v-model="activeDialog" dialog-name="ShiftDialog" />
                </div>
                <!-- <div class="profile-component">
                    <div class="row q-col-gutter-md">
                        <div class="col-3">
                            <q-card key="data-add" class="card card-profile no-shadow radius-sm q-mb-sm q-pb-lg">
                                <div class="cover-photo">
                                    <img :src="randomCover" alt="Cover"/>
                                </div>
                                <q-card-section class="text-center profile-section">
                                    <img :src="(employee?.photo)" alt="Profile" class="profile-img" />
                                </q-card-section>
                                <q-card-section class="text-center q-pt-sm">
                                    <div class="text-caption text-uppercase text-white">{{ employee?.employment?.employee_no }}</div>
                                    <div class="text-h5 text-uppercase text-bold text-white">{{ formatName(employee) }}</div>
                                    <div class="text-body1 text-uppercase text-white">{{ employee?.employment?.position?.name }}</div>
                                    <div class="text-caption text-uppercase text-white">{{ employee?.employment?.employment_status }}</div>
                                </q-card-section>
                                <q-card-section class="text-center">
                                    <div class="text-caption text-uppercase text-white">email address</div>
                                    <div class="text-body1 text-bold text-white">{{ employee?.email }}</div>
                                </q-card-section>
                                <q-card-section class="text-center">
                                    <div class="text-caption text-uppercase text-white">contact number</div>
                                    <div class="text-body1 text-bold text-white">{{ employee?.contact_number }}</div>
                                </q-card-section>
                                <q-card-section class="text-center">
                                    <div class="text-caption text-uppercase text-white">adderss</div>
                                    <div class="text-body1 text-capitalize text-bold text-white">{{ employee?.address }}</div>
                                </q-card-section>
                                <q-card-section class="text-center">
                                    <q-btn unelevated size="sm" label="print employee data" text-color="primary" color="white" />
                                </q-card-section>
                                <div class="absolute-top-left q-ma-sm">
                                    <q-btn round size="sm" icon="bi-arrow-left" text-color="primary" color="white" @click="() => { emit('update:modelValue', null); }"/>
                                </div>
                            </q-card>
                        </div>
                        <div class="col-9">
                            <div class="card-grid">
                                <div v-for="(data, index) in tabs" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 100}ms` }">
                                    <q-card @click="openDialog(data.dialog)" class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm">
                                        <q-card-section class="text-center">
                                            <div class="text-body2 text-grey text-uppercase">{{ data.label }}</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                    </div>
                    <profile-dialog v-model="activeDialog" dialog-name="ProfileDialog" @saved="GetEmployee"/>
                    <employment-dialog v-model="activeDialog" dialog-name="EmploymentDialog" @saved="GetEmployee"/>
                    <service-dialog v-model="activeDialog" dialog-name="ServiceDialog"/>
                    <biometric-dialog v-model="activeDialog" dialog-name="BiometricDialog"/>
                    <photo-dialog v-model="activeDialog" dialog-name="PhotoDialog" @saved="GetEmployee"/>
                    <education-dialog v-model="activeDialog" dialog-name="EducationDialog"/>
                    <training-dialog v-model="activeDialog" dialog-name="TrainingDialog"/>
                    <experience-dialog v-model="activeDialog" dialog-name="ExperienceDialog"/>
                    <dependent-dialog v-model="activeDialog" dialog-name="DependentDialog"/>
                    <document-dialog v-model="activeDialog" dialog-name="DocumentDialog"/>
                    <identification-dialog v-model="activeDialog" dialog-name="IdentificationDialog"/>
                    <attendance-dialog v-model="activeDialog" dialog-name="AttendanceDialog"/>
                    <leave-dialog v-model="activeDialog" dialog-name="LeaveDialog"/>
                    <performance-dialog v-model="activeDialog" dialog-name="PerformanceDialog"/>
                    <incident-dialog v-model="activeDialog" dialog-name="IncidentDialog"/>
                    <payslip-dialog v-model="activeDialog" dialog-name="PayslipDialog"/>
                    <overtime-dialog v-model="activeDialog" dialog-name="OvertimeDialog"/>
                    <salary-dialog v-model="activeDialog" dialog-name="SalaryDialog"/>
                    <account-dialog v-model="activeDialog" dialog-name="AccountDialog"/>
                    <signature-dialog v-model="activeDialog" dialog-name="SignatureDialog"/>
                    <shift-dialog v-model="activeDialog" dialog-name="ShiftDialog"/>
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
                </div> -->
            </q-card-section>
            <q-inner-loading :showing="loading" style="z-index: 2;">
                <q-card class="no-shadow radius-md q-pa-md">
                    <q-card-section class="text-center">
                        <div>
                            <q-spinner-ios color="dark"/>
                        </div>
                        <div class="text-dark text-uppercase text-caption">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 

import { useAuthStore } from 'src/stores/auth-store';
const AuthStore = useAuthStore();

import { useEmployeeStore } from 'src/stores/employee-store'
const EmployeeStore = useEmployeeStore();

const props = defineProps({
    modelValue: String,
    dialogName: String
})

const emit = defineEmits(['update:modelValue', 'saved'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => {
        if (!val) emit('update:modelValue', null)
    }
})

const SubmitLoading = ref(false)

import ProfileDialog from './ProfileDialog.vue';
import EmploymentDialog from './EmploymentDialog.vue';
import ServiceDialog from './ServiceDialog.vue';
import BiometricDialog from './BiometricDialog.vue';
import PhotoDialog from './PhotoDialog.vue';
import EducationDialog from './EducationDialog.vue';
import TrainingDialog from './TrainingDialog.vue';
import ExperienceDialog from './ExperienceDialog.vue';
import DependentDialog from './DependentDialog.vue';
import DocumentDialog from './DocumentDialog.vue';
import IdentificationDialog from './IdentificationDialog.vue';
import AttendanceDialog from './AttendanceDialog.vue';
import LeaveDialog from './LeaveDialog.vue';
import PerformanceDialog from './PerformanceDialog.vue';
import IncidentDialog from './IncidentDialog.vue';
import PayslipDialog from './PayslipDialog.vue';
import OvertimeDialog from './OvertimeDialog.vue';
import SalaryDialog from './SalaryDialog.vue';
import AccountDialog from './AccountDialog.vue';
import SignatureDialog from './SignatureDialog.vue';
import ShiftDialog from './ShiftDialog.vue';

const tabs = [
    { label: 'profile', dialog: 'ProfileDialog'},
    { label: 'employment', dialog: 'EmploymentDialog'},
    { label: 'salary', dialog: 'SalaryDialog'},
    { label: 'service recrod', dialog: 'ServiceDialog'},
    { label: 'photo', dialog: 'PhotoDialog'},
    { label: 'signature', dialog: 'SignatureDialog'},
    { label: 'face recognition', dialog: 'BiometricDialog'},
    { label: 'account', dialog: 'AccountDialog'},
    { label: 'shift', dialog: 'ShiftDialog'},
    // { label: 'id', dialog: 'IdentificationDialog'},
    { label: 'dtr', dialog: 'AttendanceDialog'},
    { label: 'leaves', dialog: 'LeaveDialog'},
    // { label: 'overtime', dialog: 'OvertimeDialog'},
    { label: 'education', dialog: 'EducationDialog'},
    { label: 'trainings', dialog: 'TrainingDialog'},
    { label: 'experiences', dialog: 'ExperienceDialog'},
    { label: 'dependents', dialog: 'DependentDialog'},
    { label: 'documents', dialog: 'DocumentDialog'},
    // { label: 'performance', dialog: 'PerformanceDialog'},
    // { label: 'incidents', dialog: 'IncidentDialog'},
    // { label: 'payslip', dialog: 'PayslipDialog'},
]

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

const FormatAvatar = (photo) => {
    const baseUrl = process.env.VUE_APP_BACKEND_URL
    const defaultAvatar = '/photos/Default.png'

    if (!photo) {
        return `${baseUrl}${defaultAvatar}`
    }

    return `${baseUrl}${photo}`
}


const activeDialog = ref(null)
const openDialog = (dialogName) => {
    activeDialog.value = dialogName
}

const loading = ref(false);
const employee = ref([]);

const GetEmployee = async () => {
    loading.value = true;
    try {
        const response = await api.get(`/employee/${EmployeeStore.data?.id}/information`);
        employee.value = response.data.record;

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

const PopulateData = async () => {
    GetEmployee();
}

const TOTAL_COVERS = 25;

const randomCover = ref('');

onBeforeMount(() => {
    const randomNumber = Math.floor(Math.random() * TOTAL_COVERS) + 1;

    randomCover.value = new URL(
        `../../assets/cover/${randomNumber}.jpg`,
        import.meta.url
    ).href;
})
</script>

<style lang="css" scoped>
.profile-page {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}

.profile-cover {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #ddd;
}

.profile-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 5;
}

.profile-content {
    max-width: 1400px;
    margin: 0 auto;
    margin-top: -70px;
    padding: 0 24px 32px;
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 32px;
    align-items: start;
}

.profile-sidebar {
    background: white;
    padding: 24px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    position: relative;
    height: 75vh;
}

.profile-avatar-wrap {
    display: flex;
    justify-content: center;
    margin-top: -90px;
    margin-bottom: 16px;
}

.profile-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid white;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
  background: #fff;
}

.profile-basic {
  margin-top: 8px;
}

.profile-stats {
  border-top: 1px solid #e9e9e9;
  padding-top: 18px;
}

.profile-main {
  background: white;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  z-index: 1;
  max-height: 75vh;
}
.card-menu
{
    width: 150px;
    height: 175px;
}

.q-inner-loading
{
    background-color: #fff;
}
</style>