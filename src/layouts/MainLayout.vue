<template>
  <q-layout view="lHh Lpr lff">
    <q-header class="nav-header text-white">
      <q-toolbar class="container q-py-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-md q-mr-sm"
        />

        <q-toolbar-title class="flex items-center cursor-pointer" @click="router.push('/')">
          <div class="logo-box q-mr-md flex items-center justify-center">
            <q-img :src="logoIcon" width="34px" height="34px" fit="contain" />
          </div>
          <div class="column justify-center">
            <span class="text-weight-bolder text-white brand-title">Padi REST API</span>
          </div>
          <q-badge
            color="amber-9"
            text-color="dark"
            class="q-ml-sm text-weight-bolder version-badge cursor-pointer"
            :label="'v' + APP_CONFIG.version"
            @click.stop="router.push('/docs/change-log')"
          />
        </q-toolbar-title>

        <div class="gt-sm q-gutter-x-sm flex items-center">
          <q-btn flat class="nav-btn" :label="$t('nav.home')" to="/" />
          <q-btn flat class="nav-btn" :label="$t('nav.features')" @click="handleNav('features')" />
          <q-btn flat class="nav-btn" :label="$t('nav.quickStart')" @click="handleNav('quickstart')" />
          <q-btn
            color="amber-9"
            text-color="dark"
            unelevated
            class="doc-btn text-weight-bolder"
            :label="$t('nav.documentation')"
            to="/docs"
            icon="menu_book"
          />
          <q-btn
            outline
            color="amber-8"
            label="GitHub"
            icon="code"
            href="https://github.com/wibiesana/padi_rest_api"
            target="_blank"
            class="github-btn text-weight-bold"
          />

          <!-- Language Selector -->
          <q-btn-dropdown
            outline
            color="grey-4"
            class="lang-btn text-weight-bold"
            :label="locale === 'id-ID' ? 'ID' : 'EN'"
            icon="translate"
            menu-class="lang-menu-popover"
          >
            <q-list dark class="lang-menu-list">
              <q-item clickable v-close-popup @click="setLocale('en-US')" :active="locale === 'en-US'" class="lang-item">
                <q-item-section avatar style="min-width: 32px"><q-icon name="language" color="amber-5" size="20px" /></q-item-section>
                <q-item-section class="lang-text">English</q-item-section>
                <q-item-section side v-if="locale === 'en-US'"><q-icon name="check" color="amber-5" size="18px" /></q-item-section>
              </q-item>
              <q-separator dark class="q-my-xs" style="background: #1f2937;" />
              <q-item clickable v-close-popup @click="setLocale('id-ID')" :active="locale === 'id-ID'" class="lang-item">
                <q-item-section avatar style="min-width: 32px"><q-icon name="flag" color="amber-5" size="20px" /></q-item-section>
                <q-item-section class="lang-text">Bahasa Indonesia</q-item-section>
                <q-item-section side v-if="locale === 'id-ID'"><q-icon name="check" color="amber-5" size="18px" /></q-item-section>
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

<style lang="scss" scoped>
.container {
  max-width: 1240px;
  margin: 0 auto;
}

.nav-header {
  background-color: #0b0f17;
  border-bottom: 1px solid #1f2937;
  position: sticky;
  top: 0;
  z-index: 1000;
  min-height: 76px;
  display: flex;
  align-items: center;
}

.logo-box {
  background: #1f2937;
  padding: 6px;
  border-radius: 10px;
  border: 1px solid #374151;
}

.brand-title {
  font-size: 1.25rem;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.version-badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.nav-btn {
  color: #d1d5db;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #f59e0b;
    background-color: #1f2937;
  }
}

.doc-btn {
  border-radius: 8px;
  padding: 8px 22px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  &:hover {
    background-color: #d97706;
  }
}

.github-btn {
  border-radius: 8px;
  padding: 7px 18px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  &:hover {
    background-color: rgba(245, 158, 11, 0.1);
  }
}

.lang-btn {
  border-radius: 8px;
  font-size: 0.9rem;
  padding: 6px 14px;
  border-color: #374151 !important;
  &:hover {
    border-color: #f59e0b !important;
    color: #f59e0b !important;
  }
}

.border-top {
  border-top: 1px solid #1f2937;
}
</style>

<style lang="scss">
/* Quasar dropdown popover override */
.lang-menu-popover,
.q-menu {
  background-color: #0b0f17 !important;
  background: #0b0f17 !important;
  border: 1px solid #1f2937 !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8) !important;
  border-radius: 8px !important;

  .lang-menu-list,
  .q-list {
    background-color: #0b0f17 !important;
    background: #0b0f17 !important;
    min-width: 180px;
    padding: 6px 0;
  }

  .q-item {
    color: #ffffff !important;
    background-color: transparent !important;
    transition: background 0.2s ease;

    &:hover {
      background-color: #1f2937 !important;
    }
  }

  /* Fix for Quasar active item default light background */
  .q-item--active,
  .q-item.q-item--active,
  .q-manual-focusable--focused {
    background-color: rgba(245, 158, 11, 0.15) !important;
    color: #f59e0b !important;

    .lang-text {
      color: #f59e0b !important;
      font-weight: 700 !important;
    }
  }

  .lang-text {
    color: #ffffff !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
  }
}
</style>
