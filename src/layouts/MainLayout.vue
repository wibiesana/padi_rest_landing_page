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
            <q-img :src="logoIcon" />
          </q-avatar>
          <span class="text-weight-bold">Padi REST API</span>
          <q-badge
            color="primary"
            class="q-ml-sm text-weight-bold cursor-pointer hover-scale"
            outline
            :label="'v' + APP_CONFIG.version"
            @click="router.push('/docs/change-log')"
          />
        </q-toolbar-title>

        <div class="gt-sm q-gutter-md flex items-center">
          <q-btn flat :label="$t('nav.home')" to="/" />
          <q-btn flat :label="$t('nav.features')" @click="handleNav('features')" />
          <q-btn flat :label="$t('nav.quickStart')" @click="handleNav('quickstart')" />
          <q-btn color="primary" unelevated :label="$t('nav.documentation')" to="/docs" icon="book" />
          <q-btn
            outline
            color="primary"
            label="GitHub"
            icon="code"
            href="https://github.com/wibiesana/padi_rest_api"
            target="_blank"
          />

          <!-- Language Selector -->
          <q-btn-dropdown
            flat
            round
            dense
            icon="translate"
            color="white"
            content-class="bg-dark"
          >
            <q-list dark>
              <q-item clickable v-close-popup @click="setLocale('en-US')" :active="locale === 'en-US'">
                <q-item-section>English</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="setLocale('id-ID')" :active="locale === 'id-ID'">
                <q-item-section>Bahasa Indonesia</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-dark text-white lt-md">
      <q-list>
        <q-item-label header class="text-white">{{ $t('nav.navigation') }}</q-item-label>
        <q-item clickable @click="router.push('/')">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>{{ $t('nav.home') }}</q-item-section>
        </q-item>
        <q-item clickable @click="handleNav('features')">
          <q-item-section avatar><q-icon name="stars" /></q-item-section>
          <q-item-section>{{ $t('nav.features') }}</q-item-section>
        </q-item>
        <q-item clickable @click="handleNav('quickstart')">
          <q-item-section avatar><q-icon name="speed" /></q-item-section>
          <q-item-section>{{ $t('nav.quickStart') }}</q-item-section>
        </q-item>
        <q-item clickable @click="router.push('/docs')">
          <q-item-section avatar><q-icon name="book" /></q-item-section>
          <q-item-section>{{ $t('nav.fullDocumentation') }}</q-item-section>
        </q-item>
        <q-separator dark q-my-sm />
        <q-item clickable tag="a" href="https://github.com/wibiesana/padi_rest_api" target="_blank">
          <q-item-section avatar><q-icon name="code" color="primary" /></q-item-section>
          <q-item-section>{{ $t('nav.githubRepo') }}</q-item-section>
        </q-item>
        <q-separator dark q-my-sm />
        <q-item-label header class="text-white">Language / Bahasa</q-item-label>
        <q-item clickable @click="setLocale('en-US')" :active="locale === 'en-US'">
          <q-item-section avatar><q-icon name="language" /></q-item-section>
          <q-item-section>English</q-item-section>
        </q-item>
        <q-item clickable @click="setLocale('id-ID')" :active="locale === 'id-ID'">
          <q-item-section avatar><q-icon name="language" /></q-item-section>
          <q-item-section>Bahasa Indonesia</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-premium">
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-white q-pa-lg text-center border-top">
      <div class="text-subtitle1">&copy; 2026 Padi REST API Framework</div>
      <div class="text-caption text-grey-5">{{ $t('nav.builtWith') }}</div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import logoIcon from 'assets/brand/padi_menunduk.png'
import { APP_CONFIG } from 'src/constants'

const { locale } = useI18n()
const leftDrawerOpen = ref(false)
const router = useRouter()
const route = useRoute()

function setLocale(lang) {
  locale.value = lang
}

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
.hover-scale {
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.08);
  }
}
</style>
