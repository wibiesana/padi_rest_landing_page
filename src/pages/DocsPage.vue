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
                  <q-item-section avatar v-if="item.icon">
                    <q-icon
                      :name="item.icon"
                      size="xs"
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
              <div class="text-h3 text-weight-bold text-gradient">{{ selectedMdTitle }}</div>
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

const search = ref('')
const activeSection = ref('intro')
const leftDrawerOpen = ref(false)

const categories = []

// Markdown Logic
const selectedMdTitle = ref('Loading Documentation...')
const selectedMdHtml = ref('')

const mdModules = import.meta.glob('./docs/**/*.md', { query: '?raw', import: 'default' })
const mdCategoriesMap = {}

for (const path in mdModules) {
  const parts = path.split('/')
  const filename = parts.pop()
  if (filename === 'README.md' || filename === 'INDEX.md' || filename === 'CHANGE_LOG.md') continue

  const folder = parts.pop()
  const catTitle = folder
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  if (!mdCategoriesMap[catTitle]) {
    mdCategoriesMap[catTitle] = { title: catTitle + ' (Docs)', items: [] }
  }

  const label = filename
    .replace('.md', '')
    .replace(/[_|-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  mdCategoriesMap[catTitle].items.push({
    id: path,
    label: label,
    icon: 'article',
    isMd: true,
  })
}

const explicitOrder = [
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
]

categories.push(
  ...Object.values(mdCategoriesMap).map((cat) => {
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

async function navigateTo(item) {
  activeSection.value = item.id
  if (item.isMd) {
    const raw = await mdModules[item.id]()
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

  // Handle internal .md links
  if (href.endsWith('.md')) {
    event.preventDefault()
    // Find the module that matches the link filename
    const filename = href.split('/').pop()
    const foundPath = Object.keys(mdModules).find((path) => path.endsWith(filename))
    if (foundPath) {
      const label = filename
        .replace('.md', '')
        .replace(/[_|-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      navigateTo({ id: foundPath, label, isMd: true })
    }
  } else if (href.startsWith('http')) {
    // Open external links in new tab
    link.setAttribute('target', '_blank')
  }
}

async function loadInitialDoc() {
  const indexKey = Object.keys(mdModules).find(
    (k) => k.includes('INDEX.md') || k.includes('README.md'),
  )
  if (indexKey) {
    const raw = await mdModules[indexKey]()
    selectedMdHtml.value = DOMPurify.sanitize(marked.parse(raw))
    selectedMdTitle.value = indexKey.includes('INDEX') ? 'Documentation Hub' : 'Framework Overview'
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
  background-attachment: fixed;
}

.docs-header {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-input {
  width: 380px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus-within {
  width: 480px;
  background: rgba(46, 125, 50, 0.1);
}

.sticky-sidebar {
  position: sticky;
  top: 160px;
}

.docs-nav .q-item {
  color: #94a3b8;
  margin-bottom: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 10px 16px;
}

.docs-nav .q-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  transform: translateX(6px);
}

.docs-nav .q-item--active {
  color: white !important;
  background: linear-gradient(
    90deg,
    rgba(46, 125, 50, 0.2) 0%,
    rgba(46, 125, 50, 0.05) 100%
  ) !important;
  border-left: 4px solid var(--q-primary);
  font-weight: 700;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.2);
}

.docs-container {
  border-radius: 32px;
}

.doc-section {
  padding: 60px 0;
}

.code-wrapper {
  background: #0d1117;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.code-snippet {
  padding: 24px;
  margin: 0;
  color: #c9d1d9;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.7;
}

.code-snippet code {
  color: #79c0ff;
}

.alert-info {
  background: rgba(3, 102, 214, 0.1);
  border: 1px solid rgba(3, 102, 214, 0.3);
}

.service-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  border-color: rgba(46, 125, 50, 0.4);
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.service-card code {
  display: block;
  margin-top: 15px;
  font-size: 0.8rem;
  color: var(--q-primary);
  opacity: 0.8;
}

.line-height-2 {
  line-height: 2;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.border-info-1 {
  border-color: rgba(3, 169, 244, 0.3);
}

.border-light-1 {
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Animations */
.anim-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

/* Markdown Dynamic View Styling */
.doc-markdown-view {
  min-height: 50vh;
}

:deep(.markdown-body) {
  ::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    color: #fff;
    font-weight: bold;
    margin-top: 1.8em;
    margin-bottom: 0.8em;
  }
  h1 {
    font-size: 1.6rem !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.3em;
    margin-top: 1em !important;
  }
  h2 {
    font-size: 1.3rem !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 0.3em;
    margin-top: 1.2em !important;
  }
  h3 {
    font-size: 1.1rem !important;
    color: var(--q-primary);
    margin-top: 1.2em !important;
  }
  p {
    font-size: 0.95rem !important;
    line-height: 1.7;
    color: #cbd5e1;
    margin-bottom: 1.2em;
  }
  a {
    color: var(--q-primary);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  ul,
  ol {
    margin-bottom: 1.2em;
    padding-left: 2em;
  }
  li {
    margin-bottom: 0.3em;
    font-size: 0.95rem;
    color: #cbd5e1;
    line-height: 1.7;
  }
  pre {
    background: #0d1117;
    padding: 16px;
    border-radius: 12px;
    overflow-x: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 1.5em;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.9em;
  }
  code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    background: rgba(255, 255, 255, 0.08);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    color: #79c0ff;
  }
  pre code {
    background: none;
    padding: 0;
    color: inherit;
  }
  blockquote {
    border-left: 4px solid var(--q-primary);
    padding-left: 1rem;
    margin-left: 0;
    color: #94a3b8;
    background: rgba(46, 125, 50, 0.05);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0 8px 8px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    color: #cbd5e1;
  }
  th,
  td {
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 16px;
    text-align: left;
  }
  th {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    font-weight: bold;
  }
  tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.02);
  }
  hr {
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin: 2em 0;
  }
}
</style>
