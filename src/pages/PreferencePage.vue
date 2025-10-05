<template>
    <div>
        <q-card class="no-shadow radius-xs">
            <q-card-section>
                <div class="tabs-container" ref="tabsContainer">
                    <div v-for="tab in tabs" :key="tab.name" class="tab-wrapper">
                        <q-btn size="sm" unelevated class="tab" :class="{ active: activeTab === tab.name }" @click="tab.subTabs ? toggleDropdown(tab.name) : selectTab(tab.name)">
                            {{ activeTab === tab.name && activeSubTab ? `${activeSubTab}` : tab.name }}
                        </q-btn>
                        <transition name="fade">
                            <div v-if="tab.subTabs && dropdownOpen === tab.name" class="dropdown">
                                <div class="text-center text-uppercase text-bold">{{ tab.name }}</div>
                                <q-separator class="q-mt-xs q-mb-xs" />
                                <q-btn unelevated size="sm" v-for="sub in tab.subTabs" :key="sub" class="sub-tab q-mb-xs" :class="{ active: activeSubTab === sub }" @click="selectTab(tab.name, sub)">
                                    {{ sub }}
                                </q-btn>
                            </div>
                        </transition>
                    </div>
                </div>
            </q-card-section>
        </q-card>
        <div class="q-mt-md">
            <component :is="components[PreferenceStore.component]" :key="PreferenceStore.component" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';
import { usePreferenceStore } from '../stores/preference-store';

import UserComponent from 'src/components/Preferences/UserComponent.vue';
import EmployeeSexComponent from 'src/components/Preferences/EmployeeSexComponent.vue';
import EmployeeRelationshipComponent from 'src/components/Preferences/EmployeeRelationshipComponent.vue';
import EmployeeBloodTypeComponent from 'src/components/Preferences/EmployeeBloodTypeComponent.vue';
import EmployeeMaritalStatusComponent from 'src/components/Preferences/EmployeeMaritalStatusComponent.vue';
import EmploymentDepartmentComponent from 'src/components/Preferences/EmploymentDepartmentComponent.vue';
import EmploymentEmploymentStatusComponent from 'src/components/Preferences/EmploymentEmploymentStatusComponent.vue';
import EmploymentAppointmentStatusComponent from 'src/components/Preferences/EmploymentAppointmentStatusComponent.vue';
import PayrollTaxCodeComponent from 'src/components/Preferences/PayrollTaxCodeComponent.vue';
import EmploymentLeaveComponent from 'src/components/Preferences/EmploymentLeaveComponent.vue';
import EmploymentGovernmentAgencyComponent from 'src/components/Preferences/EmploymentGovernmentAgencyComponent.vue';
import EmploymentCompanyComponent from 'src/components/Preferences/EmploymentCompanyComponent.vue';
import EducationSchoolComponent from 'src/components/Preferences/EducationSchoolComponent.vue';
import EducationSchoolLevelComponent from 'src/components/Preferences/EducationSchoolLevelComponent.vue';
import EducationCourseComponent from 'src/components/Preferences/EducationCourseComponent.vue';
import PlantillaPositionComponent from 'src/components/Preferences/PlantillaPositionComponent.vue';
import PlantillaIncrementComponent from 'src/components/Preferences/PlantillaIncrementComponent.vue';
import PlantillaRateComponent from 'src/components/Preferences/PlantillaRateComponent.vue';
import PlantillaSalaryGradeComponent from 'src/components/Preferences/PlantillaSalaryGradeComponent.vue';
import PlantillaSalaryClassComponent from 'src/components/Preferences/PlantillaSalaryClassComponent.vue';
import ScheduleClassComponent from 'src/components/Preferences/ScheduleClassComponent.vue';
import ScheduleShiftComponent from 'src/components/Preferences/ScheduleShiftComponent.vue';
import ScheduleHolidayComponent from 'src/components/Preferences/ScheduleHolidayComponent.vue';
import AddressRegionComponent from 'src/components/Preferences/AddressRegionComponent.vue';
import AddressProvinceComponent from 'src/components/Preferences/AddressProvinceComponent.vue';
import AddressTownComponent from 'src/components/Preferences/AddressTownComponent.vue';
import AddressBarangayComponent from 'src/components/Preferences/AddressBarangayComponent.vue';
import IncidentClassComponent from 'src/components/Preferences/IncidentClassComponent.vue';
import IncidentRoleComponent from 'src/components/Preferences/IncidentRoleComponent.vue';
import PayrollTaxBracketComponent from 'src/components/Preferences/PayrollTaxBracketComponent.vue';
import PayrollTaxDeductionComponent from 'src/components/Preferences/PayrollTaxDeductionComponent.vue';
import SchedulePremiumPayComponent from 'src/components/Preferences/SchedulePremiumPayComponent.vue';
import SignatoryTypeComponent from 'src/components/Preferences/SignatoryTypeComponent.vue';
import SignatoryProfileComponent from 'src/components/Preferences/SignatoryProfileComponent.vue';

