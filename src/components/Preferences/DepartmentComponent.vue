<template>
    <div>
        <div class="card-grid">
            <div class="card-anim-wrapper">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple @click="NewDialog()" >
                    <q-card-section>
                        <q-icon name="bi-plus-circle" color="grey" size="xl" />
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="loading">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section>
                        <q-spinner-ios color="dark"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-else-if="!loading && rows.length === 0">
                <q-card key="data-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" >
                    <q-card-section>
                        <div class="text-caption text-uppercase text-grey">no data found</div>
                    </q-card-section>
                </q-card>
            </div>
            <div v-for="(data, index) in rows" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }">
                <q-card @click="ModifyDialog(data)" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple>
                    <q-card-section>
                        <div class="text-subtitle2 text-uppercase">{{ data.name }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-caption text-grey">{{ data.alias }}</div>
                    </q-card-section>
                    <div class="absolute-top-left q-ma-sm" style="width: 7px; height: 7px; border-radius: 50%;" :class="data.is_active ? 'bg-positive' : 'bg-negative'" ></div>
                </q-card>
            </div>
        </div>
        <q-dialog v-model="dialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isEdit ? 'modify department' : 'create new department' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-1">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.alias.type ? 'text-negative' : 'text-grey'">{{ Errors.alias.type ? Errors.alias.msg : 'code' }}</div>
                            <q-input 
                                v-model="alias" 
                                label="Enter Code"
                                outlined 
                                :error="Errors.alias.type"
                                :no-error-icon="true"
                                class="text-capitalize"
                            />
                        </div>
                        <div class="col-3">
                            <div class="text-caption text-uppercase q-mb-xs" :class="Errors.name.type ? 'text-negative' : 'text-grey'">{{ Errors.name.type ? Errors.name.msg : 'name' }}</div>
                            <q-input
                                v-model="name"
                                label="Enter Name"
                                outlined
                                :error="Errors.name.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                    </div>

                    <div class="q-mt-lg">
                        <q-separator class="q-mb-md" />
                        <div class="text-subtitle2 text-uppercase q-mb-sm">signatories</div>
                        <div class="card-grid">
                            <div class="inner-card-anim-wrapper">
                                <q-card key="sig-add" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple @click="NewSignatoryDialog()">
                                    <q-card-section>
                                        <q-icon name="bi-plus-circle" size="lg" color="grey"/>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="inner-card-anim-wrapper" v-if="signatoryLoading">
                                <q-card class="card card-hover-animate flex column justify-center items-center no-shadow radius-sm">
                                    <q-card-section>
                                        <q-spinner-ios color="dark"/>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="inner-card-anim-wrapper" v-else-if="!signatoryLoading && !signatoryList.length">
                                <q-card class="card card-hover-animate flex column justify-center items-center no-shadow radius-sm">
                                    <q-card-section>
                                        <div class="text-caption text-uppercase text-grey">no data found</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="inner-card-anim-wrapper" v-for="(tile, index) in signatoryList" :key="`sig-${tile.type}`" :style="{ animationDelay: `${index * 120}ms` }">
                                <q-card @click="ShowSignatoryDialog(tile)" class="card card-hover-animate flex column justify-center items-center no-shadow cursor-pointer radius-sm" v-ripple>
                                    <q-card-section>
                                        <div class="text-body1 text-uppercase">{{ tile.type }}</div>
                                        <div class="text-caption text-grey text-uppercase">{{ tile.rows.length }} signatories</div>
                                    </q-card-section>
                                    <div class="absolute-top-left q-ma-sm" style="width: 7px; height: 7px; border-radius: 50%;" :class="tile.isActive ? 'bg-positive' : 'bg-negative'"></div>
                                </q-card>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isEdit || isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                        <q-btn v-if="isEdit" unelevated size="md" color="primary" class="btn text-capitalize" :label="isActive ? 'disable' : 'enable'" @click="Toggle"/>
                        <q-btn unelevated size="md" color="secondary" class="btn text-capitalize" label="discard" @click="() => { dialog = false; }"/>
                    </div>
                </q-card-actions>
                <q-inner-loading :showing="submitLoading">
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

        <q-dialog v-model="signatoryDialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isSignatoryDetail ? 'modify signatory' : 'create new signatory' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase text-grey">document type</div>
                        <div class="q-gutter-sm">
                            <q-checkbox
                                v-for="value in types"
                                :key="`mtype-${value}`"
                                :model-value="selectedTypes.includes(value)"
                                @update:model-value="() => ToggleType(value)"
                                checked-icon="bi-check-circle-fill"
                                unchecked-icon="bi-check-circle"
                                :label="value"
                                class="text-capitalize"
                            />
                        </div>
                    </div>

                    <div class="row q-col-gutter-xs q-mb-md" v-if="selectedTypes.includes('Vacancy')">
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="sErrors.ownerid.msg ? 'text-negative text-italic' : 'text-grey'">{{ sErrors.ownerid.msg ? sErrors.ownerid.msg : 'owner' }}</div>
                            <q-select
                            outlined
                            v-model="signatoryForm.ownerid"
                            label="Choose Owner"
                            emit-value
                            map-options
                            use-input
                            input-debounce="300"
                            :options="filteredApprovers"
                            @filter="filterApproverFn"
                            :error="!!sErrors.ownerid.type"
                            hide-dropdown-icon
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
                                    <q-item-label caption>{{ $CapitalizeWords(scope.opt.role) }}</q-item-label>
                                </q-item-section>
                                </q-item>
                            </template>
                            </q-select>
                        </div>
                    </div>
                    <div v-else class="text-caption text-grey text-uppercase q-mb-md">
                        no owner needed — order 1 is always the employee themselves
                    </div>

                    <div class="row q-col-gutter-xs q-mb-xs">
                        <div class="col-3">
                            <div class="text-caption text-uppercase text-grey">approver</div>
                        </div>
                        <div class="col-2">
                            <div class="text-caption text-uppercase text-grey">description</div>
                        </div>
                        <div class="col-1">
                            <div class="text-caption text-uppercase text-grey">order</div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in signatoryForm.rows" :key="`mrow-${index}`">
                        <div class="col-3">
                            <q-select
                                outlined
                                v-model="value.approverid"
                                label="Choose Approver"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredApprovers"
                                @filter="filterApproverFn"
                                hide-dropdown-icon
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
                                            <q-item-label caption>{{ $CapitalizeWords(scope.opt.role) }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                        <div class="col-2">
                            <q-input
                                v-model="value.description"
                                label="Enter Description"
                                outlined
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                        <div class="col-1">
                            <q-input
                                v-model="value.order"
                                label="Enter Order"
                                outlined
                                :no-error-icon="true"
                                input-class="text-capitalize"
                                :readonly="true"
                            />
                        </div>
                        <div class="col-1">
                            <q-btn
                                v-if="signatoryForm.rows.length > 1"
                                round
                                icon="bi-trash3"
                                flat
                                unelevated
                                color="grey"
                                @click="RemoveSignatoryRow(index)"
                                size="sm"
                                class="q-mt-md"
                            />
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isSignatoryDetail || signatoryIsActive" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="SaveSignatoryModal" />
                        <q-btn v-if="isSignatoryDetail" unelevated size="md" color="primary" class="btn text-capitalize" :label="signatoryIsActive ? 'disable' : 'enable'" @click="ToggleSignatory"/>
                        <q-btn v-if="!isSignatoryDetail || signatoryIsActive" unelevated size="md" color="primary" class="btn-lg text-capitalize" label="add approver" @click="AddSignatoryRow"/>
                        <q-btn unelevated size="md" color="secondary" class="btn text-capitalize" label="discard" @click="() => { signatoryDialog = false; }"/>
                    </div>
                </q-card-actions>
                <q-inner-loading :showing="signatorySubmitLoading">
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
        <q-footer class="bg-accent no-shadow q-mx-lg q-py-md text-grey">
            <q-toolbar class=" bg-white q-pt-md q-pb-md">
                <q-toolbar-title class="text-caption text-uppercase">
                    <div>© 2025 WORKFORCE. All Rights Reserved.</div>
                </q-toolbar-title>
                <q-input outlined dense debounce="1000" v-model="filter" placeholder="Search...">
                    <template v-slot:before>
                        <div class="text-caption text-uppercase">{{ `page ${meta.CurrentPage} of ${meta.TotalPages}` }}</div>
                    </template>
                    <template v-slot:after>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-bar-left" :disable="page <= 1" @click="FirstPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">First Page</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-left-short" :disable="page <= 1" @click="PreviousPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Previous</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-right-short" :disable="page >= meta.TotalPages" @click="NextPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Next</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="sm" round color="primary" icon="bi-arrow-bar-right" :disable="page >= meta.TotalPages" @click="LastPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Last Page</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-slot:prepend>
                        <q-icon name="search" style="font-size: 1rem;" />
                    </template>
                </q-input>
            </q-toolbar>
        </q-footer>
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
    onBeforeMount
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);

const id = ref('');
const name = ref('');
const alias = ref('');
const isActive = ref(false);

const Errors = reactive({
    name: { type: null, msg: '' },
    alias: { type: null, msg: '' }
});

const Validations = () => {
    
    let isError = false;

    if (!name.value) { Errors.name.type = true; Errors.name.msg = 'required'; isError = true; } else { Errors.name.type = null}
    if (!alias.value) { Errors.alias.type = true; Errors.alias.msg = 'required'; isError = true; } else { Errors.alias.type = null }

    if (isError) {
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                <div class="text-caption">Something went wrong.</div>
            `
        })
    }

    return !isError;
}

const rows = ref([]);

const meta = ref({});
const page = ref(1);
const limit = ref(20);
const loading = ref(false);

const filter = ref('');

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get(`/department`, {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value || ''
            }
        });
        rows.value = data.data;
        meta.value = data.meta;
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

const ModifyDialog = (data) => {
    ResetForm();
    dialog.value = true;
    isEdit.value = true;
    id.value = data.id;
    name.value = data.name;
    alias.value = data.alias;
    isActive.value = (data.is_active ? true : false);
    LoadDeptSignatories(data.id);
}

const ResetForm = () => {
    id.value = '';
    name.value = '';
    alias.value = '';
    isActive.value = false;
    ResetAllErrors()
    signatoryList.value = [];
    ResetSignatoryState()
}

const ResetAllErrors = () => {
    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].msg = '';
    });
}


const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const wasNew = !(id.value && isEdit.value);

        const response = id.value && isEdit.value
            ? await api.post(`/department/${id.value}/update`, {
                name: name.value,
                alias: alias.value
            })
            : await api.post('/department', {
                name: name.value,
                alias: alias.value
            });

        // signatories added while the department didn't exist yet are only
        // staged locally — persist them now that we have a real department id.
        // (Signatories added/edited/toggled while modifying an existing
        // department are already saved live, via their own modal.)
        if (wasNew) {
            const deptId = response.data.department.id;
            await SaveStagedSignatories(deptId);
        }

        dialog.value = false;
        LoadAll();
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
            ? await api.post(`/department/${id.value}/disable`)
            : await api.post(`/department/${id.value}/enable`)
        dialog.value = false;
        UpdateList(response.data.department)
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

// ─────────────────────────────────────────────────────────────
// Department-scoped signatories — edited inline on the department
// form itself (create or modify) and saved together with it.
// ─────────────────────────────────────────────────────────────

const types = ref(["Vacancy", "Leave", "TimeCard", "Overtime"]);

// A row is always present by default so the fields are visible as soon as
// a document type is selected, without needing to click "add" first.
const defaultRow = () => ({ id: null, approverid: '', description: '', order: 2 });

// One shared form — whatever is entered here gets saved identically to
// every currently-selected document type.
const signatoryForm = reactive({ ownerid: '', rows: [defaultRow()] });

// Multiple types can be edited at once (Leave/TimeCard/Overtime together),
// but Vacancy is exclusive — selecting it clears any other selection and
// vice versa.
const selectedTypes = ref(['Vacancy']);

const ToggleType = (type) => {
    const isSelected = selectedTypes.value.includes(type);

    if (type === 'Vacancy') {
        selectedTypes.value = isSelected ? [] : ['Vacancy'];
        return;
    }

    selectedTypes.value = isSelected
        ? selectedTypes.value.filter(t => t !== type)
        : [...selectedTypes.value.filter(t => t !== 'Vacancy'), type];
}

const sErrors = reactive({
    ownerid: { type: null, msg: '' }
});

const approvers = ref([]);
const filteredApprovers = ref([]);

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

const normalizeOptions = (data = []) => data.map(d => {
    const baseLabel = d.label ?? d.name ?? String(d.text ?? d.value ?? '')
    return {
        label: baseLabel,
        value: Number(d.value ?? d.id),
        role: d.role ?? ''
    }
})

const filterApproverFn = createFilterFn(approvers, filteredApprovers);

const LoadManagers = async () => {
    try {
        const { data } = await api.get(`/signatory/option/management`);
        approvers.value = normalizeOptions(data)
        filteredApprovers.value = [...approvers.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

// The list of signatory tiles shown on the department form — one tile per
// document type that has a chain configured. When the department already
// exists, tiles are the real persisted records (loaded via GetDepartmentSignatory).
// When still creating a new department, tiles are staged locally and only
// sent to the backend once the department itself is saved (see Save()).
const signatoryList = ref([]);
const signatoryLoading = ref(false);
const signatoryDialog = ref(false);
const isSignatoryDetail = ref(false);
const signatorySubmitLoading = ref(false);
const signatoryIsActive = ref(true);
const editingType = ref('');

const LoadDeptSignatories = async (deptId) => {
    signatoryLoading.value = true;
    try {
        const { data } = await api.get(`/department/${deptId}/signatory`);
        signatoryList.value = data.map(group => {
            const ownerRow = group.signatories.find(s => s.order === 1);
            const rows = group.signatories
                .filter(s => s.order > 1)
                .map(s => ({ id: s.id, approverid: s.approver_id, description: s.description, order: s.order }));
            return {
                type: group.type,
                ownerid: ownerRow ? ownerRow.owner_id : '',
                rows,
                isActive: group.isActive
            };
        });
    } catch (error) {
        console.error("Error fetching department signatories:", error);
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">Error</div>
                <div class="text-caption text-capitalize;">Unable to fetch signatories</div>
            `
        });
    } finally {
        signatoryLoading.value = false;
    }
}

