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
                        <div class="text-subtitle2 text-uppercase">{{ formatName(data?.profile) }}</div>
                        <div class="text-caption text-uppercase">{{ data?.vacancy?.position?.name }}</div>
                        <div class="text-caption text-grey">{{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data?.vacancy?.salary?.rates[0]?.monthlyCompensation) }}</div>
                    </q-card-section>
                    <q-card-section class="full-width">
                        <div class="text-caption text-uppercase">{{ data?.status }}</div>
                        <div class="text-caption text-grey">{{ formatDate(data?.createdAt) }}</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <q-dialog v-model="dialog" full-height position="right" persistent square class="dialog">
            <q-card class="dialog-card column full-height">
                <q-card-section class="q-pa-lg">
                    <div class="text-h6 text-uppercase">new applicant</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="q-mb-md">
                        <div class="q-mb-sm">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">vacant positions</span>
                            <q-icon
                                :name="Errors.vacancyId.type ? 'error' : 'info'"
                                :color="Errors.vacancyId.type ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip anchor="top middle" self="center middle" :class="Errors.vacancyId.type ? 'bg-negative' : 'bg-grey'">
                                    <template v-if="Errors.vacancyId.type">
                                        <div 
                                            v-for="(msg, i) in Errors.vacancyId.messages" 
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
                                v-for="(data, index) in vacancies"
                                :key="`data-${data.id}`"
                                class="inner-card-anim-wrapper"
                                :style="{ animationDelay: `${index * 120}ms` }"
                            >
                                <q-card 
                                    class="card card-hover-animate flex flex-center q-pa-md no-shadow cursor-pointer radius-sm" 
                                    tag="label"
                                    :class="{ 'card--active': vacancyId === data.id }"
                                    @click="vacancyId = data.id"
                                >
                                    <q-card-section class="text-center full-width q-pa-none">
                                        <div class="text-subtitle1 text-uppercase">{{ data?.salary?.positions?.name }}</div>
                                        <div class="text-caption text-uppercase">{{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data?.salary?.rates[0]?.monthlyCompensation) }}</div>
                                    </q-card-section>
                                    <q-card-section class="q-pa-none">
                                        <div class="text-caption">{{ data?.company?.name }}</div>
                                        <div class="text-caption text-grey">{{ data?.department?.name }}</div>
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
                    <div class="text-overline text-uppercase text-bold q-mt-xl q-mb-md">personal information</div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">firstname</span>
                                <q-icon
                                    :name="Errors.firstname.type ? 'error' : 'info'"
                                    :color="Errors.firstname.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.firstname.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.firstname.type">
                                            <div 
                                                v-for="(msg, i) in Errors.firstname.messages" 
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
                                v-model="firstname" 
                                outlined 
                                :error="Errors.firstname.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                        <div class="col-3">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">middlename</span>
                                <q-icon
                                    :name="Errors.middlename.type ? 'error' : 'info'"
                                    :color="Errors.middlename.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.middlename.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.middlename.type">
                                            <div 
                                                v-for="(msg, i) in Errors.middlename.messages" 
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
                                v-model="middlename" 
                                outlined 
                                :error="Errors.middlename.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                        <div class="col-3">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">lastname</span>
                                <q-icon
                                    :name="Errors.lastname.type ? 'error' : 'info'"
                                    :color="Errors.lastname.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.lastname.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.lastname.type">
                                            <div 
                                                v-for="(msg, i) in Errors.lastname.messages" 
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
                                v-model="lastname" 
                                outlined 
                                :error="Errors.lastname.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                        <div class="col-1">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">suffix</span>
                                <q-icon
                                    :name="Errors.suffix.type ? 'error' : 'info'"
                                    :color="Errors.suffix.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.suffix.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.suffix.type">
                                            <div 
                                                v-for="(msg, i) in Errors.suffix.messages" 
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
                                v-model="suffix" 
                                outlined 
                                :error="Errors.suffix.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
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
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select civil Status</span>
                                <q-icon
                                    :name="Errors.maritalId.type ? 'error' : 'info'"
                                    :color="Errors.maritalId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.maritalId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.maritalId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.maritalId.messages" 
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
                                v-model="maritalId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredMartitalStatuses"
                                @filter="filterMaritalStatusFn"
                                :error="Errors.maritalId.type"
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
                                <span class="text-caption text-uppercase text-grey q-mr-sm">birthdate</span>
                                <q-icon
                                    :name="Errors.birthdate.type ? 'error' : 'info'"
                                    :color="Errors.birthdate.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.birthdate.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.birthdate.type">
                                            <div 
                                                v-for="(msg, i) in Errors.birthdate.messages" 
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
                                v-model="birthdate" 
                                outlined 
                                :error="Errors.birthdate.type"
                                :no-error-icon="true"
                                type="date"
                            />
                        </div>
                        <div class="col-4">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">birthplace</span>
                                <q-icon
                                    :name="Errors.birthplace.type ? 'error' : 'info'"
                                    :color="Errors.birthplace.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.birthplace.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.birthplace.type">
                                            <div 
                                                v-for="(msg, i) in Errors.birthplace.messages" 
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
                                v-model="birthplace" 
                                outlined 
                                :error="Errors.birthplace.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select region</span>
                                <q-icon
                                    :name="Errors.region.type ? 'error' : 'info'"
                                    :color="Errors.region.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.region.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.region.type">
                                            <div 
                                                v-for="(msg, i) in Errors.region.messages" 
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
                                v-model="region"
                                use-input
                                emit-value
                                map-options
                                input-debounce="300"
                                :options="filteredRegions"
                                @filter="filterRegionFn"
                                :error="Errors.region.type"
                                dropdown-icon="keyboard_arrow_down"
                                @update:model-value="LoadProvinces"
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
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select province</span>
                                <q-icon
                                    :name="Errors.province.type ? 'error' : 'info'"
                                    :color="Errors.province.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.province.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.province.type">
                                            <div 
                                                v-for="(msg, i) in Errors.province.messages" 
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
                                v-model="province"
                                use-input
                                emit-value
                                map-options
                                input-debounce="300"
                                :options="filteredProvinces"
                                @filter="filterProvinceFn"
                                :error="Errors.province.type"
                                dropdown-icon="keyboard_arrow_down"
                                @update:model-value="LoadTowns"
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
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select town</span>
                                <q-icon
                                    :name="Errors.town.type ? 'error' : 'info'"
                                    :color="Errors.town.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.town.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.town.type">
                                            <div 
                                                v-for="(msg, i) in Errors.town.messages" 
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
                                v-model="town"
                                use-input
                                emit-value
                                map-options
                                input-debounce="300"
                                :options="filteredTowns"
                                @filter="filterTownFn"
                                :error="Errors.town.type"
                                dropdown-icon="keyboard_arrow_down"
                                @update:model-value="LoadBarangays"
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
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select barangay</span>
                                <q-icon
                                    :name="Errors.barangay.type ? 'error' : 'info'"
                                    :color="Errors.barangay.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.barangay.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.barangay.type">
                                            <div 
                                                v-for="(msg, i) in Errors.barangay.messages" 
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
                                v-model="barangay"
                                use-input
                                emit-value
                                map-options
                                input-debounce="300"
                                :options="filteredBarangays"
                                @filter="filterBarangayFn"
                                :error="Errors.barangay.type"
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
                                <span class="text-caption text-uppercase text-grey q-mr-sm">street address</span>
                                <q-icon
                                    :name="Errors.streetAddress.type ? 'error' : 'info'"
                                    :color="Errors.streetAddress.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.streetAddress.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.streetAddress.type">
                                            <div 
                                                v-for="(msg, i) in Errors.streetAddress.messages" 
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
                                v-model="streetAddress" 
                                outlined 
                                :error="Errors.streetAddress.type"
                                :no-error-icon="true"
                                input-class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-1">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">weight (kg)</span>
                                <q-icon
                                    :name="Errors.weight.type ? 'error' : 'info'"
                                    :color="Errors.weight.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.weight.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.weight.type">
                                            <div 
                                                v-for="(msg, i) in Errors.weight.messages" 
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
                                v-model="weight" 
                                outlined 
                                :error="Errors.weight.type"
                                :no-error-icon="true"
                            />
                        </div>
                        <div class="col-1">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">height (cm)</span>
                                <q-icon
                                    :name="Errors.height.type ? 'error' : 'info'"
                                    :color="Errors.height.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.height.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.height.type">
                                            <div 
                                                v-for="(msg, i) in Errors.height.messages" 
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
                                v-model="height" 
                                outlined 
                                :error="Errors.height.type"
                                :no-error-icon="true"
                            />
                        </div>
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">select blood type</span>
                                <q-icon
                                    :name="Errors.bloodTypeId.type ? 'error' : 'info'"
                                    :color="Errors.bloodTypeId.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.bloodTypeId.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.bloodTypeId.type">
                                            <div 
                                                v-for="(msg, i) in Errors.bloodTypeId.messages" 
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
                                v-model="bloodTypeId"
                                emit-value
                                map-options
                                use-input
                                input-debounce="300"
                                :options="filteredBloodTypes"
                                @filter="filterBloodTypeFn"
                                :error="Errors.bloodTypeId.type"
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
                                <span class="text-caption text-uppercase text-grey q-mr-sm">email address</span>
                                <q-icon
                                    :name="Errors.email.type ? 'error' : 'info'"
                                    :color="Errors.email.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.email.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.email.type">
                                            <div 
                                                v-for="(msg, i) in Errors.email.messages" 
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
                                v-model="email" 
                                outlined 
                                :error="Errors.email.type"
                                :no-error-icon="true"
                            />
                        </div>
                        <div class="col-2">
                            <div class="q-mb-xs">
                                <span class="text-caption text-uppercase text-grey q-mr-sm">contact number</span>
                                <q-icon
                                    :name="Errors.contactNo.type ? 'error' : 'info'"
                                    :color="Errors.contactNo.type ? 'negative' : 'grey'"
                                    class="cursor-pointer"
                                    size="xs"
                                >
                                    <q-tooltip anchor="top middle" self="center middle" :class="Errors.contactNo.type ? 'bg-negative' : 'bg-grey'">
                                        <template v-if="Errors.contactNo.type">
                                            <div 
                                                v-for="(msg, i) in Errors.contactNo.messages" 
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
                                v-model="contactNo" 
                                outlined 
                                :error="Errors.contactNo.type"
                                :no-error-icon="true"
                            />
                        </div>
                    </div>
                    <div class="q-mb-sm q-mt-xl">
                        <span class="text-overline text-uppercase text-bold q-mr-sm">educational information</span>
                        <q-btn icon="add" round size="sm" outline unelevated color="primary" @click="addEducation"/>
                    </div>
                    <div class="q-mb-md">
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-2">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">select school level</span>
                                    <q-icon
                                        :name="Errors.educations[0]?.level?.type ? 'error' : 'info'"
                                        :color="Errors.educations[0]?.level?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.educations[0]?.level?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.educations[0]?.level?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.educations[0]?.level.messages"
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
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">select school</span>
                                    <q-icon
                                        :name="Errors.educations[0]?.school?.type ? 'error' : 'info'"
                                        :color="Errors.educations[0]?.school?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.educations[0]?.school?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.educations[0]?.school?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.educations[0]?.school.messages"
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
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">select degree</span>
                                    <q-icon
                                        :name="Errors.educations[0]?.course?.type ? 'error' : 'info'"
                                        :color="Errors.educations[0]?.course?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.educations[0]?.course?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.educations[0]?.course?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.educations[0]?.course.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">start date</span>
                                    <q-icon
                                        :name="Errors.educations[0]?.start?.type ? 'error' : 'info'"
                                        :color="Errors.educations[0]?.start?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.educations[0]?.start?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.educations[0]?.start?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.educations[0]?.start.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">end date</span>
                                    <q-icon
                                        :name="Errors.educations[0]?.end?.type ? 'error' : 'info'"
                                        :color="Errors.educations[0]?.end?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.educations[0]?.end?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.educations[0]?.end?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.educations[0]?.end.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">graduated</span>
                                    <q-icon
                                        :name="Errors.educations[0]?.graduated?.type ? 'error' : 'info'"
                                        :color="Errors.educations[0]?.graduated?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.educations[0]?.graduated?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.educations[0]?.graduated?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.educations[0]?.graduated.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">rating</span>
                                    <q-icon
                                        :name="Errors.educations[0]?.rating?.type ? 'error' : 'info'"
                                        :color="Errors.educations[0]?.rating?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.educations[0]?.rating?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.educations[0]?.rating?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.educations[0]?.rating.messages"
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
                        <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in educations" :key="index">
                            <div class="col-2">
                                <q-select
                                    outlined
                                    v-model="value.levelId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredLevels"
                                    @filter="filterLevelFn"
                                    :error="Errors.educations[index]?.level?.type"
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
                                <q-select
                                    outlined
                                    v-model="value.schoolId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredSchools"
                                    @filter="filterSchoolFn"
                                    :error="Errors.educations[index]?.school.type"
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
                                <q-select
                                    outlined
                                    v-model="value.courseId"
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredCourses"
                                    @filter="filterCoursesFn"
                                    :error="Errors.educations[index]?.course.type"
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
                            <div class="col-1">
                                <q-input 
                                    v-model="value.startDate" 
                                    outlined 
                                    :error="Errors.educations[index]?.start.type"
                                    :no-error-icon="true"
                                    type="date"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.endDate" 
                                    outlined 
                                    :error="Errors.educations[index]?.end.type"
                                    :no-error-icon="true"
                                    type="date"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.yearGraduated" 
                                    outlined 
                                    :error="Errors.educations[index]?.graduated.type"
                                    :no-error-icon="true"
                                    type="date"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.rating" 
                                    outlined 
                                    :error="Errors.educations[index]?.rating.type"
                                    :no-error-icon="true"
                                />
                            </div>
                            <div class="col-1">
                                <q-btn 
                                    v-if="educations.length > 1" 
                                    round 
                                    icon="delete" 
                                    flat 
                                    unelevated 
                                    color="grey" 
                                    @click="removeEducation(index)" 
                                    size="sm"
                                    class="q-mt-md"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="q-mb-sm q-mt-xl">
                        <span class="text-overline text-uppercase text-bold q-mr-md">training information</span>
                        <q-btn icon="add" round size="sm" outline unelevated color="primary" @click="addTraining"/>
                    </div>
                    <div class="q-mb-md">
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-3">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">title</span>
                                    <q-icon
                                        :name="Errors.trainings[0]?.title?.type ? 'error' : 'info'"
                                        :color="Errors.trainings[0]?.title?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.trainings[0]?.title?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.trainings[0]?.title?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.trainings[0]?.title.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">start date</span>
                                    <q-icon
                                        :name="Errors.trainings[0]?.start?.type ? 'error' : 'info'"
                                        :color="Errors.trainings[0]?.start?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.trainings[0]?.start?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.trainings[0]?.start?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.trainings[0]?.start.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">end date</span>
                                    <q-icon
                                        :name="Errors.trainings[0]?.end?.type ? 'error' : 'info'"
                                        :color="Errors.trainings[0]?.end?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.trainings[0]?.end?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.trainings[0]?.end?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.trainings[0]?.end.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">hour/s</span>
                                    <q-icon
                                        :name="Errors.trainings[0]?.hour?.type ? 'error' : 'info'"
                                        :color="Errors.trainings[0]?.hour?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.trainings[0]?.hour?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.trainings[0]?.hour?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.trainings[0]?.hour.messages"
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
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">select training type</span>
                                    <q-icon
                                        :name="Errors.trainings[0]?.typeId?.type ? 'error' : 'info'"
                                        :color="Errors.trainings[0]?.typeId?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.trainings[0]?.typeId?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.trainings[0]?.typeId?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.trainings[0]?.typeId.messages"
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
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">conducted by</span>
                                    <q-icon
                                        :name="Errors.trainings[0]?.conductedBy?.type ? 'error' : 'info'"
                                        :color="Errors.trainings[0]?.conductedBy?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.trainings[0]?.conductedBy?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.trainings[0]?.conductedBy?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.trainings[0]?.conductedBy.messages"
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
                        <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in trainings" :key="index">
                            <div class="col-3">
                                <q-input 
                                    v-model="value.title" 
                                    outlined 
                                    :error="Errors.trainings[index]?.title.type"
                                    :no-error-icon="true"
                                    input-class="text-capitalize"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.startDate" 
                                    outlined 
                                    type="date"
                                    :error="Errors.trainings[index]?.start.type"
                                    :no-error-icon="true"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.endDate" 
                                    outlined 
                                    type="date"
                                    :error="Errors.trainings[index]?.end.type"
                                    :no-error-icon="true"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.hour" 
                                    outlined 
                                    :error="Errors.trainings[index]?.hour.type"
                                    :no-error-icon="true"
                                />
                            </div>
                            <div class="col-2">
                                <q-select
                                    outlined
                                    v-model="value.typeId"
                                    option-value="value"
                                    option-label="label"
                                    virtual-scroll
                                    emit-value
                                    map-options
                                    use-input
                                    input-debounce="300"
                                    :options="filteredTrainingTypes"
                                    @filter="filterTrainingTypeFn"
                                    :error="Errors.trainings[index]?.typeId.type"
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
                                <q-input 
                                    v-model="value.conductedBy" 
                                    outlined 
                                    :error="Errors.trainings[index]?.conductedBy.type"
                                    :no-error-icon="true"
                                    input-class="text-capitalize"
                                />
                            </div>
                            <div class="col-1">
                                <q-btn 
                                    v-if="trainings.length > 1" 
                                    round 
                                    icon="delete" 
                                    flat 
                                    unelevated 
                                    color="grey" 
                                    @click="removeTraining(index)" 
                                    size="sm"
                                    class="q-mt-md"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="q-mb-sm q-mt-xl">
                        <span class="text-overline text-uppercase text-bold q-mr-md">experience information</span>
                        <q-btn icon="add" round size="sm" outline unelevated color="primary" @click="addExperience"/>
                    </div>
                    <div class="q-mb-md">
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-3">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">position</span>
                                    <q-icon
                                        :name="Errors.experiences[0]?.position?.type ? 'error' : 'info'"
                                        :color="Errors.experiences[0]?.position?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.experiences[0]?.position?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.experiences[0]?.position?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.experiences[0]?.position.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">start date</span>
                                    <q-icon
                                        :name="Errors.experiences[0]?.start?.type ? 'error' : 'info'"
                                        :color="Errors.experiences[0]?.start?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.experiences[0]?.start?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.experiences[0]?.start?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.experiences[0]?.start.messages"
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
                            <div class="col-1">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">end date</span>
                                    <q-icon
                                        :name="Errors.experiences[0]?.end?.type ? 'error' : 'info'"
                                        :color="Errors.experiences[0]?.end?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.experiences[0]?.end?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.experiences[0]?.end?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.experiences[0]?.end.messages"
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
                            <div class="col-4">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">job description</span>
                                    <q-icon
                                        :name="Errors.experiences[0]?.description?.type ? 'error' : 'info'"
                                        :color="Errors.experiences[0]?.description?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.experiences[0]?.description?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.experiences[0]?.description?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.experiences[0]?.description.messages"
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
                        <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in experiences" :key="index">
                            <div class="col-3">
                                <q-input 
                                    v-model="value.position" 
                                    outlined 
                                    :error="Errors.experiences[index]?.position.type"
                                    :no-error-icon="true"
                                    input-class="text-capitalize"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.startDate" 
                                    outlined 
                                    type="date"
                                    :error="Errors.experiences[index]?.start.type"
                                    :no-error-icon="true"
                                />
                            </div>
                            <div class="col-1">
                                <q-input 
                                    v-model="value.endDate" 
                                    outlined 
                                    type="date"
                                    :error="Errors.experiences[index]?.end.type"
                                    :no-error-icon="true"
                                />
                            </div>
                            <div class="col-3">
                                <q-input 
                                    v-model="value.description" 
                                    outlined 
                                    :error="Errors.experiences[index]?.description.type"
                                    :no-error-icon="true"
                                />
                            </div>
                            <div class="col-1">
                                <q-btn 
                                    v-if="experiences.length > 1" 
                                    round 
                                    icon="delete" 
                                    flat 
                                    unelevated 
                                    color="grey" 
                                    @click="removeExperience(index)" 
                                    size="sm"
                                    class="q-mt-md"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="q-mb-sm q-mt-xl">
                        <span class="text-overline text-uppercase text-bold q-mr-md">document information</span>
                        <q-btn icon="add" round size="sm" outline unelevated color="primary" @click="addDocument"/>
                    </div>
                    <div class="q-mb-md">
                        <div class="row q-col-gutter-xs q-mb-xs">
                            <div class="col-2">
                                <div class="q-mb-xs">
                                    <span class="text-caption text-uppercase text-grey q-mr-sm">document</span>
                                    <q-icon
                                        :name="Errors.documents[0]?.file?.type ? 'error' : 'info'"
                                        :color="Errors.documents[0]?.file?.type ? 'negative' : 'grey'"
                                        class="cursor-pointer"
                                        size="xs"
                                    >
                                        <q-tooltip
                                            anchor="top middle"
                                            self="center middle"
                                            :class="Errors.documents[0]?.file?.type ? 'bg-negative' : 'bg-grey'"
                                        >
                                            <template v-if="Errors.documents[0]?.file?.type">
                                                <div
                                                    v-for="(msg, i) in Errors.documents[0]?.file.messages"
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
                        <div class="row q-col-gutter-xs q-mb-xs" v-for="(value, index) in documents" :key="index">
                            <div class="col-3">
                                <q-file 
                                    v-model="value.file" 
                                    outlined 
                                    :error="Errors.documents[index]?.file.type"
                                    :no-error-icon="true"
                                />
                            </div>
                            <div class="col-1">
                                <q-btn 
                                    v-if="documents.length > 1" 
                                    round 
                                    icon="delete" 
                                    flat 
                                    unelevated 
                                    color="grey" 
                                    @click="removeDocument(index)" 
                                    size="sm"
                                    class="q-mt-md"
                                />
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
                <q-inner-loading :showing="ApplicationSubmitting">
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
                    <div class="text-h6 text-uppercase">applicant information</div>
                </q-card-section>
                <q-separator inset />
                <q-card-section class="col q-pa-lg scroll">
                    <div class="q-mb-lg">
                        <div class="text-h6 text-uppercase text-bold q-mb-md">vacancy information</div>
                        <div class="row q-col-gutter-xs q-mb-md">
                            <div class="col-4">
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">position</div>
                                    <div class="text-body1 text-uppercase">{{ info?.vacancy?.salary?.positions?.name }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">salary</div>
                                    <div class="text-body1 text-uppercase">{{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(info?.vacancy?.salary?.rates[0]?.monthlyCompensation) }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">company</div>
                                    <div class="text-body1">{{ info?.vacancy?.company?.name }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">department</div>
                                    <div class="text-body1">{{ info?.vacancy?.department?.name }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">schedule</div>
                                    <div class="text-body1">{{ info?.vacancy?.shift?.class?.name }},&nbsp;{{ formatTime(info?.vacancy?.shift?.timeStart) }} to {{ formatTime(info?.vacancy?.shift?.timeEnd) }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">work location</div>
                                    <div class="text-body1">{{ info?.vacancy?.location }}</div>
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">job description</div>
                                    <div class="text-body1">{{ info?.vacancy?.salary?.positions?.description }}</div>
                                </div>
                                <div class="q-mb-md">
                                    <div class="text-caption text-uppercase text-grey">job qualifications</div>
                                    <div class="text-body1" v-for="(v, index) in info?.vacancy?.salary?.positions?.qualifications" :key="index">{{ (index+1) }}. {{ v.name || 'N/A' }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row q-col-gutter-lg q-mb-md">
                            <div>
                                <div class="text-caption text-uppercase text-grey">date needed</div>
                                <div class="text-body1">{{ formatDate(info?.vacancy?.dateNeeded) }}</div>
                            </div>
                            <div>
                                <div class="text-caption text-uppercase text-grey">need background check</div>
                                <div class="text-body1">{{ info?.vacancy?.needBackgroundCheck ? 'Yes' : 'No' }}</div>
                            </div>
                            <div>
                                <div class="text-caption text-uppercase text-grey">movement</div>
                                <div class="text-body1">{{ info?.vacancy?.movement }}</div>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">justification</div>
                            <div class="text-body1">{{ info?.vacancy?.justification }}</div>
                        </div>
                        <div class="row q-col-gutter-lg q-mb-mb">
                            <div>
                                <div class="text-caption text-uppercase text-grey">sex</div>
                                <div class="text-body1">{{ info?.vacancy?.sex?.name }}</div>
                            </div>
                            <div>
                                <div class="text-caption text-uppercase text-grey">school level</div>
                                <div class="text-body1">{{ info?.vacancy?.schoolLevel?.name }}</div>
                            </div>
                            <div>
                                <div class="text-caption text-uppercase text-grey">year/s of experience</div>
                                <div class="text-body1">{{ info?.vacancy?.yearExperience }}</div>
                            </div>
                            <div>
                                <div class="text-caption text-uppercase text-grey">age range</div>
                                <div class="text-body1">{{ info?.vacancy?.ageRange }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="q-mb-lg">
                        <div class="text-h6 text-uppercase text-bold q-mb-md">applicant information</div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">name</div>
                            <div class="text-body1 text-uppercase">{{ formatName(info?.profile) }}</div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">status</div>
                            <div class="text-body1 text-uppercase">{{ info?.status }}</div>
                        </div>
                        <div class="row q-col-gutter-lg q-mb-mb">
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">sex</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.sex?.name }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">marital status</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.civilStatus?.name }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">bithdate</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.birthdate }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">birthplace</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.birthplace }}</div>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey">address</div>
                            <div class="text-body1 text-uppercase">{{ formatAddress(info?.profile) }}</div>
                        </div>
                        <div class="row q-col-gutter-lg q-mb-mb">
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">weight (kg)</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.weight }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">height (cm)</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.height }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">blood type</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.bloodType?.name }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">email</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.email }}</div>
                            </div>
                            <div class="q-mb-md">
                                <div class="text-caption text-uppercase text-grey">contact number</div>
                                <div class="text-body1 text-uppercase">{{ info?.profile?.contactNo }}</div>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey q-mb-sm">educational attainment</div>
                            <div class="card-grid">
                                <div
                                    v-for="(data, index) in info?.profile?.educations"
                                    :key="`data-${data.id}`"
                                    class="inner-card-anim-wrapper"
                                    :style="{ animationDelay: `${index * 120}ms` }"
                                >
                                    <q-card 
                                        class="card card-hover-animate flex flex-center no-shadow cursor-pointer radius-sm" 
                                    >
                                        <q-card-section class="text-center full-width">
                                            <div class="text-caption text-uppercase">{{ data?.course?.name }}</div>
                                            <div class="text-caption text-capitalize text-grey">{{ data?.school?.name }}</div>
                                        </q-card-section>
                                        <q-card-section class="text-center full-width">
                                            <div class="text-caption">{{ data?.level?.name }}</div>
                                            <div class="text-caption text-grey">{{ data?.startDate }} to {{ data?.endDate }}</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey q-mb-sm">trainings</div>
                            <div class="card-grid">
                                <div
                                    v-for="(data, index) in info?.profile?.trainings"
                                    :key="`data-${data.id}`"
                                    class="inner-card-anim-wrapper"
                                    :style="{ animationDelay: `${index * 120}ms` }"
                                >
                                    <q-card 
                                        class="card card-hover-animate flex flex-center no-shadow cursor-pointer radius-sm" 
                                    >
                                        <q-card-section class="text-center full-width">
                                            <div class="text-subtitle1 text-uppercase">{{ data?.title }}</div>
                                            <div class="text-caption text-uppercase">{{ data?.type }}</div>
                                        </q-card-section>
                                        <q-card-section class="text-center full-width">
                                            <div class="text-caption text-grey">{{ data?.startDate }} to {{ data?.endDate }}</div>
                                            <div class="text-caption text-grey">{{ data?.hour }}hr/s</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey q-mb-sm">work experiences</div>
                            <div class="card-grid">
                                <div
                                    v-for="(data, index) in info?.profile?.experiences"
                                    :key="`data-${data.id}`"
                                    class="inner-card-anim-wrapper"
                                    :style="{ animationDelay: `${index * 120}ms` }"
                                >
                                    <q-card 
                                        class="card card-hover-animate flex flex-center no-shadow cursor-pointer radius-sm" 
                                    >
                                        <q-card-section class="text-center full-width">
                                            <div class="text-subtitle1 text-uppercase">{{ data?.position }}</div>
                                            <div class="text-caption text-uppercase">{{ data?.jobDescription }}</div>
                                        </q-card-section>
                                        <q-card-section class="text-center full-width">
                                            <div class="text-caption text-grey">{{ data?.startDate }} to {{ data?.endDate }}</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                        <div class="q-mb-md">
                            <div class="text-caption text-uppercase text-grey q-mb-sm">documents uploaded</div>
                            <div class="card-grid">
                                <div
                                    v-for="(data, index) in info?.profile?.documents"
                                    :key="`data-${data.id}`"
                                    class="inner-card-anim-wrapper"
                                    :style="{ animationDelay: `${index * 120}ms` }"
                                >
                                    <q-card 
                                        class="card card-hover-animate flex flex-center no-shadow cursor-pointer radius-sm" 
                                    >
                                        <q-card-section class="text-center full-width">
                                            <div class="text-subtitle1 text-uppercase" @click="ViewDocument(data)">{{ data?.filename }}</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
                
                <q-card-actions class="q-pa-lg bg">
                    <div class="q-gutter-sm">
                        <div class="q-mb-xs">
                            <span class="text-caption text-uppercase text-grey q-mr-sm">application status</span>
                            <q-icon
                                :name="Errors.applicationStatus.type ? 'error' : 'info'"
                                :color="Errors.applicationStatus.type ? 'negative' : 'grey'"
                                class="cursor-pointer"
                                size="xs"
                            >
                                <q-tooltip anchor="top middle" self="center middle" :class="Errors.applicationStatus.type ? 'bg-negative' : 'bg-grey'">
                                    <template v-if="Errors.applicationStatus.type">
                                        <div 
                                            v-for="(msg, i) in Errors.applicationStatus.messages" 
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
                            v-model="applicationStatus"
                            emit-value
                            map-options
                            use-input
                            input-debounce="300"
                            :options="filteredApplicationStatuses"
                            @filter="filterApplicationStatusFn"
                            :error="Errors.applicationStatus.type"
                            dropdown-icon="keyboard_arrow_down"
                            :no-error-icon="true"
                            dense
                            :disable="(info?.status == 'Hired' || info?.status == 'Rejected' || info?.status == 'Withdrawn') || info?.vacancy.status == 'Filled'"
                        >
                            <template v-slot:after>
                                <div class="q-gutter-sm">
                                    <q-btn :disable="(info?.status == 'Hired' || info?.status == 'Rejected' || info?.status == 'Withdrawn') || info?.vacancy.status == 'Filled'" unelevated size="md" color="primary" class="btn text-capitalize" label="update" >
                                        <q-menu transition-show="jump-up" transition-hide="jump-down" :offset="[0, 15]" class="radius-sm" style="box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;">
                                            <q-card class="no-shadow  radius-sm q-pa-lg" style="width: 300px;">
                                                <q-card-section>
                                                    <div class="text-h6 text-center text-uppercase">
                                                        proceed to update status
                                                    </div>
                                                </q-card-section>
                                                <q-card-actions>
                                                    <q-btn unelevated size="md" color="primary" class="full-width text-capitalize" label="proceed" @click="UpdateApplication(info)"/>
                                                </q-card-actions>
                                            </q-card>
                                        </q-menu>
                                    </q-btn>
                                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="print" @click="PrintApplication"/>
                                    <q-btn unelevated size="md" color="primary" class="btn text-capitalize" label="discard" @click="() => { DetailDialog = false; }" outline/>
                                </div>
                            </template>
                        </q-select>
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
const ApplicationSubmitting = ref(false);

const vacancyId = ref('');
const firstname = ref('');
const middlename = ref('');
const lastname = ref('');
const suffix = ref('');
const sexId = ref('');
const maritalId = ref('');
const birthdate = ref('');
const birthplace = ref('');
const weight = ref('');
const height = ref('');
const bloodTypeId = ref('');
const email = ref('');
const contactNo = ref('');
const region = ref(null);
const province = ref(null);
const town = ref(null);
const barangay = ref(null);
const streetAddress = ref('');
const educations = ref([
    {
        levelId: "",
        schoolId: "",
        courseId: "",
        startDate: "",
        endDate: "",
        yearGraduated: "",
        rating: ""
    }
]);
const trainings = ref([
    {
        title: '',
        startDate: '',
        endDate: '',
        hour: '',
        typeId: '',
        conductedBy: ''
    }
]);
const experiences = ref([
    {
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    }
]);
const documents = ref([
    {
        file: ''
    }
]);
const applicationStatus = ref('');

const Errors = reactive({
    vacancyId: {
        type: null, messages: []
    },
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
    educationMessages: {},
    trainings: [],
    trainingMessages: {},
    experiences: [],
    experinceMessages: {},
    documents: [],
    documentMessages: {},
    //
    applicationStatus: {
        type: null, messages: []
    }
});

const Validations = () => {

    let isError = false;

    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].messages = [];
    });

    if (!vacancyId.value) {
        Errors.vacancyId.type = true;
        Errors.vacancyId.messages.push('vacancy is required');
        isError = true;
    } else {
        Errors.vacancyId.type = null;
    }

    if (!firstname.value) {
        Errors.firstname.type = true;
        Errors.firstname.messages.push('first name is required');
        isError = true;
    } else {
        Errors.firstname.type = null;
    }

    if (!middlename.value) {
        Errors.middlename.type = true;
        Errors.middlename.messages.push('middle name is required');
        isError = true;
    } else {
        Errors.middlename.type = null;
    }

    if (!lastname.value) {
        Errors.lastname.type = true;
        Errors.lastname.messages.push('last name is required');
        isError = true;
    } else {
        Errors.lastname.type = null;
    }

    const allowedSuffixes = ['SR', 'JR', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    if (suffix.value) {
        const suffixValue = suffix.value.trim().toUpperCase();
        if (!allowedSuffixes.includes(suffixValue)) {
            Errors.suffix.type = true;
            Errors.suffix.messages.push('invalid suffix');
            isError = true;
        } else {
            Errors.suffix.type = null;
        }
    } else {
        Errors.suffix.type = null;
    }

    if (!sexId.value) {
        Errors.sexId.type = true;
        Errors.sexId.messages.push('sex is required');
        isError = true;
    } else {
        Errors.sexId.type = null;
    }

    if (!maritalId.value) {
        Errors.maritalId.type = true;
        Errors.sexId.messages.push('marital status is required');
        isError = true;
    } else {
        Errors.maritalId.type = null;
    }

    if (!birthdate.value) {
        Errors.birthdate.type = true;
        Errors.birthdate.messages.push('birthdate is required');
        isError = true;
    } else {
        Errors.birthdate.type = null;
    }

    if (!birthplace.value) {
        Errors.birthplace.type = true;
        Errors.birthplace.messages.push('birthplace is required');
        isError = true;
    } else {
        Errors.birthplace.type = null;
    }

    if (!weight.value) {
        Errors.weight.type = true;
        Errors.weight.messages.push('weight is required');
        isError = true;
    } else if (isNaN(weight.value)) {
        Errors.weight.type = true;
        Errors.weight.messages.push('weight must be a number');
        isError = true;
    } else if (weight.value <= 0 || weight.value > 500) {
        Errors.weight.type = true;
        Errors.weight.messages.push('weight must be between 1 and 500');
        isError = true;
    } else {
        Errors.weight.type = null;
    }
    if (!height.value) {
        Errors.height.type = true;
        Errors.height.messages.push('height is required');
        isError = true;
    } else if (isNaN(height.value)) {
        Errors.height.type = true;
        Errors.height.messages.push('height must be a number');
        isError = true;
    } else if (height.value < 30 || height.value > 300) {
        Errors.height.type = true;
        Errors.height.messages.push('height must be between 30 and 300 cm');
        isError = true;
    } else {
        Errors.height.type = null;
    }

    if (!bloodTypeId.value) {
        Errors.bloodTypeId.type = true;
        Errors.bloodTypeId.messages.push('blood type is required');
        isError = true;
    } else {
        Errors.bloodTypeId.type = null;
    }

    if (!email.value) {
        Errors.email.type = true;
        Errors.email.messages.push('email is required');
        isError = true;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            Errors.email.type = true;
            Errors.email.messages.push('email must be a valid email address');
            isError = true;
        } else if (email.value.length > 100) {
            Errors.email.type = true;
            Errors.email.messages.push('email must not exceed 100 characters');
            isError = true;
        } else {
            Errors.email.type = null;
        }
    }

    if (!contactNo.value) {
        Errors.contactNo.type = true;
        Errors.contactNo.messages.push('contact number is required');
        isError = true;
    } else {
        const phMobileRegex = /^(09\d{9}|\+639\d{9})$/;
        if (!phMobileRegex.test(contactNo.value)) {
            Errors.contactNo.type = true;
            Errors.contactNo.messages.push('enter a valid PH mobile number (e.g., 09123456789 or +639123456789)');
            isError = true;
        } else {
            Errors.contactNo.type = null;
        }
    }

    if (!region.value) {
        Errors.region.type = true;
        Errors.region.messages.push('region is required');
        isError = true;
    } else {
        Errors.region.type = null;
    }

    if (!province.value) {
        Errors.province.type = true;
        Errors.province.messages.push('province is required');
        isError = true;
    } else {
        Errors.province.type = null;
    }

    if (!town.value) {
        Errors.town.type = true;
        Errors.town.messages.push('town is required');
        isError = true;
    } else {
        Errors.town.type = null;
    }

    if (!barangay.value) {
        Errors.barangay.type = true;
        Errors.barangay.messages.push('barangay is required');
        isError = true;
    } else {
        Errors.barangay.type = null;
    }

    if (!streetAddress.value) {
        Errors.streetAddress.type = true;
        Errors.streetAddress.messages.push('street address/zone/purok is required');
        isError = true;
    } else {
        Errors.streetAddress.type = null;
    }

    Errors.educations = educations.value.map(() => ({
        level: { type: null, messages: [] },
        school: { type: null, messages: [] },
        course: { type: null, messages: [] },
        start: { type: null, messages: [] },
        end: { type: null, messages: [] },
        graduated: { type: null, messages: [] },
        rating: { type: null, messages: [] }
    }))
    educations.value.forEach((e, index) => {
        if (!e.levelId) {
            Errors.educations[index].level.type = true;
            Errors.educations[index].level.messages.push('school level is required');
            isError = true;
        }
        if (!e.schoolId) {
            Errors.educations[index].school.type = true;
            Errors.educations[index].school.messages.push('school is required');
            isError = true;
        }
        if (!e.courseId) {
            Errors.educations[index].course.type = true;
            Errors.educations[index].course.messages.push('degree is required');
            isError = true;
        }
        if (!e.startDate) {
            Errors.educations[index].start.type = true;
            Errors.educations[index].start.messages.push('start date is required');
            isError = true;
        } else if (isNaN(new Date(e.startDate).getTime())) {
            Errors.educations[index].start.type = true;
            Errors.educations[index].start.messages.push('start date must be a valid date');
            isError = true;
        }
        if (!e.endDate) {
            Errors.educations[index].end.type = true;
            Errors.educations[index].end.messages.push('end date is required');
            isError = true;
        } else if (isNaN(new Date(e.endDate).getTime())) {
            Errors.educations[index].end.type = true;
            Errors.educations[index].end.messages.push('end date must be a valid date');
            isError = true;
        }
        if (!e.yearGraduated) {
            Errors.educations[index].graduated.type = true;
            Errors.educations[index].graduated.messages.push('year graduated is required');
            isError = true;
        } else {
            const dateObj = new Date(e.yearGraduated);
            const currentDate = new Date();
            if (isNaN(dateObj.getTime())) {
                Errors.educations[index].graduated.type = true;
                Errors.educations[index].graduated.messages.push('graduation date must be a valid date');
                isError = true;
            }
            else if (dateObj > currentDate) {
                Errors.educations[index].graduated.type = true;
                Errors.educations[index].graduated.messages.push('graduation date cannot be in the future');
                isError = true;
            }
        }
        if (!e.rating) {
            Errors.educations[index].rating.type = true;
            Errors.educations[index].rating.messages.push('final rating is required');
            isError = true;
        } else if (isNaN(e.rating)) {
            Errors.educations[index].rating.type = true;
            Errors.educations[index].rating.messages.push('final rating must be a number');
            isError = true;
        } else if (parseFloat(e.rating) < 0 || parseFloat(e.rating) > 100) {
            Errors.educations[index].rating.type = true;
            Errors.educations[index].rating.messages.push('final rating must be between 0 and 100 percent');
            isError = true;
        }
    });

    Errors.trainings = trainings.value.map(() => ({
        title: { type: null, messages: [] },
        start: { type: null, messages: [] },
        end: { type: null, messages: [] },
        hour: { type: null, messages: [] },
        typeId: { type: null, messages: [] },
        conductedBy: { type: null, messages: [] }
    }));
    trainings.value.forEach((e, index) => {
        if (!e.title) {
            Errors.trainings[index].title.type = true;
            Errors.trainings[index].title.messages.push('training title is required');
            isError = true;
        }
        if (!e.startDate) {
            Errors.trainings[index].start.type = true;
            Errors.trainings[index].start.messages.push('start date is required');
            isError = true;
        } else if (isNaN(new Date(e.startDate).getTime())) {
            Errors.trainings[index].start.type = true;
            Errors.trainings[index].start.messages.push('start date must be a valid date');
            isError = true;
        }
        if (!e.endDate) {
            Errors.trainings[index].end.type = true;
            Errors.trainings[index].end.messages.push('end date is required');
            isError = true;
        } else if (isNaN(new Date(e.endDate).getTime())) {
            Errors.trainings[index].end.type = true;
            Errors.trainings[index].end.messages.push('end date must be a valid date');
            isError = true;
        }
        if (!e.hour) {
            Errors.trainings[index].hour.type = true;
            Errors.trainings[index].hour.messages.push('hour/s is required');
            isError = true;
        } else if (isNaN(e.hour) || e.hour < 1 || e.hour > 23) {
            Errors.trainings[index].hour.type = true;
            Errors.trainings[index].hour.messages.push('hour/s must be a valid number between 1 and 23');
            isError = true;
        }
        if (!e.typeId) {
            Errors.trainings[index].typeId.type = true;
            Errors.trainings[index].typeId.messages.push('training type is required');
            isError = true;
        }

        if (!e.conductedBy) {
            Errors.trainings[index].conductedBy.type = true;
            Errors.trainings[index].conductedBy.messages.push('conducted by is required');
            isError = true;
        }
    });

    Errors.experiences = experiences.value.map(() => ({
        position: { type: null, messages: [] },
        start: { type: null, messages: [] },
        end: { type: null, messages: [] },
        description: { type: null, messages: [] }
    }))
    experiences.value.forEach((e, index) => {
        if (!e.position) {
            Errors.experiences[index].position.type = true;
            Errors.experiences[index].position.messages.push('position is required');
            isError = true;
        }
        if (!e.startDate) {
            Errors.experiences[index].start.type = true;
            Errors.experiences[index].start.messages.push('start date is required');
            isError = true;
        } else if (isNaN(new Date(e.startDate).getTime())) {
            Errors.experiences[index].start.type = true;
            Errors.experiences[index].start.messages.push('end date must be a valid date');
            isError = true;
        }
        if (!e.endDate) {
            Errors.experiences[index].end.type = true;
            Errors.experiences[index].end.messages.push('end date is required');
            isError = true;
        } else if (isNaN(new Date(e.endDate).getTime())) {
            Errors.experiences[index].end.type = true;
            Errors.experiences[index].end.messages.push('end date must be a valid date');
            isError = true;
        }
        if (!e.description) {
            Errors.experiences[index].description.type = true;
            Errors.experiences[index].description.messages.push('job description is required');
            isError = true;
        }
    });

    Errors.documents = documents.value.map(() => ({
        file: { type: null, messages: [] }
    }))
    documents.value.forEach((e, index) => {
        const maxSize = 5 * 1024 * 1024;
        if (!e.file) {
            Errors.documents[index].file.type = true;
            Errors.documents[index].file.messages.push('file is required');
            isError = true;
        } else if (e.file.type !== 'application/pdf') {
            Errors.documents[index].file.type = true;
            Errors.documents[index].file.messages.push('file must be a PDF document');
            isError = true;
        } else if (e.file.size > maxSize) {
            Errors.documents[index].file.type = true;
            Errors.documents[index].file.messages.push('file size must not exceed 5MB');
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

const UpdateValidations = () => {

    let isError = false;

    Object.keys(Errors).forEach(key => {
        Errors[key].type = null;
        Errors[key].messages = [];
    });

    if (!applicationStatus.value) {
        Errors.applicationStatus.type = true;
        Errors.applicationStatus.messages.push('application status is required');
        isError = true;
    } else {
        Errors.applicationStatus.type = null;
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
        const { data } = await api.get(`/application`, {
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
    LoadVacancies();
    LoadSchoolLevels();
    LoadSexes();
    LoadBloodTypes();
    LoadCourses();
    LoadSchools();
    LoadMaritalStatuses();
    LoadRegions();
    LoadTrainingTypes();
    dialog.value = true;
}

const ResetForm = () => {
    vacancyId.value = '';
    firstname.value = '';
    middlename.value = '';
    lastname.value = '';
    suffix.value = '';
    sexId.value = '';
    maritalId.value = '';
    birthdate.value = '';
    birthplace.value = '';
    weight.value = '';
    sexId.value = '';
    height.value = '';
    bloodTypeId.value = '';
    email.value = '';
    contactNo.value = '';
    region.value = '';
    province.value = '';
    town.value = '';
    barangay.value = '';
    streetAddress.value = '';
    ResetPersonalErrors();
    ResetEducationErrors();
    ResetTrainingErrors();
    ResetExperienceErrors();
    ResetDocumentErrors();
}

const ResetPersonalErrors = () => {
    const personalFields = [
        'firstname',
        'middlename',
        'lastname',
        'suffix',
        'sexId',
        'maritalId',
        'birthdate',
        'birthplace',
        'weight',
        'height',
        'bloodTypeId',
        'email',
        'contactNo',
        'region',
        'province',
        'town',
        'barangay',
        'streetAddress'
    ];

    personalFields.forEach(field => {
        if (Errors[field]) {
        Errors[field].type = null;
        Errors[field].messages = [];
        }
    });
};

const ResetEducationErrors = () => {
    Errors.educations = educations.value.map(() => ({
        level: { type: null, messages: [] },
        school: { type: null, messages: [] },
        course: { type: null, messages: [] },
        start: { type: null, messages: [] },
        end: { type: null, messages: [] },
        graduated: { type: null, messages: [] },
        rating: { type: null, messages: [] }
    }));

    Errors.educationMessages = {
        level: [],
        school: [],
        course: [],
        start: [],
        end: [],
        graduated: [],
        rating: []
    };
};

const ResetTrainingErrors = () => {
    Errors.trainings = trainings.value.map(() => ({
        title: { type: null, messages: [] },
        start: { type: null, messages: [] },
        end: { type: null, messages: [] },
        hour: { type: null, messages: [] },
        typeId: { type: null, messages: [] },
        conductedBy: { type: null, messages: [] }
    }));

    Errors.trainingMessages = {
        title: [],
        start: [],
        end: [],
        hour: [],
        type: [],
        conductedBy: []
    };
};

const ResetExperienceErrors = () => {
    Errors.experiences = experiences.value.map(() => ({
        position: { type: null, messages: [] },
        start: { type: null, messages: [] },
        end: { type: null, messages: [] },
        description: { type: null, messages: [] }
    }));

    Errors.experinceMessages = {
        position: [],
        start: [],
        end: [],
        description: []
    };
};

const ResetDocumentErrors = () => {
    Errors.documents = documents.value.map(() => ({
        file: { type: null, messages: [] }
    }));

    Errors.documentMessages = {
        file: []
    };
};

const Save = async () => {
    if (!Validations()) return;
    ApplicationSubmitting.value = true;
    console.log("TrainingMessages:", Errors.trainingMessages);
    try {
        const Data = new FormData();
        Data.append("vacancyId", vacancyId.value);
        Data.append("firstname", firstname.value);
        Data.append("middlename", middlename.value);
        Data.append("lastname", lastname.value);
        Data.append("suffix", suffix.value);
        Data.append("sexId", sexId.value);
        Data.append("maritalId", maritalId.value);
        Data.append("birthdate", birthdate.value);
        Data.append("birthplace", birthplace.value);
        Data.append("weight", weight.value);
        Data.append("height", height.value);
        Data.append("bloodTypeId", bloodTypeId.value);
        Data.append("email", email.value);
        Data.append("contactNo", contactNo.value);
        Data.append("regionId", region.value);
        Data.append("provinceId", province.value);
        Data.append("townId", town.value);
        Data.append("barangayId", barangay.value);
        Data.append("streetAddress", streetAddress.value);
        Data.append("educations", JSON.stringify(educations.value));
        Data.append("trainings", JSON.stringify(trainings.value));
        Data.append("experiences", JSON.stringify(experiences.value));
        documents.value.forEach((doc, index) => {
            Data.append(`documents[${index}][documentId]`, doc.documentId);
            if (doc.file) {
                Data.append(`documents[${index}][file]`, doc.file);
            }
        });
        const response = await api.post('/application', Data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        rows.value.unshift(response.data.application)
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
        ApplicationSubmitting.value = false;
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
    DetailDialog.value = true;
    LoadApplication(data.id);
    filteredApplicationStatuses.value = [...applicationStatuses.value];
    applicationStatus.value = applicationStatuses.value.find(p => p.value === data.status)?.value || null;
}

const LoadApplication = async (id) => {
    DetailSubmitting.value = true
    try {
        const response = await api.get(`/application/${id}/details`);
        info.value = response.data.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    } finally {
        DetailSubmitting.value = false;
    }
};

const UpdateApplication = async (data) => {
    if (!UpdateValidations()) return;
    DetailSubmitting.value = true;
    try {
        const response = await api.post(`application/${data.id}/update`, {
            status: applicationStatus.value
        });
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption text-capitalize;">${response.data.message}<div>
            `
        });
        info.value = response.data.application;
        UpdateList(response.data.application);
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

const vacancies = ref([]);
const sexes = ref([]);
const levels = ref([]);
const maritalstatuses = ref([]);
const bloodtypes = ref([]);
const regions = ref([]);
const provinces = ref([]);
const towns = ref([]);
const barangays = ref([]);
const schools = ref([]);
const courses = ref([]);
const trainingTypes = ref([]);
const applicationStatuses = ref([
    {
        "value": "Pooling",
        "label": "POOLING",
    },
    {
        "value": "Shortlisted",
        "label": "SHORTLISTED",
    },
    {
        "value": "Interview",
        "label": "INTERVIEW",
    },
    {
        "value": "Hired",
        "label": "HIRED",
    },
    {
        "value": "Rejected",
        "label": "REJECTED",
    },
    {
        "value": "Withdrawn",
        "label": "WITHDRAWN",
    }
]);

const filteredSexes = ref([]);
const filteredLevels = ref([]);
const filteredMartitalStatuses = ref([]);
const filteredBloodTypes = ref([]);
const filteredRegions = ref([]);
const filteredProvinces = ref([]);
const filteredTowns = ref([]);
const filteredBarangays = ref([]);
const filteredSchools = ref([]);
const filteredCourses = ref([]);
const filteredTrainingTypes = ref([]);
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

const normalizeOptions = data => data.map(d => ({
    label: d.label ?? d.name ?? String(d.text ?? d.value),
    value: Number(d.value ?? d.id)
}))

const filterSexFn = createFilterFn(sexes, filteredSexes);
const filterLevelFn = createFilterFn(levels, filteredLevels);
const filterMaritalStatusFn = createFilterFn(maritalstatuses, filteredMartitalStatuses);
const filterBloodTypeFn = createFilterFn(bloodtypes, filteredBloodTypes);
const filterRegionFn = createFilterFn(regions, filteredRegions);
const filterProvinceFn = createFilterFn(provinces, filteredProvinces);
const filterTownFn = createFilterFn(towns, filteredTowns);
const filterBarangayFn = createFilterFn(barangays, filteredBarangays);
const filterSchoolFn = createFilterFn(schools, filteredSchools);
const filterCoursesFn = createFilterFn(courses, filteredCourses);
const filterTrainingTypeFn = createFilterFn(trainingTypes, filteredTrainingTypes);
const filterApplicationStatusFn = createFilterFn(applicationStatuses, filteredApplicationStatuses);

const LoadVacancies = async () => {
    try {
        const response = await api.get(`/option/vacancies`);
        vacancies.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadSexes = async () => {
    try {
        const { data } = await api.get(`/option/sexes`);
        sexes.value = normalizeOptions(data)
        filteredSexes.value = [...sexes.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadSchoolLevels = async () => {
    try {
        const { data } = await api.get(`/option/schoollevels`);
        levels.value = normalizeOptions(data)
        filteredLevels.value = [...levels.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadMaritalStatuses = async () => {
    try {
        const { data } = await api.get(`/option/maritalstatuses`);
        maritalstatuses.value = normalizeOptions(data)
        filteredMartitalStatuses.value = [...maritalstatuses.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadBloodTypes = async () => {
    try {
        const { data } = await api.get(`/option/bloodtypes`);
        bloodtypes.value = normalizeOptions(data)
        filteredBloodTypes.value = [...bloodtypes.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadRegions = async () => {
    try {
        const response = await api.get(`/option/regions`);
        regions.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadProvinces = async () => {
    try {
        const response = await api.get(`/option/provinces?regionId=${region.value}`);
        provinces.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadTowns = async () => {
    try {
        const response = await api.get(`/option/towns?provinceId=${province.value}`);
        towns.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadBarangays = async () => {
    try {
        const response = await api.get(`/option/barangays?townId=${town.value}`);
        barangays.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadSchools = async () => {
    try {
        const response = await api.get(`/option/schools`);
        schools.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadCourses = async () => {
    try {
        const response = await api.get(`/option/courses`);
        courses.value = response.data;
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

const LoadTrainingTypes = async () => {
    try {
        const { data } = await api.get(`/option/trainingtypes`);
        trainingTypes.value = normalizeOptions(data)
        filteredTrainingTypes.value = [...trainingTypes.value]
    } catch (error) {
        console.error("Error fetching options:", error);
    }
};

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

const formatAddress = (profile) => {
    if (!profile) return 'No address provided';
    const parts = [
        profile.streetAddress,
        profile.barangay?.name,
        profile.town?.name,
        profile.province?.name,
        profile.region?.name
    ].filter(Boolean);
    return parts.join(', ');
}

const addEducation = () => {
    const e = educations.value;
    e.unshift({
        levelId: "",
        schoolId: "",
        courseId: "",
        startDate: "",
        endDate: "",
        yearGraduated: "",
        rating: ""
    });
}

const removeEducation = (index) => {
    educations.value.splice(index, 1);
    ResetEducationErrors()
}

const addTraining = () => {
    const t = trainings.value;
    t.unshift({
        title: "",
        startDate: "",
        endDate: "",
        hour: "",
        type: "",
        conductedBy: ""
    });
}

const removeTraining = (index) => {
    const t = trainings.value;
    t.splice(index, 1);
    ResetTrainingErrors()
}

const addExperience = () => {
    const e = experiences.value;
    e.unshift({
        position: "",
        startDate: "",
        endDate: "",
        description: ""
    });
}

const removeExperience = (index) => {
    const e = experiences.value;
    e.splice(index, 1);
    ResetExperienceErrors()
}

const addDocument = () => {
    const d = documents.value;
    d.unshift({
        documentId: "",
        file: ""
    });
}

const removeDocument = (index) => {
    const d = documents.value;
    d.splice(index, 1);
    ResetDocumentErrors()
}

const ViewDocument = (data) => {
    const file = `${process.env.VUE_APP_BACKEND_URL}${data.file}`;
    window.open(file, '_blank');
}

onMounted(() => {
    LoadAll();
})
</script>

<style scoped>

</style>