const PreferenceStore = usePreferenceStore();

const components = {
    UserComponent,
    EmployeeSexComponent,
    EmployeeRelationshipComponent,
    EmployeeBloodTypeComponent,
    EmployeeMaritalStatusComponent,
    EmploymentDepartmentComponent,
    EmploymentEmploymentStatusComponent,
    EmploymentAppointmentStatusComponent,
    EmploymentCompanyComponent,
    PayrollTaxCodeComponent,
    PayrollTaxBracketComponent,
    PayrollTaxDeductionComponent,
    SchedulePremiumPayComponent,
    EmploymentLeaveComponent,
    EmploymentGovernmentAgencyComponent,
    EducationSchoolComponent,
    EducationSchoolLevelComponent,
    EducationCourseComponent,
    PlantillaPositionComponent,
    PlantillaIncrementComponent,
    PlantillaRateComponent,
    PlantillaSalaryGradeComponent,
    PlantillaSalaryClassComponent,
    ScheduleClassComponent,
    ScheduleShiftComponent,
    ScheduleHolidayComponent,
    AddressRegionComponent,
    AddressProvinceComponent,
    AddressTownComponent,
    AddressBarangayComponent,
    IncidentClassComponent,
    IncidentRoleComponent,
    SignatoryTypeComponent,
    SignatoryProfileComponent
};

const tabs = [
    { 
        name: 'User' 
    },
    { 
        name: 'Signatory', 
        subTabs: 
        [
            'Type', 
            'Profile'
        ] 
    },
    { 
        name: 'Employee', 
        subTabs: 
        [
            'Sex', 
            'Relationship', 
            'Blood Type', 
            'Marital Status'
        ] 
    },
    { 
        name: 'Education', 
        subTabs: 
        [
            'School', 
            'School Level', 
            'Course'
        ] 
    },
    { 
        name: 'Incident', 
        subTabs: 
        [
            'Class', 
            'Role'
        ] 
    },
    { 
        name: 'Employment', 
        subTabs: 
        [
            'Department', 
            'Employment Status', 
            'Appointment Status',
            'Leave',
            'Government Agency',
            'Company'
        ] 
    },
    { 
        name: 'Schedule', 
        subTabs: 
        [
            'Class', 
            'Shift', 
            'Premium Pay',
            'Holiday'
        ] 
    },
    { 
        name: 'Plantilla', 
        subTabs: 
        [
            'Increment', 
            'Salary Class', 
            'Salary Grade', 
            'Rate', 
            'Position'
        ] 
    },
    { 
        name: 'Payroll', 
        subTabs: 
        [
            'Tax Code',
            'Tax Bracket',
            'Tax Deduction'
        ] 
    },
];

const activeTab = ref('');
const activeSubTab = ref('');
const dropdownOpen = ref(null);
const tabsContainer = ref(null);

function selectTab(tabName, subTab = '') {
    activeTab.value = tabName;
    activeSubTab.value = subTab;
    dropdownOpen.value = null;
    
    const cleanTab = tabName.replace(/\s+/g, '');
    const cleanSub = subTab.replace(/\s+/g, '');
    PreferenceStore.component = subTab ? `${cleanTab}${cleanSub}Component` : `${cleanTab}Component`;
}

function toggleDropdown(tabName) {
    dropdownOpen.value = dropdownOpen.value === tabName ? null : tabName;
}

// Close dropdown if click outside
function handleClickOutside(event) {
    if (tabsContainer.value && !tabsContainer.value.contains(event.target)) {
        dropdownOpen.value = null;
    }
}

onBeforeMount(() => {
    if (!PreferenceStore.component) {
        // default
        PreferenceStore.component = 'UserComponent';
        activeTab.value = 'User';
    } else {
        // restore previous
        const match = PreferenceStore.component.match(/([A-Z][a-z]+)/g) || [];

        if (match.length) {
            const tabName = match[0];
            const subTabName = match.slice(1, -1).join(' ');

            activeTab.value = tabName;
            activeSubTab.value = subTabName || '';
        }
    }
})

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.tabs-container {
    display: flex;
    flex-wrap: wrap;
    gap: .2rem;
}

.tab-wrapper {
    position: relative;
}

.tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
}

.tab.active {
    background: #FA6724;
    color: white;
    border-color: #FA6724;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.25);
}

.arrow {
  font-size: 0.7rem;
  margin-left: 0.5rem;
}

.dropdown {
    position: absolute;
    top: 110%;
    left: 0;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    background: white;
    min-width: 140px;
    z-index: 10;
    padding: 10px;
}

.sub-tab {
    font-weight: 500;
    transition: all 0.2s ease;
}

.sub-tab.active {
    background: #FA6724;
    color: white;
}

/* Dropdown animation */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
.fade-enter-to, .fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.content {
    font-size: 1rem;
    color: #333;
}
</style>