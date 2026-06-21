<template>
    <div class="award-detail" :class="{ 'is-loaded': pageLoaded }">

        <!-- ── Nav ── -->
        <nav class="nav">
            <button class="nav-back" @click="goBack">← BACK</button>
            <span class="nav-logo">SKY</span>
            <span class="nav-spacer"></span>
        </nav>

        <!-- ── Hero Cover ── -->
        <section class="detail-hero">
            <div class="hero-cover">
                <img v-if="award.coverImage" :src="award.coverImage" :alt="award.title" class="cover-img" />
                <div v-else class="cover-placeholder" :style="{ background: award.color }">
                    <span class="cover-emoji">{{ award.emoji }}</span>
                </div>
            </div>
            <div class="hero-meta">
                <div class="container">
                    <span class="meta-label">{{ award.category }} · {{ award.year }}</span>
                    <h1 class="hero-title">{{ award.title }}</h1>
                    <p class="hero-tagline">{{ award.tagline }}</p>
                    <div class="hero-tags">
                        <span v-for="tag in award.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── Overview ── -->
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <span class="section-label">OVERVIEW</span>
                    <h2 class="section-title">背景說明</h2>
                </div>
                <div class="overview-grid">
                    <!-- 左：主要描述 -->
                    <div class="overview-body">
                        <!-- ★ 可自行編輯：每個 <p> 是一段內文 -->
                        <p v-for="(para, i) in award.overview" :key="i" class="body-text">{{ para }}</p>
                    </div>
                    <!-- 右：快速資訊欄 -->
                    <aside class="overview-aside">
                        <div class="info-block" v-for="info in award.infoBlocks" :key="info.label">
                            <span class="info-label">{{ info.label }}</span>
                            <span class="info-value">{{ info.value }}</span>
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        <!-- ── Photo Gallery ── -->
        <section class="section section--gallery">
            <div class="container">
                <div class="section-header">
                    <span class="section-label">GALLERY</span>
                    <h2 class="section-title">現場影像</h2>
                </div>
                <div class="gallery-grid">
                    <!-- ★ 可自行新增圖片：每個物件放 src + caption -->
                    <figure v-for="(photo, i) in award.photos" :key="i"
                        :class="['gallery-item', photo.span === 2 ? 'span-2' : '']" @click="openLightbox(i)">
                        <div class="gallery-img-wrap">
                            <img v-if="photo.src" :src="photo.src" :alt="photo.caption" class="gallery-img"
                                loading="lazy" />
                            <div v-else class="gallery-placeholder" :style="{ background: photo.color || '#e8ddd4' }">
                                <span>{{ photo.caption }}</span>
                            </div>
                        </div>
                        <figcaption v-if="photo.caption" class="gallery-caption">{{ photo.caption }}</figcaption>
                    </figure>
                </div>
            </div>
        </section>

        <!-- ── Timeline ── -->
        <section class="section section--timeline">
            <div class="container">
                <div class="section-header">
                    <span class="section-label">JOURNEY</span>
                    <h2 class="section-title">時間軸</h2>
                </div>
                <div class="timeline">
                    <div v-for="(event, i) in award.timeline" :key="i" class="timeline-item">
                        <div class="timeline-left">
                            <span class="timeline-date">{{ event.date }}</span>
                        </div>
                        <div class="timeline-connector">
                            <div class="timeline-dot"></div>
                            <div v-if="i < award.timeline.length - 1" class="timeline-line"></div>
                        </div>
                        <div class="timeline-right">
                            <h3 class="timeline-title">{{ event.title }}</h3>
                            <p class="timeline-desc">{{ event.description }}</p>
                            <!-- ★ 可選：附圖 -->
                            <img v-if="event.image" :src="event.image" :alt="event.title" class="timeline-img"
                                loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── Reflection ── -->
        <section class="section section--reflection">
            <div class="container">
                <div class="section-header">
                    <span class="section-label">REFLECTION</span>
                    <h2 class="section-title">心得回顧</h2>
                </div>
                <!-- ★ 可自行編輯：感想、學到的事、未來方向 -->
                <div class="reflection-grid">
                    <div v-for="card in award.reflections" :key="card.heading" class="reflection-card">
                        <span class="ref-heading">{{ card.heading }}</span>
                        <p class="ref-body">{{ card.body }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── Footer Nav ── -->
        <div class="detail-footer">
            <div class="container">
                <button class="btn-outline" @click="goBack">← 返回獎項列表</button>
            </div>
        </div>

        <!-- ── Lightbox ── -->
        <Transition name="fade">
            <div v-if="lightboxIndex !== null" class="lightbox" @click.self="closeLightbox">
                <button class="lb-close" @click="closeLightbox">✕</button>
                <button class="lb-prev" @click="prevPhoto" v-if="lightboxIndex > 0">‹</button>
                <div class="lb-img-wrap">
                    <img v-if="award.photos[lightboxIndex]?.src" :src="award.photos[lightboxIndex].src"
                        :alt="award.photos[lightboxIndex].caption" class="lb-img" />
                    <div v-else class="lb-placeholder"
                        :style="{ background: award.photos[lightboxIndex]?.color || '#e8ddd4' }">
                        <span>{{ award.photos[lightboxIndex]?.caption }}</span>
                    </div>
                    <p class="lb-caption">{{ award.photos[lightboxIndex]?.caption }}</p>
                </div>
                <button class="lb-next" @click="nextPhoto" v-if="lightboxIndex < award.photos.length - 1">›</button>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const pageLoaded = ref(false)
const lightboxIndex = ref(null)

onMounted(() => {
    setTimeout(() => { pageLoaded.value = true }, 80)
})

const goBack = () => router.push({ path: '/', hash: '#awards' })
const openLightbox = (i) => { lightboxIndex.value = i }
const closeLightbox = () => { lightboxIndex.value = null }
const prevPhoto = () => { if (lightboxIndex.value > 0) lightboxIndex.value-- }
const nextPhoto = () => { if (lightboxIndex.value < award.value.photos.length - 1) lightboxIndex.value++ }

// ★ 所有獎項的內頁資料都放在這裡
const allAwards = {

    1: {
        title: '嘖嘖募資',
        category: 'COMPETITION',
        year: '2025',
        emoji: '🏆',
        color: '#e8ddd4',
        coverImage: '',
        tagline: '這裡填入一句話簡介',
        tags: ['tag1', 'tag2'],
        infoBlocks: [
            { label: 'ROLE', value: '你的角色' },
            { label: 'TEAM', value: 'N 人團隊' },
            { label: 'DURATION', value: '時間區間' },
            { label: 'AWARD', value: '獎項名稱' },
            { label: 'TOOLS', value: '使用工具' },
        ],
        overview: ['背景說明第一段', '背景說明第二段'],
        photos: [
            { src: '', color: '#e8ddd4', caption: '照片說明', span: 2 },
        ],
        timeline: [
            { date: '2025.01', title: '開始', description: '說明', image: '' },
            { date: '2025.06', title: '完成', description: '說明', image: '' },
        ],
        reflections: [
            { heading: '🔍 收穫', body: '填入內容' },
            { heading: '⚡ 挑戰', body: '填入內容' },
            { heading: '🌱 未來', body: '填入內容' },
        ],
    },
    2: {
        title: '中草藥在地循環計劃',
        category: 'COMPETITION',
        year: '2021–2022',
        emoji: '🌿',
        color: '#d4e8d8',
        coverImage: '/3D_SP/img/umus2.jpg',
        tagline: '以循環設計思維重新詮釋中草藥的在地價值，連結種植者、消費者與地方文化。',
        tags: ['循環設計', 'UX Research', 'Figma', 'Presentation', '永續議題'],
        infoBlocks: [
            { label: 'ROLE', value: '主要設計師 · 簡報呈現' },
            { label: 'TEAM', value: '2 人團隊' },
            { label: 'DURATION', value: '2021.6 – 2022.03' },
            { label: 'AWARD', value: '★ 競賽名稱 · 獎項名稱' },
            { label: 'TOOLS', value: 'Canva, Canva, Miro' },
        ],
        overview: [
            '這個計劃源自於對台灣傳統中草藥產業的田野觀察。',
            '透過使用者訪談與文獻研究，團隊梳理出循環鏈斷點，並以服務設計方法提出解決方案。',
            '最終提案在競賽中獲得評審肯定。',
        ],
        photos: [
            { src: '', color: '#d4e8d8', caption: '參與中國醫藥大學創新創意工作坊', span: 2 },
            { src: '', color: '#e8ddd4', caption: '歷經大大小小競賽', span: 1 },
            { src: '', color: '#d4d8e8', caption: '與業師、夥伴討論', span: 1 },
        ],
        timeline: [
            { date: '2022.2', title: '順利拿到嘖嘖募資的團隊資金 · 組隊', description: '決定以「中草藥在地循環」為研究主軸。', image: '' },
            { date: '2021.11', title: '田野調查 · 使用者訪談', description: '前往苗栗、南投進行田野調查。', image: '' },
            { date: '2021.03', title: '競賽簡報 · 獲獎', description: '完成競賽簡報，獲得評審肯定。', image: '' },
            { date: '2021.03', title: '競賽簡報 · 獲獎', description: '完成競賽簡報，獲得評審肯定。', image: '' },
            { date: '2021.03', title: '競賽簡報 · 獲獎', description: '完成競賽簡報，獲得評審肯定。', image: '' },
        ],
        reflections: [
            { heading: '🔍 最大的收穫', body: '第一次將 UX 研究方法完整應用於社會議題。' },
            { heading: '⚡ 最難克服的挑戰', body: '如何清晰呈現循環鏈的系統性斷點。' },
            { heading: '🌱 未來想延伸的方向', body: '希望與在地組織合作進行 Pilot Test。' },
        ],
    },


    3: {
        title: '第三個獎項標題',
        category: 'COMPETITION',
        year: '2025',
        emoji: '🏆',
        color: '#d4d8e8',
        coverImage: '',
        tagline: '這裡填入一句話簡介',
        tags: ['tag1', 'tag2'],
        infoBlocks: [
            { label: 'ROLE', value: '你的角色' },
            { label: 'TEAM', value: 'N 人團隊' },
            { label: 'DURATION', value: '時間區間' },
            { label: 'AWARD', value: '獎項名稱' },
            { label: 'TOOLS', value: '使用工具' },
        ],
        overview: ['背景說明第一段', '背景說明第二段'],
        photos: [
            { src: '', color: '#d4d8e8', caption: '照片說明', span: 2 },
        ],
        timeline: [
            { date: '2025.01', title: '開始', description: '說明', image: '' },
            { date: '2025.06', title: '完成', description: '說明', image: '' },
        ],
        reflections: [
            { heading: '🔍 收穫', body: '填入內容' },
            { heading: '⚡ 挑戰', body: '填入內容' },
            { heading: '🌱 未來', body: '填入內容' },
        ],
    },
}

// ★ 根據網址的 id 自動選對應的獎項資料
const award = computed(() => allAwards[route.params.id] || allAwards[1])
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
/* ── Page Load ── */
.award-detail {
    opacity: 0;
    transition: opacity 0.5s ease;
    background: var(--color-bg);
    min-height: 100vh;
    font-family: var(--font-body);
}

.award-detail.is-loaded {
    opacity: 1;
}

/* ── Nav ── */
.nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    background: rgba(250, 249, 247, 0.9);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--color-border);
    z-index: 200;
}

