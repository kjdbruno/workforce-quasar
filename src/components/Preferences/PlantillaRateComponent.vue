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
                @click="ModifyDialog(data)"
                class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm"
                v-ripple
            >
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ data.class?.name }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-grey">{{ data.grade?.name }}</div>
                    </q-card-section>
                    <div
                        class="absolute-top-left q-ma-sm"
                        style="width: 7px; height: 7px; border-radius: 50%;"
                        :class="data.isActive ? 'bg-positive' : 'bg-negative'"
                    ></div>
            </q-card>
        </div>
    </div>

    <!-- Dialog -->
    <q-dialog v-model="dialog" full-height position="right" persistent square>
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">{{ isEdit ? 'modify rate' : 'create new rate' }}</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div>
                    <div class="row q-col-gutter-xs q-mb-xs">
                        <div class="col-4">
                            <q-select
                                outlined
                                v-model="classId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredClasses"
                                label="Choose Salary Class"
                                @filter="filterClassFn"
                                :error="Errors.classId.type"
                                dropdown-icon="keyboard_arrow_down"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        v-if="Errors.classId.type"
                                        name="error"
                                        color="negative"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div v-for="(msg, i) in Errors.classId.messages" :key="i" class="text-capitalize">
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-select>
                        </div>
                        <div class="col-4">
                            <q-select
                                outlined
                                v-model="gradeId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredGrades"
                                label="Choose Salary Grade"
                                @filter="filterGradeFn"
                                :error="Errors.gradeId.type"
                                dropdown-icon="keyboard_arrow_down"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        v-if="Errors.gradeId.type"
                                        name="error"
                                        color="negative"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div v-for="(msg, i) in Errors.gradeId.messages" :key="i" class="text-capitalize">
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-select>
                        </div>
                    </div>
                </div>

                <div class="q-mt-xl">
                    <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in steps" :key="index">
                        <div class="col-2">
                            <q-input v-model="value.name" outlined label="Step Increment" readonly />
                        </div>
                        <div class="col-2">
                            <q-input
                                v-model="value.monthlyCompensation"
                                outlined
                                label="Monthly"
                                :error="Errors.rates[index]?.monthlyCompensation?.type"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        v-if="Errors.rates[index]?.monthlyCompensation?.type"
                                        name="error"
                                        color="negative"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div
                                                v-for="(msg, i) in Errors.rates[index]?.monthlyCompensation?.messages"
                                                :key="i"
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="col-2">
                            <q-input
                                v-model="value.dailyCompensation"
                                outlined
                                label="Daily"
                                :error="Errors.rates[index]?.dailyCompensation?.type"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        v-if="Errors.rates[index]?.dailyCompensation?.type"
                                        name="error"
                                        color="negative"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div
                                                v-for="(msg, i) in Errors.rates[index]?.dailyCompensation?.messages"
                                                :key="i"
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="col-2">
                            <q-input
                                v-model="value.hourlyCompensation"
                                outlined
                                label="Hourly"
                                :error="Errors.rates[index]?.hourlyCompensation?.type"
                                :no-error-icon="true"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        v-if="Errors.rates[index]?.hourlyCompensation?.type"
                                        name="error"
                                        color="negative"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                            <div
                                                v-for="(msg, i) in Errors.rates[index]?.hourlyCompensation?.messages"
                                                :key="i"
                                                class="text-capitalize"
                                            >
                                                <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg }}
                                            </div>
                                        </q-tooltip>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
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

    <!-- Footer -->
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
import { usePreferenceStore } from 'src/stores/preference-store';
import { reactive, ref, watch, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { Toast } from 'src/boot/sweetalert';

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const id = ref('');
const classId = ref('');
const gradeId = ref('');
const steps = ref([]);
const isActive = ref(false);

const Errors = reactive({
    classId: { type: null, messages: [] },
    gradeId: { type: null, messages: [] },
    rates: []
});

const initializeSteps = (increments, existing = []) => {
    return increments.map(i => {
        const found = existing.find(e => e.stepId === i.value);
        return {
            stepId: i.value,
            name: i.label,
            monthlyCompensation: found ? found.monthlyCompensation : "",
            dailyCompensation: found ? found.dailyCompensation : "",
            hourlyCompensation: found ? found.hourlyCompensation : "",
            isActive: found ? found.isActive : false,
            id: found ? found.id : ""
        };
    });
};

const Validations = () => {
    
    let isError = false;

    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].messages = [];
    });
    Errors.rates = steps.value.map(() => ({
        monthlyCompensation: { type: null, messages: [] },
        dailyCompensation: { type: null, messages: [] },
        hourlyCompensation: { type: null, messages: [] }
    }));

    if (!classId.value) {
        Errors.classId.type = true;
        Errors.classId.messages.push('salary class is required');
        isError = true;
    }

    if (!gradeId.value) {
        Errors.gradeId.type = true;
        Errors.gradeId.messages.push('salary grade is required');
        isError = true;
    }

    steps.value.forEach((q, index) => {
        if (!q.monthlyCompensation || isNaN(q.monthlyCompensation) || Number(q.monthlyCompensation) <= 0) {
            Errors.rates[index].monthlyCompensation.type = true;
            Errors.rates[index].monthlyCompensation.messages.push('Monthly compensation is required and must be valid');
            isError = true;
        }
        if (!q.dailyCompensation || isNaN(q.dailyCompensation) || Number(q.dailyCompensation) <= 0) {
            Errors.rates[index].dailyCompensation.type = true;
            Errors.rates[index].dailyCompensation.messages.push('Daily compensation is required and must be valid');
            isError = true;
        }
        if (!q.hourlyCompensation || isNaN(q.hourlyCompensation) || Number(q.hourlyCompensation) <= 0) {
            Errors.rates[index].hourlyCompensation.type = true;
            Errors.rates[index].hourlyCompensation.messages.push('Hourly compensation is required and must be valid');
            isError = true;
        }
    });

    if (isError) {
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                <div class="text-caption">Something went wrong.</div>
            `
        });
    }

    return !isError;
};

const rows = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);
const loading = ref(false);
const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/rate`, {
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
};

watch(filter, () => {
    page.value = 1;
    LoadAll();
});

const NextPage = () => { if (page.value < meta.value.TotalPages) { page.value++; LoadAll(); } };
const PreviousPage = () => { if (page.value > 1) { page.value--; LoadAll(); } };
const FirstPage = () => { if (page.value > 1) { page.value = 1; LoadAll(); } };
const LastPage = () => { if (page.value < meta.value.TotalPages) { page.value = meta.value.TotalPages; LoadAll(); } };

const increments = ref([]);
const classes = ref([]);
const grades = ref([]);
const filteredClasses = ref([]);
const filteredGrades = ref([]);

const NewDialog = () => {
    ResetForm();
    dialog.value = true;
    isEdit.value = false;
    steps.value = initializeSteps(increments.value);
};

const ModifyDialog = async (data) => {
    ResetForm();
    dialog.value = true;
    isEdit.value = true;
    id.value = data.id;
    if (!classes.value.length || !grades.value.length) {
        await LoadOptions();
    }
    filteredClasses.value = [...classes.value];
    filteredGrades.value = [...grades.value];
    classId.value = classes.value.find(p => p.value === data.classId)?.value || null;
    gradeId.value = grades.value.find(p => p.value === data.gradeId)?.value || null;
    steps.value = initializeSteps(increments.value, data.rates);
    isActive.value = !!data.isActive;
};

const ResetForm = () => {
    id.value = '';
    classId.value = '';
    gradeId.value = '';
    isActive.value = false;
    Errors.classId.type = null;
    Errors.gradeId.type = null;
    Errors.rates = [];
};

const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = id.value && isEdit.value
            ? await api.post(`/rate/${id.value}/update`, { 
                classId: classId.value, 
                gradeId: gradeId.value,
                rates: steps.value 
            })
            : await api.post('/rate', { 
                classId: classId.value, 
                gradeId: gradeId.value,
                rates: steps.value 
            });

        dialog.value = false;
        if (id.value && isEdit.value) {
            UpdateList(response.data.rate);
        } else {
            LoadAll();
        }
        Toast.fire({ icon: "success", html: `<div class="text-h6 text-bold text-uppercase">granted!</div><div class="text-caption text-capitalize;">${response.data.message}<div>` });
    } catch (e) {
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
            Toast.fire({ icon: "error", html: `<div class="text-h6 text-bold text-uppercase">Request Failed</div><div class="text-caption">Something went wrong.</div>` });
        }
    } finally {
        ResetForm();
        submitLoading.value = false;
    }
};

