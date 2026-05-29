<template>
  <div class="portfolio-root" :class="{ 'is-loaded': pageLoaded }">

    <!-- ── Nav ── -->
    <nav class="nav">
      <span class="nav-logo">YOUR NAME</span>
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

      <!-- 載入遮罩 -->
      <div class="hero-loading" :class="{ 'is-hidden': splineLoaded }">
        <div class="loading-ring"></div>
        <p class="loading-text">LOADING SCENE</p>
      </div>

      <!-- Spline iframe：強制撐滿不留白 -->
      <div class="hero-spline">
        <iframe
          src="https://my.spline.design/cozyisometricworkspace-kL3kaiNowcF5Qu7NxVxwyGQO/"
          frameborder="0"
          allowfullscreen
          title="Cozy Isometric Workspace"
          @load="onSplineLoad"
        ></iframe>
      </div>

      <!-- 文字 Overlay：左下角 -->
      <div class="hero-overlay">
        <div class="hero-text" :class="{ 'is-visible': splineLoaded }">
          <span class="hero-label">PORTFOLIO · 2024</span>
          <h1 class="hero-title">Design &amp;<br />Interaction</h1>
          <p class="hero-sub">UI/UX Designer · 創造有溫度的數位體驗</p>
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
          <h2 class="section-title">作品</h2>
        </div>
        <div class="work-grid">
          <div
            v-for="(project, index) in projects"
            :key="project.id"
            class="work-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="openProject(project)"
          >
            <div class="card-image">
              <div class="card-placeholder" :style="{ background: project.color }">
                <span class="card-placeholder-text">{{ project.emoji }}</span>
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
              我是一位專注於 UI/UX 設計的設計師，相信好的設計不只是視覺，而是一套完整的體驗系統。
              從使用者研究到互動原型，我擅長將複雜的問題轉化為簡潔直觀的解決方案。
            </p>
            <p class="about-body">
              熱愛探索 3D 與互動設計的邊界，目前正在用 Spline 和 Vue 打造更有沉浸感的作品集體驗。
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

    <!-- ── Contact ── -->
    <section class="section section--contact" id="contact">
      <div class="container">
        <div class="contact-inner">
          <span class="section-label">GET IN TOUCH</span>
          <h2 class="contact-title">合作洽談</h2>
          <p class="contact-sub">歡迎聊聊你的專案想法</p>
          <a href="mailto:hello@yourname.com" class="btn-accent">SEND EMAIL →</a>
        </div>
      </div>
    </section>

    <!-- ── Footer ── -->
    <footer class="footer">
      <span class="footer-copy">© 2024 YOUR NAME. All rights reserved.</span>
      <div class="footer-links">
        <a href="#">Behance</a>
        <a href="#">LinkedIn</a>
        <a href="#">GitHub</a>
      </div>
    </footer>

    <!-- ── Modal ── -->
    <Transition name="modal">
      <div v-if="activeProject" class="modal-backdrop" @click.self="activeProject = null">
        <div class="modal-panel">
          <button class="modal-close" @click="activeProject = null">✕</button>
          <div class="modal-placeholder" :style="{ background: activeProject.color }">
            <span class="modal-emoji">{{ activeProject.emoji }}</span>
          </div>
          <div class="modal-body">
            <span class="modal-category">{{ activeProject.category }} · {{ activeProject.year }}</span>
            <h3 class="modal-title">{{ activeProject.title }}</h3>
            <p class="modal-desc">{{ activeProject.description }}</p>
            <div class="modal-tags">
              <span v-for="tag in activeProject.tags" :key="tag" class="modal-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const pageLoaded    = ref(false)
const splineLoaded  = ref(false)
const menuOpen      = ref(false)
const activeProject = ref(null)

const onSplineLoad = () => { splineLoaded.value = true }
const openProject  = (p) => { activeProject.value = p }

onMounted(() => {
  setTimeout(() => { pageLoaded.value = true }, 80)
  setTimeout(() => { splineLoaded.value = true }, 10000)
})