.nav-back {
    font-size: 11px;
    letter-spacing: 0.14em;
    color: var(--color-text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    transition: color var(--transition);
    padding: 0;
}

.nav-back:hover {
    color: var(--color-accent);
}

.nav-logo {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.18em;
}

.nav-spacer {
    width: 60px;
}

/* ── Hero ── */
.detail-hero {
    padding-top: 64px;
}

.hero-cover {
    width: 100%;
    height: 60vh;
    overflow: hidden;
}

.cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cover-emoji {
    font-size: 100px;
}

.hero-meta {
    background: var(--color-bg);
    padding: 48px 0 0;
}

.meta-label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin-bottom: 16px;
}

.hero-title {
    font-family: var(--font-display);
    font-size: clamp(28px, 5vw, 56px);
    font-weight: 400;
    line-height: 1.2;
    margin-bottom: 16px;
    color: var(--color-text-primary);
}

.hero-tagline {
    font-size: 16px;
    line-height: 1.8;
    color: var(--color-text-secondary);
    max-width: 680px;
    margin-bottom: 24px;
}

.hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 48px;
    border-bottom: 1px solid var(--color-border);
}

.tag {
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
    padding: 4px 12px;
}

/* ── Common Section ── */
.section {
    padding: 80px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 64px;
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    padding-bottom: 40px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 48px;
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
    font-size: clamp(24px, 3.5vw, 40px);
    font-weight: 400;
}

