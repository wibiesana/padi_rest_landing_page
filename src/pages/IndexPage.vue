<template>
  <q-page class="index-page overflow-hidden">
    <!-- Animated Mesh Background Elements -->
    <div class="mesh-blob mesh-1"></div>
    <div class="mesh-blob mesh-2"></div>
    <div class="mesh-blob mesh-3"></div>

    <!-- Hero Section -->
    <section class="hero-section text-center flex flex-center">
      <div class="container relative-position">
        <div class="column items-center">
          <div class="hero-icon-container q-mb-lg">
            <q-icon name="grain" size="100px" color="primary" class="animate-float" />
          </div>
          <h1
            class="text-h2 text-weight-bolder q-ma-none text-gradient text-uppercase tracking-tighter"
          >
            PADI REST API
          </h1>
          <div class="hero-subtitle-container q-mt-lg">
            <p
              class="text-h5 text-white text-weight-light max-width-900 opacity-90 border-left-primary q-pl-lg"
            >
              The Industrial-Grade, <span class="text-weight-bold">Zero-Bloat</span> PHP Engine for
              the Modern Web
            </p>
          </div>
          <div class="q-mt-xl q-gutter-lg flex justify-center">
            <q-btn
              color="primary"
              size="lg"
              unelevated
              label="Get Started"
              icon="rocket_launch"
              @click="scrollTo('quickstart')"
              class="premium-btn shadow-24"
            />
            <q-btn
              outline
              color="white"
              size="lg"
              label="Documentation"
              @click="scrollTo('docs')"
              class="premium-btn-outline"
              icon="menu_book"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy (P.A.D.I) Section -->
    <section class="q-py-xl container relative-position z-top">
      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-md-5">
          <div class="text-h3 text-weight-bolder text-white q-mb-lg leading-tight">
            Built for <span class="text-primary">Speed</span>,<br />
            Scaled for <span class="text-gradient">Industrial</span> Growth.
          </div>
          <p class="text-body1 text-grey-4 text-weight-light line-height-1-8">
            PADI isn't just another PHP framework; it's a meticulously crafted
            <b class="text-white">Code Generation Engine</b> designed to transform your database
            schemas into production-ready endpoints instantly.
          </p>
          <q-btn
            flat
            color="primary"
            label="Read the philosophy →"
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
    <section id="features" class="q-py-100 container">
      <div class="text-center q-mb-100">
        <h2 class="text-h3 text-weight-bolder text-white">Advanced Core Systems</h2>
        <div class="h-line-gradient q-mx-auto q-mt-md"></div>
      </div>

      <div class="row q-col-gutter-xl">
        <div v-for="feature in features" :key="feature.title" class="col-12 col-sm-6 col-md-4">
          <div class="feature-box glass-card q-pa-xl text-white full-height flex column">
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
                label="High Performance"
                size="sm"
                dense
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Visual Section -->
    <section class="q-py-100 bg-premium-dark relative-position">
      <div class="mesh-blob mesh-4"></div>
      <div class="container row q-col-gutter-xl items-center">
        <div class="col-12 col-md-6 text-white">
          <div class="text-overline text-primary letter-spacing-2 q-mb-md">PERFORMANCE METRICS</div>
          <h3 class="text-h3 text-weight-bolder q-mb-xl line-height-1">Precision Engineering.</h3>
          <p class="text-body1 text-grey-4 font-light q-mb-xl">
            Optimized for shared hosting and enterprise clusters alike. Our framework yields
            industry-leading security scores without sacrificing execution speed.
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
              <div class="text-h6 text-primary q-mt-lg">Real-time Performance Monitoring</div>
              <div class="text-caption text-grey-5">Awaiting Production Deployment...</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start Terminal Section -->
    <section id="quickstart" class="q-py-100 container">
      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-lg-5">
          <h2 class="text-h3 text-weight-bolder text-white q-mb-lg">
            Get Running <br /><span class="text-gradient">Instantly</span>.
          </h2>
          <p class="text-h6 text-grey-4 q-mb-xl font-light">
            No massive installation wizards. Just one command to pull the engine and start
            scaffolding your architecture.
          </p>
          <div class="q-gutter-y-md">
            <div v-for="(step, i) in installationSteps" :key="i" class="flex items-center">
              <div class="step-num text-weight-bolder text-primary q-mr-md">{{ i + 1 }}</div>
              <div class="text-h6 text-white">{{ step }}</div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-7">
          <div class="terminal-window shadow-24">
            <div class="terminal-header flex items-center q-px-md">
              <div class="flex q-gutter-x-xs">
                <div class="t-dot dot-red"></div>
                <div class="t-dot dot-yellow"></div>
                <div class="t-dot dot-green"></div>
              </div>
              <div class="q-mx-auto text-caption text-grey-6 font-mono">padi-core-cli v2.0.5</div>
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
    <section id="docs" class="q-py-100 bg-premium">
      <div class="container">
        <div class="text-center q-mb-100">
          <h2 class="text-h3 text-weight-bolder text-white">Guided Mastery</h2>
          <p class="text-h6 text-grey-4">
            Framework-specific paths designed to accelerate your delivery
          </p>
        </div>

        <div class="row q-col-gutter-xl">
          <div v-for="path in learningPaths" :key="path.title" class="col-12 col-md-4">
            <div class="path-card glass-card hover-glow flex column">
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
                    v-for="(step, idx) in path.steps"
                    :key="idx"
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
                  label="Begin this Path"
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
    <section class="q-py-100 text-center relative-position overflow-hidden">
      <div class="mesh-blob mesh-1" style="bottom: -200px; top: auto; right: 0"></div>
      <div class="container relative-position">
        <h2 class="text-h2 text-weight-bolder text-white q-mb-lg leading-tight">
          Ready to Experience <br /><span class="text-primary">Raw Power</span>?
        </h2>
        <p class="text-h5 q-mb-xl text-grey-4 opacity-80 max-width-800 q-mx-auto">
          Join the ecosystem of engineers building industrial REST services without the boilerplate.
          Stop wrestle, start shipping.
        </p>
        <q-btn
          color="primary"
          size="xl"
          unelevated
          label="Install Framework"
          icon="terminal"
          @click="scrollTo('quickstart')"
          class="premium-btn shadow-24"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const stats = [
  { label: 'Security Score', value: '9.0', color: 'text-primary' },
  { label: 'Performance', value: '8.5', color: 'text-accent' },
]

