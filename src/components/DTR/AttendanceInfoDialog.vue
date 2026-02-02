<template>
    <q-dialog v-model="isOpen" full-height position="right" persistent square class="dialog" @before-show="PopulateData()">
        <q-card class="dialog-card column full-height">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 text-uppercase">daily time records</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col q-pa-lg scroll">
                <div class="q-mb-md">
                    <div class="text-caption text-uppercase text-grey">employee</div>
                    <div class="text-body1 text-uppercase">{{ FormatName(employee?.employee) }}</div>
                </div>
                <div class="q-mb-sm">
                    <span class="text-subtitle1 text-uppercase text-bold q-mr-md">daily time record</span>
                </div>
                <div class="row q-col-gutter-xs">
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">date</span>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">day</span>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">records</span>
                        </div>
                    </div>
                </div>
                <div class="q-mb-xl">
                    <div class="row q-col-gutter-xs q-mb-xs" v-for="(data, index) in attendances.results">
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatAttendanceDate(data.date)" />
                        </div>
                        <div class="col-1">
                            <q-input outlined dense :model-value="FormatAttendanceDay(data.date)" />
                        </div>
                        <div class="col-10">
                            <div class="row items-center q-gutter-xs">
                                <q-input v-for="(time, index) in data.times" outlined dense v-model="data.times[index]" style="width: 100px;" >
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale" mask="##:##" fill-mask ref="popup" class="no-shadow custom-border radius-sm">
                                        <q-time v-model="data.times[index]" mask="HH:mm" >
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Okay" color="primary" flat />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-input>
                                <!-- <q-input v-for="(time, index) in data.times" outlined dense v-model="data.times[index]" style="width: 100px;"/> -->
                                <q-badge v-if="data.leaveType" rounded color="primary" :label="data.leaveType" />
                                <q-badge v-if="data.holiday" rounded color="primary" :label="data.holiday" />
                                <q-badge v-if="data.overtimes" rounded color="primary" :label="data.overtimes" />
                                <q-btn icon="arrow_upward" round unelevated color="primary" size="xs" @click="() => { UpdateDTR(attendances.id, employee.id, data) }"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row q-col-gutter-xl q-mb-md q-mt-xl">
                    <div v-for="(dt, index) in attendances.approvals">
                        <div class="text-caption text-uppercase text-grey">{{ dt?.status == 'Pending' ? 'unsigned' : 'signed' }}</div>
                        <div v-if="dt?.status == 'Approved'">
                            <img :src="FormatSignature(dt?.setting)" width="150"/>
                        </div>
                        <div class="text-h6 text-uppercase">{{ FormatName(dt?.setting?.approver?.employeeAccount?.employee) }}</div>
                    </div>
                </div>
            </q-card-section>
            
            <q-card-actions class="q-pa-lg bg">
                <div class="q-gutter-sm">
                    <q-btn v-if="canApprove" unelevated size="md" color="primary" class="btn text-capitalize" label="approve">
                        <q-menu @before-show="() => {  }" transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                <q-card-section>
                                    <div class="text-h6 text-center text-uppercase">
                                        proceed to approve
                                    </div>
                                </q-card-section>
                                <q-card-actions>
                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="Approve(attendances?.id)"/>
                                </q-card-actions>
                            </q-card>
                        </q-menu>
                    </q-btn>
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="Print(attendances?.id)" />
                    <!-- <q-btn v-if="info.isActive" unelevated size="md" color="primary" class="btn text-capitalize" label="cancel" @click="Cancel(info.id)"/> -->
                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { AttendanceDialog = false; }" outline/>
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

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
    get: () => props.modelValue === props.dialogName,
    set: (val) => {
        if (!val) emit('update:modelValue', null)
    }
})

const SubmitLoading = ref(false);

const PopulateData = () => {
    
}
</script>