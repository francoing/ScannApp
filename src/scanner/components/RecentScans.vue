<script setup lang="ts">
import { formatDateTime } from '@/shared/helpers/dates';
import useRecentScans from '../composables/useRecentScans';

const { recentScansQuery } = useRecentScans()
</script>

<template>
    <q-card flat bordered>
        <q-card-section class="row items-center justify-between q-py-sm">
            <span class="text-subtitle1 text-weight-medium">Últimos escaneos</span>
            <q-btn
                flat
                dense
                no-caps
                color="primary"
                label="Ver listado"
                icon-right="arrow_forward"
                :to="{ name: 'dashboard' }"
            />
        </q-card-section>

        <q-separator />

        <div v-if="recentScansQuery.isLoading.value" class="q-pa-lg flex flex-center">
            <q-spinner color="primary" size="2em" />
        </div>

        <q-list v-else separator>
            <q-item v-for="scan of recentScansQuery.data.value ?? []" :key="scan.id">
                <q-item-section avatar>
                    <q-avatar color="blue-1" text-color="primary" icon="person" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ scan.apellido }}, {{ scan.nombre }}</q-item-label>
                    <q-item-label caption>DNI {{ scan.dni }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ formatDateTime(scan.scannedAt) }}</q-item-label>
                </q-item-section>
            </q-item>

            <q-item v-if="recentScansQuery.data.value?.length === 0">
                <q-item-section class="text-grey-7">Todavía no hay escaneos</q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>

<style scoped>

</style>
