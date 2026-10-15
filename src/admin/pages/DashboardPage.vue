<script setup lang="ts">
import useScans from '@/scanner/composables/useScans';
import ScansTable from '../components/ScansTable.vue';

const { scansQuery } = useScans()
</script>

<template>
    <div class="q-mb-md">
        <span class="text-h4">Listado de escaneos</span>
        <p class="text-grey-7 q-mb-none">
            {{ scansQuery.data.value?.length ?? 0 }} registros · por ahora se guardan en este navegador hasta conectar la base de datos
        </p>
    </div>

    <ScansTable
        :scans="scansQuery.data.value ?? []"
        :loading="scansQuery.isFetching.value"
    />
</template>

<style scoped>

</style>
