<template>
    <div>
        <div class="card-grid">
            <div
                v-for="(data, index) in rows"
                :key="`data-${data.id}`"
                class="card-anim-wrapper"
                :style="{ animationDelay: `${index * 120}ms` }"
            >
                <q-card
                    @click="NewDialog(data)"
                    class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm"
                    v-ripple
                    >
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ data.name }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-uppercase">{{ data.salary?.grade?.name }}</div>
                        <div class="text-caption text-grey">{{ data.status }}</div>
                    </q-card-section>
                    <div
                        class="absolute-top-left q-ma-sm"
                        style="width: 7px; height: 7px; border-radius: 50%;"
                        :class="data.isActive ? 'bg-positive' : 'bg-negative'"
                    ></div>
                </q-card>
            </div>
        </div>
        <q-dialog v-model="dialog" full-height position="right" persistent square>
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">create opening</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-6">
                            <div class="q-mb-md">
                                <div class="text-body1 text-uppercase text-bold">position</div>
                                <div class="text-weight-light" style="font-size: 1.8em;">{{ positions?.name }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-body1 text-uppercase text-bold">job description</div>
                                <div class="text-weight-light">{{ positions?.description }}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="q-mb-md">
                                <div class="text-body1 text-uppercase text-bold">status</div>
                                <div class="text-weight-light" style="font-size: 1.8em;">{{ positions?.status }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-body1 text-uppercase text-bold">job qualifications</div>
                                <div>
                                    <q-chip square outline color="primary" text-color="white" v-for="dt in positions.qualifications">
                                        {{ dt?.name }}
                                    </q-chip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="q-mt-lg">
                        <div class="text-body1 text-uppercase text-bold q-mb-sm">position profile</div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-3">
                                <q-select
                                    outlined
                                    v-model="stepId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredSteps"
                                    label="Choose Step"
                                    @filter="filterStepFn"
                                    :error="Errors.stepId.type"
                                    dropdown-icon="keyboard_arrow_down"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon
                                            v-if="Errors.stepId.type"
                                            name="error"
                                            color="negative"
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.stepId.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                    <template v-slot:option="scope">
                                        <q-item v-bind="scope.itemProps">
                                            <q-item-section>
                                                <q-item-label>{{ scope.opt.class }}</q-item-label>
                                                <q-item-label>{{ scope.opt.label }}</q-item-label>
                                                <q-item-label caption>{{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(scope.opt.monthly) }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-3">
                                <q-select
                                    outlined
                                    v-model="companyId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredCompanies"
                                    label="Choose Company"
                                    @filter="filterCompanyFn"
                                    :error="Errors.companyId.type"
                                    dropdown-icon="keyboard_arrow_down"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon
                                            v-if="Errors.companyId.type"
                                            name="error"
                                            color="negative"
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.companyId.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-3">
                                <q-select
                                    outlined
                                    v-model="departmentId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredDepartments"
                                    label="Choose Department"
                                    @filter="filterDepartmentFn"
                                    :error="Errors.departmentId.type"
                                    dropdown-icon="keyboard_arrow_down"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon
                                            v-if="Errors.departmentId.type"
                                            name="error"
                                            color="negative"
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.departmentId.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-3">
                                <q-select
                                    outlined
                                    v-model="shiftId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredSchedules"
                                    label="Choose Schedule"
                                    @filter="filterScheduleFn"
                                    :error="Errors.shiftId.type"
                                    dropdown-icon="keyboard_arrow_down"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon
                                            v-if="Errors.shiftId.type"
                                            name="error"
                                            color="negative"
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.shiftId.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-6">
                                <q-input 
                                    v-model="location" 
                                    outlined 
                                    label="Work Location" 
                                    :error="Errors.location.type"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon 
                                            v-if="Errors.location.type" 
                                            name="error" 
                                            color="negative" 
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.location.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-3">
                                <q-input 
                                    v-model="date" 
                                    outlined 
                                    label="Date Needed" 
                                    :error="Errors.date.type"
                                    :no-error-icon="true"
                                    type="date"
                                >
                                    <template v-slot:append>
                                        <q-icon 
                                            v-if="Errors.date.type" 
                                            name="error" 
                                            color="negative" 
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.date.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-3">
                                <q-select
                                    outlined
                                    v-model="employmentId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredEmploymentStatuses"
                                    label="Choose Employment Status"
                                    @filter="filterEmploymentStatusFn"
                                    :error="Errors.employmentId.type"
                                    dropdown-icon="keyboard_arrow_down"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon
                                            v-if="Errors.employmentId.type"
                                            name="error"
                                            color="negative"
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.employmentId.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-4">
                                <div>
                                    <q-radio v-model="movement" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Addition" label="addition to department"  class="text-uppercase" />
                                    <q-radio v-model="movement" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Replacement" label="replacement"  class="text-uppercase" />
                                </div>
                                <div>
                                    <q-input 
                                        v-model="justification" 
                                        outlined 
                                        label="Justification" 
                                        :error="Errors.justification.type"
                                        :no-error-icon="true"
                                        type="textarea"
                                    >
                                        <template v-slot:append>
                                            <q-icon 
                                                v-if="Errors.justification.type" 
                                                name="error" 
                                                color="negative" 
                                                class="cursor-pointer"
                                                size="xs"
                                            >
                                                <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                    <div v-for="(msg, i) in Errors.justification.messages" :key="i" class="text-capitalize">
                                                        <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                    </div>
                                                </q-tooltip>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div>
                                    <q-checkbox right-label v-model="needBackgroundCheck" label="nedd background check" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" class="text-uppercase"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="q-mt-lg">
                        <div class="text-body1 text-uppercase text-bold q-mb-sm">other qualifications</div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-xs">
                        <div class="col-2">
                            <q-select
                                outlined
                                v-model="sexId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredSexes"
                                label="Choose Sex"
                                @filter="filterSexFn"
                                :error="Errors.sexId.type"
                                dropdown-icon="keyboard_arrow_down"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        v-if="Errors.sexId.type"
                                        name="error"
                                        color="negative"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div v-for="(msg, i) in Errors.sexId.messages" :key="i" class="text-capitalize">
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-select>
                        </div>
                        <div class="col-2">
                            <q-input 
                                v-model="ageRange" 
                                outlined 
                                label="Age Range" 
                                :error="Errors.ageRange.type"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon 
                                        v-if="Errors.ageRange.type" 
                                        name="error" 
                                        color="negative" 
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div v-for="(msg, i) in Errors.ageRange.messages" :key="i" class="text-capitalize">
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="col-2">
                            <q-select
                                outlined
                                v-model="levelId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredLevels"
                                label="Choose School Level"
                                @filter="filterLevelFn"
                                :error="Errors.levelId.type"
                                dropdown-icon="keyboard_arrow_down"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        v-if="Errors.levelId.type"
                                        name="error"
                                        color="negative"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div v-for="(msg, i) in Errors.levelId.messages" :key="i" class="text-capitalize">
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-select>
                        </div>
                        <div class="col-2">
                            <q-input 
                                v-model="yearExperience" 
                                outlined 
                                label="Year/s of Experience" 
                                :error="Errors.yearExperience.type"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon 
                                        v-if="Errors.yearExperience.type" 
                                        name="error" 
                                        color="negative" 
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div v-for="(msg, i) in Errors.yearExperience.messages" :key="i" class="text-capitalize">
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
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
    usePreferenceStore 
} from 'src/stores/preference-store';

import { 
    reactive,
    computed,
    onMounted,
    ref, 
    watch
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const id = ref('');
const positions = ref(null);
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

const Errors = reactive({
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
    }
});

const Validations = () => {

    let isError = false;

    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].messages = [];
    });

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

