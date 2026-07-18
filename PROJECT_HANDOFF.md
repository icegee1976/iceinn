# ICEINN 攝影作品集網站交接文件

> 更新日期：2026-07-19（Asia/Taipei）  
> Repository：<https://github.com/icegee1976/iceinn>  
> 線上環境：<https://iceinn.agneng.workers.dev>  
> 本文件目的：讓下一位 Codex 不需重讀對話，即可直接完成視覺 QA、review、GitHub 整合與 Cloudflare 上線驗證。

## 1. 任務目標與使用者最新要求

使用者希望把 ICEINN 攝影作品集做成兼具原站精神、當代技術、精品質感與快速瀏覽體驗的網站。本輪最新四項要求如下：

1. 修正首頁 Hero 文字仍然擠在一起的問題，尤其是短而寬的 `824 × 350` viewport：英文 eyebrow、巨大「愛似影」與下方中文引言都必須有清楚呼吸空間，不可互相碰撞、裁切或溢位。
2. 修正所有作品分類頁大標題中英文距離過遠的問題，例如「人物」與 `People` 不應分居畫面左右兩端；所有分類頁都要採緊密、自然、可換行的雙語 lockup。
3. 全面移除沒有資訊價值的頁碼／張數小字，例如 `PAGE 01 / 05 | 6 PHOTOGRAPHS`。分類頁上方原有的 `Portfolio · 01` eyebrow 是分類識別的一部分，目前保留。
4. 深入參考全球優秀攝影師作品集的設計語彙，替網站加入真正適合 ICEINN 的驚豔元素；不能犧牲照片主體、載入速度、行動裝置體驗、鍵盤操作或 reduced-motion 支援。

## 2. 已採用的設計概念：Living Contact Sheet／流動接觸印樣

本輪已把設計方向定為 **Living Contact Sheet／流動接觸印樣**：不是堆疊裝飾，而是讓網站像一張會呼吸、會回應觀看者的攝影接觸印樣。

核心原則：

- **照片優先**：介面退後，不用冗長文案與無意義 metadata 搶走視線。
- **編輯式節奏**：作品格線不再機械地永遠兩欄；改用全寬主視覺、雙幅並置、置中留白畫面交替，形成像攝影書／雜誌的閱讀節奏。
- **互動式分類索引**：桌面版游標或鍵盤焦點移到作品分類時，在右側即時顯示該分類第一張照片；未選擇時呈現低調的 `ICEINN / Living contact sheet` 識別。
- **精品動態**：頁面進場與預覽切換只有輕微透明度、位移與縮放，不做搶戲的動畫；系統偏好 reduced motion 時由既有規則停用。
- **雙語字體成為一個標題**：中文與英文使用緊密 flex lockup，保持語意關係；空間不足時自然換行，不再被 grid 強行推到兩端。
- **行動裝置單欄**：桌面互動預覽在 `≤900px` 或無 hover 裝置隱藏；作品在 `≤760px` 回到清楚、穩定的單欄閱讀。

## 3. 研究參考與取用的設計原則

下列網站是本輪研究參考，不是照抄版型；實作只提取與 ICEINN 相容的共同原則：照片主導、低介面噪音、系列式瀏覽、編輯節奏、細緻但克制的互動。

- Elizaveta Porodina：<https://porodina.com/>  
  參考大型影像區塊、Swiss／editorial 編排、極少文字與雙欄節奏。
- Nadav Kander：<https://www.nadavkander.com/>  
  參考以系列／專案為核心的作品導航與清楚分類結構。
- Tyler Mitchell：<https://www.tylermitchell.co/>  
  參考影像密度、畫面流動感，以及讓照片本身建立敘事節奏。
- DesignRush 攝影作品集 roundup：<https://www.designrush.com/best-designs/websites/trends/best-photography-portfolio-websites>  
  參考當代攝影作品集常見的極簡導航、全幅影像、hover 回饋與精品色彩。
- Wix 對 Max Montgomery 網站的設計分析：<https://www.wix.com/explore/websites/site/max-montgomery>  
  參考 dark editorial、full-bleed 首圖、type-led navigation 與「介面消失、影像留下」的方向。

## 4. 目前已修改的功能檔案

本輪功能修改共 3 個檔案，並與本交接文件一起提交：

### `app/components/PortfolioSite.tsx`

- 引入 `CategoryKey` 型別與既有 `ResponsiveImage`，沒有新增第三方依賴。
- `HomePage` 新增 `previewCategory` state。
- 首頁作品分類由單純 `<nav>` 升級為 `.category-explorer`：
  - 左欄保留分類索引。
  - 桌面右欄新增 sticky `.category-preview`。
  - 分類連結同時支援 `mouse enter/leave` 與 `focus/blur`，鍵盤使用者也能觸發預覽。
  - 僅在實際 hover／focus 時掛載該分類第一張 `ResponsiveImage`，避免一開始 eager 載入五張大型圖片。
  - 預覽標示為 `aria-hidden="true"`，因為它是裝飾性視覺回饋；連結本身仍保有可存取名稱。
