<template>
    <div>
        <div class="card-main-grid">
            <div class="card-anim-wrapper">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple @click="NewDialog()">
                    <q-card-section class="text-center">
                        <q-avatar size="75px" font-size="52px" color="grey" text-color="white" icon="add" />
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-if="loading">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" >
                    <q-card-section class="text-center">
                        <q-spinner-puff size="md"/>
                        <div class="text-caption text-grey text-uppercase q-mt-xs">we're working on it!</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="card-anim-wrapper" :style="{ animationDelay: `120ms` }" v-else-if="!loading && rows.length === 0">
                <q-card key="data-add" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" >
                    <q-card-section class="text-center">
                        <div class="text-caption text-uppercase text-grey">no data found</div>
                    </q-card-section>
                </q-card>
            </div>
            <div v-for="(data, index) in rows" :key="`data-${data.id}`" class="card-anim-wrapper" :style="{ animationDelay: `${index * 120}ms` }">
                <q-card @click="ShowDialog(data)" class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" v-ripple>
                    <q-card-section class="text-center full-width">
                        <div class="text-subtitle2 text-uppercase">{{ data.type }}</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <div class="text-caption text-uppercase">{{ data.owner?.name }}</div>
                        <div class="text-caption text-grey text-capitalize">owner</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <div class="text-caption text-uppercase">{{ data.approver?.name }}</div>
                        <div class="text-caption text-grey text-capitalize">approver</div>
                    </q-card-section>
                    <div class="absolute-top-left q-ma-sm" style="width: 7px; height: 7px; border-radius: 50%;" :class="data.is_active ? 'bg-positive' : 'bg-negative'"></div>
                    <div class="text-caption text-grey absolute-top-right q-ma-sm">{{ FormatOrdinal(data.order) }}</div>
                </q-card>
            </div>
        </div>
        <q-dialog v-model="dialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">{{ isDetail ? 'signatory information' : 'create new signatory' }}</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div v-if="isDetail">
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">document type</div>
                            <div class="text-body1 text-uppercase">{{ info?.type }}</div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">owner</div>
                            <div class="text-body1 text-uppercase">{{ info?.owner?.name }}</div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">approver</div>
                            <div class="text-body1 text-uppercase">{{ info?.approver?.name }}</div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">description</div>
                            <div class="text-body1 text-uppercase">{{ info?.description }}</div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">order</div>
                            <div class="text-body1 text-uppercase">{{ FormatOrdinal(info?.order) }}</div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase" :class="Errors.type.msg ? 'text-negative' : 'text-grey'">{{ Errors.type.msg ? Errors.type.msg : 'document type' }}</div>
                            <div class="q-gutter-sm">
                                <q-radio v-for="value in types" v-model="type" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="value" :label="value" class="text-capitalize"/>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xl">
                            <div class="col-3">
                                <div class="text-caption text-uppercase" :class="Errors.ownerid.msg ? 'text-negative' : 'text-grey'">{{ Errors.ownerid.msg ? Errors.ownerid.msg : 'owner' }}</div>
                                <q-select
                                    outlined
                                    v-model="ownerid"
                                    label="Choose Owner"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredOwners"
                                    @filter="filterOwnerFn"
                                    :error="Errors.ownerid.type"
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
                                                <q-item-label caption>{{ $CapitalizeWords(scope.opt.role) }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-select>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-3">
                                <div class="text-caption text-uppercase" :class="Errors.signatories.approverid.msg ? 'text-negative' : 'text-grey'">{{ Errors.signatories.approverid.msg ? Errors.signatories.approverid.msg : 'approver' }}</div>
                            </div>
                            <div class="col-2">
                                <div class="text-caption text-uppercase" :class="Errors.signatories.description.msg ? 'text-negative' : 'text-grey'">{{ Errors.signatories.description.msg ? Errors.signatories.description.msg : 'description' }}</div>
                            </div>
                            <div class="col-1">
                                <div class="text-caption text-uppercase" :class="Errors.signatories.order.msg ? 'text-negative' : 'text-grey'">{{ Errors.signatories.order.msg ? Errors.signatories.order.msg : 'order' }}</div>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in signatories">
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
                                    :error="Errors.signatories.approverid.type[index]"
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
                                    :error="Errors.signatories.description.type[index]"
                                    :no-error-icon="true"
                                    input-class="text-capitalize"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.order" 
                                    label="Enter Order"
                                    outlined 
                                    :error="Errors.signatories.order.type[index]"
                                    :no-error-icon="true"
                                    input-class="text-capitalize"
                                />
                            </div>
                            <div class="col-1">
                                <q-btn 
                                    v-if="signatories.length > 1" 
                                    round 
                                    icon="delete" 
                                    flat 
                                    unelevated 
                                    color="grey" 
                                    @click="RemoveSignatory(index)" 
                                    size="sm"
                                    class="q-mt-md"
                                />
                            </div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <q-btn v-if="!isDetail" unelevated size="md" color="primary" class="btn text-capitalize" label="save" @click="Save" />
                        <q-btn v-if="isDetail" unelevated size="md" color="primary" class="btn text-capitalize" :label="info?.is_active ? 'disable' : 'enable'" @click="Toggle(info)"/>
                        <q-btn v-if="!isDetail" unelevated size="md" color="primary" class="btn text-capitalize" label="add" @click="() => { AddSignatory() }" outline/>
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
    onBeforeMount
} from 'vue';