const installationSteps = [
  'Pull the SDK via Composer',
  'Automated Setup Wizard',
  'Launch Dev Environment',
]

const philosophyItems = [
  {
    l: 'P',
    t: 'Performant',
    d: 'Hyper-optimized execution core that extracts every ounce of speed from modern PHP architectures.',
  },
  {
    l: 'A',
    t: 'Adaptable',
    d: 'Flawlessly bridges the gap between diverse backend databases and blazing-fast frontend ecosystems.',
  },
  {
    l: 'D',
    t: 'Distributed',
    d: 'Engineered from the ground up to thrive in clustered microservices and containerized environments.',
  },
  {
    l: 'I',
    t: 'Interface',
    d: 'The ultimate standard, providing iron-clad, reliable data plumbing for your mission-critical applications.',
  },
]

const features = [
  {
    title: 'Auto CRUD SDK',
    description:
      'Instantly transform database schemas into production-ready APIs with full documentation in seconds.',
    icon: 'auto_fix_high',
  },
  {
    title: 'Ultra-Lightweight',
    description:
      'Zero-bloat architecture that eliminates heavy overhead, ensuring minimal latency and maximum clarity.',
    icon: 'inventory_2',
  },
  {
    title: 'Worker-Optimized',
    description:
      'Native FrankenPHP Worker Mode support delivering up to 10x performance gains via memory-state optimization.',
    icon: 'rocket_launch',
  },
  {
    title: 'Modern Core',
    description:
      'Built for PHP 8.4+ standards, utilizing latest enhancements for robust, type-safe, and clean codebases.',
    icon: 'hub',
  },
  {
    title: 'Stateless Shield',
    description:
      'Engineered specifically for high-traffic environments, safe from memory leaks in long-lived execution.',
    icon: 'security',
  },
  {
    title: 'Agnostic Data',
    description:
      'Seamlessly scale between MySQL, PostgreSQL, or SQLite without rewriting your core business logic.',
    icon: 'storage',
  },
]

