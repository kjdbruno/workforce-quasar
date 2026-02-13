<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">new employee</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <transition name="fade-slide" mode="out-in">
                    <div :key="step">
                        <div v-if="step === 0">
                            <div class="q-mb-xl" v-if="applicants.length">
                                <div class="q-mb-sm">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">choose hired applicant</span>
                                </div>
                                <div class="card-grid">
                                    <div v-for="(data, index) in applicants" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" >
                                        <q-card class="card card-menu card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm q-mr-sm q-mb-sm" tag="label" :class="{ 'card--active': applicant === data }" @click="() => { applicant = data; Populate(data) }">
                                            <q-card-section class="text-center full-width">
                                                <div class="text-caption text-uppercase">{{ formatName(data) }}</div>
                                            </q-card-section>
                                            <div class="checkmark-overlay">
                                                <q-radio v-model="applicant" :val="data" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" size="xs"/>
                                            </div>
                                        </q-card>
                                    </div>
                                </div>
                            </div>
                            <div class="text-overline text-uppercase text-bold q-mb-md">personal information</div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-3">
                                    <div class="text-caption text-uppercase" :class="Errors.firstname.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.firstname.type ? Errors.firstname.msg : 'firstname' }}</div>
                                    <q-input 
                                        v-model="firstname" 
                                        label="Enter Firstname"
                                        outlined 
                                        :error="Errors.firstname.type"
                                        :no-error-icon="true"
                                        input-class="text-capitalize"
                                    />
                                </div>
                                <div class="col-3">
                                    <div class="text-caption text-uppercase" :class="Errors.middlename.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.middlename.type ? Errors.middlename.msg : 'middlename' }}</div>
                                    <q-input 
                                        v-model="middlename" 
                                        label="Enter Middlename"
                                        outlined 
                                        :error="Errors.middlename.type"
                                        :no-error-icon="true"
                                        input-class="text-capitalize"
                                    />
                                </div>
                                <div class="col-3">
                                    <div class="text-caption text-uppercase" :class="Errors.lastname.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.lastname.type ? Errors.lastname.msg : 'lastname' }}</div>
                                    <q-input 
                                        v-model="lastname"
                                        label="Enter Lastname" 
                                        outlined 
                                        :error="Errors.lastname.type"
                                        :no-error-icon="true"
                                        input-class="text-capitalize"
                                    />
                                </div>
                                <div class="col-1">
                                    <div class="text-caption text-uppercase" :class="Errors.suffix.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.suffix.type ? Errors.suffix.msg : 'suffix' }}</div>
                                    <q-input 
                                        v-model="suffix" 
                                        label="Enter Suffix"
                                        outlined 
                                        :error="Errors.suffix.type"
                                        :no-error-icon="true"
                                        input-class="text-capitalize"
                                    />
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.sex.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.sex.type ? Errors.sex.msg : 'sex' }}</div>
                                    <div class="q-gutter-sm">
                                        <q-radio v-for="value in sexes" v-model="sex" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="value" :label="value" />
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="text-caption text-uppercase" :class="Errors.civilstatus.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.civilstatus.type ? Errors.civilstatus.msg : 'civil status' }}</div>
                                    <div class="q-gutter-sm">
                                        <q-radio v-for="value in civilstatuses" v-model="civilstatus" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="value" :label="value" />
                                    </div>
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.birthdate.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.birthdate.type ? Errors.birthdate.msg : 'birthdate (YYYY-MM-DD)' }}</div>
                                    <q-input outlined v-model="birthdate" label="Enter Date" :error="Errors.birthdate.type" :no-error-icon="true">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                            <q-date v-model="birthdate" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                                <div class="col-4">
                                    <div class="text-caption text-uppercase" :class="Errors.birthplace.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.birthplace.type ? Errors.birthplace.msg : 'birthplace' }}</div>
                                    <q-input 
                                        v-model="birthplace" 
                                        label="Enter Birthplace"
                                        outlined 
                                        :error="Errors.birthplace.type"
                                        :no-error-icon="true"
                                        input-class="text-capitalize"
                                    />
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-6">
                                    <div class="text-caption text-uppercase" :class="Errors.address.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.address.type ? Errors.address.msg : 'address' }}</div>
                                    <div class="q-gutter-sm">
                                        <q-input 
                                            v-model="address" 
                                            label="Enter Address"
                                            outlined 
                                            :error="Errors.address.type"
                                            :no-error-icon="true"
                                            input-class="text-capitalize"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.email.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.email.type ? Errors.email.msg : 'email address' }}</div>
                                    <q-input 
                                        v-model="email" 
                                        label="Enter Email Address"
                                        outlined 
                                        :error="Errors.email.type"
                                        :no-error-icon="true"
                                    />
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.contactNo.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.contactNo.type ? Errors.contactNo.msg : 'contact number' }}</div>
                                    <q-input 
                                        v-model="contactNo"
                                        label="Enter Contact No." 
                                        outlined 
                                        :error="Errors.contactNo.type"
                                        :no-error-icon="true"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-else-if="step === 1">
                            <div class="text-overline text-uppercase text-bold q-mb-md">employment information</div>
                            <div v-if="!applicant" class="q-mb-md">
                                <div class="text-caption text-uppercase q-mb-sm" :class="Errors.positionId.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.positionId.type ? Errors.positionId.msg : 'position' }}</div>
                                <div class="card-grid">
                                    <div class="inner-card-anim-wrapper" :style="{ animationDelay: `100ms` }">
                                        <q-card class="card card-menu card-hover-animate q-pa-md no-shadow cursor-pointer radius-sm" v-if="!displayedPositions.length">
                                            <q-card-section class="text-center">
                                                <div class="text-caption text-dark text-uppercase">no record found</div>
                                            </q-card-section>
                                        </q-card>
                                    </div>
                                    <div v-for="(data, index) in displayedPositions" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 100}ms` }" v-if="displayedPositions.length">
                                        <q-card @click="() => { positionId = data.id }" class="card card-menu card-hover-animate q-pa-md no-shadow cursor-pointer radius-sm q-mr-sm q-mb-sm" :class="{ 'card--active': positionId === data.id }">
                                            <q-card-section class="text-center">
                                                <div class="text-caption text-dark text-uppercase">{{ data.label }}</div>
                                                <div class="text-caption text-grey text-uppercase">{{ formatCurrency(data?.amount) }}</div>
                                            </q-card-section>
                                            <div class="absolute-left">
                                                <q-radio v-model="positionId" :val="data.id" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" size="xs" />
                                            </div>
                                        </q-card>
                                    </div>
                                </div>
                            </div>
                            <div v-if="applicant" class="q-mb-md">
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">position</div>
                                    <div class="text-body1 text-uppercase">{{ applicant?.vacancy?.position?.name }}</div>
                                </div>
                                <div >
                                    <div class="text-caption text-uppercase text-grey">salary</div>
                                    <div class="text-body1 text-uppercase">{{ formatCurrency(applicant?.vacancy?.position?.salary_amount) }}</div>
                                </div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase" :class="Errors.employmentstatus.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.employmentstatus.type ? Errors.employmentstatus.msg : 'employment status' }}</div>
                                <div class="q-gutter-sm">
                                    <q-radio v-for="value in employmentstatuses" v-model="employmentstatus" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="value" :label="value" class="text-capitalize"/>
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.dateHired.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.dateHired.msg ? Errors.dateHired.msg : 'date hired (YYYY-MM-DD)' }}</div>
                                    <q-input outlined v-model="dateHired" label="Enter Date" :error="Errors.dateHired.type" :no-error-icon="true">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                            <q-date v-model="dateHired" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.employeeNo.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.employeeNo.msg ? Errors.employeeNo.msg : 'id number (YYYY-NNN)' }}</div>
                                    <q-input 
                                        v-model="employeeNo" 
                                        label="Enter ID No."
                                        mask="####-###"
                                        outlined 
                                        :error="Errors.employeeNo.type"
                                        :no-error-icon="true"
                                    />
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.departmentId.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.departmentId.msg ? Errors.departmentId.msg : 'department' }}</div>
                                    <q-select
                                        outlined
                                        v-model="departmentId"
                                        label="Choose Department"
                                        emit-value
                                        map-options
                                        use-input
                                        input-debounce="300"
                                        :options="filteredDepartments"
                                        @filter="filterDepartmentFn"
                                        :error="Errors.departmentId.type"
                                        dropdown-icon="keyboard_arrow_down"
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    >
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-italic text-grey">
                                                No options
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                        <template v-slot:option="scope">
                                            <q-item v-bind="scope.itemProps">
                                                <q-item-section>
                                                    <q-item-label>{{ $CapitalizeWords(scope.opt.label) }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.tin.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.tin.type ? Errors.tin.msg : 'TIN' }}</div>
                                    <q-input 
                                        v-model="tin" 
                                        label="Enter TIN"
                                        mask="###-###-###-###"
                                        outlined 
                                        :error="Errors.tin.type"
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    />
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.sssNo.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.sssNo.type ? Errors.sssNo.msg : 'SSS no' }}</div> 
                                    <q-input 
                                        v-model="sssNo" 
                                        label="Enter SSS No."
                                        mask="##-#######-#"
                                        outlined 
                                        :error="Errors.sssNo.type"
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    />
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.philhealthNo.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.philhealthNo.type ? Errors.philhealthNo.msg : 'Philhealth No.' }}</div>
                                    <q-input 
                                        v-model="philhealthNo"
                                        label="Enter Philhealth No."
                                        mask="##-#######-#" 
                                        outlined 
                                        :error="Errors.philhealthNo.type"
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    />
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.pagibigNo.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.pagibigNo.type ? Errors.pagibigNo.msg : 'pagibig no.' }}</div>
                                    <q-input 
                                        v-model="pagibigNo" 
                                        label="Enter Pagibig No."
                                        mask="####-####-####"
                                        outlined 
                                        :error="Errors.pagibigNo.type"
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-else-if="step === 2">
                            <div class="text-overline text-uppercase text-bold q-mb-md">salary schedule</div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase" :class="Errors.payrollgroup.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.payrollgroup.type ? Errors.payrollgroup.msg : 'payroll group' }}</div>
                                <div class="q-gutter-sm">
                                    <q-radio v-for="value in payrollgroups" v-model="payrollgroup" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="value" :label="value" class="text-capitalize"/>
                                </div>
                            </div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.salarygroup.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.salarygroup.type ? Errors.salarygroup.msg : 'salary group' }}</div>
                                    <q-select
                                        outlined
                                        v-model="salarygroup"
                                        label="Choose Salary Group"
                                        emit-value
                                        map-options
                                        use-input
                                        input-debounce="300"
                                        :options="salarygroups"
                                        :error="Errors.salarygroup.type"
                                        dropdown-icon="keyboard_arrow_down"
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    >
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-italic text-grey">
                                                No options
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                        <template v-slot:option="scope">
                                            <q-item v-bind="scope.itemProps">
                                                <q-item-section>
                                                    <q-item-label>{{ $CapitalizeWords(scope.opt.label) }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.taxstatus.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.taxstatus.type ? Errors.taxstatus.msg : 'tax status' }}</div>
                                    <q-select
                                        outlined
                                        v-model="taxstatus"
                                        label="Choose Tax Status"
                                        use-input
                                        input-debounce="300"
                                        :options="taxstatuses"
                                        :error="Errors.taxstatus.type"
                                        dropdown-icon="keyboard_arrow_down"
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    >
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-italic text-grey">
                                                No options
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                        <template v-slot:option="scope">
                                            <q-item v-bind="scope.itemProps">
                                                <q-item-section>
                                                    <q-item-label>{{ $CapitalizeWords(scope.opt) }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="step === 3">
                            <div class="text-overline text-uppercase text-bold q-mb-md">shift schedule</div>
                            <div class="row q-col-gutter-xs q-mb-md">
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.shiftId.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.shiftId.type ? Errors.shiftId.msg : 'shift' }}</div>
                                    <q-select
                                        outlined
                                        v-model="shiftId"
                                        label="Choose Shift"
                                        use-input
                                        emit-value
                                        map-options
                                        input-debounce="300"
                                        :options="filteredShifts"
                                        @filter="filterShiftFn"
                                        :error="Errors.shiftId.type"
                                        dropdown-icon="keyboard_arrow_down"
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    >
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-italic text-grey">
                                                No options
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                        <template v-slot:option="scope">
                                            <q-item v-bind="scope.itemProps">
                                                <q-item-section>
                                                    <q-item-label>{{ $CapitalizeWords(scope.opt.label) }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase" :class="Errors.effectiveFrom.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.effectiveFrom.type ? Errors.effectiveFrom.msg : 'effective from (YYYY-MM-DD)' }}</div>
                                    <q-input outlined v-model="effectiveFrom" label="Enter Date" :error="Errors.effectiveFrom.type" :no-error-icon="true">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                            <q-date v-model="effectiveFrom" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase text-grey">effective to (YYYY-MM-DD)</div>
                                    <q-input outlined v-model="effectiveTo" label="Enter Date" :no-error-icon="true">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="popup" class="no-shadow custom-border radius-sm">
                                            <q-date v-model="effectiveTo" mask="YYYY-MM-DD" @update:model-value="() => { popup.hide() }" />
                                        </q-popup-proxy>
                                    </q-input>
                                </div>
                                <div class="col-2">
                                    <div class="text-caption text-uppercase text-grey">notes</div>
                                    <q-input 
                                        v-model="notes" 
                                        label="Enter Notes"
                                        outlined 
                                        :no-error-icon="true"
                                        class="text-capitalize"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="row q-gutter-sm">
                    <q-btn v-if="step > 0" unelevated size="md" color="primary" class="btn text-capitalize" label="back"  @click="() => { PreviousStep(); }"/>
                    <q-btn v-if="step < totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="next"  @click="() => { NextStep(); }"/>
                    <q-btn v-if="step === totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="() => { Save() }" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" v-close-popup outline/>
                    <q-input v-if="step === 1 && !applicant" outlined dense debounce="1000" v-model="searchPosition" placeholder="Search...">
                        <template v-slot:prepend>
                            <q-icon name="search" style="font-size: 1rem;" />
                        </template>
                        <template v-slot:after>
                            <div class="text-caption text-uppercase text-grey">{{ displayCount }} of {{ totalCount }}</div>
                        </template>
                    </q-input>
                </div>
            </q-card-actions>
            <q-inner-loading :showing="SubmitLoading">
                <div class="text-center">
                    <q-spinner-puff size="md"/>
                    <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                </div>
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 
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

const SubmitLoading = ref(false);

const applicant = ref(null);
const firstname = ref('');
const middlename = ref('');
const lastname = ref('');
const suffix = ref('');
const sex = ref('');
const civilstatus = ref('');
const birthdate = ref(new Date().toISOString().split('T')[0]);
const birthplace = ref('');
const address = ref('');
const email = ref('');
const contactNo = ref('');

const employeeNo = ref('');
const dateHired = ref(new Date().toISOString().split('T')[0]);
const employmentstatus = ref('');
const departmentId = ref('');
const positionId = ref('');
const tin = ref('');
const sssNo = ref('');
const philhealthNo = ref('');
const pagibigNo = ref('');
const salarygroup = ref('');
const payrollgroup = ref('');
const taxstatus = ref('');

const shiftId = ref('');
const effectiveFrom = ref(new Date().toISOString().split('T')[0]);
const effectiveTo = ref('');
const notes = ref('');

const Errors = reactive({
    firstname: { type: null, msg: '' },
    middlename: { type: null, msg: '' },
    lastname: { type: null, msg: '' },
    suffix: { type: null, msg: '' },
    sex: { type: null, msg: '' },
    civilstatus: { type: null, msg: '' },
    birthdate: { type: null, msg: '' },
    birthplace: { type: null, msg: '' },
    address: { type: null, msg: '' },
    email: { type: null, msg: '' },
    contactNo: { type: null, msg: '' },

    employeeNo: { type: null, msg: '' },
    dateHired: { type: null, msg: '' },
    employmentstatus: { type: null, msg: '' },
    departmentId: { type: null, msg: '' },
    positionId: { type: null, msg: '' },
    tin: { type: null, msg: '' },
    sssNo: { type: null, msg: '' },
    philhealthNo: { type: null, msg: '' },
    pagibigNo: { type: null, msg: '' },

    salarygroup: { type: null, msg: '' },
    payrollgroup: { type: null, msg: '' },
    taxstatus: { type: null, msg: '' },
    
    shiftId: { type: null, msg: '' },
    effectiveFrom: { type: null, msg: '' }
});

const failToast = () =>
  Toast.fire({
    icon: "error",
    html: `
      <div class="text-h6 text-bold text-uppercase">Request Failed</div>
      <div class="text-caption">Something went wrong.</div>
    `
  })

const setErr = (key, msg = 'required') => (Errors[key].type = true, Errors[key].msg = msg, true)
const clearErr = (key) => (Errors[key].type = null, Errors[key].msg = '', false)

const req = (key, val) => (!val ? setErr(key, 'required') : clearErr(key))
const maxLen = (key, val, n, msg = 'invalid') => (val && String(val).length > n ? setErr(key, msg) : clearErr(key))
const match = (key, val, regex, msg = 'invalid') => (!val ? setErr(key, 'required') : (!regex.test(val) ? setErr(key, msg) : clearErr(key)))
const isAtLeast15YearsOld = (birthdate) => {
    if (!birthdate) return false;

    const today = new Date();
    const dob = new Date(birthdate);

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age >= 15;
};

const ValidateEmployee = () => {
    const allowedSuffixes = ['SR','JR','II','III','IV','V','VI','VII','VIII','IX','X']
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phMobileRegex = /^09\d{9}$/

    let isError = false

    isError ||= req('firstname', firstname.value)
    isError ||= req('middlename', middlename.value)
    isError ||= req('lastname', lastname.value)

    isError ||= (suffix.value && !allowedSuffixes.includes(suffix.value.trim().toUpperCase()))
        ? setErr('suffix', 'invalid')
        : clearErr('suffix')

    isError ||= req('sex', sex.value)
    isError ||= req('civilstatus', civilstatus.value)

    if (!birthdate.value) isError ||= setErr('birthdate', 'required')
    else if (!isAtLeast15YearsOld(birthdate.value))
    isError ||= setErr('birthdate', 'invalid')
    else clearErr('birthdate')

    isError ||= req('birthplace', birthplace.value)

    // email: required + format + max length
    if (!email.value) isError ||= setErr('email', 'required')
    else if (!emailRegex.test(email.value)) isError ||= setErr('email', 'invalid')
    else if (email.value.length > 100) isError ||= setErr('email', 'invalid')
    else clearErr('email')

    // PH mobile number
    if (!contactNo.value) isError ||= setErr('contactNo', 'required')
    else if (!phMobileRegex.test(contactNo.value)) isError ||= setErr('contactNo', 'invalid')
    else clearErr('contactNo')

    isError ||= req('address', address.value)

    if (isError) failToast()
    return !isError
}

const ValidateEmployment = () => {
  let isError = false

  isError ||= req('positionId', positionId.value)
  isError ||= req('employmentstatus', employmentstatus.value)
  isError ||= req('departmentId', departmentId.value)
  isError ||= req('dateHired', dateHired.value)

  isError ||= maxLen('tin', tin.value, 15, 'invalid')
  isError ||= maxLen('sssNo', sssNo.value, 15, 'invalid')
  isError ||= maxLen('philhealthNo', philhealthNo.value, 15, 'invalid')
  isError ||= maxLen('pagibigNo', pagibigNo.value, 15, 'invalid')

  if (isError) failToast()
  return !isError
}

const ValidateSalary = () => {
  let isError = false

  isError ||= req('payrollgroup', payrollgroup.value)
  isError ||= req('salarygroup', salarygroup.value)
  isError ||= req('taxstatus', taxstatus.value)

  if (isError) failToast()
  return !isError
}

const ValidateShift = () => {
  let isError = false

  isError ||= req('shiftId', shiftId.value)
  isError ||= req('effectiveFrom', effectiveFrom.value)

  if (isError) failToast()
  return !isError
}


const ResetForm = () => {
    /**Employee */
    applicant.value = null;
    firstname.value = '';
    middlename.value = '';
    lastname.value = '';
    suffix.value = '';
    sex.value = '';
    civilstatus.value = '';
    birthdate.value = new Date().toISOString().split('T')[0];
    birthplace.value = '';
    address.value = '';
    email.value = '';
    contactNo.value = '';
    /**Employment */
    employeeNo.value = '';
    dateHired.value = new Date().toISOString().split('T')[0]; // today
    employmentstatus.value = '';
    departmentId.value = '';
    positionId.value = '';
    tin.value = '';
    sssNo.value = '';
    philhealthNo.value = '';
    pagibigNo.value = '';
    /**Salary */
    salarygroup.value = '';
    payrollgroup.value = '';
    taxstatus.value = '';
    /**Shift */
    shiftId.value = '';
    effectiveFrom.value = new Date().toISOString().split('T')[0];
    effectiveTo.value = '';
    notes.value = '';
}

const ResetAllErrors = () => {
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].msg = '';
    });
}

const applicants = ref([]);
const sexes = ref(["Male","Female"]);
const civilstatuses = ref(["Single","Married","Widowed","Divorced","Separated"]);
const employmentstatuses = ref(["Regular","Probationary","Contractual","Temporary","Intern"]);
const positions = ref([]);
const departments = ref([]);
const shifts = ref([]);
const salarygroups = ref([
    { value: "HIRE", label: "Hiring Rate" },
    { value: "PROMO", label: "Promotion Increase" },
    { value: "MERIT", label: "Merit Increase" },
    { value: "ANNUAL", label: "Annual Increase" },
    { value: "COLA", label: "Cost of Living Allowance" },
    { value: "PROB", label: "Probationary Increase" },
    { value: "ADJUST", label: "Salary Adjustment" },
    { value: "GOVT", label: "Government Mandated Increase" },
]);
const payrollgroups = ref(["Monthly", "Semi-Monthly", "Weekly"]);
const taxstatuses = ref(['S', 'ME', 'S1', 'S2', 'S3', 'S4', 'ME1', 'ME2', 'ME3', 'ME4', 'Z']);

const filteredDepartments = ref([]);
const filteredShifts = ref([]);

const createFilterFn = (sourceRef, targetRef) => {
    return (val, update) => {
        if (val === '') {
        update(() => { targetRef.value = sourceRef.value; });
            return;
        }
        update(() => {
            const needle = val.toLowerCase();
            targetRef.value = sourceRef.value.filter(v => v.label.toLowerCase().includes(needle));
        });
    };
};

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

const filterDepartmentFn = createFilterFn(departments, filteredDepartments);
const filterShiftFn = createFilterFn(shifts, filteredShifts);

const LoadApplicants = async () => {
    try {
        const response = await api.get(`/employee/option/applicant`);
        applicants.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadDepartments = async () => {
    try {
        const { data } = await api.get(`/employee/option/department`);
        departments.value = (data || []).map(d => {
            const baseLabel = d.label ?? d.name ?? String(d.text ?? d.value ?? '');
            return {
                label: baseLabel,
                value: Number(d.value ?? d.id)
            };
        });
        filteredDepartments.value = [...departments.value];
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadShifts = async () => {
    try {
        const { data } = await api.get(`/employee/option/shift`);
        shifts.value = (data || []).map(d => {
            const baseLabel = d.label ?? d.name ?? String(d.text ?? d.value ?? '');
            return {
                label: baseLabel,
                value: Number(d.value ?? d.id)
            };
        });
        filteredShifts.value = [...shifts.value];
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadPositions = async () => {
    try {
        const response = await api.get(`/employee/option/position`);
        positions.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const PopulateData = () => {
    LoadDepartments();
    LoadShifts();
    LoadPositions();
    LoadApplicants();
    ResetForm();
    ResetAllErrors();
    step.value = 0;
}

const Populate = (app) => {
    firstname.value = app.first_name;
    middlename.value = app.middle_name;
    lastname.value = app.last_name;
    suffix.value = app.suffix;
    sex.value = app.sex;
    civilstatus.value = app.civil_status;
    birthdate.value = app.birthdate;
    birthplace.value = app.birthplace;
    address.value = app.address;
    email.value = app.email;
    contactNo.value = app.contact_number;
    employmentstatus.value = app.vacancy.employment_status;
    departmentId.value = app.vacancy.department_id;
    positionId.value = app.vacancy.position_id;
    shiftId.value = app.vacancy.shift_id;
}

const Save = async () => {
    SubmitLoading.value = true;
    const applicantId = applicant.value?.id ?? null;
    try {
        const response = await api.post('/employee', {
            //employee
            applicantId,
            firstname: firstname.value,
            middlename: middlename.value,
            lastname: lastname.value,
            suffix: suffix.value,
            sex: sex.value,
            civilstatus: civilstatus.value,
            birthdate: birthdate.value,
            birthplace: birthplace.value,
            address: address.value,
            email: email.value,
            contactNo: contactNo.value,
            //employment
            employeeNo: employeeNo.value,
            dateHired: dateHired.value,
            tin: tin.value,
            sssNo: sssNo.value,
            philhealthNo: philhealthNo.value,
            pagibigNo: pagibigNo.value,
            positionId: positionId.value,
            departmentId: departmentId.value,
            employmentstatus: employmentstatus.value,
            //salary
            salarygroup: salarygroup.value,
            payrollgroup: payrollgroup.value,
            taxstatus: taxstatus.value,
            //shift
            shiftId: shiftId.value,
            effectiveFrom: effectiveFrom.value,
            effectiveTo: effectiveTo.value,
            notes: notes.value
        });
        emit('saved');
        emit('update:modelValue', null);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
    } catch (e) {
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
    } finally {
        SubmitLoading.value = false;
    }
};

const applyBackendErrors = (backendErrors) => {
    const errorsArray = Array.isArray(backendErrors)
        ? backendErrors
        : backendErrors?.errors || []
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null
        Errors[key].messages = []
    })
    errorsArray.forEach(err => {
        if (Errors[err.path] !== undefined) {
            Errors[err.path].type = true
            Errors[err.path].messages.push(err.msg)
        }
    })
}

const popup = ref(null);

const searchPosition = ref('')

const filteredPositions = computed(() => {
    const q = searchPosition.value.trim().toLowerCase()

    return positions.value
        .filter(p => p.status === 'Vacant') // ✅ only Vacant
        .filter(p =>
        !q || String(p.label || '').toLowerCase().includes(q)
        )
})

const displayedPositions = computed(() =>
  filteredPositions.value.slice(0, 5)
)

const displayCount = computed(() => displayedPositions.value.length)
const totalCount = computed(() => filteredPositions.value.length)

const step = ref(0)
const totalSteps = 4;

const validators = [
    ValidateEmployee,
    ValidateEmployment,
    ValidateSalary,
    ValidateShift
]

const NextStep = () => {
  const validate = validators[step.value];
  if (validate && !validate()) return;

  step.value++;
};

const PreviousStep = () => {
    if (step.value > 0) step.value--;
};

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

</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>