<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">create application</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <transition name="fade-slide" mode="out-in">
                    <div :key="step">
                        <div v-if="step === 0">
                            <div class="text-overline text-uppercase text-bold q-mb-md">position information</div>
                            <div class="text-caption text-uppercase q-mb-sm" :class="Errors.vacancyId.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.vacancyId.type ? Errors.vacancyId.msg : 'position' }}</div>
                            <div class="card-grid">
                                <div key="data-none" class="inner-card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="displayedVacancies.length === 0">
                                    <q-card class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" tag="label">
                                        <q-card-section class="text-center full-width q-pa-none">
                                            <div class="text-caption text-uppercase text-grey">no data found</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                                <div v-for="(data, index) in displayedVacancies" :key="`data-${data.id}`" class="inner-card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }" v-else>
                                    <q-card class="card card-menu card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" tag="label" :class="{ 'card--active': vacancyId === data.id }" @click="vacancyId = data.id" >
                                        <q-card-section class="text-center">
                                            <div class="text-caption text-uppercase">{{ data?.position?.name }}</div>
                                            <div class="text-caption text-grey text-uppercase">{{ (data?.position?.salary_type == 'Monthly' ? formatCurrency(data?.position?.monthly_salary) : (data?.position?.salary_type == 'Daily' ? formatCurrency(data?.position?.daily_salary) : data?.position?.salary_type == 'Hourly' ? formatCurrency(data?.position?.hourly_salary) : null)) }}</div>
                                        </q-card-section>
                                        <q-card-section>
                                            <div class="text-caption text-capitalize text-grey">{{ data?.department?.name }}</div>
                                        </q-card-section>
                                        <div class="checkmark-overlay">
                                            <q-radio v-model="vacancyId" :val="data.id" checked-icon="bi-check-circle-fill" unchecked-icon="bi-check-circle" size="xs" />
                                        </div>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 1">
                            <div class="text-overline text-uppercase text-bold q-mb-md">personal information</div>
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
                                <div class="col-10">
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
                                    <span class="text-caption text-uppercase" :class="Errors.contactNo.type ? 'text-negative text-italic' : 'text-grey'">{{ Errors.contactNo.type ? Errors.contactNo.msg : 'contact number' }}</span>
                                    <q-input 
                                        v-model="contactNo"
                                        label="Enter Contact No." 
                                        outlined 
                                        :error="Errors.contactNo.type"
                                        :no-error-icon="true"
                                        mask="###########"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 2">
                                <div class="text-overline text-uppercase text-bold q-mb-md">education information</div>
                            <div class="q-mb-md">
                                <div class="row q-col-gutter-xs q-mb-xs">
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.educations.schoollevel.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.educations.schoollevel.msg ? Errors.educations.schoollevel.msg : 'school level' }}</div>
                                    </div>
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.educations.schoolId.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.educations.schoolId.msg ? Errors.educations.schoolId.msg : 'school' }}</div>
                                    </div>
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.educations.courseId.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.educations.courseId.msg ? Errors.educations.courseId.msg : 'degree' }}</div>
                                    </div>
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.educations.startDate.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.educations.startDate.msg ? Errors.educations.startDate.msg : 'start date (YYYY-MM-DD)' }}</div>
                                    </div>
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.educations.endDate.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.educations.endDate.msg ? Errors.educations.endDate.msg : 'end date (YYYY-MM-DD)' }}</div>
                                    </div>
                                </div>
                                <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in educations" :key="index">
                                    <div class="col-2">
                                        <q-select
                                            outlined
                                            v-model="value.schoollevel"
                                            label="Choose School Level"
                                            input-debounce="300"
                                            :options="schoollevels"
                                            :error="Errors.educations.schoollevel.type[index]"
                                            hide-dropdown-icon
                                            :no-error-icon="true"
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
                                    <div class="col-2">
                                        <q-select
                                            outlined
                                            v-model="value.schoolId"
                                            label="Choose School"
                                            emit-value
                                            map-options
                                            use-input
                                            input-debounce="300"
                                            :options="filteredSchools"
                                            @filter="filterSchoolFn"
                                            :error="Errors.educations.schoolId.type[index]"
                                            hide-dropdown-icon
                                            :no-error-icon="true"
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
                                        <q-select
                                            outlined
                                            v-model="value.courseId"
                                            label="Choose Degree"
                                            emit-value
                                            map-options
                                            use-input
                                            input-debounce="300"
                                            :options="filteredCourses"
                                            @filter="filterCoursesFn"
                                            :error="Errors.educations.courseId.type[index]"
                                            hide-dropdown-icon
                                            :no-error-icon="true"
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
                                        <q-input outlined v-model="value.startDate" label="Enter Date" :error="Errors.educations.startDate.type[index]" :no-error-icon="true">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" :ref="el => eduStartPopups[index] = el">
                                                <q-date v-model="value.startDate" mask="YYYY-MM-DD" @update:model-value="() => hideEduStartPopup(index)"/>
                                            </q-popup-proxy>
                                        </q-input>
                                    </div>
                                    <div class="col-2">
                                        <q-input outlined v-model="value.endDate" label="Enter Date" :error="Errors.educations.endDate.type[index]" :no-error-icon="true">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" :ref="el => eduEndPopups[index] = el">
                                                <q-date v-model="value.endDate" mask="YYYY-MM-DD" @update:model-value="() => hideEduEndPopup(index)"/>
                                            </q-popup-proxy>
                                        </q-input>
                                    </div>
                                    <div class="col-1">
                                        <q-btn 
                                            v-if="educations.length > 1" 
                                            round 
                                            icon="bi-trash3" 
                                            flat 
                                            unelevated 
                                            color="grey" 
                                            @click="RemoveEducation(index)" 
                                            size="sm"
                                            class="q-mt-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 3">
                            <div class="text-overline text-uppercase text-bold q-mb-md">training information</div>
                            <div class="q-mb-md">
                                <div class="row q-col-gutter-xs q-mb-xs">
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.trainings.trainingtype.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.trainings.trainingtype.msg ? Errors.trainings.trainingtype.msg : 'training type' }}</div>
                                    </div>
                                    <div class="col-3">
                                        <div class="text-caption text-uppercase" :class="Errors.trainings.title.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.trainings.title.msg ? Errors.trainings.title.msg : 'title' }}</div>
                                    </div>
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.trainings.startDate.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.trainings.startDate.msg ? Errors.trainings.startDate.msg : 'start date (YYYY-MM-DD)' }}</div>
                                    </div>
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.trainings.endDate.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.trainings.endDate.msg ? Errors.trainings.endDate.msg : 'end date (YYYY-MM-DD)' }}</div>
                                    </div>
                                    <div class="col-1">
                                        <div class="text-caption text-uppercase" :class="Errors.trainings.hour.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.trainings.hour.msg ? Errors.trainings.hour.msg : 'hour/s' }}</div>
                                    </div>
                                </div>
                                <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in trainings" :key="index">
                                    <div class="col-2">
                                        <q-select
                                            outlined
                                            v-model="value.trainingtype"
                                            label="Choose Training Type"
                                            input-debounce="300"
                                            :options="trainingtypes"
                                            :error="Errors.trainings.trainingtype.type[index]"
                                            hide-dropdown-icon
                                            :no-error-icon="true"
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
                                    <div class="col-3">
                                        <q-input 
                                            v-model="value.title" 
                                            label="Enter Title"
                                            outlined 
                                            :error="Errors.trainings.title.type[index]"
                                            :no-error-icon="true"
                                            input-class="text-capitalize"
                                        />
                                    </div>
                                    <div class="col-2">
                                        <q-input outlined v-model="value.startDate" label="Enter Date" :error="Errors.trainings.startDate.type[index]" :no-error-icon="true">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" :ref="el => trainingStartPopups[index] = el">
                                                <q-date v-model="value.startDate" mask="YYYY-MM-DD" @update:model-value="() => hideTrainingStartPopup(index)"/>
                                            </q-popup-proxy>
                                        </q-input>
                                    </div>
                                    <div class="col-2">
                                        <q-input outlined v-model="value.endDate" label="Enter Date" :error="Errors.trainings.endDate.type[index]" :no-error-icon="true">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" :ref="el => trainingEndPopups[index] = el">
                                                <q-date v-model="value.endDate" mask="YYYY-MM-DD" @update:model-value="() => hideTrainingEndPopup(index)"/>
                                            </q-popup-proxy>
                                        </q-input>
                                    </div>
                                    <div class="col-2">
                                        <q-input 
                                            v-model="value.hour" 
                                            label="Enter Hour/s"
                                            outlined 
                                            :error="Errors.trainings.hour.type[index]"
                                            :no-error-icon="true"
                                        />
                                    </div>
                                    <div class="col-1">
                                        <q-btn 
                                            v-if="trainings.length > 1" 
                                            round 
                                            icon="bi-trash3" 
                                            flat 
                                            unelevated 
                                            color="grey" 
                                            @click="RemoveTraining(index)" 
                                            size="sm"
                                            class="q-mt-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 4">
                            <div class="text-overline text-uppercase text-bold q-mb-md">experience information</div>
                            <div class="q-mb-md">
                                <div class="row q-col-gutter-xs q-mb-xs">
                                    <div class="col-3">
                                        <div class="text-caption text-uppercase" :class="Errors.experiences.position.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.experiences.position.msg ? Errors.experiences.position.msg : 'position' }}</div>
                                    </div>
                                    <div class="col-4">
                                        <div class="text-caption text-uppercase" :class="Errors.experiences.description.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.experiences.description.msg ? Errors.experiences.description.msg : 'job description' }}</div>
                                    </div>
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.experiences.startDate.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.experiences.startDate.msg ? Errors.experiences.startDate.msg : 'start date (YYYY-MM-DD)' }}</div>
                                    </div>
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.experiences.endDate.msg ? 'text-negative text-italic' : 'text-grey'">{{ Errors.experiences.endDate.msg ? Errors.experiences.endDate.msg : 'end date (YYYY-MM-DD)' }}</div>
                                    </div>
                                </div>
                                <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in experiences" :key="index">
                                    <div class="col-3">
                                        <q-input 
                                            v-model="value.position" 
                                            label="Enter Position"
                                            outlined 
                                            :error="Errors.experiences.position.type[index]"
                                            :no-error-icon="true"
                                            input-class="text-capitalize"
                                        />
                                    </div>
                                    <div class="col-4">
                                        <q-input 
                                            v-model="value.description" 
                                            label="EnterJob Description"
                                            outlined 
                                            :error="Errors.experiences.description.type[index]"
                                            :no-error-icon="true"
                                        />
                                    </div>
                                    <div class="col-2">
                                        <q-input outlined v-model="value.startDate" label="Enter Date" :error="Errors.experiences.startDate.type[index]" :no-error-icon="true">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" :ref="el => expStartPopups[index] = el">
                                                <q-date v-model="value.startDate" mask="YYYY-MM-DD" @update:model-value="() => hideExpStartPopup(index)"/>
                                            </q-popup-proxy>
                                        </q-input>
                                    </div>
                                    <div class="col-2">
                                        <q-input outlined v-model="value.endDate" label="Enter Date" :error="Errors.experiences.endDate.type[index]" :no-error-icon="true">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="no-shadow custom-border radius-sm" :ref="el => expEndPopups[index] = el">
                                                <q-date v-model="value.endDate" mask="YYYY-MM-DD" @update:model-value="() => hideExpEndPopup(index)"/>
                                            </q-popup-proxy>
                                        </q-input>
                                    </div>
                                    <div class="col-1">
                                        <q-btn 
                                            v-if="experiences.length > 1" 
                                            round 
                                            icon="bi-trash3" 
                                            flat 
                                            unelevated 
                                            color="grey" 
                                            @click="RemoveExperience(index)" 
                                            size="sm"
                                            class="q-mt-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="step === 5">
                            <div class="text-overline text-uppercase text-bold q-mb-md">document information</div>
                            <div class="q-mb-md">
                                <div class="row q-col-gutter-xs q-mb-xs">
                                    <div class="col-2">
                                        <div class="text-caption text-uppercase" :class="Errors.documents.file.msg ? 'text-negative' : 'text-grey'">{{ Errors.documents.file.msg ? Errors.documents.file.msg : 'documents' }}</div>
                                    </div>
                                </div>
                                <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in documents" :key="index">
                                    <div class="col-3">
                                        <q-file 
                                            v-model="value.file" 
                                            label="Upload File"
                                            outlined 
                                            :error="Errors.documents.file.type[index]"
                                            :no-error-icon="true"
                                        />
                                    </div>
                                    <div class="col-1">
                                        <q-btn 
                                            v-if="documents.length > 1" 
                                            round 
                                            icon="bi-trash3" 
                                            flat 
                                            unelevated 
                                            color="grey" 
                                            @click="RemoveDocument(index)" 
                                            size="sm"
                                            class="q-mt-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="row q-gutter-sm">
                    <q-btn v-if="step > 0" unelevated size="md" color="primary" class="btn text-capitalize" label="previous" @click="() => { PreviousStep() }" />
                    <q-btn v-if="step < totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="next" @click="() => { NextStep() }" />
                    <q-btn v-if="step === totalSteps - 1" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                    <q-btn v-if="(step === 2 || step === 3 || step === 4 || step === 5)" unelevated size="md" color="primary" class="btn text-capitalize" label="add" @click="() => { (step === 2 ? AddEducation() : (step === 3 ? AddTraining() : (step === 4 ? AddExperience() : step === 5 ? AddDocument() : null))) }" outline/>
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { emit('update:modelValue', null); }" outline/>
                    <q-input v-if="step === 0" outlined dense debounce="1000" v-model="search" placeholder="Search...">
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
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, reactive, computed, nextTick } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { Toast } from 'src/boot/sweetalert'; 
import { useRecruitmentStore } from 'src/stores/recruitment-store';
const RecruitmentStore = useRecruitmentStore();

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

