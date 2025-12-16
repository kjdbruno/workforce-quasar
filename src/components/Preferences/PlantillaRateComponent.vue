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
                        <q-card-section class="text-center full-width q-pa-none">
                            <div class="text-subtitle1 text-uppercase">{{ data?.positions?.name }}</div>
                            <div class="text-caption text-grey">{{ data?.class?.name }}</div>
                        </q-card-section>
                        <q-card-section class="q-pa-none">
                            <div class="text-caption">{{ data?.grade?.name }}</div>
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
    <q-dialog v-model="dialog" full-height position="right" persistent square class="dialog">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">{{ isEdit ? 'modify rate' : 'create new rate' }}</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="q-mb-md">
                    <div class="q-mb-sm">
                        <span class="text-caption text-uppercase text-grey q-mr-sm">choose salary class</span>
                        <q-icon
                            :name="Errors.salaryId.type ? 'error' : 'info'"
                            :color="Errors.salaryId.type ? 'negative' : 'grey'"
                            class="cursor-pointer"
                            size="xs"
                        >
                            <q-tooltip anchor="top middle" self="center middle" :class="Errors.salaryId.type ? 'bg-negative' : 'bg-grey'">
                                <template v-if="Errors.salaryId.type">
                                    <div 
                                        v-for="(msg, i) in Errors.salaryId.messages" 
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
                            v-for="(data, index) in salaries"
                            :key="`data-${data.id}`"
                            class="inner-card-anim-wrapper"
                            :style="{ animationDelay: `${index * 120}ms` }"
                        >
                            <q-card 
                                class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" 
                                tag="label"
                                :class="{ 'card--active': salaryId === data.id }"
                                @click="salaryId = data.id"
                            >
                                <q-card-section class="text-center full-width q-pa-none">
                                    <div class="text-subtitle1 text-uppercase">{{ data?.positions?.name }}</div>
                                    <div class="text-caption text-grey">{{ data?.class?.name }}</div>
                                </q-card-section>
                                <q-card-section class="q-pa-none">
                                    <div class="text-caption">{{ data?.grade?.name }}</div>
                                    <div class="text-caption text-grey">{{ data?.status }}</div>
                                </q-card-section>
                                <div class="checkmark-overlay">
                                    <q-radio
                                        v-model="vacancyId"
                                        :val="data.id"
                                        checked-icon="task_alt"
                                        unchecked-icon="panorama_fish_eye"
                                        size="md"
                                    />
                                </div>
                            </q-card>
                        </div>
                    </div>
                </div>
                <div class="row q-col-gutter-xs">
                    <div class="col-2">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">step increment</span>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">Monthly Compensation</span>
                            <q-icon
                                :name="Errors.globalMessages?.monthly?.length ? 'error' : 'info'"
                                :color="Errors.globalMessages?.monthly?.length ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip
                                    anchor="top middle"
                                    self="center middle"
                                    :class="Errors.globalMessages?.monthly?.length ? 'bg-negative' : 'bg-grey'"
                                >
                                    <template v-if="Errors.globalMessages?.monthly?.length">
                                        <div
                                            v-for="(msg, i) in Errors.globalMessages.monthly"
                                            :key="i"
                                            class="text-capitalize"
                                        >
                                            <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg }}
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
                    </div>
                    <div class="col-2">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">daily Compensation</span>
                            <q-icon
                                :name="Errors.globalMessages?.daily?.length ? 'error' : 'info'"
                                :color="Errors.globalMessages?.daily?.length ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip
                                    anchor="top middle"
                                    self="center middle"
                                    :class="Errors.globalMessages?.daily?.length ? 'bg-negative' : 'bg-grey'"
                                >
                                    <template v-if="Errors.globalMessages?.daily?.length">
                                        <div
                                            v-for="(msg, i) in Errors.globalMessages.daily"
                                            :key="i"
                                            class="text-capitalize"
                                        >
                                            <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg }}
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
                    </div>
                    <div class="col-2">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">hourly Compensation</span>
                            <q-icon
                                :name="Errors.globalMessages?.hourly?.length ? 'error' : 'info'"
                                :color="Errors.globalMessages?.hourly?.length ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip
                                    anchor="top middle"
                                    self="center middle"
                                    :class="Errors.globalMessages?.hourly?.length ? 'bg-negative' : 'bg-grey'"
                                >
                                    <template v-if="Errors.globalMessages?.hourly?.length">
                                        <div
                                            v-for="(msg, i) in Errors.globalMessages.hourly"
                                            :key="i"
                                            class="text-capitalize"
                                        >
                                            <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg }}
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
                    </div>
                </div>
                <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in steps" :key="index">
                    <div class="col-2">
                        <q-input 
                            v-model="value.name" 
                            outlined  
                            readonly 
                            input-class="text-capitalize"
                        />
                    </div>
                    <div class="col-2">
                        <q-input
                            v-model="value.monthlyCompensation"
                            outlined
                            :error="Errors.rates[index]?.monthlyCompensation?.type"
                            :no-error-icon="true"
                        />
                    </div>
                    <div class="col-2">
                        <q-input
                            v-model="value.dailyCompensation"
                            outlined
                            :error="Errors.rates[index]?.dailyCompensation?.type"
                            :no-error-icon="true"
                        />
                    </div>
                    <div class="col-2">
                        <q-input
                            v-model="value.hourlyCompensation"
                            outlined
                            :error="Errors.rates[index]?.hourlyCompensation?.type"
                            :no-error-icon="true"
                        />
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
import { reactive, ref, watch, onMounted, onBeforeMount } from 'vue';
import { api } from 'src/boot/axios';
import { Toast } from 'src/boot/sweetalert';

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const id = ref('');
const salaryId = ref('');
const steps = ref([]);
const isActive = ref(false);

