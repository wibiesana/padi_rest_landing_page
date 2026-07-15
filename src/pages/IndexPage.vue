<template>
  <q-page class="index-page overflow-hidden">
    <!-- Animated Mesh Background Elements -->
    <div class="mesh-blob mesh-1"></div>
    <div class="mesh-blob mesh-2"></div>
    <div class="mesh-blob mesh-3"></div>

    <!-- Hero Section -->
    <section class="hero-section text-center flex flex-center reveal">
      <div class="container relative-position">
        <div class="column items-center">
          <div class="hero-icon-container q-mb-lg">
            <q-img :src="heroImage" width="120px" class="animate-float shadow-glow" alt="Padi REST API Framework Logo" />
          </div>
          <h1
            class="text-h2 text-weight-bolder q-ma-none text-gradient text-uppercase tracking-tighter"
          >
            {{ $t('hero.title') }}
          </h1>
          <div class="hero-subtitle-container q-mt-lg">
            <p
              class="text-h5 text-white text-weight-light max-width-900 opacity-90 border-left-primary q-pl-lg"
            >
              {{ $t('hero.subtitle') }}
            </p>
          </div>
          <div class="q-mt-xl q-gutter-lg flex justify-center">
            <q-btn
              color="primary"
              size="lg"
              unelevated
              :label="$t('hero.getStarted')"
              icon="rocket_launch"
              @click="scrollTo('quickstart')"
              class="premium-btn shadow-24"
            />
            <q-btn
              outline
              color="white"
              size="lg"
              :label="$t('hero.documentation')"
              @click="scrollTo('docs')"
              class="premium-btn-outline"
              icon="menu_book"
            />
          </div>
          <div class="q-mt-lg text-body2 text-grey-5 flex items-center justify-center reveal delay-2">
            <q-icon name="bolt" color="warning" size="20px" class="q-mr-xs" />
            <span>Looking for a real-time demo? Check out the</span>
            <a href="https://github.com/wibiesana/padi-rest-realtime-example" target="_blank" class="text-primary text-weight-bold q-ml-xs hover-underline" style="text-decoration: none; color: var(--q-primary);">Real-time Example App</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy (P.A.D.I) Section -->
    <section class="q-py-xl container relative-position z-top reveal delay-1">
      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-md-5">
          <div class="text-h3 text-weight-bolder text-white q-mb-lg leading-tight">
            {{ $t('philosophy.title1') }} <span class="text-primary">{{ $t('philosophy.titleSpeed') }}</span>,<br />
            {{ $t('philosophy.title2') }} <span class="text-gradient">{{ $t('philosophy.titleIndustrial') }}</span>.
          </div>
          <p class="text-body1 text-grey-4 text-weight-light line-height-1-8">
            {{ $t('philosophy.desc') }}
          </p>
          <q-btn
            flat
            color="primary"
            :label="$t('philosophy.readBtn')"
            size="lg"
            rounded
            class="q-mt-md no-padding hover-translate-x"
          />
        </div>

        <div class="col-12 col-md-7">
          <div class="row q-col-gutter-lg justify-center">
            <div v-for="(item, index) in philosophyItems" :key="item.l" class="col-12 col-sm-6">
              <div
                class="glass-card philosophy-card q-pa-xl column justify-center transition-all"
                :class="{ 'mt-xl': index % 2 !== 0 }"
              >
                <div class="philosophy-watermark pointer-events-none">{{ item.l }}</div>
                <div class="text-h6 text-weight-bold text-white q-mb-sm">{{ item.t }}</div>
                <div class="text-body2 text-grey-4 leading-relaxed">{{ item.d }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Bento Grid -->
    <section id="features" class="q-py-100 container reveal">
      <div class="text-center q-mb-100">
        <h2 class="text-h3 text-weight-bolder text-white">{{ $t('features.title') }}</h2>
        <div class="h-line-gradient q-mx-auto q-mt-md"></div>
      </div>

      <div class="row q-col-gutter-xl">
        <div
          v-for="(feature, idx) in features"
          :key="feature.title"
          class="col-12 col-sm-6 col-md-4"
        >
          <div
            class="feature-box glass-card q-pa-xl text-white full-height flex column"
            :class="'delay-' + ((idx % 4) + 1)"
          >
            <div class="feature-icon-wrapper q-mb-xl">
              <q-icon :name="feature.icon" size="48px" color="primary" />
            </div>
            <div class="text-h6 text-weight-bold q-mb-sm">{{ feature.title }}</div>
            <p class="text-body2 text-grey-4 flex-grow-1">
              {{ feature.description }}
            </p>
            <div class="q-mt-md">
              <q-chip
                outline
                color="primary"
                text-color="white"
                :label="$t('features.performanceTag')"
                size="sm"
                dense
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Visual Section -->
    <section class="q-py-100 bg-premium-dark relative-position reveal">
      <div class="mesh-blob mesh-4"></div>
      <div class="container row q-col-gutter-xl items-center">
        <div class="col-12 col-md-6 text-white">
          <div class="text-overline text-primary letter-spacing-2 q-mb-md">{{ $t('stats.title') }}</div>
          <h3 class="text-h3 text-weight-bolder q-mb-xl line-height-1">{{ $t('stats.subtitle') }}</h3>
          <p class="text-body1 text-grey-4 font-light q-mb-xl">
            {{ $t('stats.desc') }}
          </p>
          <div class="row q-col-gutter-lg">
            <div v-for="stat in stats" :key="stat.label" class="col-6">
              <div class="stat-item">
                <div class="text-h3 text-weight-bolder" :class="stat.color">{{ stat.value }}</div>
                <div class="text-subtitle1 text-grey-5 text-uppercase tracking-widest">
                  {{ stat.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="visual-placeholder glass-card flex flex-center q-pa-xl border-dashed">
            <div class="column items-center">
              <q-spinner-puff color="primary" size="100px" />
              <div class="text-h6 text-primary q-mt-lg">{{ $t('monitor.title') }}</div>
              <div class="text-caption text-grey-5">{{ $t('monitor.desc') }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start Terminal Section -->
    <section id="quickstart" class="q-py-100 container reveal">
      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-lg-5">
          <h2 class="text-h3 text-weight-bolder text-white q-mb-lg">
            {{ $t('quickStart.title1') }} <br /><span class="text-gradient">{{ $t('quickStart.title2') }}</span>.
          </h2>
          <p class="text-h6 text-grey-4 q-mb-xl font-light">
            {{ $t('quickStart.desc') }}
          </p>
          <div class="q-gutter-y-md">
            <div v-for="(step, i) in installationSteps" :key="i" class="flex items-center">
              <div class="step-num text-weight-bolder text-primary q-mr-md">{{ i + 1 }}</div>
              <div class="text-h6 text-white">{{ step }}</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-7">
          <div class="terminal-window shadow-24 reveal delay-2">
            <div class="terminal-header flex items-center q-px-md">
              <div class="flex q-gutter-x-xs">
                <div class="t-dot dot-red"></div>
                <div class="t-dot dot-yellow"></div>
                <div class="t-dot dot-green"></div>
              </div>
              <div class="q-mx-auto text-caption text-grey-6 font-mono">{{ APP_CONFIG.cliName }} v{{ APP_CONFIG.version }}</div>
              <q-btn
                flat
                round
                dense
                icon="content_copy"
                size="sm"
                color="grey-7"
                @click="copySnippet"
              />
            </div>
            <div class="terminal-body q-pa-xl font-mono text-body1">
              <div class="t-line"><span class="t-dim"># Create project</span></div>
              <div class="t-line">
                <span class="t-prompt">$</span> <span class="t-cmd">composer</span> create-project
                <span class="t-arg">wibiesana/padi-rest-api</span> my-api
              </div>
              <div class="t-line q-mt-md"><span class="t-dim"># Enter & Setup</span></div>
              <div class="t-line">
                <span class="t-prompt">$</span> <span class="t-cmd">cd</span> my-api &&
                <span class="t-cmd">php</span> padi setup
              </div>
              <div class="t-line q-mt-md"><span class="t-dim"># Fire up the engine</span></div>
              <div class="t-line">
                <span class="t-prompt">$</span> <span class="t-cmd">php</span> padi serve
              </div>
              <div class="t-line q-mt-lg cursor-blink">_</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Learning Path Section -->
    <section id="docs" class="q-py-100 bg-premium reveal">
      <div class="container">
        <div class="text-center q-mb-100">
          <h2 class="text-h3 text-weight-bolder text-white">{{ $t('learning.title') }}</h2>
          <p class="text-h6 text-grey-4">
            {{ $t('learning.subtitle') }}
          </p>
        </div>

        <div class="row q-col-gutter-xl">
          <div v-for="(path, idx) in learningPaths" :key="path.title" class="col-12 col-md-4">
            <div
              class="path-card glass-card hover-glow flex column reveal"
              :class="'delay-' + (idx + 1)"
            >
              <div class="q-pa-xl flex-grow-1">
                <div class="flex items-center q-mb-xl">
                  <div class="path-icon-box q-mr-md">
                    <q-icon :name="path.icon" size="sm" color="primary" />
                  </div>
                  <div class="text-h6 text-weight-bold text-white">{{ path.title }}</div>
                </div>
                <p class="text-body2 text-grey-5 q-mb-xl line-height-1-8">{{ path.description }}</p>
                <q-list dark>
                  <q-item
                    v-for="(step, idx2) in path.steps"
                    :key="idx2"
                    dense
                    padding
                    class="q-px-none"
                  >
                    <q-item-section side><div class="step-bullet"></div></q-item-section>
                    <q-item-section
                      ><span class="text-grey-3 text-weight-medium">{{
                        step
                      }}</span></q-item-section
                    >
                  </q-item>
                </q-list>
              </div>
              <div class="q-pa-lg border-top-light">
                <q-btn
                  flat
                  color="primary"
                  :label="$t('learning.beginBtn')"
                  icon-right="east"
                  @click="goToDocs(path.target)"
                  class="full-width"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Finale -->
    <section class="q-py-100 text-center relative-position overflow-hidden reveal">
      <div class="mesh-blob mesh-1" style="bottom: -200px; top: auto; right: 0"></div>
      <div class="container relative-position">
        <h2 class="text-h2 text-weight-bolder text-white q-mb-lg leading-tight">
          {{ $t('cta.title1') }} <br /><span class="text-primary">{{ $t('cta.title2') }}</span>?
        </h2>
        <p class="text-h5 q-mb-xl text-grey-4 opacity-80 max-width-800 q-mx-auto">
          {{ $t('cta.desc') }}
        </p>
        <q-btn
          color="primary"
          size="xl"
          unelevated
          :label="$t('cta.installBtn')"
          icon="terminal"
          @click="scrollTo('quickstart')"
          class="premium-btn shadow-24"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import heroImage from 'assets/brand/padi_menunduk.png'
import { APP_CONFIG } from 'src/constants'

useMeta({
  title: 'Padi REST API - Zero-Bloat PHP REST API Framework',
  meta: {
    description: { name: 'description', content: 'Build secure, zero-bloat, and lightweight RESTful APIs in PHP. Native FrankenPHP Worker Mode compatibility, active record ORM, and high performance.' },
    keywords: { name: 'keywords', content: 'php rest api framework, php rest api, lightweight php framework, php web api, frankenphp api framework, fastest php api, zero dependency php framework, php active record orm, building rest api in php, php routing library, jwt authentication php' }
  }
})

const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()

// Animation Logic: Intersection Observer
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active')
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const stats = computed(() => [
  { label: t('stats.securityScore'), value: '9.8', color: 'text-primary' },
  { label: t('stats.performance'), value: '9.5', color: 'text-accent' },
])

const installationSteps = computed(() => [
  t('quickStart.steps[0]'),
  t('quickStart.steps[1]'),
  t('quickStart.steps[2]'),
])

const philosophyItems = computed(() => [
  {
    l: 'P',
    t: t('philosophy.items.p.t'),
    d: t('philosophy.items.p.d'),
  },
  {
    l: 'A',
    t: t('philosophy.items.a.t'),
    d: t('philosophy.items.a.d'),
  },
  {
    l: 'D',
    t: t('philosophy.items.d.t'),
    d: t('philosophy.items.d.d'),
  },
  {
    l: 'I',
    t: t('philosophy.items.i.t'),
    d: t('philosophy.items.i.d'),
  },
])

const features = computed(() => [
  {
    title: t('features.items.cli.t'),
    description: t('features.items.cli.d'),
    icon: 'auto_fix_high',
  },
  {
    title: t('features.items.routing.t'),
    description: t('features.items.routing.d'),
    icon: 'hub',
  },
  {
    title: t('features.items.orm.t'),
    description: t('features.items.orm.d'),
    icon: 'storage',
  },
  {
    title: t('features.items.middleware.t'),
    description: t('features.items.middleware.d'),
    icon: 'inventory_2',
  },
  {
    title: t('features.items.queue.t'),
    description: t('features.items.queue.d'),
    icon: 'rocket_launch',
  },
  {
    title: t('features.items.cache.t'),
    description: t('features.items.cache.d'),
    icon: 'speed',
  },
  {
    title: t('features.items.auth.t'),
    description: t('features.items.auth.d'),
    icon: 'security',
  },
  {
    title: t('features.items.validation.t'),
    description: t('features.items.validation.d'),
    icon: 'rule',
  },
  {
    title: t('features.items.response.t'),
    description: t('features.items.response.d'),
    icon: 'description',
  },
])

const learningPaths = computed(() => [
  {
    title: t('learning.paths.basics.t'),
    description: t('learning.paths.basics.d'),
    icon: 'flash_on',
    target: 'intro',
    steps: [
      t('learning.paths.basics.steps[0]'),
      t('learning.paths.basics.steps[1]'),
      t('learning.paths.basics.steps[2]'),
      t('learning.paths.basics.steps[3]'),
    ],
  },
  {
    title: t('learning.paths.advanced.t'),
    description: t('learning.paths.advanced.d'),
    icon: 'architecture',
    target: 'models',
    steps: [
      t('learning.paths.advanced.steps[0]'),
      t('learning.paths.advanced.steps[1]'),
      t('learning.paths.advanced.steps[2]'),
      t('learning.paths.advanced.steps[3]'),
    ],
  },
  {
    title: t('learning.paths.production.t'),
    description: t('learning.paths.production.d'),
    icon: 'speed',
    target: 'hosting',
    steps: [
      t('learning.paths.production.steps[0]'),
      t('learning.paths.production.steps[1]'),
      t('learning.paths.production.steps[2]'),
      t('learning.paths.production.steps[3]'),
    ],
  },
])

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -100
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

function goToDocs(section) {
  router.push({ path: '/docs', query: { section } })
}

function copySnippet() {
  const code = `# 1. Create project
composer create-project wibiesana/padi-rest-api my-api
# 2. Configure environment
cd my-api
cp .env.example .env
# 3. Generate JWT secret
php -r "echo bin2hex(random_bytes(32));"
# 4. Start server
php padi serve`

  navigator.clipboard.writeText(code).then(() => {
    $q.notify({
      message: 'Command copied to clipboard',
      color: 'primary',
      position: 'top',
      timeout: 2000,
    })
  })
}
</script>

<style lang="scss" scoped>
/* Base Animations */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: blur(10px);
}

.reveal-active {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.delay-1 {
  transition-delay: 0.1s;
}
.delay-2 {
  transition-delay: 0.2s;
}
.delay-3 {
  transition-delay: 0.3s;
}
.delay-4 {
  transition-delay: 0.4s;
}

.shadow-glow {
  filter: drop-shadow(0 0 15px rgba(46, 125, 50, 0.6));
}

.index-page {
  background: #090d16;
  color: white;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  
  @media (max-width: 599px) {
    padding: 0 16px;
  }
}

/* Enhanced Mesh Backgrounds with Breathing */
.mesh-blob {
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(100px);
  animation: breathing 15s ease-in-out infinite alternate;

  @media (max-width: 599px) {
    width: 300px;
    height: 300px;
  }
}

@keyframes breathing {
  from {
    transform: scale(1) translate(0, 0);
    opacity: 0.7;
  }
  to {
    transform: scale(1.2) translate(50px, -30px);
    opacity: 0.4;
  }
}

.mesh-1 {
  top: -200px;
  right: -200px;
  animation-duration: 20s;
}
.mesh-2 {
  top: 40%;
  left: -300px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
  animation-duration: 25s;
}
.mesh-3 {
  bottom: 10%;
  right: -200px;
  animation-duration: 18s;
}

/* Hero Styling */
.hero-section {
  min-height: 90vh;
  padding-top: 120px;
  padding-bottom: 60px;
  position: relative;
  
  @media (max-width: 599px) {
    min-height: auto;
    padding-top: 100px;
    padding-bottom: 40px;
  }
}

.hero-icon-container {
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
  padding: 40px;
  border-radius: 50%;
  animation: pulse-glow 4s ease-in-out infinite;

  @media (max-width: 599px) {
    padding: 20px;
    .q-img {
      width: 80px !important;
    }
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0);
  }
  50% {
    box-shadow: 0 0 60px rgba(16, 185, 129, 0.25);
  }
}

.text-h2 {
  font-size: 3.5rem;
  line-height: 0.9;
  letter-spacing: -4px;

  @media (max-width: 599px) {
    font-size: 2.2rem !important;
    letter-spacing: -1.5px;
    line-height: 1.1;
  }
}

.premium-btn {
  border-radius: 12px;
  font-weight: 800;
  padding: 12px 42px;
  background: linear-gradient(135deg, var(--q-primary) 0%, #2e7d32 100%);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(46, 125, 50, 0.4);
    filter: brightness(1.1);
  }
}

.premium-btn-outline {
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-weight: 800;
  padding: 10px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.8);
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(255, 255, 255, 0.05);
  }
}

/* Philosophy Cards */
.philosophy-card {
  height: 100%;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    border-color: var(--q-primary);
    background: rgba(46, 125, 50, 0.05);
    transform: translateY(-15px);
    .philosophy-watermark {
      opacity: 0.4;
      transform: scale(1.1);
    }
  }
}