const PopulateData = () => {
    ResetForm();
    LoadVacancies();
    LoadCourses();
    LoadSchools();
    step.value = 0;
}

const SubmitLoading = ref(false);

const vacancyId = ref('');
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
const educations = ref([
    {
        schoollevel: "",
        schoolId: "",
        courseId: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    }
]);
const trainings = ref([
    {
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        hour: '',
        typeId: '',
        conductedBy: ''
    }
]);
const experiences = ref([
    {
        position: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        description: ''
    }
]);
const documents = ref([
    {
        file: ''
    }
]);
const applicationstatus = ref('');

const Errors = reactive({
    vacancyId: {
        type: null, msg: ''
    },
    firstname: {
        type: null, msg: ''
    },
    middlename: {
        type: null, msg: ''
    },
    lastname: {
        type: null, msg: ''
    },
    suffix: {
        type: null, msg: ''
    },
    sex: {
        type: null, msg: ''
    },
    civilstatus: {
        type: null, msg: ''
    },
    birthdate: {
        type: null, msg: ''
    },
    birthplace: {
        type: null, msg: ''
    },
    address: {
        type: null, msg: ''
    },
    email: {
        type: null, msg: ''
    },
    contactNo: {
        type: null, msg: ''
    },
    //
    educations: {
        schoollevel: {
            type: [], msg: ''
        },
        schoolId: {
            type: [], msg: ''
        },
        courseId: {
            type: [], msg: ''
        },
        startDate: {
            type: [], msg: ''
        },
        endDate: {
            type: [], msg: ''
        }
    },
    trainings: {
        trainingtype: {
            type: [], msg: ''
        },
        title: {
            type: [], msg: ''
        },
        startDate: {
            type: [], msg: ''
        },
        endDate: {
            type: [], msg: ''
        },
        hour: {
            type: [], msg: ''
        }
    },
    experiences: {
        position: {
            type: [], msg: ''
        },
        startDate: {
            type: [], msg: ''
        },
        endDate: {
            type: [], msg: ''
        },
        description: {
            type: [], msg: ''
        }
    },
    documents: {
        file: {
            type: [], msg: ''
        }
    },
    //
    applicationstatus: {
        type: [], msg: ''
    }
});

