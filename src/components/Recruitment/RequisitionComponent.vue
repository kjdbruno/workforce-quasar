<template>
    <div>
        <div class="card-grid">
            <div class="card-anim-wrapper">
                <q-card
                    key="data-add"
                    class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm"
                    v-ripple
                    @click="NewDialog()"
                >
                    <q-card-section class="text-center">
                        <q-avatar size="75px" font-size="52px" color="grey" text-color="white" icon="add" />
                    </q-card-section>
                </q-card>
            </div>

            <div
                v-for="(data, index) in rows"
                :key="`data-${data.id}`"
                class="card-anim-wrapper"
                :style="{ animationDelay: `${index * 120}ms` }"
            >
                <q-card
                    @click="InfoDialog(data)"
                    class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm"
                    >
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ data.salary?.positions?.name }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-uppercase">{{ data?.salary?.grade?.name }}</div>
                        <div class="text-caption text-grey">{{ data?.status }}</div>
                    </q-card-section>
                    <div
                        class="absolute-top-left q-ma-sm"
                        style="width: 7px; height: 7px; border-radius: 50%;"
                        :class="data.isActive ? 'bg-positive' : 'bg-negative'"
                    ></div>
                </q-card>
            </div>
        </div>
        <q-dialog v-model="dialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">create opening</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="q-mb-md">
                        <div class="q-mb-sm">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">choose position</span>
                            <q-icon
                                :name="Errors.salary.type ? 'error' : 'info'"
                                :color="Errors.salary.type ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip anchor="top middle" self="center middle" :class="Errors.salary.type ? 'bg-negative' : 'bg-grey'">
                                    <template v-if="Errors.salary.type">
                                        <div 
                                            v-for="(msg, i) in Errors.salary.messages" 
                                            :key="i" 
                                            class="text-capitalize"
                                        >
                                            <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-capitalize">
                                            <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                        </div>
                                    </template>
                                </q-tooltip>
                            </q-icon>
                        </div>
                        <div class="card-grid">
                            <div
                                v-for="(data, index) in positions"
                                :key="`data-${data.id}`"
                                class="inner-card-anim-wrapper"
                                :style="{ animationDelay: `${index * 120}ms` }"
                            >
                                <q-card 
                                    class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" 
                                    tag="label"
                                    :class="{ 'card--active': salary === data }"
                                    @click="salary = data"
                                >
                                    <q-card-section class="text-center full-width q-pa-none">
                                        <div class="text-subtitle1 text-uppercase">{{ data?.positions?.name }}</div>
                                        <div class="text-caption text-uppercase">{{ data?.class?.name }}</div>
                                    </q-card-section>
                                    <q-card-section class="q-pa-none">
                                        <div class="text-caption">{{ data?.grade?.name }}</div>
                                        <div class="text-caption text-grey">{{ data?.status }}</div>
                                    </q-card-section>
                                    <div class="checkmark-overlay">
                                        <q-radio
                                            v-model="salary"
                                            :val="data"
                                            checked-icon="task_alt"
                                            unchecked-icon="panorama_fish_eye"
                                            size="md"
                                        />
                                    </div>
                                </q-card>
                            </div>
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey q-mb-xs">job description</div>
                            <div class="text-caption">{{ qualifications?.description || 'N/A' }}</div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey q-mb-xs">job qualification</div>
                            <div class="text-caption">
                                <div v-for="(dt, index) in qualifications?.qualifications">
                                    {{ index+1 }}. {{ dt.name }}
                                </div>
                                {{ qualifications.length===0 ? 'N/A' : null }}
                            </div>
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="q-mb-sm">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">choose initial salary</span>
                            <q-icon
                                :name="Errors.stepId.type ? 'error' : 'info'"
                                :color="Errors.stepId.type ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip anchor="top middle" self="center middle" :class="Errors.stepId.type ? 'bg-negative' : 'bg-grey'">
                                    <template v-if="Errors.stepId.type">
                                        <div 
                                            v-for="(msg, i) in Errors.stepId.messages" 
                                            :key="i" 
                                            class="text-capitalize"
                                        >
                                            <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-capitalize">
                                            <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                        </div>
                                    </template>
                                </q-tooltip>
                            </q-icon>
                        </div>
                        <div class="card-grid" v-if="steps.length">
                            <div
                                v-for="(data, index) in steps"
                                :key="`data-${data.id}`"
                                class="inner1-card-anim-wrapper"
                                :style="{ animationDelay: `${index * 120}ms` }"
                            >
                                <q-card 
                                    class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" 
                                    tag="label"
                                    :class="{ 'card--active': stepId === data.stepId }"
                                    @click="stepId = data.stepId"
                                >
                                    <q-card-section class="text-center full-width q-pa-sm">
                                        <div class="text-caption text-uppercase">{{ data?.increment?.name }}</div>
                                        <div class="text-caption text-grey">{{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data?.monthlyCompensation) }}</div>
                                    </q-card-section>
                                    <div class="checkmark-overlay">
                                        <q-radio
                                            v-model="stepId"
                                            :val="data.stepId"
                                            checked-icon="task_alt"
                                            unchecked-icon="panorama_fish_eye"
                                            size="md"
                                        />
                                    </div>
                                </q-card>
                            </div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select company</span>
                                <q-icon
                                    :name="Errors.companyId.type ? 'error' : 'info'"
                                    :color="Errors.companyId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.companyId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.companyId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.companyId.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-select
                                outlined
                                v-model="companyId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredCompanies"
                                @filter="filterCompanyFn"
                                :error="Errors.companyId.type"
                                dropdown-icon="keyboard_arrow_down"
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
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select department</span>
                                <q-icon
                                    :name="Errors.departmentId.type ? 'error' : 'info'"
                                    :color="Errors.departmentId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.departmentId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.departmentId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.departmentId.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-select
                                outlined
                                v-model="departmentId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredDepartments"
                                @filter="filterDepartmentFn"
                                :error="Errors.departmentId.type"
                                dropdown-icon="keyboard_arrow_down"
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
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select shift</span>
                                <q-icon
                                    :name="Errors.shiftId.type ? 'error' : 'info'"
                                    :color="Errors.shiftId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.shiftId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.shiftId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.shiftId.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-select
                                outlined
                                v-model="shiftId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredSchedules"
                                @filter="filterScheduleFn"
                                :error="Errors.shiftId.type"
                                dropdown-icon="keyboard_arrow_down"
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
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select sex</span>
                                <q-icon
                                    :name="Errors.sexId.type ? 'error' : 'info'"
                                    :color="Errors.sexId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.sexId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.sexId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.sexId.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-select
                                outlined
                                v-model="sexId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredSexes"
                                @filter="filterSexFn"
                                :error="Errors.sexId.type"
                                dropdown-icon="keyboard_arrow_down"
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
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select school level</span>
                                <q-icon
                                    :name="Errors.levelId.type ? 'error' : 'info'"
                                    :color="Errors.levelId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.levelId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.levelId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.levelId.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-select
                                outlined
                                v-model="levelId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredLevels"
                                @filter="filterLevelFn"
                                :error="Errors.levelId.type"
                                dropdown-icon="keyboard_arrow_down"
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
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">year/s of experience</span>
                                <q-icon
                                    :name="Errors.yearExperience.type ? 'error' : 'info'"
                                    :color="Errors.yearExperience.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.yearExperience.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.yearExperience.type">
                                            <div 
                                                v-for="(msg, i) in Errors.yearExperience.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-input 
                                v-model="yearExperience" 
                                outlined
                                :error="Errors.yearExperience.type"
                                :no-error-icon="true"
                            />
                        </div>
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">age range</span>
                                <q-icon
                                    :name="Errors.ageRange.type ? 'error' : 'info'"
                                    :color="Errors.ageRange.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.ageRange.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.ageRange.type">
                                            <div 
                                                v-for="(msg, i) in Errors.ageRange.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-input 
                                v-model="ageRange" 
                                outlined
                                :error="Errors.ageRange.type"
                                :no-error-icon="true"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select employment status</span>
                                <q-icon
                                    :name="Errors.employmentId.type ? 'error' : 'info'"
                                    :color="Errors.employmentId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.employmentId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.employmentId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.employmentId.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-select
                                outlined
                                v-model="employmentId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredEmploymentStatuses"
                                @filter="filterEmploymentStatusFn"
                                :error="Errors.employmentId.type"
                                dropdown-icon="keyboard_arrow_down"
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
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">date needed</span>
                                <q-icon
                                    :name="Errors.date.type ? 'error' : 'info'"
                                    :color="Errors.date.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.date.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.date.type">
                                            <div 
                                                v-for="(msg, i) in Errors.date.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-input 
                                v-model="date" 
                                outlined
                                :error="Errors.date.type"
                                :no-error-icon="true"
                                type="date"
                            />
                        </div>
                        <div class="col-4">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">location</span>
                                <q-icon
                                    :name="Errors.location.type ? 'error' : 'info'"
                                    :color="Errors.location.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.location.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.location.type">
                                            <div 
                                                v-for="(msg, i) in Errors.location.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-input 
                                v-model="location" 
                                outlined
                                :error="Errors.location.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">additional/replacement</span>
                            <q-icon
                                :name="Errors.movement.type ? 'error' : 'info'"
                                :color="Errors.movement.type ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip anchor="top middle" self="center middle" :class="Errors.movement.type ? 'bg-negative' : 'bg-grey'">
                                    <template v-if="Errors.movement.type">
                                        <div 
                                            v-for="(msg, i) in Errors.movement.messages" 
                                            :key="i" 
                                            class="text-capitalize"
                                        >
                                            <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-capitalize">
                                            <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                        </div>
                                    </template>
                                </q-tooltip>
                            </q-icon>
                        </div>
                        <q-radio v-model="movement" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Addition" label="addition to department"  class="text-uppercase" />
                        <q-radio v-model="movement" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Replacement" label="replacement"  class="text-uppercase" />
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-4">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">justification</span>
                                <q-icon
                                    :name="Errors.justification.type ? 'error' : 'info'"
                                    :color="Errors.justification.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.justification.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.justification.type">
                                            <div 
                                                v-for="(msg, i) in Errors.justification.messages" 
                                                :key="i" 
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="text-capitalize">
                                                <q-icon name="info" color="white" size="xs" />&nbsp;Required
                                            </div>
                                        </template>
                                    </q-tooltip>
                                </q-icon>
                            </div>
                            <q-input 
                                v-model="justification" 
                                outlined
                                :error="Errors.justification.type"
                                :no-error-icon="true"
                                type="textarea"
                            />
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey q-mb-xs">background check</div>
                        <q-checkbox right-label v-model="needBackgroundCheck" label="need background check?" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" class="text-uppercase"/>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                        <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { dialog = false; }" outline/>
                    </div>
                </q-card-actions>
                <q-inner-loading :showing="submitLoading">
                    <div class="text-center">
                        <q-spinner-puff size="md"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </div>
                </q-inner-loading>
            </q-card>
        </q-dialog>
        <q-dialog v-model="DetailDialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">requisition information</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">position</div>
                        <div class="text-body1 text-uppercase">{{ info?.salary?.positions?.name }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">salary</div>
                        <div class="text-body1 text-uppercase">{{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(info?.salary?.rates[0]?.monthlyCompensation) }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">status</div>
                        <div class="text-body1 text-uppercase">{{ info?.status }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">job description</div>
                        <div class="text-body1">{{ info?.salary?.positions?.description }}</div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">job qualifications</div>
                        <div class="text-body1" v-for="(v, index) in info?.salary?.positions?.qualifications" :key="index">{{ (index+1) }}. {{ v.name || 'N/A' }}</div>
                    </div>
                    <div class="row q-col-gutter-lg q-mb-md">
                        <div>
                            <div class="text-caption text-uppercase text-grey">company</div>
                            <div class="text-body1">{{ info?.company?.name }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">department</div>
                            <div class="text-body1">{{ info?.department?.name }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">schedule</div>
                            <div class="text-body1">{{ info?.shift?.class?.name }},&nbsp;{{ formatTime(info?.shift?.timeStart) }} to {{ formatTime(info?.shift?.timeEnd) }}</div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-lg q-mb-md">
                        <div>
                            <div class="text-caption text-uppercase text-grey">date needed</div>
                            <div class="text-body1">{{ formatDate(info?.dateNeeded) }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">need background check</div>
                            <div class="text-body1">{{ info?.needBackgroundCheck ? 'Yes' : 'No' }}</div>
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">work location</div>
                        <div class="text-body1">{{ info?.location }}</div>
                    </div>
                    <div class="row q-col-gutter-lg q-mb-md">
                        <div>
                            <div class="text-caption text-uppercase text-grey">movement</div>
                            <div class="text-body1">{{ info?.movement }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">justification</div>
                            <div class="text-body1">{{ info?.justification }}</div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-lg q-mb-mb">
                        <div>
                            <div class="text-caption text-uppercase text-grey">sex</div>
                            <div class="text-body1">{{ info?.sex?.name }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">school level</div>
                            <div class="text-body1">{{ info?.schoolLevel?.name }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">year/s of experience</div>
                            <div class="text-body1">{{ info?.yearExperience }}</div>
                        </div>
                        <div>
                            <div class="text-caption text-uppercase text-grey">age range</div>
                            <div class="text-body1">{{ info?.ageRange }}</div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xl q-mb-md q-mt-xl">
                        <div v-for="(dt, index) in info?.requests">
                            <div class="text-caption text-uppercase text-grey">{{ dt?.status == 'Pending' ? 'unsigned' : 'signed' }}</div>
                            <div v-if="dt?.status == 'Approved'">
                                <img :src="formatSignature(dt?.signatory)" width="150"/>
                            </div>
                            <div class="text-h6 text-uppercase">{{ formatName(dt?.signatory?.user?.profile) }}</div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="canApprove" unelevated size="md" color="primary" class="btn text-capitalize" label="approve" >
                            <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                                <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                    <q-card-section>
                                        <div class="text-h6 text-center text-uppercase">
                                            proceed to approve
                                        </div>
                                    </q-card-section>
                                    <q-card-actions>
                                        <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="ApproveRequisition(info)"/>
                                    </q-card-actions>
                                </q-card>
                            </q-menu>
                        </q-btn>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="PrintManpowerRequisition"/>
                        <q-btn  v-if="isActive" unelevated size="md" color="primary" class="btn text-capitalize" :label="formatToggle(info) ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { DetailDialog = false; }" outline/>
                    </div>
                </q-card-actions>
                <q-inner-loading :showing="DetailSubmitting">
                    <div class="text-center">
                        <q-spinner-puff size="md"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </div>
                </q-inner-loading>
            </q-card>
        </q-dialog>
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
    onBeforeMount
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

import moment from 'moment';

import { useAuthStore } from 'src/stores/auth-store';

const AuthStore = useAuthStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const id = ref('');
const salary = ref('');
const stepId = ref('');
const companyId = ref('');
const departmentId = ref('');
const shiftId = ref('');
const sexId = ref('');
const date = ref('');
const location = ref('');
const employmentId = ref('');
const levelId = ref('');
const yearExperience = ref('');
const ageRange = ref('');
const movement = ref('');
const justification = ref('');
const needBackgroundCheck = ref(false);
const isActive = ref(false);

const Errors = reactive({
    salary: { 
        type: null, messages: []
    },
    stepId: { 
        type: null, messages: []
    },
    companyId: {
        type: null, messages: []
    },
    departmentId: {
        type: null, messages: []
    },
    shiftId: {
        type: null, messages: []
    },
    sexId: {
        type: null, messages: []
    },
    date: {
        type: null, messages: []
    },
    location: {
        type: null, messages: []
    },
    employmentId: {
        type: null, messages: []
    },
    levelId: {
        type: null, messages: []
    },
    yearExperience: {
        type: null, messages: []
    },
    ageRange: {
        type: null, messages: []
    },
    movement: {
        type: null, messages: []
    },
    justification: {
        type: null, messages: []
    },
    //
    firstname: {
        type: null, messages: []
    },
    middlename: {
        type: null, messages: []
    },
    lastname: {
        type: null, messages: []
    },
    suffix: {
        type: null, messages: []
    },
    sexId: {
        type: null, messages: []
    },
    maritalId: {
        type: null, messages: []
    },
    birthdate: {
        type: null, messages: []
    },
    birthplace: {
        type: null, messages: []
    },
    weight: {
        type: null, messages: []
    },
    height: {
        type: null, messages: []
    },
    bloodTypeId: {
        type: null, messages: []
    },
    email: {
        type: null, messages: []
    },
    contactNo: {
        type: null, messages: []
    },
    region: {
        type: null, messages: []
    },
    province: {
        type: null, messages: []
    },
    town: {
        type: null, messages: []
    },
    barangay: {
        type: null, messages: []
    },
    streetAddress: {
        type: null, messages: []
    },
    //
    educations: [],
    trainings: [],
    experiences: [],
    documents: []
});

const Validations = () => {

    let isError = false;

    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].messages = [];
    });

    if (!salary.value) {
        Errors.salary.type = true;
        Errors.salary.messages.push('Position is required');
        isError = true;
    } else {
        Errors.salary.type = null;
    }

    if (!stepId.value) {
        Errors.stepId.type = true;
        Errors.stepId.messages.push('Salary Increment is required');
        isError = true;
    } else {
        Errors.stepId.type = null;
    }

    if (!companyId.value) {
        Errors.companyId.type = true;
        Errors.companyId.messages.push('company is required');
        isError = true;
    } else {
        Errors.companyId.type = null;
    }

    if (!departmentId.value) {
        Errors.departmentId.type = true;
        Errors.departmentId.messages.push('department is required');
        isError = true;
    } else {
        Errors.departmentId.type = null;
    }

    if (!shiftId.value) {
        Errors.shiftId.type = true;
        Errors.shiftId.messages.push('schedule shift is required');
        isError = true;
    } else {
        Errors.shiftId.type = null;
    }

    if (!sexId.value) {
        Errors.sexId.type = true;
        Errors.sexId.messages.push('sex is required');
        isError = true;
    } else {
        Errors.sexId.type = null;
    }

    if (!employmentId.value) {
        Errors.employmentId.type = true;
        Errors.employmentId.messages.push('Employment status is required');
        isError = true;
    } else {
        Errors.employmentId.type = null;
    }

    if (!levelId.value) {
        Errors.levelId.type = true;
        Errors.levelId.messages.push('school level is required');
        isError = true;
    } else {
        Errors.levelId.type = null;
    }

    if (!date.value) {
        Errors.date.type = true;
        Errors.date.messages.push('date is required');
        isError = true;
    } else {
        Errors.date.type = null;
    }

    if (!location.value) {
        Errors.location.type = true;
        Errors.location.messages.push('location is required');
        isError = true;
    } else {
        Errors.location.type = null;
    }

    if (!yearExperience.value) {
        Errors.yearExperience.type = true;
        Errors.yearExperience.messages.push('years of experience is required');
        isError = true;
    } else {
        Errors.yearExperience.type = null;
    }

    if (!ageRange.value) {
        Errors.ageRange.type = true;
        Errors.ageRange.messages.push('age range is required');
        isError = true;
    } else {
        Errors.ageRange.type = null;
    }

    if (!movement.value) {
        Errors.movement.type = true;
        Errors.movement.messages.push('movement is required');
        isError = true;
    } else {
        Errors.movement.type = null;
    }

    if (!justification.value) {
        Errors.justification.type = true;
        Errors.justification.messages.push('justification is required');
        isError = true;
    } else {
        Errors.justification.type = null;
    }

    if (isError) {
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                <div class="text-caption">Something went wrong.</div>
            `
        })
    }

    return !isError
}

const qualifications = ref([]);

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/recruitment`, {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value || ''
            }
        });
        rows.value = data.data;
        meta.value = data.meta;

        if (!rows.value.length) {
            Toast.fire({
                icon: "info",
                html: `
                <div class="text-h6 text-bold text-uppercase">Notice</div>
                <div class="text-caption text-capitalize;">No records found!</div>
                `
            });
        }
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

const NewDialog = () => {
    ResetForm();
    LoadPositions();
    LoadCompanies();
    LoadDepartments();
    LoadEmploymentStatuses();
    LoadRecruitmentSchedules();
    LoadSchoolLevels();
    LoadSexes();
    dialog.value = true;
}

const ResetForm = () => {
    salary.value = '';
    stepId.value = '';
    companyId.value = '';
    departmentId.value = '';
    shiftId.value = '';
    date.value = '';
    location.value = '';
    movement.value = '';
    justification.value = '';
    needBackgroundCheck.value = false;
    sexId.value = '';
    ageRange.value = '';
    levelId.value = '';
    yearExperience.value = '';
    employmentId.value = '';
    qualifications.value = [];
    Errors.salary.type = null;
    Errors.stepId.type = null;
    Errors.companyId.type = null;
    Errors.departmentId.type = null;
    Errors.shiftId.type = null;
    Errors.date.type = null;
    Errors.location.type = null;
    Errors.movement.type = null;
    Errors.justification.type = null;
    Errors.sexId.type = null;
    Errors.ageRange.type = null;
    Errors.levelId.type = null;
    Errors.yearExperience.type = null;
    Errors.employmentId.type = null;
}

const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = await api.post('/recruitment', {
            salaryId: salary.value.id,
            stepId: stepId.value,
            companyId: companyId.value,
            departmentId: departmentId.value,
            shiftId: shiftId.value,
            date: date.value,
            location: location.value,
            movement: movement.value,
            justification: justification.value,
            needBackgroundCheck: needBackgroundCheck.value,
            sexId: sexId.value,
            ageRange: ageRange.value,
            levelId: levelId.value,
            yearExperience: yearExperience.value,
            employmentId: employmentId.value,
        });
        LoadAll();
        dialog.value = false;
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
        submitLoading.value = false;
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

const DetailSubmitting = ref(false);
const DetailDialog = ref(false);
const info = ref(null)

const InfoDialog = (data) => {
    id.value = data.id;
    isActive.value = data.isActive;
    DetailDialog.value = true;
    LoadDetails(data.id);
}

const LoadDetails = async (id) => {
    DetailSubmitting.value = true;
    try {
        const response  = await api.get(`/recruitment/${id}/details`);
        info.value = response.data.data
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
        DetailSubmitting.value = false;
    }
}

const ApproveRequisition = async (data) => {
    DetailSubmitting.value = true;
    const authUserId = AuthStore.user?.id;
    const matchedSignatory = data?.requests?.find(req => req.signatory?.userId === authUserId);
    const signatoryId = matchedSignatory ? matchedSignatory.signatoryId : null;
    const vacancyId = data?.requests[0]?.vacancyId;
    try {
        const response = await api.post('recruitment/approve', {
            vacancyId: vacancyId,
            signatoryId: signatoryId
        })
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
        LoadAll();
        DetailDialog.value = false;
    } catch (error) {
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
        DetailSubmitting.value = false;
    }
}

const UpdateList = (data) => {
    const index = rows.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        rows.value[index] = data
    }
}

const Toggle = async () => {
    DetailSubmitting.value = true;
    try {
        const response = isActive.value
            ? await api.post(`/recruitment/${id.value}/disable`)
            : await api.post(`/recruitment/${id.value}/enable`)
        DetailDialog.value = false;
        UpdateList(response.data.vacancy);
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
        DetailSubmitting.value = false;
    }
}

const positions = ref([]);
const steps = ref([]);
const companies = ref([]);
const departments = ref([]);
const schedules = ref([]);
const sexes = ref([]);
const levels = ref([]);
const employmentstatuses = ref([]);

const filteredCompanies = ref([]);
const filteredDepartments = ref([]);
const filteredSchedules = ref([]);
const filteredSexes = ref([]);
const filteredLevels = ref([]);
const filteredEmploymentStatuses = ref([]);

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

const filterCompanyFn = createFilterFn(companies, filteredCompanies);
const filterDepartmentFn = createFilterFn(departments, filteredDepartments);
const filterScheduleFn = createFilterFn(schedules, filteredSchedules);
const filterSexFn = createFilterFn(sexes, filteredSexes);
const filterLevelFn = createFilterFn(levels, filteredLevels);
const filterEmploymentStatusFn = createFilterFn(employmentstatuses, filteredEmploymentStatuses);

const LoadRecruitmentSteps = async (id) => {
    try {
        const response = await api.get(`/option/recruitmentsteps?id=${id}`);
        steps.value = response.data[0]?.rates;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadCompanies = async () => {
    try {
        const response = await api.get(`/option/companies`);
        companies.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadDepartments = async () => {
    try {
        const response = await api.get(`/option/departments`);
        departments.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadRecruitmentSchedules = async () => {
    try {
        const response = await api.get(`/option/recruitmentschedules`);
        schedules.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadSexes = async () => {
    try {
        const response = await api.get(`/option/sexes`);
        sexes.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadSchoolLevels = async () => {
    try {
        const response = await api.get(`/option/schoollevels`);
        levels.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadEmploymentStatuses = async () => {
    try {
        const response = await api.get(`/option/employmentstatuses`);
        employmentstatuses.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadPositions = async () => {
    try {
        const response = await api.get(`/option/recruitmentpositions`);
        positions.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadPositionQualifications = async (id) => {
    try {
        const response = await api.get(`/option/recruitmentqualifications?positionId=${id}`);
        qualifications.value = response.data[0];
    } catch (error) {
        console.error("Error fetching options:", error);
    }
}

const formatTime = (time) => {
    if (!time) return ''
    return moment(time, 'HH:mm').format('hh:mm A')
}

const formatDate = (date) => {
    if (!date) return ''
    return moment(date).format('MMMM Do, YYYY')
}

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

const formatSignature = (sign) => {
    return `${process.env.VUE_APP_BACKEND_URL}${sign.signature}`
}

const formatToggle = (info) => !!info?.isActive;

const canApprove = computed(() => {
    if (!info.value?.requests || info.value.requests.length === 0) return false;

    // Sort signatories by order
    const sorted = [...info.value.requests].sort(
        (a, b) => a.signatory.order - b.signatory.order
    );

    // Find the first pending request
    const nextPending = sorted.find(req => req.status === 'Pending');
    if (!nextPending) return false;

    // Check if the current user matches the next pending signatory
    return nextPending.signatory.userId === AuthStore.user?.id;
});

watch(salary, (newValue) => {
    const id = newValue.positionId;
    if (newValue) {
        LoadPositionQualifications(id);
        LoadRecruitmentSteps(newValue.id);
    }
})

const printDialog = ref(false);
const pdf = ref(null);

const PrintManpowerRequisition = async () => {
    DetailSubmitting.value = true;
    try {
        const res = await api.get(`/recruitment/${id.value}/pdf`, {
            responseType: 'arraybuffer',
        })
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const pdfurl = window.URL.createObjectURL(blob) + "#view=FitW";
        pdf.value = pdfurl
        printDialog.value = true;
        DetailSubmitting.value = false;
    } catch (error) {
        DetailSubmitting.value = false;
        console.error("Error generating PDF:", error);
    }
}

onMounted(() => {
    LoadAll();
})
</script>