- 完整刪除分類頁 `.page-meta` DOM，因此不再輸出 `Page 01 / 05` 與 `6 photographs`。
- `Portfolio · 01` eyebrow 仍保留，`pageNumber` 也仍被該 eyebrow 使用。

### `app/components/Gallery.tsx`

- 每個 `<figure>` 新增 `data-orientation="landscape|portrait"`。
- CSS 可依作品方向決定全幅照片的最大寬度，避免直幅圖被無限制放大，同時保持原始 aspect ratio。
- 既有 `ResponsiveImage`、lazy/eager 策略、lightbox 按鈕語意與圖片資料流均未被替換。

### `app/globals.css`

- **首頁 Hero 排版**：
  - `.hero-copy` 新增明確 gap。
  - Hero `h1` 移除會造成擁擠的 margin，縮小最大字級，放寬 line-height 與 letter-spacing。
  - Hero 引言移除額外 margin，增加 line-height。
  - scroll cue 上方距離縮短，避免在短 viewport 把整組文字往上擠。
  - `≤900px` 與 `≤760px` 分別加入更穩定的字級、寬度、padding 與行高設定。
- **雙語分類標題**：
  - `.page-heading h1` 由兩欄 grid 改成可換行 flex。
  - 中文與英文改為緊密的橫向 gap，英文可縮排／換行，不再被推至畫面另一端。
  - 同步調整桌面與手機字級、line-height、頁首高度與 padding。
- **移除 metadata**：刪除所有 `.page-meta` CSS，包括手機版 override。
- **互動式分類索引**：
  - 新增 `.category-explorer` 兩欄 layout。
  - 新增 sticky preview、idle state、圖片覆蓋與英文標籤樣式。
  - 在 `≤900px` 或 `hover: none` 裝置改回單欄並隱藏預覽。
- **編輯式作品格線**：
  - 每 `6n+1` 張作品跨滿兩欄。
  - 若該張為直幅，限制寬度並置中。
  - 每 `6n+4` 張作品使用較大的上下留白與置中框幅，製造攝影書節奏。
  - `≤760px` 所有作品恢復 100% 寬、單欄、無額外 margin。
- **動態**：新增 `page-enter` 與 `preview-in`；既有全域 `prefers-reduced-motion` 規則會停用動畫。

## 5. 已完成的工程驗證

下列指令已在目前這批功能變更上執行且通過：

```powershell
npm run typecheck
npm run lint
npm test
npm run build:pages
npm run test:pages
git diff --check
```

意義：

- TypeScript 無型別錯誤。
- ESLint 無阻擋問題。
- vinext production build 與 Node 測試通過。
- Pages／Vite 靜態 artifact build 與 smoke test 通過。
- patch 無 whitespace error。

Terra 審查修正完成後，上述六組驗證已再次全部通過。這些自動化結果不能取代精確 viewport 的視覺驗收；視覺 QA 仍是後續最重要的未完成項目。

## 6. 已完成審查與尚待驗收項目

Terra 已完成獨立審查：P0 無；兩項 P1 與兩項 P2 均已採納修正。

- 短視窗 Hero 新增 `max-height: 600px` 規則，取消 600px 強制高度、縮小字級與間距；`761–900px` 字級由 `18vw` 降為 `13vw`。
- 編輯式 gallery 依實際版位宣告 `100vw`／`74vw`／`56vw`／`50vw` 的 responsive `sizes`，避免全寬作品誤選低解析度來源。
- 無 hover 或窄版裝置不再因鍵盤 focus 掛載隱藏的分類預覽圖。
- `6n+4` 直幅作品另設 `min(52vw, 720px)` 上限，避免單張直幅過度壓迫。

瀏覽器工作階段曾反覆中斷，因此以下仍需由下一位完成：

1. **精確 viewport QA**
   - `824 × 350`：首頁 Hero 的 eyebrow／「愛似影」／中文引言不可重疊、裁切或超出 viewport。
   - `1117px` 寬桌面：所有分類頁中英文標題必須緊密相鄰，不可分居左右；不能有水平 overflow。
   - `390px` 寬手機：首頁與所有 route 都不可水平 overflow；Hero 與雙語標題需合理換行；作品格線為單欄。
2. **互動回歸**
   - 桌面 category hover 與 keyboard focus 都能切換右側預覽。
   - 手機／touch 不顯示 preview。
   - menu、route navigation、lightbox、Esc、焦點行為沒有退化。
3. **Cloudflare 線上驗收**：main push 後需等待自動部署，再對 <https://iceinn.agneng.workers.dev> 重做重點 QA。

## 7. 下一位 Codex 建議執行順序

### A. 先確認工作樹，不要覆蓋現有變更

```powershell
git status --short --branch
git diff -- app/components/PortfolioSite.tsx app/components/Gallery.tsx app/globals.css
```

不要使用 `git reset --hard`、`git checkout --` 或任何會清掉未提交內容的指令。

### B. 啟動本機並完成精確 viewport QA

```powershell
npm run dev -- --host 127.0.0.1 --port 5713
```

至少檢查：