const initErrors = () => {

    Errors.educations.schoollevel.type = educations.value.map(() => null);
    Errors.educations.schoolId.type = educations.value.map(() => null);
    Errors.educations.courseId.type = educations.value.map(() => null);
    Errors.educations.startDate.type = educations.value.map(() => null);
    Errors.educations.endDate.type = educations.value.map(() => null);
    
    Errors.trainings.trainingtype.type = trainings.value.map(() => null);
    Errors.trainings.title.type = trainings.value.map(() => null);
    Errors.trainings.startDate.type = trainings.value.map(() => null);
    Errors.trainings.endDate.type = trainings.value.map(() => null);
    Errors.trainings.hour.type = trainings.value.map(() => null);

    Errors.experiences.position.type = experiences.value.map(() => null);
    Errors.experiences.startDate.type = experiences.value.map(() => null);
    Errors.experiences.endDate.type = experiences.value.map(() => null);
    Errors.experiences.description.type = experiences.value.map(() => null);
    
    Errors.documents.file.type = documents.value.map(() => null);
}

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

const ValidateVacancy = () => {

    let isError = false

    isError ||= req('vacancyId', vacancyId.value)

    if (isError) failToast()
    return !isError
}

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

const ValidateEducation = () => {
    let isError = false;
    Errors.educations.schoollevel = { type: null, msg: '' }
    Errors.educations.schoolId = { type: null, msg: '' }
    Errors.educations.courseId = { type: null, msg: '' }
    Errors.educations.startDate = { type: null, msg: '' }
    Errors.educations.endDate = { type: null, msg: '' }
    initErrors()
    educations.value.forEach((e, index) => {
        if (!e.schoollevel) {
            Errors.educations.schoollevel.type[index] = true;
            Errors.educations.schoollevel.msg = 'school level is required';
            isError = true;
        }
        if (!e.schoolId) {
            Errors.educations.schoolId.type[index] = true;
            Errors.educations.schoolId.msg = 'school is required';
            isError = true;
        }
        if (!e.courseId) {
            Errors.educations.courseId.type[index] = true;
            Errors.educations.courseId.msg = 'degree is required';
            isError = true;
        }
        if (!e.startDate) {
            Errors.educations.startDate.type[index] = true;
            Errors.educations.startDate.msg = 'start date is required';
            isError = true;
        } else if (isNaN(new Date(e.startDate).getTime())) {
            Errors.educations.startDate.type[index] = true;
            Errors.educations.startDate.msg = 'start date must be a valid date';
            isError = true;
        }
        if (!e.endDate) {
            Errors.educations.endDate.type[index] = true;
            Errors.educations.endDate.msg = 'end date is required';
            isError = true;
        } else if (isNaN(new Date(e.endDate).getTime())) {
            Errors.educations.endDate.type[index] = true;
            Errors.educations.endDate.msg = 'end date must be a valid date';
            isError = true;
        }
    });
    if (isError) failToast()
    return !isError
}

