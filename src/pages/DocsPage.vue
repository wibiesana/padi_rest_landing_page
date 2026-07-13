<template>
  <q-page class="docs-page bg-premium">
    <!-- Search Bar (Sticky Header) -->
    <div class="docs-header q-pa-md glass-header shadow-20">
      <div class="container flex justify-between items-center">
        <div class="flex items-center q-gutter-x-sm">
          <q-btn
            flat
            round
            icon="menu"
            color="primary"
            class="lt-md q-mr-sm"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
          <div class="text-h6 text-weight-bold text-gradient">Framework Documentation Hub</div>
          <q-badge
            color="primary"
            class="q-ml-sm q-px-sm text-weight-bold"
            :label="'v' + APP_CONFIG.version"
          />
        </div>
        <q-input
          v-model="search"
          placeholder="Search topics, classes, or code..."
          dark
          dense
          outlined
          class="search-input"
          bg-color="rgba(255,255,255,0.05)"
        >
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="container row no-wrap q-pa-lg">
      <!-- Sidebar Navigation -->
      <div class="col-3 gt-sm q-pr-xl">
        <div class="sticky-sidebar">
          <q-scroll-area style="height: calc(100vh - 180px)">
            <q-list padding class="text-white docs-nav q-gutter-y-xs">
              <template v-for="category in filteredCategories" :key="category.title">
                <q-item-label
                  header
                  class="text-primary text-weight-bold q-mt-md uppercase text-caption letter-spacing-1"
                >
                  {{ category.title }}
                </q-item-label>
                <q-item
                  v-for="item in category.items"
                  :key="item.id"
                  clickable
                  v-ripple
                  :active="activeSection === item.id"
                  @click="navigateTo(item)"
                  class="rounded-borders"
                >
                  <q-item-section side v-if="item.icon">
                    <q-icon
                      :name="item.icon"
                      size="20px"
                      :color="activeSection === item.id ? 'white' : 'grey-5'"
                    />
                  </q-item-section>
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-scroll-area>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="col-12 col-md-9">
        <div class="docs-container glass-card q-pa-xl text-white shadow-24 border-light-1">
          <!-- MARKDOWN VIEWER -->
          <div class="doc-markdown-view anim-fade-in q-pb-xl">
            <div class="flex items-center q-mb-lg">
              <h1 class="text-h3 text-weight-bold text-gradient">{{ selectedMdTitle }}</h1>
            </div>
            <div class="markdown-body" v-html="selectedMdHtml" @click="handleMarkdownClick"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Back to Top -->
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[24, 24]">
      <q-btn fab icon="keyboard_arrow_up" color="primary" unelevated class="shadow-10" />
    </q-page-scroller>

    <!-- Mobile Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      dark
      side="left"
      overlay
      style="background: #0f172a"
    >
      <q-list padding class="text-white">
        <template v-for="category in filteredCategories" :key="'m-' + category.title">
          <q-item-label
            header
            class="text-primary text-weight-bold q-mt-md uppercase text-caption"
            >{{ category.title }}</q-item-label
          >
          <q-item
            v-for="item in category.items"
            :key="'m-' + item.id"
            clickable
            @click="handleMobileNav(item)"
            v-ripple
          >
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { APP_CONFIG } from 'src/constants'
import { useMeta } from 'quasar'

const search = ref('')
const activeSection = ref('intro')
const leftDrawerOpen = ref(false)
const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

// Markdown Logic
const selectedMdTitle = ref('Loading Documentation...')
const selectedMdHtml = ref('')

useMeta(() => ({
  title: selectedMdTitle.value
    ? `Padi Docs - ${selectedMdTitle.value}`
    : 'Padi REST API Documentation',
}))

const mdModules = import.meta.glob('./docs/**/*.md', { query: '?raw', import: 'default' })

