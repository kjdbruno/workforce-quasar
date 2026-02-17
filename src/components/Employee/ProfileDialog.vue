<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">profile information</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="row q-col-gutter-xs q-mb-md">
                    <div class="col-2">
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
                    <div class="col-2">
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
                    <div class="col-2">
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
                            <q-radio v-for="value in sexes" v-model="sex" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" :val="value" :label="value" />
                        </div>
                    </div>
                    <div class="col">
                        <div class="text-caption text-uppercase" :class="Errors.civilstatus.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.civilstatus.type ? Errors.civilstatus.msg : 'civil status' }}</div>
                        <div class="q-gutter-sm">
                            <q-radio v-for="value in civilstatuses" v-model="civilstatus" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" :val="value" :label="value" />
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
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="AuthStore.hasRole(['SuperAdmin', 'Admin', 'HR'])" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save()" />
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }" outline/>
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

const SubmitLoading = ref(false);

const firstname = ref('');
const middlename = ref('');
const lastname = ref('');
const suffix = ref('');
const sex = ref('');
const civilstatus = ref('');
const birthdate = ref('');
const birthplace = ref('');
const address = ref('');
const email = ref('');
const contactNo = ref('');

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

const sexes = ref(["Male","Female"]);
const civilstatuses = ref(["Single","Married","Widowed","Divorced","Separated"]);

const PopulateData = () => {
    const app = EmployeeStore.data;
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
}

const Save = async () => {
    if (ValidateEmployee && !ValidateEmployee()) return;
    SubmitLoading.value = true;
    try {
        const response = await api.post(`/employee/${EmployeeStore.data?.id}/information`, {
            firstname: firstname.value,
            middlename: middlename.value,
            lastname: lastname.value,
            suffix: suffix.value,
            sex: sex.value,
            civilstatus: civilstatus.value,
            birthdate: birthdate.value,
            address: address.value,
            email: email.value,
            contactNo: contactNo.value
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
</script>