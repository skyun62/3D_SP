<template>
  <div class="portfolio-root" :class="{ 'is-loaded': pageLoaded }">
    <!-- ── Nav ── -->
    <nav class="nav">
      <span class="nav-logo">SKY</span>
      <div class="nav-links">
        <a href="#work">WORK</a>
        <a href="#about">ABOUT</a>
        <a href="#contact">CONTACT</a>
      </div>
      <div class="nav-hamburger" @click="menuOpen = !menuOpen">
        <span></span><span></span>
      </div>
    </nav>
    <div class="mobile-menu" :class="{ 'is-open': menuOpen }">
      <a href="#work" @click="menuOpen = false">WORK</a>
      <a href="#about" @click="menuOpen = false">ABOUT</a>
      <a href="#contact" @click="menuOpen = false">CONTACT</a>
    </div>
    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-loading" :class="{ 'is-hidden': splineLoaded }">
        <div class="loading-ring"></div>
        <p class="loading-text">LOADING ⌛</p>
      </div>
      <div class="hero-spline">
        <iframe src="https://my.spline.design/cozyisometricworkspace-kL3kaiNowcF5Qu7NxVxwyGQO/" frameborder="0"
          allowfullscreen title="Cozy Isometric Workspace" @load="onSplineLoad"></iframe>
      </div>
      <div class="hero-overlay">
        <div class="hero-text" :class="{ 'is-visible': splineLoaded }">
          <span class="hero-label">PORTFOLIO · 2026</span>
          <h1 class="hero-title">Design &amp;<br />Interaction</h1>
          <p class="hero-sub">UX Designer · Product Strategist · Researcher</p>
          <a href="#work" class="hero-cta">VIEW WORKS ↓</a>
        </div>
        <div class="hero-hint" :class="{ 'is-visible': splineLoaded }">
          <span>← DRAG TO EXPLORE →</span>
        </div>
      </div>
      <div class="hero-fade"></div>
    </section>
    <!-- ── Work Grid ── -->
    <section class="section" id="work">
      <div class="container">
        <div class="section-header">
          <span class="section-label">SELECTED WORKS</span>
          <h2 class="section-title">專案作品</h2>
        </div>
        <div class="work-grid">
          <!-- ★ 點擊卡片直接導向 /projects/:id 內頁，不再彈出 Modal -->
          <div v-for="(project, index) in projects" :key="project.id" class="work-card"
            :style="{ animationDelay: `${index * 0.1}s` }" @click="openProject(project)">
            <div class="card-image">
              <div class="card-placeholder" :style="{ background: project.color }">
                <img v-if="project.image" :src="project.image" :alt="project.title" class="card-img" />
                <span v-else class="card-placeholder-text">{{ project.emoji }}</span>
              </div>
              <div class="card-tag">{{ project.year }}</div>
            </div>
            <div class="card-info">
              <span class="card-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="card-meta">
                <p class="card-category">{{ project.category }}</p>
                <h3 class="card-title">{{ project.title }}</h3>
              </div>
              <span class="card-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Awards ── -->
    <section class="section section--awards" id="awards">
      <div class="container">
        <div class="section-header">
          <span class="section-label">RECOGNITION</span>
          <h2 class="section-title">獎項</h2>
        </div>
        <div class="awards-list">
          <div
            v-for="(award, index) in awards"
            :key="award.id"
            class="award-row"
            @click="router.push(`/awards/${award.id}`)"
            >
            <div class="award-cover">
              <img v-if="award.image" :src="award.image" :alt="award.title" class="award-img" />
              <span v-else class="award-emoji">{{ award.emoji }}</span>
            </div>
            <div class="award-content">
              <span class="award-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="award-meta">
                <span class="award-category">{{ award.category }} · {{ award.year }}</span>
                <h3 class="award-title">{{ award.title }}</h3>
                <p class="award-desc">{{ award.description }}</p>
                <div class="award-tags">
                  <span v-for="tag in award.tags" :key="tag" class="award-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- ── About ── -->
    <section class="section section--about" id="about">
      <div class="container">
        <div class="section-header">
          <span class="section-label">ABOUT ME</span>
          <h2 class="section-title">關於</h2>
        </div>
        <div class="about-grid">
          <div class="about-text">
            <p class="about-body">
              擅長從觀察中發現問題，從研究中找出脈絡，並將抽象的洞察轉化為具體的解決方案。
              <br>
              過去參與政府專案、數位產品與跨部門合作，累積了使用者研究、產品規劃與內容策略經驗。
            </p>
            <p class="about-body">
              我相信好的設計與產品，不只是解決問題，更來自對人的理解。
              近期熱愛探索 3D 與互動設計的邊界，目前正在用 Spline 和 Vue 打造更有沉浸感的作品集體驗。
            </p>
            <div class="about-skills">
              <div class="skill-item" v-for="skill in skills" :key="skill">
                <span class="skill-dot">·</span>{{ skill }}
              </div>
            </div>
          </div>
          <div class="about-stats">
            <div class="stat-item" v-for="stat in stats" :key="stat.label">
              <span class="stat-number">{{ stat.number }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- ── Footer ── -->
    <footer class="footer">
      <span class="footer-copy">© 2026 SKY. All rights reserved.</span>
      <div class="footer-links">
        <a href="#">104</a>
        <a href="#">LinkedIn</a>
        <a href="#">GitHub</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { projects } from './projects.js'

const router = useRouter()

const pageLoaded = ref(false)
const splineLoaded = ref(false)
const menuOpen = ref(false)

const onSplineLoad = () => { splineLoaded.value = true }

// ★ 原本是開啟 Modal，現在改成導向專案內頁 /projects/:id
const openProject = (project) => {
  router.push(`/projects/${project.id}`)
}

onMounted(() => {
  setTimeout(() => { pageLoaded.value = true }, 80)
  setTimeout(() => { splineLoaded.value = true }, 10000)
})

const skills = reactive(['UI/UX Design', 'Figma', 'Vue 3', 'Spline 3D', 'User Research', 'Prototyping', 'Design System'])
const awards = reactive([
  {
    id: 1,
    title: '嘖嘖募資上架',
    category: 'COMPETITION',
    year: '2022',
    emoji: '🏆',
    image: '/3D_SP/img/zzmz.png',
    link: 'https://your-award-link.com',
    description: '經過長達一年多的顧客調研與競賽，將產品順利產出並成功上架平台。',
    tags: ['最小可行性市場驗證', '群眾募資'],
  },
  {
    id: 2,
    title: '中草藥在地循環計劃',
    category: 'COMPETITION',
    year: '2021-2022',
    emoji: '🏆',
    image: '/3D_SP/img/umus.jpg',
    link: 'https://your-award-link.com',
    description: '以循環設計思維重新詮釋中草藥的在地價值，透過使用者訪談與文獻研究，團隊梳理出循環鏈斷點，連結種植者、消費者與地方文化，並以服務設計方法提出解決方案。',
    tags: ['循環設計', 'UX Research', '地方創生', 'Presentation', '永續議題'],
  },
])
const stats = reactive([{ number: '20+', label: 'Projects' }, { number: '3yr', label: 'Experience' }, { number: '100%', label: 'Passion' }])
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&family=Noto+Serif+TC:wght@400;500&family=Noto+Sans+TC:wght@400;500&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  scroll-behavior: smooth;
}