const learningPaths = [
  {
    title: 'Quick Scaffolder',
    description: 'Perfect for building a rapid prototype or a standard internal utility app.',
    icon: 'flash_on',
    target: 'intro',
    steps: ['CLI Overview', 'Auto-CRUD Gen', 'First API Calls'],
  },
  {
    title: 'Enterprise Architect',
    description: 'Designed for high-load systems requiring RBAC, multi-DB, and caching layers.',
    icon: 'architecture',
    target: 'models',
    steps: ['ActiveRecord Dive', 'RBAC Logic', 'Database Clusters'],
  },
  {
    title: 'DevOps & Scaling',
    description: 'Focus on production hardening, worker mode optimization, and containerization.',
    icon: 'speed',
    target: 'hosting',
    steps: ['Worker Mode Fix', 'Docker Runtime', 'Security Hardening'],
  },
]

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
.index-page {
  background: #0f172a;
  color: white;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Mesh Backgrounds */
.mesh-blob {
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(46, 125, 50, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(100px);
}

.mesh-1 {
  top: -200px;
  right: -200px;
}
.mesh-2 {
  top: 40%;
  left: -300px;
  background: radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%);
}
.mesh-3 {
  bottom: 10%;
  right: -200px;
}
.mesh-4 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1200px;
}

/* Hero Styling */
.hero-section {
  min-height: 90vh;
  padding-top: 100px;
}

.hero-icon-container {
  background: radial-gradient(circle, rgba(46, 125, 50, 0.2) 0%, transparent 70%);
  padding: 40px;
  border-radius: 50%;
}

.text-h2 {
  font-size: 3.5rem;
  line-height: 0.9;
  letter-spacing: -4px;
  @media (max-width: 600px) {
    font-size: 4rem;
    letter-spacing: -2px;
  }
}

.tracking-tighter {
  letter-spacing: -4px;
}
.letter-spacing-2 {
  letter-spacing: 2px;
}
.tracking-widest {
  letter-spacing: 4px;
}

.border-left-primary {
  border-left: 6px solid var(--q-primary);
}

.premium-btn {
  border-radius: 12px;
  font-weight: 800;
  padding: 10px 40px;
  text-transform: none;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 20px 40px rgba(46, 125, 50, 0.4);
  }
}

.premium-btn-outline {
  border-radius: 12px;
  border-width: 2px;
  font-weight: 800;
  padding: 10px 40px;
  text-transform: none;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
}

/* Philosophy Cards */
.philosophy-card {
  height: 100%;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 1;
  &:hover {
    border-color: rgba(46, 125, 50, 0.5);
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-10px);
  }
}

.philosophy-watermark {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 130px;
  font-weight: 900;
  color: var(--q-primary);
  opacity: 0.2;
  line-height: 1;
  z-index: -1;
  user-select: none;
}

/* Feature Boxes */
.feature-box {
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease;
  .feature-icon-wrapper {
    width: 80px;
    height: 80px;
    background: rgba(46, 125, 50, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover {
    background: rgba(46, 125, 50, 0.05);
    border-color: var(--q-primary);
    transform: scale(1.02);
  }
}

/* Terminal */
.terminal-window {
  background: #020617;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-header {
  height: 45px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.t-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.dot-red {
  background: #ff5f56;
}
.dot-yellow {
  background: #ffbd2e;
}
.dot-green {
  background: #27c93f;
}

.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.t-dim {
  opacity: 0.4;
}
.t-prompt {
  color: var(--q-primary);
  font-weight: bold;
}
.t-cmd {
  color: #818cf8;
}
.t-arg {
  color: #4ade80;
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
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.05);
  .path-icon-box {
    width: 48px;
    height: 48px;
    background: rgba(46, 125, 50, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.step-bullet {
  width: 8px;
  height: 8px;
  background: var(--q-primary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--q-primary);
}

.hover-glow:hover {
  box-shadow: 0 0 50px rgba(46, 125, 50, 0.2);
  border-color: rgba(46, 125, 50, 0.3);
}

/* Utils */
.line-height-1 {
  line-height: 1;
}
.line-height-1-8 {
  line-height: 1.8;
}
.line-height-2 {
  line-height: 2;
}
.q-py-100 {
  padding-top: 140px;
  padding-bottom: 140px;
}
.q-mb-100 {
  margin-bottom: 100px;
}
.h-line-gradient {
  width: 80px;
  height: 6px;
  background: linear-gradient(90deg, var(--q-primary), transparent);
  border-radius: 3px;
}
.border-dashed {
  border: 2px dashed rgba(255, 255, 255, 0.1);
}
.border-top-light {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
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

.transition-all {
  transition: all 0.3s ease;
}
.max-width-800 {
  max-width: 800px;
}
.max-width-900 {
  max-width: 900px;
}
</style>