const ValidateTraining = () => {
    let isError = false;
    Errors.trainings.trainingtype = { type: null, msg: ''}
    Errors.trainings.title = { type: null, msg: ''}
    Errors.trainings.startDate = { type: null, msg: ''}
    Errors.trainings.endDate = { type: null, msg: ''}
    Errors.trainings.hour = { type: null, msg: ''}
    initErrors()
    trainings.value.forEach((e, index) => {
        if (!e.trainingtype) {
            Errors.trainings.trainingtype.type[index] = true;
            Errors.trainings.trainingtype.msg = 'training type is required';
            isError = true;
        }
        if (!e.title) {
            Errors.trainings.title.type[index] = true;
            Errors.trainings.title.msg = 'title is required';
            isError = true;
        }
        if (!e.startDate) {
            Errors.trainings.startDate.type[index] = true;
            Errors.trainings.startDate.msg = 'start date is required';
            isError = true;
        } else if (isNaN(new Date(e.startDate).getTime())) {
            Errors.trainings.startDate.type[index] = true;
            Errors.trainings.startDate.msg = 'start date must be a valid date';
            isError = true;
        }
        if (!e.endDate) {
            Errors.trainings.endDate.type[index] = true;
            Errors.trainings.endDate.msg = 'end date is required';
            isError = true;
        } else if (isNaN(new Date(e.endDate).getTime())) {
            Errors.trainings.endDate.type[index] = true;
            Errors.trainings.endDate.msg = 'end date must be a valid date';
            isError = true;
        }
        if (!e.hour) {
            Errors.trainings.hour.type[index] = true;
            Errors.trainings.hour.msg = 'hour/s is required';
            isError = true;
        } else if (isNaN(e.hour) || e.hour < 1 || e.hour > 23) {
            Errors.trainings.hour.type[index] = true;
            Errors.trainings.hour.msg = 'hour/s must be a valid number between 1 to 23';
            isError = true;
        }
    });
    if (isError) failToast()
    return !isError
}