import { api } from 'src/boot/axios';

import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const dialog = ref(false);
const isDetail = ref(false);
const submitLoading = ref(false);

const id = ref('');
const type = ref('');
const ownerid = ref('');
const signatories = ref([{ id: "", approverid: "", description: "", order: "" }])
const isActive = ref(false);

const Errors = reactive({
    type: { 
        type: null, msg: '' 
    },
    ownerid: { 
        type: null, msg: '' 
    },
    signatories: {
        approverid: {
            type: [], msg: ''
        },
        description: {
            type: [], msg: ''
        },
        order: {
            type: [], msg: ''
        }
    },
});

const initErrors = () => {
    Errors.signatories.approverid.type = signatories.value.map(() => null);
    Errors.signatories.description.type = signatories.value.map(() => null);
    Errors.signatories.order.type = signatories.value.map(() => null);
}

const Validations = () => {
    
    let isError = false;

    Errors.signatories.approverid = { type: null, msg: '' }
    Errors.signatories.description = { type: null, msg: '' }
    Errors.signatories.order = { type: null, msg: '' }

    if (!type.value) {
        Errors.type.type = true
        Errors.type.msg = 'document type is required'
        isError = true
    } else {
        Errors.ownerid.type = null
    }
    if (!ownerid.value) {
        Errors.ownerid.type = true
        Errors.ownerid.msg = 'owner is required'
        isError = true
    } else {
        Errors.ownerid.type = null
    }
    
    initErrors()
    
    signatories.value.forEach((e, index) => {
        if (!e.approverid) {
            Errors.signatories.approverid.type[index] = true;
            Errors.signatories.approverid.msg = 'required';
            isError = true;
        }
        if (!e.description) {
            Errors.signatories.description.type[index] = true;
            Errors.signatories.description.msg = 'required';
            isError = true;
        }
        if (!e.order) {
            Errors.signatories.order.type[index] = true;
            Errors.signatories.order.msg = 'required';
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
        const { data } = await api.get(`/signatory`, {
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
    isDetail.value = false;
}

const info = ref([])

const ShowDialog = (data) => {
    ResetForm();
    dialog.value = true;
    isDetail.value = true;
    info.value = data;
}

const ResetForm = () => {
    id.value = '';
    type.value = '';
    ownerid.value = '';
    signatories.value = [{ id: "", approverid: "", description: "", order: "" }]
    isActive.value = false;
}

const Save = async () => {
    if (!Validations()) return;
    submitLoading.value = true;
    try {
        const response = await api.post(`/signatory`, {
            type: type.value,
            ownerid: ownerid.value,
            signatories: signatories.value
        });
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

const Toggle = async (app) => {
    submitLoading.value = true;
    try {
        const response = app.is_active
            ? await api.post(`/signatory/${app.id}/disable`)
            : await api.post(`/signatory/${app.id}/enable`)
        dialog.value = false;
        LoadAll()
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

const types = ref(["Vacancy", "Leave", "TimeCard", "Overtime"]);
const owners = ref([]);
const approvers = ref([]);

const filteredOwners = ref([]);
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

    // Default
    return {
        label: baseLabel,
        value: Number(d.value ?? d.id),
        role: d.role ?? ''
    }
})

const filterOwnerFn = createFilterFn(owners, filteredOwners);
const filterApproverFn = createFilterFn(approvers, filteredApprovers);

const LoadUsers = async () => {
    try {
        const { data } = await api.get(`/signatory/option/user`);
        owners.value = normalizeOptions(data)
        filteredOwners.value = [...owners.value]
        approvers.value = normalizeOptions(data)
        filteredApprovers.value = [...approvers.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

function FormatOrdinal(n) {
    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
    switch (n % 10) {
        case 1: return `${n}st`;
        case 2: return `${n}nd`;
        case 3: return `${n}rd`;
        default: return `${n}th`;
    }
}

const AddSignatory = () => {
    const e = signatories.value;
    e.unshift({
        id: "",
        approverid: "",
        description: "",
        order: ""
    });
}

const RemoveSignatory = (index) => {
    const e = signatories.value;
    e.splice(index, 1);
}

onMounted(() => {
    LoadAll();
})

onBeforeMount(() => {
    LoadUsers()
})

</script>

<style scoped>

</style>