body {
  background: #faf9f7;
  color: #1a1a1a;
  font-family: 'DM Sans', 'Noto Sans TC', sans-serif;
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 100%;
  height: 100%;
}

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
.portfolio-root {
  opacity: 0;
  transition: opacity 0.6s ease;
  width: 100%;
}

.portfolio-root.is-loaded {
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

.nav-logo {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
}

.nav-links {
  display: flex;
  gap: 36px;
}

.nav-links a {
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.nav-links a:hover {
  color: var(--color-accent);
}

.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.nav-hamburger span {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--color-text-primary);
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 190;
  flex-direction: column;
  padding: 24px 32px;
  gap: 20px;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.mobile-menu.is-open {
  transform: translateY(0);
}

.mobile-menu a {
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--color-text-primary);
  text-decoration: none;
}

/* ── Hero ── */
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.hero-spline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.hero-spline iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%) scale(1.02);
  transform-origin: center center;
  border: none;
  display: block;
}

.hero-loading {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  transition: opacity 0.8s ease;
}

.hero-loading.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.loading-ring {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--color-text-secondary);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 64px 72px;
  pointer-events: none;
}

.hero-text {
  pointer-events: auto;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
}

.hero-text.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-label {
  display: block;
  font-size: 10px;
  letter-spacing: 0.22em;
  color: var(--color-text-secondary);
  margin-bottom: 14px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(44px, 6vw, 80px);
  font-weight: 400;
  line-height: 1.08;
  color: var(--color-text-primary);
  margin-bottom: 18px;
}

.hero-sub {
  font-size: 14px;
  font-weight: 300;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}

.hero-cta {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-text-primary);
  padding-bottom: 4px;
  text-decoration: none;
  transition: color var(--transition), border-color var(--transition);
}