- 首頁：`824 × 350`、`390 × 844`、一般桌面。
- 每個分類 route：`#/people`、`#/landscape`、`#/wedding`、`#/still-life`、`#/works`。
- 其他 route：`#/video`、`#/about`、`#/contact`。
- `document.documentElement.scrollWidth <= window.innerWidth`。
- `.page-meta` 數量必須為 0；頁面文字不得再出現符合 `Page \d+ / \d+` 或 `photographs` 的 metadata。
- 桌面分類預覽在 hover/focus 前不應存在額外預覽圖片；觸發後只出現目前分類的一張預覽圖。
- gallery 在桌面有全幅、雙幅與留白節奏；手機為單欄且圖像比例正確。

### C. 視覺 QA 時確認 responsive 圖片畫質

`Gallery` 已依 `6n+1`／`6n+4`、橫直幅與一般雙欄版位提供相符的 `sizes`。後續應在 1440px／1920px 桌面確認全寬圖沒有偏軟，同時用 Network 面板確認一般雙欄圖沒有不必要地全部下載 1800px 版本。

### D. 重跑完整自動化驗證

若視覺 QA 後有任何程式碼變更，重跑：

```powershell
npm run typecheck
npm run lint
npm test
npm run build:pages
npm run test:pages
git diff --check
```

### E. Terra reviewer 結果（已完成）

Terra 已針對本輪 diff 完成獨立 review，覆蓋：

- P0/P1/P2 正確性與 UI finding。
- responsive overflow、標題碰撞、hover/focus、touch fallback。
- image loading／`sizes`／CLS 風險。
- accessibility、reduced-motion、menu/lightbox 回歸。
- 是否可批准 merge。

結果為 P0 無；2 項 P1 與 2 項 P2 已全數修正，完整自動化驗證再次通過。後續若精確 viewport QA 發現新問題，應重新請 reviewer 確認。

### F. Commit、push、PR、merge

建議建立功能分支，例如：

```powershell
git switch -c agent/editorial-contact-sheet
git add app/components/Gallery.tsx app/components/PortfolioSite.tsx app/globals.css PROJECT_HANDOFF.md
git commit -m "Elevate portfolio editorial experience"
git push -u origin agent/editorial-contact-sheet
```

接著開 PR、確認 checks、merge 到 `main`，最後同步本機 `main`。如使用者仍要求「合併所有分支後 push」，應先列出本地與遠端分支，確認沒有其他未合併工作後再清理已合併的工作分支。

### G. Cloudflare live QA

- main push 後等待 Cloudflare GitHub integration 自動部署。
- 重新打開 <https://iceinn.agneng.workers.dev>，確認新的分類預覽／編輯式格線已出現，藉此排除 CDN 舊版。
- 線上至少重測 `824 × 350` Hero、`1117px` 雙語標題、`390px` 行動版、metadata 消失、分類 preview、menu 與 lightbox。
- 若線上內容未更新，先查 Cloudflare deployment 狀態與 commit SHA，不要反覆修改功能碼猜測。

## 8. 最終驗收標準

只有同時滿足以下條件才算完成：

- 首頁 Hero 在 `824 × 350` 無碰撞、裁切、溢位，閱讀順序清楚。
- 五個作品分類頁的中英文大標在桌面與手機都形成一個緊密標題群組。
- 所有 `PAGE xx / xx` 與 `x PHOTOGRAPHS` metadata 已從 DOM 與畫面消失。
- 桌面分類索引可用滑鼠與鍵盤觸發相片預覽；touch／手機有乾淨 fallback。
- 桌面作品瀏覽有全幅、雙幅、留白交替的 editorial rhythm；手機單欄穩定。
- 圖片無明顯低解析度、變形、CLS 或不必要的首頁大量 eager load。
- menu、navigation、lightbox、Esc、focus、reduced-motion 無回歸。
- typecheck、lint、test、build:pages、test:pages、diff-check 全數通過。
- Terra 無未處理 P0/P1。
- PR 已 merge 到 `main`，origin 同步，Cloudflare 線上站點已實測為新版。

## 9. 目前 Repository／Branch／Status 快照

建立本文件前的確認結果：

- 目前 branch：`main`
- upstream：`origin/main`
- HEAD：`cd15122 Trigger Cloudflare deployment`
- `origin/main...HEAD` ahead/behind：`0 0`
- remote：`https://github.com/icegee1976/iceinn.git`
- 本段是建立交接檔時的基準快照；本輪交付會把下列功能檔與 `PROJECT_HANDOFF.md` 一起提交、推送並合併到 `main`，實際 SHA 請用 `git log -1` 確認。
- 已修改：
  - `app/components/Gallery.tsx`
  - `app/components/PortfolioSite.tsx`
  - `app/globals.css`
- 本交接檔新增後會多出：`PROJECT_HANDOFF.md`
- Terra review 本機伺服器產生的 `vite.terra.*.log` 已排除，不納入提交。

目前 diff 規模（不含本交接文件）：3 files changed，約 217 insertions、67 deletions。

---

交接重點一句話：**功能實作、Terra 審查、P1/P2 修正與完整自動化測試已完成；本輪會推送並合併到 main，下一位需完成精確 viewport 視覺 QA 與 Cloudflare live QA。**