.philosophy-watermark {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 130px;
  font-weight: 900;
  color: var(--q-primary);
  opacity: 0.15;
  transition: all 0.5s ease;
  z-index: -1;
}

/* Feature Boxes */
.feature-box {
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  .feature-icon-wrapper {
    width: 60px;
    height: 60px;
    background: rgba(46, 125, 50, 0.1);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  &:hover {
    background: rgba(46, 125, 50, 0.08);
    border-color: var(--q-primary);
    transform: translateY(-10px);
    .feature-icon-wrapper {
      background: var(--q-primary);
      .q-icon {
        color: white !important;
      }
    }
  }
}

/* Terminal */
.terminal-window {
  background: #020617;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  &:hover {
    border-color: var(--q-primary);
    box-shadow: 0 0 30px rgba(46, 125, 50, 0.2);
  }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
  color: var(--q-primary);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* Path Cards */
.path-card {
  border-radius: 24px;
  transition: all 0.5s ease;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    .path-icon-box {
      background: var(--q-primary);
      .q-icon {
        color: white !important;
      }
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.q-py-100 {
  padding-top: 140px;
  padding-bottom: 140px;
}

.leading-tight {
  line-height: 1.1;
}
.text-gradient {
  background: linear-gradient(135deg, var(--q-primary) 0%, #fff 80%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hover-underline:hover {
  text-decoration: underline !important;
}
</style>
