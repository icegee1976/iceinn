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
npm run test:pages
```

- `npm run build`：建立 vinext / Cloudflare Workers 正式版本。
- `npm run build:pages`：建立 `dist-pages/` 平台中立靜態產物，用於驗證靜態部署相容性。
- `npm run test:pages`：驗證靜態產物的 base path、hash route recovery 與本地圖片資產。
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

作品分類採 hash route（例如 `#/people`），因此靜態部署重新整理可直接恢復頁面，且不需要為每個分類設定伺服器 rewrite。`public/404.html` 保留將 `/iceinn/people` 形式的直接網址導向 `#/people`，供靜態主機相容性驗證使用。

切換分類時，網站會同步更新瀏覽器標題與 description；但 hash route 的 SEO 仍有平台限制：不執行 JavaScript 的搜尋爬蟲只會讀到首頁 metadata，因此 canonical 與 sitemap 以作品集首頁為唯一索引入口。

正式環境部署至 Cloudflare Workers：<https://iceinn.agneng.workers.dev>。

- 推送 `main` 後，由 Cloudflare 的 Git 整合建置並發佈正式版本。
- Repository 不含 GitHub Actions 部署 workflow，但保留 CI 品質檢查；GitHub 不會執行發佈工作。
- `build:pages` 與 `test:pages` 僅保留作為平台中立的靜態產物驗證，不會觸發任何部署。

本專案保留 `.openai/hosting.json`、Sites Vite plugin 與 Cloudflare Worker-compatible vinext build；正式發佈以 Cloudflare Workers 為準。

## 內容完整性

移植總數固定為 32 張：Home 5、People 6、Event 6、Fashion 3、Product 8、Space 4。正式頁面只使用 `public/assets/` 的本地檔案，不 hotlink Wix。影片使用隱私友善的 YouTube thumbnail facade，點擊後才載入 `youtube-nocookie.com` 播放器。