const NewDialog = (data) => {
    ResetForm();
    LoadOptions(data.id);
    dialog.value = true;
    positions.value = data;
}

const ResetForm = () => {
    id.value = '';
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

const steps = ref([]);
const companies = ref([]);
const departments = ref([]);
const schedules = ref([]);
const sexes = ref([]);
const levels = ref([]);
const employmentstatuses = ref([]);

const filteredSteps = ref([]);
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
const filterStepFn = createFilterFn(steps, filteredSteps);
const filterCompanyFn = createFilterFn(companies, filteredCompanies);
const filterDepartmentFn = createFilterFn(departments, filteredDepartments);
const filterScheduleFn = createFilterFn(schedules, filteredSchedules);
const filterSexFn = createFilterFn(sexes, filteredSexes);
const filterLevelFn = createFilterFn(levels, filteredLevels);
const filterEmploymentStatusFn = createFilterFn(employmentstatuses, filteredEmploymentStatuses);

const LoadOptions = async (id) => {
    try {
        const response = await api.get(`/option?positionId=${id}`);
        steps.value = response.data.recruitmentSteps;
        companies.value = response.data.recruitmentCompanies;
        departments.value = response.data.departments;
        schedules.value = response.data.recruitmentSchedules;
        sexes.value = response.data.sexes;
        levels.value = response.data.schoollevels;
        employmentstatuses.value = response.data.employmentstatuses;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

// const Save = async () => {

//     if (!Validations()) return;
//     submitLoading.value = true;
//     try {
//         const response = id.value && isEdit
//             ? await api.post(`/school/${id.value}/update`, {
//                 name: name.value,
//                 type: type.value,
//                 website: website.value,
//                 contactNo: contactNo.value
//             })
//             : await api.post('/school', {
//                 name: name.value,
//                 type: type.value,
//                 website: website.value,
//                 contactNo: contactNo.value
//             });
//         if (id.value && isEdit) {
//             UpdateList(response.data.school);
//         } else {
//             LoadAll();
//         }
//         dialog.value = false;
//         Toast.fire({
//             icon: "success",
//             html: `
//                 <div class="text-h6 text-bold text-uppercase">granted!</div>
//                 <div class="text-caption text-capitalize;">${response.data.message}<div>
//             `
//         });
//     } catch (e) {

//         if (e.response && e.response.data) {
//             applyBackendErrors(e.response.data);
//             Toast.fire({
//                 icon: "error",
//                 html: `
//                     <div class="text-h6 text-bold text-uppercase">Request Failed</div>
//                     <div class="text-caption">Something went wrong.</div>
//                 `
//             })
//         }

//     } finally {

//         ResetForm();
//         submitLoading.value = false;

//     }
// }

// const applyBackendErrors = (backendErrors) => {

//     const errorsArray = Array.isArray(backendErrors)
//         ? backendErrors
//         : backendErrors?.errors || []
        
//     Object.keys(Errors).forEach(key => {
//         Errors[key].type = null
//         Errors[key].messages = []
//     })
    
//     errorsArray.forEach(err => {
//         if (Errors[err.path] !== undefined) {
//             Errors[err.path].type = true
//             Errors[err.path].messages.push(err.msg)
//         }
//     })
// }

// const UpdateList = (data) => {

//     const index = rows.value.findIndex(item => item.id === data.id)
//     if (index !== -1) {
//         rows.value[index] = data
//     }

// }

// const Toggle = async () => {

//     submitLoading.value = true;
//     try {
//         const response = isActive.value
//             ? await api.post(`/school/${id.value}/disable`)
//             : await api.post(`/school/${id.value}/enable`)
//         UpdateList(response.data.school)
//         dialog.value = false;
//         Toast.fire({
//             icon: "success",
//             html: `
//                 <div class="text-h6 text-bold text-uppercase">granted!</div>
//                 <div class="text-caption text-capitalize;">${response.data.message}<div>
//             `
//         });
//     } catch (e) {

//         if (e.response && e.response.data) {
//             applyBackendErrors(e.response.data);
//             Toast.fire({
//                 icon: "error",
//                 html: `
//                     <div class="text-h6 text-bold text-uppercase">Request Failed</div>
//                     <div class="text-caption">Something went wrong.</div>
//                 `
//             })
//         }

//     } finally {

//         submitLoading.value = false;

//     }
// }

onMounted(() => {
    LoadAll();
})

</script>

<style scoped>
</style>