const ResetSignatoryState = () => {
    selectedTypes.value = ['Vacancy'];
    signatoryForm.ownerid = '';
    signatoryForm.rows = [defaultRow()];
    sErrors.ownerid.type = null;
    sErrors.ownerid.msg = '';
}

const NewSignatoryDialog = () => {
    ResetSignatoryState();
    isSignatoryDetail.value = false;
    signatoryIsActive.value = true;
    editingType.value = '';
    signatoryDialog.value = true;
}

const ShowSignatoryDialog = (tile) => {
    ResetSignatoryState();
    isSignatoryDetail.value = true;
    signatoryIsActive.value = tile.isActive;
    editingType.value = tile.type;
    selectedTypes.value = [tile.type];
    signatoryForm.ownerid = tile.ownerid || '';
    signatoryForm.rows = tile.rows.length ? tile.rows.map(r => ({ ...r })) : [defaultRow()];
    signatoryDialog.value = true;
}

const AddSignatoryRow = () => {
    const rows = signatoryForm.rows;
    const maxOrder = rows.length
        ? Math.max(...rows.map(s => Number(s.order) || 0))
        : 1;
    rows.push({
        id: null,
        approverid: "",
        description: "",
        order: Math.max(maxOrder + 1, 2)
    });
}

const RemoveSignatoryRow = (index) => {
    signatoryForm.rows.splice(index, 1);
}

