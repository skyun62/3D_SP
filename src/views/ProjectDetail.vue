<template>
  <div v-if="project" class="detail-root" :class="{ 'is-loaded': pageLoaded }">
    <!-- ── Nav：回首頁 ── -->
    <nav class="nav">
      <router-link to="/" class="nav-back">← BACK</router-link>
      <span class="nav-logo">SKY</span>
    </nav>

    <!-- ── Hero：全幅大圖，標題疊在下方 ── -->
    <section class="detail-hero">
      <div class="hero-media" :style="{ background: project.color }">
        <img v-if="project.image" :src="project.image" :alt="project.title" class="hero-img" />
        <span v-else class="hero-emoji">{{ project.emoji }}</span>
      </div>
      <div class="hero-fade"></div>
      <div class="hero-caption" :class="{ 'is-visible': pageLoaded }">
        <span class="hero-index">{{ String(currentIndex + 1).padStart(2, '0') }} / {{ String(projects.length).padStart(2, '0') }}</span>
        <span class="hero-category">{{ project.category }} · {{ project.year }}</span>
      </div>
    </section>

    <!-- ── Intro：標題 → 內文介紹 → 標籤 → 連結按鈕 ── -->
    <section class="detail-intro">
      <div class="container">
        <h1 class="intro-title">{{ project.title }}</h1>
        <p class="intro-desc">{{ project.description }}</p>
        <div class="intro-tags">
          <span v-for="tag in project.tags" :key="tag" class="intro-tag">{{ tag }}</span>
        </div>
        <a v-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer"
          class="btn-accent intro-link">
          VIEW PROJECT →
        </a>
      </div>
    </section>

    <!-- ── Timeline 區塊們：依 group 分成「製作歷程 / 使用者流程 / AI工具應用」等獨立區塊 ── -->
    <section
      v-for="section in timelineSections"
      :key="section.key"
      class="detail-timeline"
    >
      <div class="container">
        <div class="section-header">
          <span class="section-label">{{ section.label }}</span>
          <h2 class="section-title">{{ section.title }}</h2>
        </div>

        <div class="timeline">
          <div v-for="(step, index) in section.items" :key="index" class="timeline-item">
            <div class="timeline-marker">
              <span class="timeline-dot"></span>
            </div>
            <div class="timeline-body">
              <div class="timeline-image">
                <video
                  v-if="isVideoFile(step.image)"
                  :src="step.image"
                  class="timeline-media"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="metadata"
                ></video>
                <img v-else-if="step.image" :src="step.image" :alt="step.stage" class="timeline-media" />
                <span v-else class="timeline-emoji">{{ project.emoji }}</span>
              </div>
              <div class="timeline-text">
                <span class="timeline-stage">{{ String(index + 1).padStart(2, '0') }} · {{ step.stage }}</span>
                <p class="timeline-desc">{{ step.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Footer ── -->
    <footer class="footer">
      <span class="footer-copy">© 2026 SKY. All rights reserved.</span>
    </footer>
  </div>

  <!-- ── 找不到專案時的簡單提示 ── -->
  <div v-else class="not-found">
    <p class="not-found-text">找不到這個專案。</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { projects } from './projects.js'

const route = useRoute()
const pageLoaded = ref(false)

const currentIndex = computed(() =>
  projects.findIndex((p) => p.id === Number(route.params.id))
)
const project = computed(() => (currentIndex.value > -1 ? projects[currentIndex.value] : null))

// 依副檔名自動判斷是圖片還是影片，換檔案路徑就會自動切換播放方式
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.ogg', '.m4v']
function isVideoFile(src) {
  if (!src) return false
  const clean = src.split('?')[0].split('#')[0].toLowerCase()
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext))
}

// ── 區塊分類規則 ──
// 每個 timeline 項目可以在 projects.js 裡加一個 group 欄位（'process' / 'flow' / 'ai'）
// 沒有標註 group 的項目，預設歸類為 'process'（製作歷程），維持向下相容，其他專案完全不用改
const TIMELINE_GROUPS = [
  { key: 'flow', label: 'USER FLOW', title: '使用者歷程' },
  { key: 'strategy', label: 'DESIGN STRATEGY', title: '設計策略' },
  { key: 'process', label: 'PROCESS', title: '歷程與客群定位' },
  { key: 'ai', label: 'AI TOOLS', title: 'AI 工具應用' },
]

