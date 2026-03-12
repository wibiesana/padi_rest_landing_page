<template>
  <q-page class="docs-page bg-premium">
    <!-- Search Bar (Sticky Header) -->
    <div class="docs-header q-pa-md glass-header shadow-20">
      <div class="container flex justify-between items-center">
        <div class="flex items-center">
          <q-btn
            flat
            round
            icon="menu"
            color="primary"
            class="lt-md q-mr-sm"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
          <div class="text-h6 text-weight-bold text-gradient">Framework Documentation Hub</div>
          <q-badge color="primary" class="q-ml-sm q-px-sm text-weight-bold" :label="'v' + APP_CONFIG.version" />
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
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { APP_CONFIG } from 'src/constants'
import { useMeta } from 'quasar'

const search = ref('')
const activeSection = ref('intro')
const leftDrawerOpen = ref(false)

const categories = []

// Markdown Logic
const selectedMdTitle = ref('Loading Documentation...')
const selectedMdHtml = ref('')

useMeta(() => ({
  title: selectedMdTitle.value ? `Padi Docs - ${selectedMdTitle.value}` : 'Padi REST API Documentation'
}))

const mdModules = import.meta.glob('./docs/**/*.md', { query: '?raw', import: 'default' })
const mdCategoriesMap = {}

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

for (const path in mdModules) {
  const parts = path.split('/')
  const filename = parts.pop()
  if (filename === 'README.md') continue

  let catTitle = ''
  let label = ''

  if (filename === 'INDEX.md') {
    catTitle = 'Welcome'
    label = 'Start Here'
  } else if (filename === 'CHANGE_LOG.md') {
    catTitle = 'Releases'
    label = 'Change Log'
  } else {
    const folder = parts.pop()
    catTitle = folder
      .replace(/^\d+-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

    label = filename
      .replace('.md', '')
      .replace(/[_|-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
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

// Sort and push categories
const sortedCategories = Object.values(mdCategoriesMap).sort((a, b) => {
  const idxA = categoryOrder.indexOf(a.title.toLowerCase())
  const idxB = categoryOrder.indexOf(b.title.toLowerCase())
  if (idxA !== -1 && idxB !== -1) return idxA - idxB
  if (idxA !== -1) return -1
  if (idxB !== -1) return 1
  return a.title.localeCompare(b.title)
})

categories.push(
  ...sortedCategories.map((cat) => {
    cat.items.sort((a, b) => {
      const idxA = explicitOrder.indexOf(a.label.toLowerCase())
      const idxB = explicitOrder.indexOf(b.label.toLowerCase())
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      return a.label.localeCompare(b.label)
    })
    return cat
  }),
)

const filteredCategories = computed(() => {
  if (!search.value) return categories
  const query = search.value.toLowerCase()
  return categories
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
    selectedMdHtml.value = DOMPurify.sanitize(marked.parse(raw))
    selectedMdTitle.value = item.label
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  // Handle internal .md links
  if (href.endsWith('.md')) {
    event.preventDefault()

    // Robust relative path resolution
    const currentPath = activeSection.value // e.g., "./docs/02-core-concepts/CACHE.md"
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/')) // e.g., "./docs/02-core-concepts"

    let targetKey = ''

    if (href.startsWith('./') || href.startsWith('../') || !href.includes('/')) {
      // Relative path logic
      const parts = href.split('/')
      const pathStack = basePath.split('/')

      for (const part of parts) {
        if (part === '.' || part === '') continue
        if (part === '..') pathStack.pop()
        else pathStack.push(part)
      }
      targetKey = pathStack.join('/')
    } else {
      // It's a path like "01-getting-started/QUICK_START.md" relative to current basePath
      targetKey = basePath + '/' + href
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
      navigateTo({ id: foundPath, label, isMd: true })
    } else {
      console.error(`Documentation file not found: ${href} (Resolved to: ${normalizedTarget})`)
    }
  } else if (href.startsWith('http')) {
    link.setAttribute('target', '_blank')
  }
}

async function loadInitialDoc() {
  // Priority: INDEX.md, then README.md
  const indexKey =
    Object.keys(mdModules).find((k) => k.includes('INDEX.md')) ||
    Object.keys(mdModules).find((k) => k.includes('README.md'))

  if (indexKey) {
    activeSection.value = indexKey
    let raw = await mdModules[indexKey]()
    raw = raw.replace(/\{\{APP_VERSION\}\}/g, APP_CONFIG.version)
    selectedMdHtml.value = DOMPurify.sanitize(marked.parse(raw))
    selectedMdTitle.value = '🌾 Documentation Hub'
  } else {
    selectedMdTitle.value = 'Welcome'
    selectedMdHtml.value = '<p>Select a topic from the sidebar.</p>'
  }
}

function handleMobileNav(item) {
  navigateTo(item)
  leftDrawerOpen.value = false
}

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