const SignatoryValidations = () => {
    let isError = false;

    const hasRows = signatoryForm.rows.some(r => Number(r.approverid));
    if (selectedTypes.value.includes('Vacancy') && hasRows && !signatoryForm.ownerid) {
        sErrors.ownerid.type = true;
        sErrors.ownerid.msg = 'owner is required';
        isError = true;
    } else {
        sErrors.ownerid.type = null;
        sErrors.ownerid.msg = '';
    }

    if (!selectedTypes.value.length) {
        isError = true;
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

    return !isError;
}

const applySignatoryBackendErrors = (backendErrors) => {
    const errorsArray = Array.isArray(backendErrors)
        ? backendErrors
        : backendErrors?.errors || []

    sErrors.ownerid.type = null;
    sErrors.ownerid.msg = '';

    errorsArray.forEach(err => {
        if (sErrors[err.path] !== undefined) {
            sErrors[err.path].type = true
            sErrors[err.path].msg = err.msg
        }
    })
}

const SaveSignatoryModal = async () => {
    if (!SignatoryValidations()) return;
    signatorySubmitLoading.value = true;
    try {
        if (id.value) {
            // department already exists — persist immediately
            for (const type of selectedTypes.value) {
                await api.post(`/department/${id.value}/signatory`, {
                    type,
                    ownerid: type === 'Vacancy' ? (signatoryForm.ownerid || null) : null,
                    signatories: signatoryForm.rows
                });
            }
            await LoadDeptSignatories(id.value);
        } else {
            // department doesn't exist yet — stage the tile(s) locally
            const replacedTypes = editingType.value ? [editingType.value, ...selectedTypes.value] : selectedTypes.value;
            signatoryList.value = signatoryList.value.filter(t => !replacedTypes.includes(t.type));
            for (const type of selectedTypes.value) {
                signatoryList.value.push({
                    type,
                    ownerid: type === 'Vacancy' ? signatoryForm.ownerid : '',
                    rows: signatoryForm.rows.filter(r => Number(r.approverid)).map(r => ({ ...r })),
                    isActive: true
                });
            }
        }
        signatoryDialog.value = false;
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">Signatory saved<div>
            `
        });
    } catch (e) {
        if (e.response && e.response.data) {
            applySignatoryBackendErrors(e.response.data);
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">Something went wrong.</div>
                `
            })
        }
    } finally {
        signatorySubmitLoading.value = false;
    }
}

