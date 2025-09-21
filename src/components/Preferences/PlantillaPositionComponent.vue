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
                        <div class="text-subtitle2 text-uppercase">{{ data.name }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-grey">{{ data.salary?.grade?.name }}</div>
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
                    <div class="text-h6 text-uppercase">{{ isEdit ? 'modify position' : 'create new position' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-4">
                                <q-select
                                    outlined
                                    v-model="salaryId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredSalaries"
                                    label="Choose Salary"
                                    @filter="filterSalaryFn"
                                    :error="Errors.salaryId.type"
                                    dropdown-icon="keyboard_arrow_down"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon
                                            v-if="Errors.salaryId.type"
                                            name="error"
                                            color="negative"
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.salaryId.messages" :key="i" class="text-capitalize">
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
                                <q-input 
                                    v-model="name" 
                                    outlined 
                                    label="Name" 
                                    :error="Errors.name.type"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon 
                                            v-if="Errors.name.type" 
                                            name="error" 
                                            color="negative" 
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.name.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-4">
                                <q-input 
                                    v-model="description" 
                                    outlined 
                                    label="Job Description" 
                                    :error="Errors.description.type" 
                                    type="textarea"
                                    :no-error-icon="true"
                                >
                                    <template v-slot:append>
                                        <q-icon 
                                            v-if="Errors.description.type" 
                                            name="error" 
                                            color="negative" 
                                            class="cursor-pointer"
                                            size="xs"
                                        >
                                            <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                <div v-for="(msg, i) in Errors.description.messages" :key="i" class="text-capitalize">
                                                    <q-icon name="error" color="white" size="xs"/>&nbsp;{{ msg || 'Invalid input' }}
                                                </div>
                                            </q-tooltip>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                        </div>
                    </div>
                    <div class="q-mt-xl">
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-4">
                                <div v-for="(value, index) in qualifications" :key="index" class="q-mb-xs">
                                    <q-input
                                        v-model="value.name"
                                        outlined
                                        :label="`Qualification ${index + 1}`"
                                        :error="Errors.qualifications[index]?.type"
                                        :no-error-icon="true"
                                    >
                                        <template v-slot:append>
                                            <q-icon
                                                v-if="Errors.qualifications[index]?.type"
                                                name="error"
                                                color="negative"
                                                class="cursor-pointer"
                                                size="xs"
                                            >
                                                <q-tooltip anchor="top middle" self="center middle" class="bg-negative">
                                                    <div
                                                        v-for="(msg, i) in Errors.qualifications[index]?.messages"
                                                        :key="i"
                                                        class="text-capitalize"
                                                    >
                                                        <q-icon name="error" color="white" size="xs" />&nbsp;{{ msg || 'Invalid input' }}
                                                    </div>
                                                </q-tooltip>
                                            </q-icon>
                                        <q-btn
                                            v-if="qualifications.length > 1"
                                            flat unelevated round icon="block" size="sm"
                                            @click="remove(index)"
                                        />
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                        <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="add" @click="Add" outline/>
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
    watch,
    nextTick 
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const id = ref('');
const salaryId = ref('');
const name = ref('');
const description = ref('');
const qualifications = ref([
    { id: "", name: "" }
]);
const isActive = ref(false);

const Errors = reactive({
    salaryId: {
        type: null, messages: []
    },
    name: { 
        type: null, messages: []
    },
    description: {
        type: null, messages: []
    },
    qualifications: []
});

const Validations = () => {
    
    let isError = false;

    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].messages = [];
    });
    Errors.qualifications = qualifications.value.map(() => ({ type: null, messages: [] }))

    if (!salaryId.value) {
        Errors.salaryId.type = true
        Errors.salaryId.messages.push('Salary is required')
        isError = true
    } else {
        Errors.salaryId.type = null
    }
    
    if (!name.value) {
        Errors.name.type = true
        Errors.name.messages.push('Name is required')
        isError = true
    } else {
        Errors.name.type = null
    }

    if (!description.value) {
        Errors.description.type = true
        Errors.description.messages.push('Name is required')
        isError = true
    } else {
        Errors.description.type = null
    }

    qualifications.value.forEach((q, index) => {
        if (!q.name || !q.name.trim()) {
            Errors.qualifications[index].type = true
            Errors.qualifications[index].messages.push('Qualification is required')
            isError = true
        }
    })
    
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
        const { data } = await api.get(`/position`, {
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
    dialog.value = true;
    isEdit.value = false;
}

const ModifyDialog = async (data) => {
    ResetForm();
    dialog.value = true;
    isEdit.value = true;
    id.value = data.id;
    if (!salaries.value.length) {
        await LoadOptions();
    }
    filteredSalaries.value = [...salaries.value];
    salaryId.value = salaries.value.find(p => p.value === data.salaryId)?.value || null;
    name.value = data.name;
    description.value = data.description;
    qualifications.value = data.qualifications;
    isActive.value = (data.isActive ? true : false);
}

const ResetForm = () => {
    id.value = '';
    salaryId.value = '';
    name.value = '';
    description.value = '';
    qualifications.value = [{ id: "", name: "" }];
    isActive.value = false;
    Errors.salaryId.type = null;
    Errors.name.type = null;
    Errors.description.type = null;
    Errors.qualifications = [];
}

const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = id.value && isEdit
            ? await api.post(`/position/${id.value}/update`, {
                salaryId: salaryId.value,
                name: name.value,
                description: description.value,
                qualifications: qualifications.value
            })
            : await api.post('/position', {
                salaryId: salaryId.value,
                name: name.value,
                description: description.value,
                qualifications: qualifications.value
            });
        dialog.value = false;
        if (id.value && isEdit) {
            UpdateList(response.data.position);
        } else {
            LoadAll();
        }
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
        ResetForm();
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

const UpdateList = (data) => {
    const index = rows.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        rows.value[index] = data
    }
}

const Toggle = async () => {
    submitLoading.value = true;
    try {
        const response = isActive.value
            ? await api.post(`/position/${id.value}/disable`)
            : await api.post(`/position/${id.value}/enable`)
        dialog.value = false;
        UpdateList(response.data.position)
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

const qualificationInputs = ref([]);

const Add = async () => {

    qualifications.value.unshift({
        id: "",
        name: ""
    });

    await nextTick();
    if (qualificationInputs.value[0]) {
        qualificationInputs.value[0].focus();
    }
}

const remove = (index) => {
    qualifications.value.splice(index, 1);
}

const salaries = ref([]);

const createFilterFn = (sourceRef, targetRef) => {
    return (val, update) => {
        update(() => {
            if (!val) {
                targetRef.value = sourceRef.value.slice(0, 5);
            } else {
                const needle = val.toLowerCase().trim()
                targetRef.value = sourceRef.value
                    .filter(v => (v.label ?? '').toLowerCase().includes(needle))
                    .slice(0, 5)
            }
        })
    }
}

const filteredSalaries = ref([]);
const filterSalaryFn = createFilterFn(salaries, filteredSalaries);

const LoadOptions = async () => {
    try {
        const response = await api.get(`/option`);
        salaries.value = response.data.salary;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

onMounted(() => {
    LoadOptions();
    LoadAll();
})

</script>

<style scoped>
.card {
    height: 250px;
    width: 225px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.card-hover-animate {
    transition: border-color 0.3s ease, transform 0.2s ease;
}

.card-hover-animate:hover {
  transform: scale(1.02); /* optional zoom effect */
}

.card-overlay {
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.6);
    opacity: 0;
    transition: opacity 0.5s ease;
}
.card:hover .card-overlay {
    opacity: 1;
}
/* Smooth fade + slide */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>