const ValidateExperience = () => {
    let isError = false;
    Errors.experiences.position = { type: null, msg: '' }
    Errors.experiences.startDate = { type: null, msg: '' }
    Errors.experiences.endDate = { type: null, msg: '' }
    Errors.experiences.description = { type: null, msg: '' }
    initErrors()
    experiences.value.forEach((e, index) => {
        if (!e.position) {
            Errors.experiences.position.type[index] = true;
            Errors.experiences.position.msg = 'position is required';
            isError = true;
        }
        if (!e.startDate) {
            Errors.experiences.startDate.type[index] = true;
            Errors.experiences.startDate.msg = 'start date is required';
            isError = true;
        } else if (isNaN(new Date(e.startDate).getTime())) {
            Errors.experiences.startDate.type[index] = true;
            Errors.experiences.startDate.msg = 'start date must be a valid date';
            isError = true;
        }
        if (!e.endDate) {
            Errors.experiences.endDate.type[index] = true;
            Errors.experiences.endDate.msg = 'end date is required';
            isError = true;
        } else if (isNaN(new Date(e.endDate).getTime())) {
            Errors.experiences.endDate.type[index] = true;
            Errors.experiences.endDate.msg = 'end date must a valid date';
            isError = true;
        }
        if (!e.description) {
            Errors.experiences.description.type[index] = true;
            Errors.experiences.description.msg = 'job description is required';
            isError = true;
        }
    });
    if (isError) failToast()
    return !isError
}