const iconMap = {
  // Getting Started
  'INTRODUCTION.md': 'rocket_launch',
  'QUICK_START.md': 'bolt',
  'INSTALLATION.md': 'settings_remote',
  'SETUP_METHODS.md': 'account_tree',
  'FIRST_STEPS.md': 'directions_walk',
  'CONFIGURATION.md': 'display_settings',
  'INIT_APP_GUIDE.md': 'auto_awesome',
  'INIT_APP_TROUBLESHOOTING.md': 'moped',

  // Core Concepts
  'ROUTING.md': 'hub',
  'CONTROLLERS.md': 'gamepad',
  'MODELS.md': 'rebase_edit',
  'ACTIVE_RECORD.md': 'dataset',
  'REQUEST.md': 'login',
  'RESPONSE.md': 'logout',
  'AUTHENTICATION.md': 'vpn_key',
  'DATABASE.md': 'settings_input_component',
  'MIGRATIONS.md': 'dynamic_feed',
  'VALIDATION.md': 'verified_user',
  'QUERY_BUILDER.md': 'manage_search',
  'CACHE.md': 'cached',
  'EMAIL.md': 'send_time_extension',
  'FILE_UPLOAD.md': 'upload_file',
  'MIDDLEWARE.md': 'filter_alt',
  'RBAC.md': 'badge',
  'RESOURCES.md': 'inventory',
  'RESPONSE_STRUCTURE.md': 'schema',
  'USER_MODEL.md': 'account_circle',

  // Advanced
  'SECURITY.md': 'security',
  'CACHING.md': 'timer',
  'QUEUE.md': 'playlist_add_check',
  'CLI_INTERFACE.md': 'terminal',
  'FRONTEND_INTEGRATION.md': 'devices',
  'API_TESTING.md': 'rule_folder',
  'MULTI_DATABASE.md': 'storage',
  'FILE_STORAGE.md': 'folder_shared',
  'MAILER.md': 'alternate_email',
  'API_COLLECTION_GUIDE.md': 'collections_bookmark',
  'CORS.md': 'language',
  'ERROR_HANDLING.md': 'report_problem',
  'PAGINATION.md': 'last_page',
  'PASSWORD_RESET.md': 'lock_reset',

  // Deployment
  'PRODUCTION.md': 'running_with_errors',
  'DOCKER.md': 'anchor',
  'FRANKENPHP_SETUP.md': 'electric_bolt',
  'REDIS_SETUP.md': 'flash_on',
  'MODE_SWITCHING.md': 'multiple_stop',
  'WORKER_SCRIPTS.md': 'smart_toy',
  'PERFORMANCE.md': 'speed',
  'TROUBLESHOOTING.md': 'help_center',

  // Default
  'INDEX.md': 'dashboard',
  'CHANGE_LOG.md': 'history',
}

const categoryOrder = [
  'welcome',
  'getting started',
  'core concepts',
  'advanced',
  'deployment',
  'examples',
  'releases',
]

const explicitOrder = [
  'start here',
  'quick start',
  'installation',
  'setup methods',
  'first steps',
  'configuration',
  'init app guide',
  'init app troubleshooting',

  'production',
  'docker',
  'frankenphp setup',
  'redis setup',
  'mode switching',
  'worker scripts',
  'performance',
  'troubleshooting',
  'change log',
]

