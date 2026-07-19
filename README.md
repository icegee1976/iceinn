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

## 新增照片流程

照片清單是資料與檔案共同維護的管線，不能只把圖片丟進 `public/assets/images/`。`prepare-assets` 會依 `migration-source.json` 的陣列順序產生檔名，而畫面則依 `app/data/portfolio.ts` 的 `id` 取檔；兩邊順序與 stem 必須完全一致。

1. **備妥原圖 URL。** 使用可公開存取、不需登入、沒有短效簽章的 HTTPS 原圖網址，並先在無痕視窗確認能直接載入。來源應是原始尺寸，不要使用縮圖 URL。
2. **選定分類與位置。** 可加入 `home`，或 `people`、`event`、`fashion`、`product`、`space` 其中之一。原則上永遠追加在該陣列尾端，讓既有編號與資產保持穩定。
3. **同步兩份清單。** 把 URL 加入 `migration-source.json` 對應陣列；同時在 `app/data/portfolio.ts` 的 `homeImages` 或分類 `images` 加入 `{ id, width, height, alt }`。`id` 必須等於該 URL 依順序產生的 stem，例如分類第 7 張是 `people-07`；`alt` 要具體描述照片內容，不要只寫「作品照」。
4. **更新數量閘門。** 調整 `expectedCounts` 的分類數量，以及 `assertPortfolioManifest()` 內的總作品數與錯誤訊息。測試中目前也固定檢查分類數量與 derivative 總數，新增照片時要一併更新預期值。
5. **產生本地資產。** 執行：

```bash
npm run prepare:assets
```

腳本會重新讀取全部 URL、把原圖下載到系統暫存目錄，依 EXIF 方向轉正，並在 `public/assets/images/` 為每張作品輸出四個 derivative：`<id>-960.webp`、`<id>-960.jpg`、`<id>-1800.webp`、`<id>-1800.jpg`。它不會把原始大圖加入正式網站，也不會把小原圖放大；檔名仍保留目標寬度後綴。

6. **核對輸出。** 確認新增 stem 的四個檔案都存在，並查看 `public/assets/images/asset-dimensions.json` 的原圖 `width`／`height` 是否與 `portfolio.ts` 相符。特別確認 URL 陣列順序、資料 `id` 與實際檔名是一對一對應。
7. **跑完整驗證。** 執行：

```bash
npm run typecheck
npm run lint
npm test
npm run build:pages
npm run test:pages
git diff --check
```

8. **做瀏覽器驗收。** 本機預覽首頁、所屬分類、分類 hover/focus preview 與燈箱；確認縮圖和大圖都是新照片、`alt` 仍保留給圖片與對話框的可存取語意。至少重測桌面與手機，檢查構圖、比例、單欄、水平 overflow、鍵盤焦點、Esc 與前後張切換。
9. **走 branch／PR／正式部署。** 在功能分支 commit 前逐項確認包含：更新後的 `migration-source.json`、`app/data/portfolio.ts`、tests 內對應的分類／總數／derivative 預期值、`public/assets/images/asset-dimensions.json`，以及每張新增照片的四個 derivative。開 PR 等待 CI 品質檢查；review 通過並合併到 `main` 後，由 Cloudflare Git 整合部署。最後在 <https://iceinn.agneng.workers.dev> 驗收新照片與正確版本。

若一定要把照片插入陣列中間，`prepare-assets` 會讓該位置之後的 URL 全部重新編號；必須同步重編後續 `portfolio.ts` id、重新產生資產，並清理不再對應的舊檔。除非確實要改變作品順序，請一律在尾端追加。

## 路由與部署

Cloudflare Workers 正式站使用可索引的真實路徑：`/people`、`/event`、`/fashion`、`/product`、`/space`、`/video`、`/about`。每條路由的第一個 HTML response 已包含該頁 H1、作品內容、獨立 title、description、canonical 與 Open Graph URL；共用設定集中在 `seo.config.mjs`。