const ToggleSignatory = async () => {
    signatorySubmitLoading.value = true;
    try {
        if (id.value) {
            const response = signatoryIsActive.value
                ? await api.post(`/department/${id.value}/signatory/${editingType.value}/disable`)
                : await api.post(`/department/${id.value}/signatory/${editingType.value}/enable`);
            await LoadDeptSignatories(id.value);
            Toast.fire({
                icon: "success",
                html: `
                    <div class="text-h6 text-bold text-uppercase">granted!</div>
                    <div class="text-caption text-capitalize;">${response.data.message}<div>
                `
            });
        } else {
            const tile = signatoryList.value.find(t => t.type === editingType.value);
            if (tile) tile.isActive = !tile.isActive;
        }
        signatoryDialog.value = false;
    } catch (e) {
        if (e.response && e.response.data) {
            applySignatoryBackendErrors(e.response.data);
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">Something went wrong.</div>
                `
            })
        }
    } finally {
        signatorySubmitLoading.value = false;
    }
}

const SaveStagedSignatories = async (deptId) => {
    for (const tile of signatoryList.value) {
        await api.post(`/department/${deptId}/signatory`, {
            type: tile.type,
            ownerid: tile.type === 'Vacancy' ? (tile.ownerid || null) : null,
            signatories: tile.rows
        });
        if (!tile.isActive) {
            await api.post(`/department/${deptId}/signatory/${tile.type}/disable`);
        }
    }
}

onBeforeMount(() => {
    LoadAll();
    LoadManagers();
})

const PageLoading = ref(true);
onMounted(() => {
    setTimeout(() => {
        PageLoading.value = false
    }, 1000)
})

</script>

<style scoped>

</style>