const Errors = reactive({
    salaryId: { type: null, messages: [] },
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

    if (!salaryId.value) {
        Errors.salaryId.type = true;
        Errors.salaryId.messages.push('salary class is required');
        isError = true;
    }

    const globalMessages = {
        monthly: new Set(),
        daily: new Set(),
        hourly: new Set()
    };

    steps.value.forEach((q, index) => {
        if (!q.monthlyCompensation || isNaN(q.monthlyCompensation) || Number(q.monthlyCompensation) <= 0) {
        Errors.rates[index].monthlyCompensation.type = true;
        globalMessages.monthly.add('Monthly compensation is required and must be valid');
        isError = true;
        }

        if (!q.dailyCompensation || isNaN(q.dailyCompensation) || Number(q.dailyCompensation) <= 0) {
        Errors.rates[index].dailyCompensation.type = true;
        globalMessages.daily.add('Daily compensation is required and must be valid');
        isError = true;
        }

        if (!q.hourlyCompensation || isNaN(q.hourlyCompensation) || Number(q.hourlyCompensation) <= 0) {
        Errors.rates[index].hourlyCompensation.type = true;
        globalMessages.hourly.add('Hourly compensation is required and must be valid');
        isError = true;
        }
    });

    Errors.globalMessages = {
        monthly: Array.from(globalMessages.monthly),
        daily: Array.from(globalMessages.daily),
        hourly: Array.from(globalMessages.hourly)
    };

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

const NextPage = () => { 
    if (page.value < meta.value.TotalPages) { 
        page.value++; 
        LoadAll(); 
    }
};

const PreviousPage = () => { 
    if (page.value > 1) { 
        page.value--; 
        LoadAll(); 
    } 
};

const FirstPage = () => { 
    if (page.value > 1) { 
        page.value = 1; 
        LoadAll(); 
    } 
};

const LastPage = () => { 
    if (page.value < meta.value.TotalPages) { 
        page.value = meta.value.TotalPages;
        LoadAll(); 
    } 
};

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
    salaryId.value = data.salaryId;
    steps.value = initializeSteps(increments.value, data.rates);
    isActive.value = !!data.isActive;
};

const ResetForm = () => {
    id.value = '';
    salaryId.value = '';
    isActive.value = false;
    Errors.salaryId.type = null;
    Errors.rates = [];
    Errors.rates = steps.value.map(() => ({
        monthlyCompensation: { type: null, messages: [] },
        dailyCompensation: { type: null, messages: [] },
        hourlyCompensation: { type: null, messages: [] }
    }));

    Errors.globalMessages = {
        monthly: [],
        daily: [],
        hourly: []
    };
};

const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = id.value && isEdit.value
            ? await api.post(`/rate/${id.value}/update`, { 
                salaryId: salaryId.value, 
                rates: steps.value 
            })
            : await api.post('/rate', { 
                salaryId: salaryId.value, 
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
};

const Toggle = async () => {
    submitLoading.value = true;
    try {
        const response = isActive.value
            ? await api.post(`/rate/${id.value}/disable`)
            : await api.post(`/rate/${id.value}/enable`);
        dialog.value = false;
        UpdateList(response.data.rate);
        Toast.fire({ 
            icon: "success", 
            html: `<div class="text-h6 text-bold text-uppercase">granted!</div><div class="text-caption text-capitalize;">${response.data.message}<div>` 
        });
    } catch (e) {
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
            Toast.fire({ 
                icon: "error", 
                html: `<div class="text-h6 text-bold text-uppercase">Request Failed</div><div class="text-caption">Something went wrong.</div>` 
            });
        }
    } finally {
        submitLoading.value = false;
    }
};

const increments = ref([]);
const salaries = ref([]);

const LoadSalaries = async () => {
    try {
        const response = await api.get(`/option/salaryrates`);
        salaries.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadIncrements = async () => {
    try {
        const response = await api.get(`/option/increments`);
        increments.value = response.data || [];
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

onBeforeMount(() => {
    LoadSalaries();
    LoadIncrements();
})

onMounted(() => {
    LoadAll();
});
</script>

<style scoped>

</style>