/* ── Overview ── */
.overview-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 80px;
    align-items: start;
}

.body-text {
    font-size: 16px;
    line-height: 1.85;
    color: var(--color-text-primary);
    margin-bottom: 24px;
}

.body-text:last-child {
    margin-bottom: 0;
}

.overview-aside {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid var(--color-border);
}

.info-block {
    padding: 16px 0;
    border-bottom: 1px solid var(--color-border);
}

.info-label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin-bottom: 6px;
}

.info-value {
    font-size: 14px;
    color: var(--color-text-primary);
    line-height: 1.6;
}

/* ── Gallery ── */
.section--gallery {
    background: var(--color-bg-card);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.gallery-item {
    cursor: pointer;
    overflow: hidden;
    margin: 0;
}

.gallery-item.span-2 {
    grid-column: span 2;
}

.gallery-img-wrap {
    overflow: hidden;
    aspect-ratio: 16/9;
}

.gallery-item.span-2 .gallery-img-wrap {
    aspect-ratio: 21/9;
}

.gallery-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
}

.gallery-item:hover .gallery-img {
    transform: scale(1.03);
}

.gallery-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--color-text-secondary);
    letter-spacing: 0.06em;
    transition: transform 0.6s ease;
}

.gallery-item:hover .gallery-placeholder {
    transform: scale(1.03);
}

