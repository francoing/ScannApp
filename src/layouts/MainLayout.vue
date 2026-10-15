<script setup lang="ts">
</script>

<template>
    <q-layout view="hHh lpR fFf" class="bg-grey-1">
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-icon name="qr_code_scanner" size="sm" class="q-mr-sm" />
                <q-toolbar-title>Scanner DNI</q-toolbar-title>
                <q-btn
                    flat
                    no-caps
                    icon="admin_panel_settings"
                    label="Admin"
                    :to="{ name: 'dashboard' }"
                />
            </q-toolbar>
        </q-header>

        <q-page-container class="q-pa-md">
            <div class="page-content">
                <router-view />
            </div>
        </q-page-container>
    </q-layout>
</template>

<style scoped>
.page-content {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
