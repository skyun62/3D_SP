# ✦ Personal Portfolio — skyun62

> 🌿持續生長的個人作品集。  
>  UI/UX 設計、前端切版、自動部署，到 3D 模型與空間設計的邊界探索。

🔗 **Live Site** → [https://skyun62.github.io/3D_SP/](https://skyun62.github.io/3D_SP/)

---

## Overview

這不只是一個作品展示頁，而是我設計思維的延伸。  
每一個 Section 都對應著我在不同領域的實踐——從訪談、研究到雛形；從介面到空間，試圖讓「設計」這件事立體起來。

---

## Tech Stack

| 層面 | 技術 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 建構工具 | Vite |
| 3D 場景 | Spline |
| 設計工具 | Figma |
| 部署 | GitHub Actions → GitHub Pages |
| 字型 | Playfair Display · DM Sans · Noto Serif TC |

---

## Architecture

```
3D_SP/
├── public/
│   └── img/              # 作品封面圖
├── src/
│   ├── components/       # Vue 元件
│   ├── views/            # 頁面（Portfolio 主頁）
│   ├── assets/           # 靜態資源
│   └── main.js
├── .github/
│   └── workflows/
│       └── deploy.yml    # 自動部署設定
├── vite.config.js
└── README.md
```

---

## Features

- **Hero 3D Scene** — Spline 互動場景嵌入，支援拖曳探索
- **Work Grid** — 作品卡片展示，點擊開啟 Modal 內頁
- **Modal 內頁** — 作品描述、標籤、外部連結
- **RWD** — 響應式設計，支援手機與桌面
- **CI/CD** — push to `main` 自動觸發建構與部署

---

## Works Included

| 作品 | 類型 |
|------|------|
| Momento 郵寄遊記 | Interaction Design · Spline · Vue 3 |
| CloudBOX 雲端的潘朵拉 | UI/UX Design · Figma · Vue 3 |
| 衛福部採購稽核系統 | 0→∞ Product Design · Design System |
| 洲際棒球場網頁改版 | UI/UX Design · Data Viz |

---

## Deployment

每次 push 到 `main` 分支，GitHub Actions 會自動執行：

```
npm install → npm run build → 部署至 gh-pages 分支
```

手動部署：
```bash
npm run build
```

---

## Local Dev

```bash
git clone https://github.com/skyun62/3D_SP.git
cd 3D_SP
npm install
npm run dev
```

---

<p align="center">
  Designed & Built by <strong>skyun62</strong> · 持續更新中
</p>