const timelineSections = computed(() => {
  if (!project.value || !project.value.timeline) return []
  return TIMELINE_GROUPS
    .map((group) => ({
      ...group,
      items: project.value.timeline.filter((step) => (step.group || 'process') === group.key),
    }))
    .filter((group) => group.items.length > 0)
})

onMounted(() => {
  window.scrollTo(0, 0)
  setTimeout(() => {
    pageLoaded.value = true
  }, 80)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&family=Noto+Serif+TC:wght@400;500&family=Noto+Sans+TC:wght@400;500&display=swap');

:root {
  --color-accent: #ba9393;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-bg: #faf9f7;
  --color-bg-card: #f4f1ed;
  --color-border: rgba(0, 0, 0, 0.10);
  --font-display: 'Playfair Display', 'Noto Serif TC', serif;
  --font-body: 'DM Sans', 'Noto Sans TC', sans-serif;
  --transition: 0.3s ease;
}
</style>

<style scoped>
.detail-root {
  opacity: 0;
  transition: opacity 0.6s ease;
  width: 100%;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
}

.detail-root.is-loaded {
  opacity: 1;
}

/* ── Nav ── */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  background: rgba(250, 249, 247, 0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
}

.nav-back {
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.nav-back:hover {
  color: var(--color-accent);
}

.nav-logo {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
}

/* ── Hero ── */
.detail-hero {
  position: relative;
  width: 100%;
  height: 72vh;
  min-height: 420px;
  overflow: hidden;
}

.hero-media {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-emoji {
  font-size: 120px;
}

.hero-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(to bottom, transparent, var(--color-bg));
  pointer-events: none;
}

.hero-caption {
  position: absolute;
  left: 64px;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}

.hero-caption.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-index {
  font-size: 11px;
  letter-spacing: 0.14em;
  color: #fff;
}

.hero-category {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

/* ── Container 通用 ── */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 64px;
}

/* ── Intro：標題 → 內文介紹 → 標籤 → 連結按鈕 ── */
.detail-intro {
  padding: 80px 0 40px;
}

.intro-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 24px;
}

.intro-desc {
  font-size: 16px;
  line-height: 1.9;
  color: var(--color-text-primary);
  white-space: pre-line;
  margin-bottom: 24px;
}

.intro-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.intro-tag {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  padding: 5px 12px;
}

.btn-accent {
  display: inline-block;
  background: var(--color-accent);
  color: #fff;
  border: 1px solid var(--color-accent);
  padding: 12px 32px;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-family: var(--font-body);
  text-decoration: none;
  transition: opacity var(--transition);
}

.btn-accent:hover {
  opacity: 0.82;
}

/* ── Section header（時間軸區塊標題）── */
.section-header {
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding-top: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 64px;
}

.section-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 400;
}

/* ── Timeline：左圖右文，中間一條直線串連圓點 ── */
.detail-timeline {
  padding: 40px 0 100px;
}

/* 讓連續的區塊之間有分隔線，視覺上明確區隔開 */
.detail-timeline + .detail-timeline {
  padding-top: 0;
  border-top: 1px solid var(--color-border);
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 72px;
}

/* 中間貫穿全部項目的直線 */
.timeline::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 19px;
  width: 1px;
  background: var(--color-border);
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 32px;
}

.timeline-marker {
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.timeline-dot {
  position: relative;
  z-index: 1;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 1px solid var(--color-accent);
}

.timeline-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  align-items: start;
}

.timeline-image {
  aspect-ratio: 4/3;
  overflow: hidden;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.timeline-emoji {
  font-size: 56px;
}

.timeline-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
}

.timeline-stage {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.timeline-desc {
  font-size: 15px;
  line-height: 1.85;
  color: var(--color-text-primary);
  white-space: pre-line;
}

/* ── Footer ── */
.footer {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 64px;
  border-top: 1px solid var(--color-border);
}

.footer-copy {
  font-size: 12px;
  color: var(--color-text-secondary);
  letter-spacing: 0.06em;
}

/* ── 找不到專案 ── */
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
}

/* ── 響應式 ── */
@media (max-width: 768px) {
  .nav {
    padding: 0 24px;
  }

  .container {
    padding: 0 32px;
  }

  .detail-hero {
    height: 50vh;
    min-height: 320px;
  }

  .hero-caption {
    left: 32px;
    bottom: 24px;
  }

  .timeline-body {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .timeline-image {
    aspect-ratio: 16/10;
  }

  .footer {
    padding: 0 32px;
  }
}

@media (max-width: 480px) {
  .footer {
    height: auto;
    padding: 20px 24px;
  }
}
</style>