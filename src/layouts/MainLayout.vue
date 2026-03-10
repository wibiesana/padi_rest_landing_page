<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="glass-header text-white">
      <q-toolbar class="container">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-md"
        />

        <q-toolbar-title class="flex items-center">
          <q-avatar size="32px" class="q-mr-sm">
            <q-icon name="grain" color="primary" />
          </q-avatar>
          <span class="text-weight-bold">Padi REST API</span>
        </q-toolbar-title>

        <div class="gt-sm q-gutter-md">
          <q-btn flat label="Home" to="/" />
          <q-btn flat label="Features" @click="handleNav('features')" />
          <q-btn flat label="Quick Start" @click="handleNav('quickstart')" />
          <q-btn color="primary" unelevated label="Documentation" to="/docs" icon="book" />
          <q-btn
            outline
            color="primary"
            label="GitHub"
            icon="code"
            href="https://github.com/wibiesana/padi_rest_api"
            target="_blank"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-dark text-white lt-md">
      <q-list>
        <q-item-label header class="text-white"> Navigation </q-item-label>
        <q-item clickable @click="router.push('/')">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable @click="handleNav('features')">
          <q-item-section avatar><q-icon name="stars" /></q-item-section>
          <q-item-section>Features</q-item-section>
        </q-item>
        <q-item clickable @click="handleNav('quickstart')">
          <q-item-section avatar><q-icon name="speed" /></q-item-section>
          <q-item-section>Quick Start</q-item-section>
        </q-item>
        <q-item clickable @click="router.push('/docs')">
          <q-item-section avatar><q-icon name="book" /></q-item-section>
          <q-item-section>Full Documentation</q-item-section>
        </q-item>
        <q-separator dark q-my-sm />
        <q-item clickable tag="a" href="https://github.com/wibiesana/padi_rest_api" target="_blank">
          <q-item-section avatar><q-icon name="code" color="primary" /></q-item-section>
          <q-item-section>GitHub Repository</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-premium">
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-white q-pa-lg text-center border-top">
      <div class="text-subtitle1">&copy; 2026 Padi REST API Framework</div>
      <div class="text-caption text-grey-5">Built with Quasar & Passion</div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const leftDrawerOpen = ref(false)
const router = useRouter()
const route = useRoute()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function handleNav(id) {
  if (route.path !== '/') {
    await router.push('/')
    // Wait for page to load
    setTimeout(() => scrollTo(id), 100)
  } else {
    scrollTo(id)
  }
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    leftDrawerOpen.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.border-top {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