const ValidateDocument = () => {
    let isError = false;
    Errors.documents.file = { type: null, msg: '' }
    initErrors()
    documents.value.forEach((e, index) => {
        const maxSize = 5 * 1024 * 1024;
        if (!e.file) {
            Errors.documents.file.type[index] = true;
            Errors.documents.file.msg = 'file is required';
            isError = true;
        } else if (e.file.type !== 'application/pdf') {
            Errors.documents.file.type[index] = true;
            Errors.documents.file.msg = 'file must be a PDF document';
            isError = true;
        } else if (e.file.size > maxSize) {
            Errors.documents.file.type[index] = true;
            Errors.documents.file.msg = 'file size must not exceed to 5MB';
            isError = true;
        }
    });
    if (isError) failToast()
    return !isError
}

const ResetErrors = () => {
    Object.keys(Errors).forEach(key => {
        const field = Errors[key];

        // Top-level single fields
        if (field.type !== undefined && !Array.isArray(field.type)) {
        field.type = null;
        field.msg = '';
        }
        // Top-level array fields
        else if (field.type !== undefined && Array.isArray(field.type)) {
        field.type = [];
        field.msg = '';
        }
        // Nested groups (educations, trainings, experiences, documents)
        else {
        Object.keys(field).forEach(sub => {
            if (Array.isArray(field[sub].type)) {
            field[sub].type = [];
            } else {
            field[sub].type = null;
            }
            field[sub].msg = '';
        });
        }
    });
}

const ResetForm = () => {
    vacancyId.value = '';
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
    educations.value = ([
        {
            schoollevel: "",
            schoolId: "",
            courseId: "",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        }
    ]);
    trainings.value = ([
        {
            title: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            hour: '',
            typeId: '',
            conductedBy: ''
        }
    ]);
    experiences.value = ([
        {
            position: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            description: ''
        }
    ]);
    documents.value = ([
        {
            file: ''
        }
    ]);
    ResetErrors()
}

