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

作品分類採 hash route（例如 `#/people`），因此靜態部署重新整理可直接恢復頁面，且不需要為每個分類設定伺服器 rewrite。`public/404.html` 保留將 `/iceinn/people` 形式的直接網址導向 `#/people`，供靜態主機相容性驗證使用。

切換分類時，網站會同步更新瀏覽器標題與 description；但 hash route 的 SEO 仍有平台限制：不執行 JavaScript 的搜尋爬蟲只會讀到首頁 metadata，因此 canonical 與 sitemap 以作品集首頁為唯一索引入口。

正式環境部署至 Cloudflare Workers：<https://iceinn.agneng.workers.dev>。

- 推送 `main` 後，由 Cloudflare 的 Git 整合建置並發佈正式版本。
- Repository 不含 GitHub Actions 部署 workflow，但保留 CI 品質檢查；GitHub 不會執行發佈工作。
- `build:pages` 與 `test:pages` 僅保留作為平台中立的靜態產物驗證，不會觸發任何部署。

本專案保留 `.openai/hosting.json`、Sites Vite plugin 與 Cloudflare Worker-compatible vinext build；正式發佈以 Cloudflare Workers 為準。

## 內容完整性

移植總數固定為 32 張：Home 5、People 6、Event 6、Fashion 3、Product 8、Space 4。正式頁面只使用 `public/assets/` 的本地檔案，不 hotlink Wix。影片使用隱私友善的 YouTube thumbnail facade，點擊後才載入 `youtube-nocookie.com` 播放器。
