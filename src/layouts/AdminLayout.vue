<script setup lang="ts">
import { ref } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

interface MenuLink {
    label: string,
    icon: string,
    to: RouteLocationRaw
}

const links: MenuLink[] = [
    { label: 'Listado de escaneos', icon: 'list_alt',        to: { name: 'dashboard' } },
    { label: 'Volver al scanner',   icon: 'qr_code_scanner', to: { name: 'home' } },
]

const leftDrawerOpen = ref<boolean>(false)

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
    <q-layout view="hHh Lpr lFf" class="bg-grey-1">
        <q-header elevated class="bg-dark text-white">
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menú" @click="toggleLeftDrawer" />
                <q-toolbar-title>Admin · Scanner DNI</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="240">
            <q-list>
                <q-item-label header>Menú</q-item-label>
                <q-item
                    v-for="link of links"
                    :key="link.label"
                    clickable
                    exact
                    :to="link.to"
                    active-class="text-primary bg-blue-1"
                >
                    <q-item-section avatar>
                        <q-icon :name="link.icon" />
                    </q-item-section>
                    <q-item-section>{{ link.label }}</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container class="q-pa-md">
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<style scoped>

</style>