const projects = reactive([
  { id: 1, title: 'Cozy Workspace — 3D 互動作品集', category: 'INTERACTION DESIGN', year: '2024', emoji: '🛋️', color: '#e8ddd4', description: '以 Spline 建構等距視角的溫馨工作室，整合 Vue 3 打造可互動的沉浸式作品集頁面。', tags: ['Spline', 'Vue 3', '3D Design', 'Interaction'] },
  { id: 2, title: 'Habit Loop — 習慣追蹤 App', category: 'UI/UX DESIGN', year: '2024', emoji: '🌱', color: '#d4e8d8', description: '透過行為科學理論設計的習慣養成 App，完成從研究到高保真原型的完整流程。', tags: ['User Research', 'Figma', 'Prototyping', 'iOS'] },
  { id: 3, title: 'Tidewave — 音樂社群平台', category: 'PRODUCT DESIGN', year: '2023', emoji: '🎵', color: '#d4d8e8', description: '重新定義音樂人與聽眾的連結方式，設計以創作者為中心的社群功能。', tags: ['Design System', 'Community', 'Figma', 'Research'] },
  { id: 4, title: 'Luminary — 智慧家居儀表板', category: 'DASHBOARD DESIGN', year: '2023', emoji: '💡', color: '#e8e4d4', description: '為智慧家居設備打造統一的控制介面，平衡資訊密度與操作直覺性。', tags: ['Dashboard', 'Data Viz', 'IoT', 'Vue'] },
])
const skills = reactive(['UI/UX Design', 'Figma', 'Vue 3', 'Spline 3D', 'User Research', 'Prototyping', 'Design System'])
const stats   = reactive([{ number: '20+', label: 'Projects' }, { number: '3yr', label: 'Experience' }, { number: '100%', label: 'Passion' }])
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&family=Noto+Serif+TC:wght@400;500&family=Noto+Sans+TC:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body { width: 100%; height: 100%; scroll-behavior: smooth; }

body {
  background: #faf9f7;
  color: #1a1a1a;
  font-family: 'DM Sans', 'Noto Sans TC', sans-serif;
  -webkit-font-smoothing: antialiased;
}

#app { width: 100%; height: 100%; }

:root {
  --color-accent:         #ba9393;
  --color-text-primary:   #1a1a1a;
  --color-text-secondary: #666666;
  --color-bg:             #faf9f7;
  --color-bg-card:        #f4f1ed;
  --color-border:         rgba(0,0,0,0.10);
  --font-display:         'Playfair Display','Noto Serif TC',serif;
  --font-body:            'DM Sans','Noto Sans TC',sans-serif;
  --transition:           0.3s ease;
}
</style>

<style scoped>
.portfolio-root { opacity: 0; transition: opacity 0.6s ease; width: 100%; }
.portfolio-root.is-loaded { opacity: 1; }

/* ── Nav ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 64px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px;
  background: rgba(250,249,247,0.85); backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
}
.nav-logo { font-size: 12px; font-weight: 500; letter-spacing: 0.18em; }
.nav-links { display: flex; gap: 36px; }
.nav-links a { font-size: 11px; letter-spacing: 0.14em; color: var(--color-text-secondary); text-decoration: none; transition: color var(--transition); }
.nav-links a:hover { color: var(--color-accent); }
.nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
.nav-hamburger span { display: block; width: 22px; height: 1px; background: var(--color-text-primary); }

.mobile-menu {
  display: none; position: fixed; top: 64px; left: 0; right: 0;
  background: var(--color-bg); border-bottom: 1px solid var(--color-border);
  z-index: 190; flex-direction: column; padding: 24px 32px; gap: 20px;
  transform: translateY(-100%); transition: transform 0.3s ease;
}
.mobile-menu.is-open { transform: translateY(0); }
.mobile-menu a { font-size: 13px; letter-spacing: 0.14em; color: var(--color-text-primary); text-decoration: none; }

/* ── Hero ── */
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Spline 容器：絕對定位撐滿 */
.hero-spline {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 1;
  overflow: hidden;
}

/* iframe：置中 + scale 強制撐滿，解決 1024px 限制 */
.hero-spline iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  /* 寬高給大一點確保不留白，用 scale + translate 置中 */
  width: 100vw;
  height: 100vh;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%) scale(1.02);
  transform-origin: center center;
  border: none;
  display: block;
}

