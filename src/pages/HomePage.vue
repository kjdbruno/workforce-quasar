<template>
    <div>
        <div class="row q-col-gutter-md">
            <div class="col-9">
                <q-card class="card card-profile no-shadow radius-sm">
                    <div class="row q-col-gutter-sm">
                        <div class="col-9">
                            <q-card-section class="q-pa-xl">
                                <div>
                                    <div class="text-h6 text-capitalize text-light text-white">welcome!</div>
                                    <div class="text-h5 text-capitalize text-white text-bold">kenneth jay bruno</div>
                                </div>
                            </q-card-section>
                        </div>
                        <div class="col-3">
                            <img
                                src="~assets/photo.png"
                                alt="Welcome"
                                />
                        </div>
                    </div>
                </q-card>
            </div>
            <div class="col-3">
                <q-card class="no-shadow radius-sm">
                    <q-card-section class="q-pa-none">
                        <q-date v-model="date" class="full-width no-shadow radius-sm"/>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.card-profile {
    overflow: hidden;
    background: linear-gradient(
        135deg,
        #ff4d2d 0%,
        #ff7a18 45%,
        #ff9f1c 100%
    );
    height: 300px;
}

.welcome-card{
    overflow: hidden;
    background: linear-gradient(
        135deg,
        #ff4d2d 0%,
        #ff7a18 45%,
        #ff9f1c 100%
    );
}

/* avatar container on right */
.welcome-avatar{
    width: 150px;
    height: 100px;
    display:flex;
    align-items:flex-end;
    justify-content:flex-end;
    position: relative;
    z-index: 1;
}
 img{
    height: 300px;
    width: 100%;
    object-fit: contain;
    transform: translateY(6px);
}
</style>