const applyBackendErrors = (backendErrors) => {
    const errorsArray = Array.isArray(backendErrors) ? backendErrors : backendErrors?.errors || [];
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].messages = [];
    });
    errorsArray.forEach(err => {
        if (Errors[err.path] !== undefined) {
            Errors[err.path].type = true;
            Errors[err.path].messages.push(err.msg);
        }
    });
};

const UpdateList = (data) => {
    const index = rows.value.findIndex(item => item.id === data.id);
    if (index !== -1) rows.value[index] = data;
    console.log('to')
};

const Toggle = async () => {
    submitLoading.value = true;
    try {
        const response = isActive.value
            ? await api.post(`/rate/${id.value}/disable`)
            : await api.post(`/rate/${id.value}/enable`);
        dialog.value = false;
        UpdateList(response.data.rate);
        Toast.fire({ icon: "success", html: `<div class="text-h6 text-bold text-uppercase">granted!</div><div class="text-caption text-capitalize;">${response.data.message}<div>` });
    } catch (e) {
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
            Toast.fire({ icon: "error", html: `<div class="text-h6 text-bold text-uppercase">Request Failed</div><div class="text-caption">Something went wrong.</div>` });
        }
    } finally {
        submitLoading.value = false;
    }
};

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
const filterClassFn = createFilterFn(classes, filteredClasses);
const filterGradeFn = createFilterFn(grades, filteredGrades);

const LoadOptions = async () => {
    try {
        const response = await api.get(`/option`);
        classes.value = response.data.salaryclass;
        grades.value = response.data.salarygrade;
        increments.value = response.data.increment || [];
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

onMounted(() => {
    LoadAll();
    LoadOptions();
});
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
</style>