const Save = async () => {
    if (ValidateDocument && !ValidateDocument()) return;
    SubmitLoading.value = true;
    try {
        const Data = new FormData();
        Data.append("vacancyId", vacancyId.value);
        Data.append("firstname", firstname.value);
        Data.append("middlename", middlename.value);
        Data.append("lastname", lastname.value);
        Data.append("suffix", suffix.value);
        Data.append("sex", sex.value);
        Data.append("civilstatus",civilstatus.value);
        Data.append("birthdate", birthdate.value);
        Data.append("birthplace", birthplace.value);
        Data.append("email", email.value);
        Data.append("contactNo", contactNo.value);
        Data.append("address", address.value);
        Data.append("educations", JSON.stringify(educations.value));
        Data.append("trainings", JSON.stringify(trainings.value));
        Data.append("experiences", JSON.stringify(experiences.value));
        documents.value.forEach((doc, index) => {
            Data.append(`documents[${index}][documentId]`, doc.documentId);
            if (doc.file) {
                Data.append(`documents[${index}][file]`, doc.file);
            }
        });
        const response = await api.post('/socket/application/create', Data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
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
}

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

const vacancies = ref([]);
const sexes = ref(["Male", "Female"]);
const schoollevels = ref(["High School", "Vocational", "College", "Graduate Studies"]);
const civilstatuses = ref(["Single", "Married", "Widowed", "Divorced", "Separated"]);
const schools = ref([]);
const courses = ref([]);
const trainingtypes = ref(["Managerial", "Supervisory", "Technical", "Orientation", "Compliance", "Seminar", "Workshop", "Conference", "Other"]);
const applicationstatuses = ["Pooling", "Shortlisted", "Interview", "Hired", "Rejected", "Withdrawn"];

const filteredSchools = ref([]);
const filteredCourses = ref([]);
const filteredApplicationStatuses = ref([]);

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

const filterSchoolFn = createFilterFn(schools, filteredSchools);
const filterCoursesFn = createFilterFn(courses, filteredCourses);

const LoadVacancies = async () => {
    try {
        const response = await api.get(`/application/option/vacancy`);
        vacancies.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadSchools = async () => {
    try {
        const response = await api.get(`/application/option/school`);
        schools.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadCourses = async () => {
    try {
        const response = await api.get(`/application/option/course`);
        courses.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

function formatCurrency(value, currency = 'PHP') {
    if (value == null || value === '') return '';

    const num = Number(String(value).replace(/,/g, ''));
    if (isNaN(num)) return '';

    return num.toLocaleString('en-PH', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

const AddEducation = () => {
    const e = educations.value;
    e.unshift({
        schoollevel: "",
        schoolId: "",
        courseId: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
}

const RemoveEducation = (index) => {
    educations.value.splice(index, 1);
}

const AddTraining = () => {
    const t = trainings.value;
    t.unshift({
        trainingtype: "",
        title: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        hour: ""
    });
}

const RemoveTraining = (index) => {
    const t = trainings.value;
    t.splice(index, 1);
}

const AddExperience = () => {
    const e = experiences.value;
    e.unshift({
        position: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
}

const RemoveExperience = (index) => {
    const e = experiences.value;
    e.splice(index, 1);
}

const AddDocument = () => {
    const d = documents.value;
    d.unshift({
        file: ""
    });
}

const RemoveDocument = (index) => {
    const d = documents.value;
    d.splice(index, 1);
}

const popup = ref(null)

// Refs for popups
const eduStartPopups = ref([]);
const eduEndPopups = ref([]);

const trainingStartPopups = ref([]);
const trainingEndPopups = ref([]);

const expStartPopups = ref([]);
const expEndPopups = ref([]);

// Safe hide functions
function hideEduStartPopup(index) {
  nextTick(() => {
    if (eduStartPopups.value[index]) eduStartPopups.value[index].hide();
  });
}
function hideEduEndPopup(index) {
  nextTick(() => {
    if (eduEndPopups.value[index]) eduEndPopups.value[index].hide();
  });
}

function hideTrainingStartPopup(index) {
  nextTick(() => {
    if (trainingStartPopups.value[index]) trainingStartPopups.value[index].hide();
  });
}
function hideTrainingEndPopup(index) {
  nextTick(() => {
    if (trainingEndPopups.value[index]) trainingEndPopups.value[index].hide();
  });
}

function hideExpStartPopup(index) {
  nextTick(() => {
    if (expStartPopups.value[index]) expStartPopups.value[index].hide();
  });
}
function hideExpEndPopup(index) {
  nextTick(() => {
    if (expEndPopups.value[index]) expEndPopups.value[index].hide();
  });
}

const step = ref(0)
const totalSteps = 6;

const validators = [
    ValidateVacancy,
    ValidateEmployee,
    ValidateEducation,
    ValidateTraining,
    ValidateExperience
]

const NextStep = () => {
  const validate = validators[step.value];
  if (validate && !validate()) return;

  step.value++;
};

const PreviousStep = () => {
    if (step.value > 0) step.value--;
};

const search = ref('')

const filteredVacancies = computed(() => {
    const q = search.value.trim().toLowerCase()
    return q
        ? vacancies.value.filter(p =>
            String(p.position?.name || '').toLowerCase().includes(q)
        )
        : vacancies.value
})

const displayedVacancies = computed(() => filteredVacancies.value)

const displayCount = computed(() => displayedVacancies.value.length)
const totalCount = computed(() => filteredVacancies.value.length)
</script>

<style lang="css" scoped>
.card-menu
{
    width: 150px;
    height: 175px;
}
</style>