/* 載入遮罩 */
.hero-loading {
  position: absolute; inset: 0; z-index: 30;
  background: var(--color-bg);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 20px;
  transition: opacity 0.8s ease;
}
.hero-loading.is-hidden { opacity: 0; pointer-events: none; }
.loading-ring {
  width: 36px; height: 36px;
  border: 1px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-size: 10px; letter-spacing: 0.2em; color: var(--color-text-secondary); }

/* 文字 Overlay */
.hero-overlay {
  position: absolute; inset: 0; z-index: 20;
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 0 64px 72px;
  pointer-events: none;
}
.hero-text { pointer-events: auto; opacity: 0; transform: translateY(16px); transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s; }
.hero-text.is-visible { opacity: 1; transform: translateY(0); }
.hero-label { display: block; font-size: 10px; letter-spacing: 0.22em; color: var(--color-text-secondary); margin-bottom: 14px; }
.hero-title { font-family: var(--font-display); font-size: clamp(44px, 6vw, 80px); font-weight: 400; line-height: 1.08; color: var(--color-text-primary); margin-bottom: 18px; }
.hero-sub { font-size: 14px; font-weight: 300; color: var(--color-text-secondary); margin-bottom: 32px; }
.hero-cta { display: inline-block; font-size: 11px; letter-spacing: 0.16em; color: var(--color-text-primary); border-bottom: 1px solid var(--color-text-primary); padding-bottom: 4px; text-decoration: none; transition: color var(--transition), border-color var(--transition); }
.hero-cta:hover { color: var(--color-accent); border-color: var(--color-accent); }
.hero-hint { opacity: 0; transition: opacity 0.8s ease 0.6s; font-size: 10px; letter-spacing: 0.14em; color: var(--color-text-secondary); writing-mode: vertical-rl; pointer-events: none; }
.hero-hint.is-visible { opacity: 1; }
.hero-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 160px; z-index: 15; background: linear-gradient(to bottom, transparent, var(--color-bg)); pointer-events: none; }

/* ── Section 通用 ── */
.section { padding: 120px 0; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 64px; }
.section-header { display: flex; align-items: baseline; gap: 24px; padding-bottom: 40px; border-bottom: 1px solid var(--color-border); margin-bottom: 64px; }
.section-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-text-secondary); flex-shrink: 0; white-space: nowrap; }
.section-title { font-family: var(--font-display); font-size: clamp(28px,4vw,48px); font-weight: 400; }

/* ── Work Grid ── */
.work-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1px; background: var(--color-border); }
.work-card { background: var(--color-bg-card); cursor: pointer; overflow: hidden; animation: cardFadeIn 0.5s ease both; }
@keyframes cardFadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
.card-image { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.card-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; transition: transform 0.6s ease; }
.work-card:hover .card-placeholder { transform: scale(1.03); }
.card-placeholder-text { font-size: 64px; }
.card-tag { position:absolute; top:16px; right:16px; font-size:10px; letter-spacing:0.12em; color: var(--color-text-secondary); background:rgba(250,249,247,0.85); padding:4px 10px; border:1px solid var(--color-border); }
.card-info { display:flex; align-items:center; gap:16px; padding:20px 24px; border-top:1px solid var(--color-border); }
.card-index { font-size:10px; color: var(--color-text-secondary); letter-spacing:0.1em; flex-shrink:0; }
.card-meta { flex:1; }
.card-category { font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color: var(--color-accent); margin-bottom:4px; }
.card-title { font-size:17px; font-weight:500; line-height:1.3; }
.card-arrow { font-size:18px; color: var(--color-text-secondary); transition: transform var(--transition), color var(--transition); flex-shrink:0; }
.work-card:hover .card-arrow { transform: translateX(5px); color: var(--color-accent); }