// Computed menu dynamically switches items and translations based on active locale
const docsMenu = computed(() => {
  const mdCategoriesMap = {}
  const keys = Object.keys(mdModules)

  const idKeys = keys.filter((k) => k.includes('/id-ID/'))
  const enKeys = keys.filter((k) => !k.includes('/id-ID/'))

  let activeKeys = []
  if (locale.value === 'id-ID') {
    const resolved = {}
    enKeys.forEach((k) => {
      const rel = k.replace(/^\.\/docs\//, '')
      resolved[rel] = k
    })
    idKeys.forEach((k) => {
      const rel = k.replace(/^\.\/docs\/id-ID\//, '')
      resolved[rel] = k
    })
    activeKeys = Object.values(resolved)
  } else {
    activeKeys = enKeys
  }

  activeKeys.forEach((path) => {
    const parts = path.split('/')
    const filename = parts.pop()
    if (filename.toUpperCase() === 'README.MD') return

    let catTitle = ''
    let label = ''

    // Helper to translate category and label names for ID
    const translateLabel = (name) => {
      if (locale.value !== 'id-ID') return name
      const dict = {
        // Categories
        Welcome: 'Selamat Datang',
        'Getting Started': 'Memulai',
        'Core Concepts': 'Konsep Inti',
        Advanced: 'Lanjutan',
        Deployment: 'Penyebaran',
        Examples: 'Contoh',
        Releases: 'Rilis',
        // Labels
        Introduction: 'Pengenalan',
        'Quick Start': 'Mulai Cepat',
        Installation: 'Instalasi',
        'Setup Methods': 'Metode Setup',
        'First Steps': 'Langkah Pertama',
        Configuration: 'Konfigurasi',
        'Init App Guide': 'Panduan Inisialisasi',
        'Init App Troubleshooting': 'Troubleshooting Inisialisasi',
        Routing: 'Routing',
        Controllers: 'Controller',
        Models: 'Model',
        'Active Record': 'Active Record',
        Request: 'Request',
        Response: 'Response',
        Authentication: 'Autentikasi',
        Database: 'Database',
        Migrations: 'Migrasi',
        Validation: 'Validasi',
        'Query Builder': 'Query Builder',
        Cache: 'Cache',
        Email: 'Email',
        'File Upload': 'Upload File',
        Middleware: 'Middleware',
        Rbac: 'RBAC',
        Resources: 'Resource',
        'Response Structure': 'Struktur Respon',
        'User Model': 'Model User',
        Security: 'Keamanan',
        Caching: 'Caching',
        Queue: 'Antrean (Queue)',
        'Cli Interface': 'Antarmuka CLI',
        'Frontend Integration': 'Integrasi Frontend',
        'Api Testing': 'Pengujian API',
        'Multi Database': 'Multi Database',
        'File Storage': 'Penyimpanan File',
        Mailer: 'Mailer',
        Production: 'Produksi',
        Docker: 'Docker',
        'Frankenphp Setup': 'Setup FrankenPHP',
        'Redis Setup': 'Setup Redis',
        'Mode Switching': 'Peralihan Mode',
        'Worker Scripts': 'Script Worker',
        Performance: 'Performa',
        Troubleshooting: 'Troubleshooting',
        'Change Log': 'Catatan Perubahan',
        'Start Here': 'Mulai di Sini',
      }
      return dict[name] || name
    }

    if (filename.toUpperCase() === 'INDEX.MD') {
      catTitle = translateLabel('Welcome', true)
      label = translateLabel('Start Here')
    } else if (filename.toUpperCase() === 'CHANGE_LOG.MD') {
      catTitle = translateLabel('Releases', true)
      label = translateLabel('Change Log')
    } else {
      // Remove id-ID from folder parts if present
      const folderParts = parts.filter((p) => p !== 'id-ID')
      const folder = folderParts.pop()
      const rawCat = folder
        .replace(/^\d+-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      catTitle = translateLabel(rawCat, true)

      const rawLabel = filename
        .replace('.md', '')
        .replace(/[_|-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      label = translateLabel(rawLabel)
    }

    if (!mdCategoriesMap[catTitle]) {
      mdCategoriesMap[catTitle] = {
        title: catTitle,
        items: [],
      }
    }

    mdCategoriesMap[catTitle].items.push({
      id: path,
      label: label,
      icon: iconMap[filename] || 'article',
      isMd: true,
    })
  })

  // Sort categories
  const sorted = Object.values(mdCategoriesMap).sort((a, b) => {
    const getEngCat = (title) => {
      const mapping = {
        'Selamat Datang': 'welcome',
        Memulai: 'getting started',
        'Konsep Inti': 'core concepts',
        Lanjutan: 'advanced',
        Penyebaran: 'deployment',
        Contoh: 'examples',
        Rilis: 'releases',
      }
      return mapping[title] || title.toLowerCase()
    }
    const idxA = categoryOrder.indexOf(getEngCat(a.title))
    const idxB = categoryOrder.indexOf(getEngCat(b.title))
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.title.localeCompare(b.title)
  })

  sorted.forEach((cat) => {
    cat.items.sort((a, b) => {
      const getEngLabel = (lbl) => {
        const mapping = {
          'Mulai di Sini': 'start here',
          'Mulai Cepat': 'quick start',
          Instalasi: 'installation',
          'Metode Setup': 'setup methods',
          'Langkah Pertama': 'first steps',
          Konfigurasi: 'configuration',
          'Panduan Inisialisasi': 'init app guide',
          'Troubleshooting Inisialisasi': 'init app troubleshooting',
          Controller: 'controllers',
          Model: 'models',
          'Model User': 'user model',
          'Upload File': 'file upload',
          'Struktur Respon': 'response structure',
          'Antrean (Queue)': 'queue',
          'Antarmuka CLI': 'cli interface',
          'Integrasi Frontend': 'frontend integration',
          'Pengujian API': 'api testing',
          'Penyimpanan File': 'file storage',
          Produksi: 'production',
          'Setup FrankenPHP': 'frankenphp setup',
          'Setup Redis': 'redis setup',
          'Peralihan Mode': 'mode switching',
          'Script Worker': 'worker scripts',
          Performa: 'performance',
          'Catatan Perubahan': 'change log',
          Keamanan: 'security',
          Pengenalan: 'introduction',
        }
        return mapping[lbl] || lbl.toLowerCase()
      }
      const idxA = explicitOrder.indexOf(getEngLabel(a.label))
      const idxB = explicitOrder.indexOf(getEngLabel(b.label))
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      return a.label.localeCompare(b.label)
    })
  })

  return sorted
})

const filteredCategories = computed(() => {
  if (!search.value) return docsMenu.value
  const query = search.value.toLowerCase()
  return docsMenu.value
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.label.toLowerCase().includes(query) || cat.title.toLowerCase().includes(query),
      ),
    }))
    .filter((cat) => cat.items.length > 0)
})

// Custom Renderer to add IDs to headings (Slugger is internal to marked)
const renderer = {
  heading({ text, depth, raw }) {
    const slug = (raw || text || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove symbols
      .replace(/\s+/g, '-') // Convert spaces to hyphens
      .replace(/-+$/g, '') // Trim trailing hyphens
      .replace(/^-+/, (m) => (m.length > 1 ? '-' : m)) // Keep single leading hyphen if emoji was there
    return `<h${depth} id="${slug}">${text}</h${depth}>`
  },
}

marked.use({ renderer })

async function navigateTo(item) {
  activeSection.value = item.id
  if (item.isMd) {
    let raw = await mdModules[item.id]()
    // Replace placeholders
    raw = raw.replace(/\{\{APP_VERSION\}\}/g, APP_CONFIG.version)

    // Format raw markdown uniformly
    raw = cleanMarkdownRaw(raw)

    selectedMdHtml.value = DOMPurify.sanitize(marked.parse(raw))
    selectedMdTitle.value = item.label
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Dynamically update browser URL without .md extension
    const cleanSlug = item.id.split('/').pop().replace('.md', '').toLowerCase().replace(/_/g, '-')

    const newPath = cleanSlug === 'index' ? '/docs' : `/docs/${cleanSlug}`
    router.replace(newPath)
  }
}

function handleMarkdownClick(event) {
  const link = event.target.closest('a')
  if (!link) return

  const href = link.getAttribute('href')
  if (!href) return

  // Handle Internal Anchor Links (#target)
  if (href.startsWith('#')) {
    event.preventDefault()
    const targetId = href.substring(1)

    // Attempt multiple ID matches (due to varied slug generation styles)
    const possibleIds = [
      targetId, // Exact match: "architecture"
      targetId.replace(/^-+/, ''), // No leading hyphen: "-architecture" -> "architecture"
      '-' + targetId.replace(/^-+/, ''), // Leading hyphen: "architecture" -> "-architecture"
    ]

    let element = null
    for (const id of possibleIds) {
      element = document.getElementById(id)
      if (element) break
    }

    if (element) {
      const headerOffset = 150
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      // Update URL hash without jumping
      history.pushState(null, null, href)
    } else {
      console.warn(`Anchor target not found: ${targetId}. Tried IDs: ${possibleIds.join(', ')}`)
    }
    return
  }

  // Handle internal markdown links (with or without anchor hashes)
  const isMdLink = href.includes('.md') || href.endsWith('.md')
  if (isMdLink) {
    event.preventDefault()

    // Separate file path from anchor hash (e.g. "./ACTIVE_RECORD.md#some-heading")
    const hashIndex = href.indexOf('#')
    const filePart = hashIndex !== -1 ? href.substring(0, hashIndex) : href
    const anchorHash = hashIndex !== -1 ? href.substring(hashIndex) : ''

    // Robust relative path resolution
    const currentPath = activeSection.value // e.g., "./docs/02-core-concepts/CACHE.md"
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/')) // e.g., "./docs/02-core-concepts"

    let targetKey = ''

    if (filePart.startsWith('./') || filePart.startsWith('../') || !filePart.includes('/')) {
      // Relative path logic
      const parts = filePart.split('/')
      const pathStack = basePath.split('/')

      for (const part of parts) {
        if (part === '.' || part === '') continue
        if (part === '..') pathStack.pop()
        else pathStack.push(part)
      }
      targetKey = pathStack.join('/')
    } else {
      // Relative to current basePath
      targetKey = basePath + '/' + filePart
    }

    // Clean up double slashes or ./ prefixes for matching
    const normalizedTarget = targetKey.replace(/\/+/g, '/')

    const foundPath = Object.keys(mdModules).find(
      (path) =>
        path === normalizedTarget ||
        path === './' + normalizedTarget ||
        path.replace('./', '') === normalizedTarget.replace('./', ''),
    )

    if (foundPath) {
      const filename = foundPath.split('/').pop()
      const label = filename
        .replace('.md', '')
        .replace(/[_|-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      navigateTo({ id: foundPath, label, isMd: true }).then(() => {
        // If there was an anchor hash, scroll to that element
        if (anchorHash) {
          setTimeout(() => {
            const targetId = anchorHash.substring(1)
            const element = document.getElementById(targetId)
            if (element) {
              const headerOffset = 150
              const elementPosition = element.getBoundingClientRect().top
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
              history.pushState(null, null, window.location.pathname + anchorHash)
            }
          }, 150)
        }
      })
    } else {
      console.error(`Documentation file not found: ${href} (Resolved to: ${normalizedTarget})`)
    }
  } else if (href.startsWith('http')) {
    link.setAttribute('target', '_blank')
  }
}

async function loadInitialDoc() {
  const topic = route.params.topic
    ? String(route.params.topic).toLowerCase().replace(/-/g, '_')
    : null

  // 1. Detect if specific topic is requested (e.g. /docs/active-record)
  if (topic) {
    let matchedKey = null
    if (locale.value === 'id-ID') {
      matchedKey = Object.keys(mdModules).find((key) => {
        if (!key.includes('/id-ID/')) return false
        const name = key.split('/').pop().replace('.md', '').toLowerCase().replace(/_/g, '_')
        return name === topic
      })
    }

    // Fallback to English version if Indonesian is not found
    if (!matchedKey) {
      matchedKey = Object.keys(mdModules).find((key) => {
        if (key.includes('/id-ID/')) return false
        const name = key.split('/').pop().replace('.md', '').toLowerCase().replace(/_/g, '_')
        return name === topic
      })
    }

    if (matchedKey) {
      if (activeSection.value === matchedKey) return
      const filename = matchedKey.split('/').pop()
      const label = filename
        .replace('.md', '')
        .replace(/[_|-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      await navigateTo({ id: matchedKey, label, isMd: true })
      return
    }
  }

  // 2. Legacy Check if hash is #changelog
  const hasChangelogTarget =
    window.location.hash === '#changelog' || window.location.search.includes('tab=changelog')
  let changelogKey = null
  if (locale.value === 'id-ID') {
    changelogKey = Object.keys(mdModules).find(
      (k) => k.includes('/id-ID/') && k.includes('CHANGE_LOG.md'),
    )
  }
  if (!changelogKey) {
    changelogKey = Object.keys(mdModules).find(
      (k) => !k.includes('/id-ID/') && k.includes('CHANGE_LOG.md'),
    )
  }

  if (hasChangelogTarget && changelogKey) {
    if (activeSection.value === changelogKey) return
    const filename = changelogKey.split('/').pop()
    const label = filename
      .replace('.md', '')
      .replace(/[_|-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    await navigateTo({ id: changelogKey, label, isMd: true })
    return
  }

  // 3. Fallback Priority: INDEX.md, then README.md
  let indexKey = null
  if (locale.value === 'id-ID') {
    indexKey =
      Object.keys(mdModules).find((k) => k.includes('/id-ID/') && k.includes('INDEX.md')) ||
      Object.keys(mdModules).find((k) => k.includes('/id-ID/') && k.includes('README.md'))
  }
  if (!indexKey) {
    indexKey =
      Object.keys(mdModules).find((k) => !k.includes('/id-ID/') && k.includes('INDEX.md')) ||
      Object.keys(mdModules).find((k) => !k.includes('/id-ID/') && k.includes('README.md'))
  }

  if (indexKey) {
    if (activeSection.value === indexKey) return
    activeSection.value = indexKey
    let raw = await mdModules[indexKey]()
    raw = raw.replace(/\{\{APP_VERSION\}\}/g, APP_CONFIG.version)

    // Format raw markdown uniformly
    raw = cleanMarkdownRaw(raw)

    selectedMdHtml.value = DOMPurify.sanitize(marked.parse(raw))
    selectedMdTitle.value =
      locale.value === 'id-ID' ? '🌾 Pusat Dokumentasi' : '🌾 Documentation Hub'
  } else {
    selectedMdTitle.value = locale.value === 'id-ID' ? 'Selamat Datang' : 'Welcome'
    selectedMdHtml.value =
      locale.value === 'id-ID'
        ? '<p>Pilih topik dari bilah sisi.</p>'
        : '<p>Select a topic from the sidebar.</p>'
  }
}

/**
 * Format and clean raw markdown uniformly.
 * 1. Strips ".md" extension from the link labels (e.g. "[PAGE.md](url)" -> "[PAGE](url)")
 * 2. Parses the "Table of Contents" section and adds a "🔗" emoji to any list item links
 *    that don't already start with an emoji/icon.
 */
function cleanMarkdownRaw(raw) {
  if (!raw) return ''

  // 1. Remove ".md" from label/text inside markdown links
  raw = raw.replace(/\[([^\]]+)\.md\]\(/gi, '[$1](')

  // 2. Format Table of Contents items cleanly
  // Matches list items under the TOC header and adds a matching document emoji from iconMap
  const tocRegex = /(## 📋 Table of Contents\s*\n)([\s\S]*?)(?=\n## |---|$)/i
  raw = raw.replace(tocRegex, (match, header, listContent) => {
    // Mapping of Quasar icons to beautiful unicode emojis for Markdown rendering
    const emojiMapping = {
      rocket_launch: '🚀',
      bolt: '⚡',
      settings_remote: '⚙️',
      account_tree: '🌱',
      directions_walk: '👣',
      display_settings: '🔧',
      auto_awesome: '✨',
      moped: '🛵',
      hub: '🛣️',
      gamepad: '🎮',
      rebase_edit: '🧱',
      dataset: '💾',
      login: '📥',
      logout: '📤',
      vpn_key: '🔑',
      settings_input_component: '🔌',
      dynamic_feed: '📦',
      verified_user: '🛡️',
      manage_search: '🔍',
      cached: '⚡',
      send_time_extension: '📬',
      upload_file: '📁',
      filter_alt: '🎛️',
      badge: '🏷️',
      inventory: '🗃️',
      schema: '📐',
      account_circle: '👤',
      security: '🛡️',
      timer: '⏱️',
      playlist_add_check: '📋',
      terminal: '💻',
      devices: '📱',
      rule_folder: '📂',
      storage: '🗄️',
      folder_shared: '📂',
      alternate_email: '✉️',
      collections_bookmark: '📚',
      language: '🌐',
      report_problem: '⚠️',
      last_page: '📄',
      lock_reset: '🔄',
      running_with_errors: '🚀',
      anchor: '⚓',
      electric_bolt: '⚡',
      flash_on: '🔥',
      multiple_stop: '🔁',
      smart_toy: '🤖',
      speed: '📈',
      help_center: '❓',
      dashboard: '🌾',
      history: '📜',
    }

    // Process each line in the TOC list block
    const updatedLines = listContent.split('\n').map((line) => {
      const trimmed = line.trim()
      // If line is a list item starting with a link: - [label](url)
      if (trimmed.startsWith('- [') || trimmed.startsWith('* [')) {
        const linkMatch = trimmed.match(/^[-*]\s+\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch) {
          const text = linkMatch[1]
          const href = linkMatch[2]

          // Check if link text already starts with a unicode emoji or custom icon
          const hasEmoji =
            /^\p{Emoji}/u.test(text) ||
            /^[\u2700-\u27BF]/u.test(text) ||
            /^[a-zA-Z0-9]/.test(text) === false

          if (!hasEmoji) {
            let matchedEmoji = '📄'

            // If the link is a local anchor link: e.g. "#requirements"
            if (href.startsWith('#')) {
              const anchor = href.substring(1).toLowerCase()
              if (anchor.includes('requirements')) matchedEmoji = '⚙️'
              else if (anchor.includes('installation') || anchor.includes('step'))
                matchedEmoji = '🏗️'
              else if (anchor.includes('verify') || anchor.includes('check')) matchedEmoji = '✓'
              else if (anchor.includes('troubleshoot') || anchor.includes('error'))
                matchedEmoji = '❓'
              else if (anchor.includes('next') || anchor.includes('link')) matchedEmoji = '👣'
              else if (anchor.includes('routing') || anchor.includes('url')) matchedEmoji = '🛣️'
              else if (anchor.includes('group') || anchor.includes('version')) matchedEmoji = '👥'
              else if (anchor.includes('auth') || anchor.includes('security')) matchedEmoji = '🛡️'
              else if (anchor.includes('method') || anchor.includes('action')) matchedEmoji = '⚡'
              else if (anchor.includes('parameter') || anchor.includes('variable'))
                matchedEmoji = '🔢'
              else if (anchor.includes('auto') || anchor.includes('wizard')) matchedEmoji = '🤖'
            } else {
              // Standard file link resolution
              const filePart = href.split('#')[0].split('/').pop() || ''
              const quasarIcon = iconMap[filePart] || ''
              matchedEmoji = emojiMapping[quasarIcon] || '📄'
            }

            // Prepend the matching visual emoji
            return line.replace(/\[/, `[${matchedEmoji} `)
          }
        }
      }
      return line
    })

    return header + updatedLines.join('\n')
  })

  return raw
}

function handleMobileNav(item) {
  navigateTo(item)
  leftDrawerOpen.value = false
}

watch(
  () => [route.params.topic, route.hash],
  () => {
    loadInitialDoc()
  },
)

// Watch global locale to automatically reload current documentation in selected language
watch(locale, async () => {
  const currentKey = activeSection.value
  if (!currentKey) return

  const filename = currentKey.split('/').pop()

  // Find the translated item from the updated docsMenu containing the correct localized label
  let matchedItem = null
  for (const cat of docsMenu.value) {
    const item = cat.items.find((i) => i.id.endsWith(filename))
    if (item) {
      matchedItem = item
      break
    }
  }

  if (matchedItem) {
    await navigateTo(matchedItem)
  }
})

onMounted(() => {
  loadInitialDoc()
})
</script>

<style lang="scss" scoped>
.docs-page {
  min-height: 100vh;
  padding-top: 110px;
  background:
    radial-gradient(circle at top right, rgba(46, 125, 50, 0.15), transparent 40%),
    radial-gradient(circle at bottom left, rgba(46, 125, 50, 0.1), transparent 40%);
  background-attachment: fixed;

  @media (max-width: 1023px) {
    padding-top: 80px;
  }
}

.docs-header {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  background: rgba(15, 23, 42, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 1023px) {
    top: 50px; // Offset for main toolbar if exists
    padding: 8px 16px;
  }
}

.search-input {
  width: 380px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 599px) {
    width: 60%;
  }

  :deep(.q-field__control) {
    border-radius: 12px;
  }
}

.search-input:focus-within {
  width: 480px;
  background: rgba(46, 125, 50, 0.1);

  @media (max-width: 599px) {
    width: 100%;
  }
}

.sticky-sidebar {
  position: sticky;
  top: 160px;
}

.docs-nav {
  padding-right: 10px;

  .q-item-label--header {
    letter-spacing: 2px;
    font-size: 0.75rem;
    opacity: 0.6;
    margin-top: 24px;
    padding-left: 12px;
  }

  .q-item {
    color: #94a3b8;
    margin-bottom: 4px;
    font-size: 0.9rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 10px 16px;
    border-radius: 12px;
    border: 1px solid transparent;

    .q-item__section--side {
      width: 40px;
      min-width: 40px;
      padding-right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      transform: translateX(4px);
    }

    &.q-item--active {
      color: white !important;
      background: rgba(46, 125, 50, 0.15) !important;
      border: 1px solid rgba(46, 125, 50, 0.3);
      font-weight: 600;

      .q-icon {
        color: var(--q-primary) !important;
        transform: scale(1.1);
      }
    }
  }
}

.docs-container {
  border-radius: 24px;
  backdrop-filter: blur(10px);
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.5s ease;

  @media (max-width: 599px) {
    border-radius: 16px;
    padding: 24px !important; // Override q-pa-xl
  }

  &:hover {
    border-color: rgba(46, 125, 50, 0.2);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  }
}

.doc-markdown-view {
  min-height: 50vh;

  .text-gradient {
    background: linear-gradient(135deg, var(--q-primary) 0%, #fff 80%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 599px) {
    .text-h3 {
      font-size: 1.75rem !important;
      line-height: 1.2;
    }
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--q-primary);
}

:deep(.markdown-body) {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.8;
  word-wrap: break-word;

  @media (max-width: 599px) {
    font-size: 0.9rem;
  }

  h1,
  h2,
  h3,
  h4 {
    margin-top: 2em;
    margin-bottom: 1em;
    color: #f8fafc;
    line-height: 1.3;
  }

  h1 {
    font-size: 2.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5em;
    @media (max-width: 599px) {
      font-size: 1.75rem;
    }
  }
  h2 {
    font-size: 1.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 0.3em;
    @media (max-width: 599px) {
      font-size: 1.4rem;
    }
  }
  h3 {
    font-size: 1.4rem;
    color: var(--q-primary);
    @media (max-width: 599px) {
      font-size: 1.2rem;
    }
  }

  p {
    margin-bottom: 1.5em;
  }

  a {
    color: var(--q-primary);
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid transparent;
    transition: all 0.2s;

    &:hover {
      border-bottom-color: var(--q-primary);
    }
  }

  pre {
    background: #0f172a;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin: 2em 0;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
    overflow-x: auto;
    max-width: 100%;

    @media (max-width: 599px) {
      padding: 16px;
      margin: 1.5em 0;
      border-radius: 12px;
    }
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    background: rgba(46, 125, 50, 0.15);
    color: #86efac;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 0.9em;
    white-space: pre-wrap;
    word-break: break-all;
  }

  pre code {
    background: transparent;
    padding: 0;
    color: #e2e8f0;
    white-space: pre;
    word-break: normal;
  }

  blockquote {
    border-left: 4px solid var(--q-primary);
    background: rgba(46, 125, 50, 0.05);
    margin: 2em 0;
    padding: 1.5em 2em;
    border-radius: 0 16px 16px 0;
    font-style: italic;

    @media (max-width: 599px) {
      padding: 1em 1.5em;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
  }

  table {
    display: block;
    width: 100%;
    overflow-x: auto;
    border-spacing: 0;
    border-collapse: separate;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin: 2em 0;

    th {
      background: rgba(46, 125, 50, 0.1);
      padding: 16px;
      text-align: left;
      white-space: nowrap;
    }

    td {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