.hero-cta:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.hero-hint {
  opacity: 0;
  transition: opacity 0.8s ease 0.6s;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--color-text-secondary);
  writing-mode: vertical-rl;
  pointer-events: none;
}

.hero-hint.is-visible {
  opacity: 1;
}

.hero-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160px;
  z-index: 15;
  background: linear-gradient(to bottom, transparent, var(--color-bg));
  pointer-events: none;
}

/* ── Section 通用 ── */
.section {
  padding: 60px 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 64px;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 32px;
}

.section-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  white-space: nowrap;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 400;
}

/* ── Work Grid ── */
.work-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.work-card {
  background: var(--color-bg-card);
  cursor: pointer;
  overflow: hidden;
  animation: cardFadeIn 0.5s ease both;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-image {
  position: relative;
  aspect-ratio: 2/1;
  overflow: hidden;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s ease;
  overflow: hidden;
}

.work-card:hover .card-placeholder {
  transform: scale(1.03);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-placeholder-text {
  font-size: 64px;
}

.card-tag {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--color-text-secondary);
  background: rgba(250, 249, 247, 0.85);
  padding: 4px 10px;
  border: 1px solid var(--color-border);
}

.card-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-top: 1px solid var(--color-border);
}

.card-index {
  font-size: 10px;
  color: var(--color-text-secondary);
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

.card-meta {
  flex: 1;
}

.card-category {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 4px;
}

.card-title {
  font-size: 17px;
  font-weight: 500;
  line-height: 1.3;
}

.card-arrow {
  font-size: 18px;
  color: var(--color-text-secondary);
  transition: transform var(--transition), color var(--transition);
  flex-shrink: 0;
}

.work-card:hover .card-arrow {
  transform: translateX(5px);
  color: var(--color-accent);
}

/* ── Awards ── */
.section--awards {
  background: var(--color-bg);
}

.awards-list {
  display: flex;
  flex-direction: column;
}

.award-row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  gap: 32px;
  align-items: center;
  padding: 32px 0;
  border-bottom: 1px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: background var(--transition);
  cursor: pointer;
}

.award-row:hover {
  background: var(--color-bg-card);
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;
}

.award-cover {
  width: 160px;
  height: 100px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.award-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.award-row:hover .award-img {
  transform: scale(1.04);
}

.award-emoji {
  font-size: 36px;
}

.award-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.award-index {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  padding-top: 4px;
}

.award-meta {
  flex: 1;
}

.award-category {
  display: block;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 6px;
}

.award-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 8px;
  line-height: 1.3;
}

.award-desc {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.award-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.award-tag {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  padding: 3px 10px;
}

@media (max-width: 768px) {
  .award-row {
    grid-template-columns: 100px 1fr;
    grid-template-rows: auto auto;
  }

  .award-cover {
    width: 100px;
    height: 70px;
  }

  .award-row:hover {
    margin: 0;
    padding: 32px 0;
  }
}

@media (max-width: 480px) {
  .award-row {
    grid-template-columns: 1fr;
  }

  .award-cover {
    width: 100%;
    height: 140px;
  }
}

/* ── About ── */
.section--about {
  background: var(--color-bg-card);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 80px;
  align-items: start;
}

.about-body {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 24px;
}

.about-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 32px;
}

.skill-item {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
}

.skill-dot {
  color: var(--color-accent);
  margin-right: 6px;
}

.about-stats {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stat-item {
  border-bottom: 1px solid var(--color-border);
  padding-top: 20px;
}

.stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}


/* ── Footer ── */
.footer {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 64px;
  border-top: 1px solid var(--color-border);
}

.footer-copy {
  font-size: 12px;
  color: var(--color-text-secondary);
  letter-spacing: 0.06em;
}

.footer-links {
  display: flex;
  gap: 28px;
}

.footer-links a {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.footer-links a:hover {
  color: var(--color-accent);
}

/* ── 響應式 768px ── */
@media (max-width: 768px) {
  .nav {
    padding: 0 24px;
  }

  .nav-links {
    display: none;
  }

  .nav-hamburger {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  .hero-overlay {
    padding: 0 32px 56px;
  }

  .hero-hint {
    display: none;
  }

  .container {
    padding: 0 32px;
  }

  .section {
    padding: 80px 0;
  }

  .work-grid {
    grid-template-columns: 1fr;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-stats {
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 32px;
  }

  .stat-item {
    flex: 1;
    min-width: 100px;
  }

  .footer {
    padding: 0 32px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 40px;
  }

  .section-header {
    flex-direction: column;
    gap: 8px;
  }

  .footer {
    flex-direction: column;
    height: auto;
    gap: 12px;
    padding: 20px 24px;
  }
}
</style>