/* ── About ── */
.section--about { background: var(--color-bg-card); }
.about-grid { display:grid; grid-template-columns:1fr 280px; gap:80px; align-items:start; }
.about-body { font-size:16px; line-height:1.8; margin-bottom:24px; }
.about-skills { display:flex; flex-wrap:wrap; gap:8px 20px; margin-top:32px; }
.skill-item { font-size:12px; letter-spacing:0.08em; color: var(--color-text-secondary); }
.skill-dot { color: var(--color-accent); margin-right:6px; }
.about-stats { display:flex; flex-direction:column; gap:32px; }
.stat-item { border-top:1px solid var(--color-border); padding-top:20px; }
.stat-number { display:block; font-family: var(--font-display); font-size:42px; font-weight:400; line-height:1; margin-bottom:8px; }
.stat-label { font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color: var(--color-text-secondary); }

/* ── Contact ── */
.section--contact { text-align:center; }
.contact-inner { max-width:600px; margin:0 auto; }
.contact-title { font-family: var(--font-display); font-size:clamp(36px,5vw,64px); font-weight:400; margin:16px 0 12px; }
.contact-sub { font-size:15px; color: var(--color-text-secondary); margin-bottom:40px; line-height:1.7; }
.btn-accent { display:inline-block; background: var(--color-accent); color:#fff; border:1px solid var(--color-accent); padding:14px 40px; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; font-family: var(--font-body); text-decoration:none; transition:opacity var(--transition); }
.btn-accent:hover { opacity:0.82; }

/* ── Footer ── */
.footer { height:72px; display:flex; align-items:center; justify-content:space-between; padding:0 64px; border-top:1px solid var(--color-border); }
.footer-copy { font-size:12px; color: var(--color-text-secondary); letter-spacing:0.06em; }
.footer-links { display:flex; gap:28px; }
.footer-links a { font-size:11px; letter-spacing:0.12em; color: var(--color-text-secondary); text-decoration:none; transition:color var(--transition); }
.footer-links a:hover { color: var(--color-accent); }

/* ── Modal ── */
.modal-backdrop { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; padding:32px; backdrop-filter:blur(4px); }
.modal-panel { background: var(--color-bg); width:100%; max-width:580px; border:1px solid var(--color-border); position:relative; overflow:hidden; }
.modal-close { position:absolute; top:16px; right:16px; background:none; border:none; font-size:14px; cursor:pointer; color: var(--color-text-secondary); z-index:10; transition:color var(--transition); }
.modal-close:hover { color: var(--color-accent); }
.modal-placeholder { width:100%; height:240px; display:flex; align-items:center; justify-content:center; }
.modal-emoji { font-size:80px; }
.modal-body { padding:32px; }
.modal-category { display:block; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color: var(--color-accent); margin-bottom:12px; }
.modal-title { font-family: var(--font-display); font-size:28px; font-weight:400; margin-bottom:16px; line-height:1.3; }
.modal-desc { font-size:15px; line-height:1.75; color: var(--color-text-secondary); margin-bottom:24px; }
.modal-tags { display:flex; flex-wrap:wrap; gap:8px; }
.modal-tag { font-size:10px; letter-spacing:0.1em; color: var(--color-text-secondary); border:1px solid var(--color-border); padding:5px 12px; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel { transition: transform 0.25s ease; }
.modal-enter-from .modal-panel { transform: translateY(20px); }
.modal-leave-to .modal-panel { transform: translateY(10px); }

/* ── 響應式 768px ── */
@media (max-width: 768px) {
  .nav { padding: 0 24px; }
  .nav-links { display: none; }
  .nav-hamburger { display: flex; }
  .mobile-menu { display: flex; }
  .hero-overlay { padding: 0 32px 56px; }
  .hero-hint { display: none; }
  .container { padding: 0 32px; }
  .section { padding: 80px 0; }
  .work-grid { grid-template-columns: 1fr; }
  .about-grid { grid-template-columns: 1fr; }
  .about-stats { flex-direction:row; flex-wrap:wrap; margin-top:32px; }
  .stat-item { flex:1; min-width:100px; }
  .footer { padding: 0 32px; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 40px; }
  .section-header { flex-direction: column; gap: 8px; }
  .modal-backdrop { padding:16px; align-items:flex-end; }
  .modal-panel { max-height:90vh; overflow-y:auto; }
  .footer { flex-direction:column; height:auto; gap:12px; padding:20px 24px; }
}
</style>