.gallery-caption {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--color-text-secondary);
    padding: 10px 0;
    line-height: 1.5;
}

/* ── Timeline ── */
.timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.timeline-item {
    display: grid;
    grid-template-columns: 120px 40px 1fr;
    gap: 0 0;
    min-height: 80px;
}

.timeline-left {
    padding-top: 2px;
    text-align: right;
    padding-right: 24px;
}

.timeline-date {
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--color-accent);
    font-weight: 500;
    white-space: nowrap;
}

.timeline-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.timeline-dot {
    width: 8px;
    height: 8px;
    border: 1px solid var(--color-accent);
    border-radius: 50%;
    background: var(--color-bg);
    flex-shrink: 0;
    margin-top: 4px;
    position: relative;
    z-index: 1;
}

.timeline-line {
    flex: 1;
    width: 1px;
    background: var(--color-border);
    margin-top: 4px;
    margin-bottom: 0;
}

.timeline-right {
    padding: 0 0 48px 24px;
}

.timeline-title {
    font-size: 17px;
    font-weight: 500;
    margin-bottom: 10px;
    line-height: 1.4;
    color: var(--color-text-primary);
}

.timeline-desc {
    font-size: 15px;
    line-height: 1.8;
    color: var(--color-text-secondary);
}

.timeline-img {
    margin-top: 20px;
    width: 100%;
    max-width: 480px;
    height: auto;
    object-fit: cover;
    border: 1px solid var(--color-border);
    display: block;
}

/* ── Reflection ── */
.section--reflection {
    background: var(--color-bg-card);
}

.reflection-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    border: 1px solid var(--color-border);
}

.reflection-card {
    background: var(--color-bg);
    padding: 36px 32px;
}

.ref-heading {
    display: block;
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--color-text-primary);
    line-height: 1.4;
}

.ref-body {
    font-size: 14px;
    line-height: 1.85;
    color: var(--color-text-secondary);
}

/* ── Footer Nav ── */
.detail-footer {
    padding: 48px 0 80px;
    border-top: 1px solid var(--color-border);
}

.btn-outline {
    background: transparent;
    border: 1px solid var(--color-text-primary);
    padding: 12px 32px;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-family: var(--font-body);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: border-color var(--transition), color var(--transition);
}

.btn-outline:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

/* ── Lightbox ── */
.lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.88);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
}

.lb-close {
    position: absolute;
    top: 24px;
    right: 32px;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 20px;
    cursor: pointer;
    transition: color var(--transition);
}

.lb-close:hover {
    color: #fff;
}

.lb-prev,
.lb-next {
    position: absolute;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 48px;
    cursor: pointer;
    transition: color var(--transition);
    padding: 0 16px;
    line-height: 1;
}

.lb-prev {
    left: 24px;
}

.lb-next {
    right: 24px;
}

.lb-prev:hover,
.lb-next:hover {
    color: #fff;
}

.lb-img-wrap {
    max-width: 880px;
    width: 100%;
    text-align: center;
}

.lb-img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    display: block;
    margin: 0 auto;
}

.lb-placeholder {
    width: 100%;
    height: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--color-text-secondary);
}

.lb-caption {
    margin-top: 16px;
    font-size: 12px;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.5);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* ── RWD ── */
@media (max-width: 768px) {
    .nav {
        padding: 0 24px;
    }

    .container {
        padding: 0 24px;
    }

    .overview-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .gallery-grid {
        grid-template-columns: 1fr;
    }

    .gallery-item.span-2 {
        grid-column: span 1;
    }

    .reflection-grid {
        grid-template-columns: 1fr;
    }

    .timeline-item {
        grid-template-columns: 80px 32px 1fr;
    }

    .detail-hero .hero-cover {
        height: 40vh;
    }

    .lightbox {
        padding: 24px;
    }
}

@media (max-width: 480px) {
    .timeline-left {
        display: none;
    }

    .timeline-item {
        grid-template-columns: 32px 1fr;
    }

    .timeline-date {
        font-size: 10px;
        display: block;
        margin-bottom: 6px;
        color: var(--color-accent);
    }
}
</style>