`build:pages` 靜態相容產物仍採 hash route（例如 `#/people`）。`PortfolioSite` 依入口切換 path/hash 模式，`public/404.html` 則把 `/iceinn/people` 形式的靜態主機直接網址導向 `#/people`。靜態入口使用首頁 canonical，不列入正式 Workers 的逐頁索引策略。

正式環境部署至 Cloudflare Workers：<https://iceinn.agneng.workers.dev>。

- 推送 `main` 後，由 Cloudflare 的 Git 整合建置並發佈正式版本。
- Repository 不含 GitHub Actions 部署 workflow，但保留 CI 品質檢查；GitHub 不會執行發佈工作。
- `build:pages` 與 `test:pages` 僅保留作為平台中立的靜態產物驗證，不會觸發任何部署。

本專案保留 `.openai/hosting.json`、Sites Vite plugin 與 Cloudflare Worker-compatible vinext build；正式發佈以 Cloudflare Workers 為準。

## 舊站 SEO 搬遷 Runbook

> 尚未執行：舊站是位於 `https://icegee.wixsite.com/iceinn` 路徑下的免費 Wix 網站。以下是受平台限制的遷移計畫，不代表 canonical、下架或 Search Console 工作已完成。逐頁對照見 `migration-url-map.json`。

1. 舊 sitemap 的九條 URL 已逐項記錄在 `migration-url-map.json`：一般內容一對一映射；實查為 Wix placeholder 的 `/photo-albums` 映射首頁；實際標題與內容為活動的 `/copy-of-people` 映射 `/event`。這份 map 是遷移計畫，不是 redirect 設定。
2. 另盤點每頁內嵌的 image、video、JavaScript、CSS 舊資產 URL。攝影作品與有外連的圖片要逐張對應新圖片 URL 或實際分類頁，不能全數指向首頁；video／JS／CSS 也要記錄新資產、保留方式或確定下架後的處置。
3. Wix 官方限制免費 `wixsite.com` URL 使用 URL Redirect Manager 建立 `301`，因此本次不能宣稱已做或可做伺服器端永久 redirect，也不以 client-side redirect 冒充。現階段在舊 Wix 後台為九個頁面逐頁設定指向 map 中新 URL 的 **external canonical**，作為受限環境可用的主要遷移訊號。
4. 設定後逐頁檢視舊站輸出的 `<link rel="canonical">`，確認絕對 HTTPS 目的地與 map 完全一致；同時抽查新頁的 200、SSR H1、canonical、Open Graph、robots 與 sitemap，並用瀏覽器 Network 確認新站不再請求舊 image／video／JS／CSS。
5. 不要在送出 external canonical 的同時對舊頁加 `noindex`，以免搜尋引擎尚未完成訊號轉移就停止抓取。持續用 URL Inspection 與索引報告觀察；等各新頁已穩定收錄、canonical 判定一致後，才評估舊頁下架或 `noindex`。
6. 舊站 Search Console property 的 site location 含 `/iceinn` 路徑，不符合 Google **Change of Address** 工具條件；本次不可執行或宣稱已執行 Change of Address。只需驗證可用 property、觀察舊新 URL 的索引狀態，並在新站 property 提交 <https://iceinn.agneng.workers.dev/sitemap.xml> 與 <https://iceinn.agneng.workers.dev/image-sitemap.xml>。
7. image sitemap 由 `public/assets/images/*-1800.jpg` 在 build 前自動產生，home 圖片掛首頁，其餘圖片依 people、event、fashion、product、space 掛到實際分類 landing page。上線後持續監看重複 canonical、404、圖片索引與搜尋流量；任何後續 noindex／下架時間都要留下紀錄，不可先寫成已完成。

## 內容完整性

移植總數固定為 32 張：Home 5、People 6、Event 6、Fashion 3、Product 8、Space 4。正式頁面只使用 `public/assets/` 的本地檔案，不 hotlink Wix。影片使用隱私友善的 YouTube thumbnail facade，點擊後才載入 `youtube-nocookie.com` 播放器。
