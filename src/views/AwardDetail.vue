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
        title: '嘖嘖募資上架成功',
        category: 'COMPETITION',
        year: '2022-2023',
        emoji: '🏆',
        color: '#e8ddd4',
        coverImage: '/3D_SP/img/110651095.jpg',
        tagline: '經過長達一年多的調研與競賽，將產品順利產出並成功上架平台。',
        tags: ['最小可行性市場驗證', '群眾募資'],
        infoBlocks: [
            { label: 'ROLE', value: '產品PM、主視覺' },
            { label: 'TEAM', value: '2 人團隊' },
            { label: 'DURATION', value: '2022/6-2023/2' },
            { label: 'AWARD', value: '群眾募資成功🏆' },
            { label: 'TOOLS', value: 'Adobe Illustrator、3D Mockup模擬、Photoshop' },
        ],
        overview: ['保健類飲品計畫達成募資目標 488%，透過大專院校徵件審核順利上架嘖嘖平台！', '2 人工作室獨立執行完整流程：市場調查 → MVP 測試 → 廠商接洽（5+ 家）→ 品牌設計 → 上線', '自學 Adobe Illustrator 完成品牌視覺設計，製作形象影片、募資Landing Page'],
        photos: [
            { src: '/3D_SP/img/p1.jpg', color: '#e8ddd4', caption: '拍攝商業影片與導演檢查畫面', span: 1 },
            { src: '/3D_SP/img/p2.jpg', color: '#e8ddd4', caption: '錄音室調音與製作', span: 1 },
            { src: '/3D_SP/img/p3.jpg', color: '#e8ddd4', caption: '自學 Adobe Illustrator並製作募資長頁，圖片為前期版面', span: 1 },
            { src: '/3D_SP/img/p4.jpg', color: '#e8ddd4', caption: '與食品工廠業務洽談產品', span: 1 },
        ],
        timeline: [
            { date: '2023.03', title: '募資完成', description: '資金完成結算並撥款', image: '' },
            { date: '2023.02', title: '募資結束', description: '募資專案關閉，金流進入結算階段', image: '' },
            { date: '2023.01', title: '產品寄出、顧客收貨', description: '回覆顧客訊息與結束線上募資、工作室端開始發貨', image: '' },
            { date: '2022.12', title: '線下行銷', description: '參與市集', image: '' },
            { date: '2022.11', title: '線上募資開始', description: '資料上稿，串接專案帳戶與完成金流綁定，同時成立粉專', image: '' },
            { date: '2022.10', title: '商業影音素材拍攝與上稿', description: '拍攝商業影片與剪輯、照片精修、募資型Landing page，並與業師確認文案，根據問卷回饋並做出調整', image: '' },
            { date: '2022.09', title: '市集銷貨', description: '參與不同地區的市集與活動，並向顧客發放問卷，共計發出100份有效問卷', image: '' },
            { date: '2022.09', title: '產品到貨', description: '產品(含印刷明信片與包裝紙盒、食品)到貨、檢驗與包裝', image: '' },
            { date: '2022.08', title: '產品下訂', description: '經過多方篩選後，與廠商簽約合作(包裝、食品廠、印刷廠、個人攝影工作室等)，討論產品與作品細節，完成下訂與訂金支付', image: '' },
            { date: '競賽初期-2022.08', title: '競賽與市場調研階段', description: '參與超過15場次的競賽，取得合計超過10萬元的資金，並入選【國立雲林科技大學START UP創新補件計畫】實踐組，以團隊工作室開啟募資之旅', image: '' },
        ],
        reflections: [
            { heading: '🔍 收穫', body: '在經過長達一年的調研、競賽與業師輔導，在了解募資背後的運作後，產品終於上線，除了成就感之外，過程中也透過訪談，採集各行各業的知識與專業，是非常充實的一年。' },
            { heading: '⚡ 挑戰', body: '因為團隊成員各自的職涯規劃不同，在協調時間與資源上遇到困難，經過多次溝通後，妥善分配與協調、互相幫補，順利完成專案項目。' },
            // { heading: '🌱 未來', body: '填入內容' },
        ],
    },
    2: {
        title: '中草藥在地循環計劃',
        category: 'COMPETITION',
        year: '2022',
        emoji: '🌿',
        color: '#d4e8d8',
        coverImage: '/3D_SP/img/umus2.jpg',
        tagline: '以循環設計思維重新詮釋中草藥的在地價值，連結種植者、消費者與地方文化，並以服務設計方法提出解決方案。',
        tags: ['循環設計', 'UX Research', '地方創生', 'Presentation', '永續議題'],
        infoBlocks: [
            { label: 'ROLE', value: '產品PM、簡報與產品主視覺' },
            { label: 'TEAM', value: '2 人團隊' },
            { label: 'DURATION', value: '2022.1 – 2022.10' },
            { label: 'AWARD', value: '戰國策創新競賽、各大校園創意競賽、縣市政府主辦賽事' },
            { label: 'TOOLS', value: 'Canva, Adobe Illustrator, Notion' },
        ],
        overview: [
            '參與 15+ 場創新創意競賽，獲金銀銅獎共 3 座，累計獎金超過100,000 元！',
            '競賽涵蓋全國性競賽、大專院校競賽、縣市政府主辦賽事，並取得亞洲廣東眾創盃複賽資格',
            '負責提案策略規劃、簡報設計與現場口頭報告，以 2 人核心團隊屢獲評審肯定',
        ],
        photos: [
            { src: '/3D_SP/img/r2.jpg', color: '#d4e8d8', caption: '尤努斯創新獎頒獎典禮，獲得【佳作獎】', span: 1 },
            { src: '/3D_SP/img/r1.png', color: '#e8ddd4', caption: '疫情期間，線上參與業師輔導', span: 1 },
            { src: '/3D_SP/img/r3.jpg', color: '#d4d8e8', caption: '至花蓮縣政府參與創新競賽，獲得【銀獎】', span: 1 },
            { src: '/3D_SP/img/r4.jpg', color: '#d4d8e8', caption: '戰國策創新競賽，獲得【佳作】', span: 1 },
            { src: '/3D_SP/img/r5.jpg', color: '#d4d8e8', caption: '準備競賽期間，幾乎三天打開一次簡報軟體，不斷調整簡報內容與講稿', span: 1 },
            { src: '/3D_SP/img/r6.jpg', color: '#d4d8e8', caption: '疫情期間參與線上競賽', span: 1 },
        ],
        timeline: [
            { date: '2022.8.27', title: 'HSH花蓮縣創新創業競賽指定題組【銀獎】', description: '將台灣花東中草藥市場納入循環範圍，並以「中草藥在地循環」為研究主軸。', image: '' },
            { date: '2022.6.27', title: '國立雲林科技大學START UP創新補件計畫【實踐組】入選', description: '由於上課地點在雲科大校本部，入選後往返台中與雲林，開啟長達半年的募資之旅', image: '' },
            { date: '2022.6.16', title: '中國醫大創意創新創生競賽-永續智慧創新組【冠軍】', description: '以校外生的身分參與競賽', image: '' },
            { date: '2022.6.10', title: '全國SDGs創新創意競賽-創新產品組【季軍】', description: '完成競賽簡報，獲得評審肯定。', image: '' },
            { date: '2022.6.09', title: '第十七屆戰國全國創新創業競賽-創新服務組【佳作】', description: '前往花蓮，參與為期兩天的競賽', image: '' },
            { date: '2022.5.28', title: 'NTUE校園創業競賽【潛力獎】', description: '因應疫情，參與線上競賽，獲得評審的初步肯定，也為後續比賽建立良好的回饋基礎', image: '' },
        ],
        reflections: [
            { heading: '🔍 最大的收穫', body: '起初的參與動機很單純，就只是想趁大四下最後的時光好好探索自己有興趣的提案企劃、專案管理，於是在核心團隊僅有兩人的情況下，半年內共報名了16個競賽(邊參加邊環島(❁´◡`❁)，也在調研的過程當中更加認識台中中草藥街的在地商圈與困境。' },
            { heading: '⚡ 最難克服的挑戰', body: '最困難的是建立合適的受眾模型，因為主題是中草藥保健，本身沒有太多喝中藥的習慣，因此只能不斷在提案與撰寫的過程中收集並彙整資訊，意見相左這件事更是家常便飯，不過，還好我跟成員都樂於在溝通過程中激發創意火花、執行的成就感，並享受競賽時與不同評審間的思考問答。' },
            // { heading: '🌱 未來想延伸的方向', body: '希望與在地組織合作進行 Pilot Test。' },
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
            // { heading: '🌱 未來', body: '填入內容' },
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
    grid-template-columns: repeat(2, 1fr);
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