# ICEINN 愛似影攝影

ICEINN Photography 的全新作品網站。本站由舊 Wix 網站移植，保留黑白極簡、雙語字距與右側抽屜導覽，並重做為快速、響應式、具鍵盤操作與無障礙燈箱的資料驅動作品集。

## 本地開發

需要 Node.js 22.13 以上版本。

```bash
npm ci
npm run dev
```

正式驗證：

```bash
npm run typecheck
npm run lint
npm test
npm run build:pages
```

- `npm run build`：建立 vinext / Cloudflare Sites 版本。
- `npm run build:pages`：建立 `dist-pages/` GitHub Pages 靜態版本。
- `npm test`：建置並驗證作品數、About 記錄、本地資產與正式 metadata。

## 更新內容

- 作品分類、中文替代文字與排序：`app/data/portfolio.ts`
- About 獲獎、展覽、攝影集：`app/data/portfolio.ts`
- 版面與互動：`app/components/`
- 視覺 tokens、排版與響應式規則：`app/globals.css`
- 移植來源稽核：`migration-source.json`

若更換或新增舊站來源圖，先更新 `migration-source.json` 與 typed manifest，再執行：

```bash
npm run prepare:assets
```

腳本會把原圖下載到系統暫存目錄，輸出 960 / 1800 像素的 WebP 與 progressive JPEG 到 `public/assets/images/`，不會把原始大圖加入正式網站。請同步更新每張作品的 `width`、`height` 與具體 `alt`，並調整 `expectedCounts`。

## 路由與部署

作品分類採 hash route（例如 `#/people`），因此 GitHub Pages 重新整理可直接恢復頁面，且不需要伺服器 rewrite。`public/404.html` 會把 `/iceinn/people` 形式的直接網址導向 `#/people`。

切換分類時，網站會同步更新瀏覽器標題與 description；但 hash route 的 SEO 仍有平台限制：不執行 JavaScript 的搜尋爬蟲只會讀到首頁 metadata，因此 canonical 與 sitemap 以作品集首頁為唯一索引入口。

`.github/workflows/deploy-pages.yml` 已設定自動部署：

1. 到 GitHub repository 的 **Settings → Pages**。
2. 將 **Build and deployment / Source** 設為 **GitHub Actions**。
3. 推送 `main` 後，workflow 會 typecheck、建立靜態版本並部署至 `https://icegee1976.github.io/iceinn/`。

本專案同時保留 `.openai/hosting.json`、Sites Vite plugin 與 Cloudflare Worker-compatible vinext build，可另外透過 OpenAI Sites 發佈。

## 內容完整性

移植總數固定為 32 張：Home 5、People 6、Event 6、Fashion 3、Product 8、Space 4。正式頁面只使用 `public/assets/` 的本地檔案，不 hotlink Wix。影片使用隱私友善的 YouTube thumbnail facade，點擊後才載入 `youtube-nocookie.com` 播放器。
