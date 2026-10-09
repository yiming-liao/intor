# Intor 問題盤點

更新日期：2026-10-08

狀態：盤點與逐項修正中；BUG-01～04 已提交，BUG-05／06 已修正但未提交，其餘項目見各節。

目的：先記錄與確認當前 bug、契約缺口及驗證限制，再逐項決定修正範圍。這不是完整 audit 的結論，也不是已批准的功能 roadmap。

## 1. 已重現的 bug

### BUG-01：Local loader 改寫 fallback 優先順序

- 狀態：已修正，尚未發布。原問題已透過實際 local loader 重現。
- 位置：[load-local-messages.ts](../../packages/intor/src/server/messages/load-local-messages/load-local-messages.ts)，cache key 建立處。
- 觸發：傳入有多個語言且順序不同於字典排序的 `fallbackLocales`。
- 原因：`fallbackLocales?.sort()` 原地修改陣列；後續 candidate locales 使用修改後的順序。上層 `loadMessages` 傳入的是 config 中的陣列，因此也會修改 config。
- 影響：載入優先順序違反設定，並可能影響後續 translator 查找順序。

實際重現結果：

````text
輸入 locale：fr
輸入 fallbackLocales：["zh-TW", "en-US"]
資源：zh-TW 與 en-US 都存在
載入後 fallbackLocales：["en-US", "zh-TW"]
實際載入 locale：en-US
````

修正驗收：

- [x] 載入不修改輸入 fallback 陣列與 config。
- [x] 缺少目前語言時，依宣告順序選取第一份可用資源。
- [x] Cache key 區分不同 fallback 優先順序；只改成複製後排序仍不足。

修正紀錄：fallback 直接依原順序建立 key，namespace 排序改用副本。新增 2 個回歸案例，修正前皆失敗；不改變第一份可用語言即停止的策略。加入 Intor patch changeset。

附帶觀察：`namespaces?.sort()` 也會修改輸入陣列。這是已確認的副作用，但尚未重現 namespace 排序造成的消費者功能錯誤，不列為另一個已重現 bug。

### BUG-02：載入成功的 fallback messages 在 translator 建立流程被丟棄

- 狀態：已修正，尚未發布。原問題已透過 `initTranslator` 與實際 local 資源重現。
- 位置：[merge-messages.ts](../../packages/intor/src/core/messages/merge-messages.ts)、[create-translator.ts](../../packages/intor/src/core/translator/create-translator.ts)。
- 觸發：目前 locale 沒有可用資源，loader 回傳另一個 fallback locale 的 messages，且 config 沒有可提供同一訊息的靜態 fallback messages。
- 原因：`mergeMessages` 僅合併 `b[locale]` 並保留 `a` 的其他語言；載入結果 `b` 的其他語言不會保留。
- 影響：成功讀取的 fallback 訊息無法供 translator 使用，最後進入 missing 行為。

實際重現結果：

````text
請求 locale：fr
fallbackLocales：fr → en-US
資源：只有 en-US 有可用訊息，hello = "world"
initTranslator 的 messages：{ fr: {} }
t("hello")："hello"
````

共用影響：server 初始化與 client refetch 都呼叫這段 merge。Server/local 路徑已實測；client/remote 路徑的影響由呼叫鏈確認，尚未另外做端到端重現。

修正驗收：

- [x] 成功載入的 fallback 語言可被 translator 查找。
- [x] 保留訊息原本的 locale 身分，不把 fallback 冒充目前語言。
- [x] 目前 locale 不因 fallback 而切換。
- [x] 既有靜態與載入訊息的覆寫規則不受破壞。
- [x] 評估各 merge 呼叫點的契約，不直接假定共用函式應全面改成合併所有語言。

修正紀錄：保留公開 `mergeMessages` 的單一 locale 契約；新增內部 `mergeLoadedMessages`，於 server translator 建立與 client refetch 共用，逐一合併實際載入的 locale。未擴大 loader 載入範圍。新增 3 個 smoke 案例，涵蓋真實 local fallback、靜態／loaded 覆寫與 mock fetch 的 client fallback；Intor 670 tests 通過。加入 patch changeset。

### BUG-03：Translator 將繼承屬性誤判為訊息 key（P2）

- 狀態：已修正，尚未發布。原問題透過來源碼 `CoreTranslator` 實測重現。
- 位置：[find-message-in-locales.ts](../../packages/intor-translator/src/shared/utils/find-message-in-locales.ts)，第 27 行。
- 觸發：一般物件 messages 沒有自有的 `toString`、`constructor` 或 `__proto__` 訊息，仍查找這些 key。
- 原因：路徑查找使用 `in`，將 prototype chain 上的屬性視為訊息。
- 影響：`hasKey("toString")` 回傳 true；`t("toString")` 回傳 function，`t("__proto__")` 回傳 prototype object，跳過正常 missing／fallback。Nested path 也使用相同判斷。
- 驗收：只將 message tree 的自有屬性視為存在；正常自有同名 key 與帶點 key 的既有查找能力須維持。

修正紀錄：路徑查找改用自有屬性判斷。新增 8 個案例涵蓋頂層／巢狀繼承屬性、fallback 與顯式同名 key；修正前其中 5 個失敗，修正後 translator 全部 179 tests 通過，套件 type check 通過。既有帶點 key 測試亦通過。已加入 translator patch changeset；不改動公開 API，也未執行版本更新或發布。

### BUG-04：Local 訊息覆寫結果依非同步讀取完成順序改變（P2）

- 狀態：已提交為 `47870e9`，尚未發布。原問題直接呼叫 `parseFileEntries`，使用自訂 reader 與受控延遲重現。
- 位置：[parse-file-entries.ts](../../packages/intor/src/server/messages/load-local-messages/read-locale-messages/parse-file-entries/parse-file-entries.ts)，第 95 與 111 行。
- 觸發：多份合法資源形成相同 message path，例如 `auth/index` 內有 `login.title`，同時存在 `auth/login` 的 `title`。
- 原因：並行 reader 完成後 push 結果，再按完成順序 deep merge。
- 影響：相同檔案內容與相同 fileEntries，只有讀取速度不同，最終文案就不同。Production cache 會保留當次結果。

````text
auth/index.mock：{ login: { title: "INDEX" } }
auth/login.mock：{ title: "FILE" }
index 較慢：auth.login.title = "INDEX"
login 較慢：auth.login.title = "FILE"
````

採用契約：同一 locale 資源樹的重複 leaf key（即使值相同）與 leaf／object 結構衝突均拒絕；不同檔案可補充同一物件中的不同 keys。跨 locale 不互相比較；static config／loaded messages 的跨層覆寫保持不變。

Dotted-key 補充：跨檔案的 literal dotted／nested key 與 dotted parent 使用完整查詢 key 比對。只登記實際節點，不為 dotted property 建立虛擬中間物件；同一檔案內 aliases 不新增限制。保留每個 query key 的各來源定義，避免同一檔案的 object／leaf aliases 遮蔽後續跨檔案衝突。新增 9 個邊界案例；連同直接 unit tests 與 smoke tests，Intor 完整 695 tests、type check、runtime build、declaration build 與 API check 通過。修改檔案 ESLint 通過。API Extractor 提示其 bundled TypeScript 版本較舊，但未造成檢查失敗。仍未 commit 或更新版本。

修正：按輸入順序收集並解析合併結果，追蹤每個結構路徑的來源；拋出內部 `MessageConflictError`，包含 key 與兩個完整來源檔案路徑。Local loader 不吞掉此錯誤、不繼續 fallback。Reader 原有一般讀取／格式錯誤處理不變。

驗證：新增 7 個 smoke 案例，涵蓋完成順序、leaf／object 衝突、合法分組與真實 JSON loader 的錯誤傳遞；Intor 全部 677 tests 通過。這是更嚴格的消費者行為，依賴檔案內重複 key 的應用需移除重複定義；release 分級與 changeset 尚待確認，不假定可直接作 patch 發布。

### BUG-05：不支援的 locale cookie 遮蔽有效瀏覽器語言（P2）

- 狀態：已修正，未提交／發布。原問題透過 `getClientLocale`、模擬 document／navigator 重現。
- 位置：[get-client-locale.ts](../../packages/intor/src/client/shared/helpers/get-client-locale.ts)，第 31–33 行。
- 觸發：cookie enabled，cookie 有值但不匹配 supportedLocales；瀏覽器偏好可匹配。
- 原因：先用 cookie 或 browser 選一個 candidate，再只 match 一次；cookie 不匹配直接進入 default。
- 影響：例如 supportedLocales 為 en／zh-TW、default 為 en，瀏覽器 zh-TW；無 cookie 得到 zh-TW，cookie 為 unsupported 得到 en。這不符合函式文件中 cookie → browser → default 的解析順序。
- 驗收：無法匹配的 cookie 不阻止嘗試有效 browser locale。

### BUG-06：格式錯誤的 locale cookie 使 client locale 解析拋錯（P2）

- 狀態：已修正，未提交／發布。原問題透過 `getClientLocale`、模擬 document／navigator 重現。
- 位置：[get-locale-from-cookie.ts](../../packages/intor/src/client/shared/utils/locale/get-locale-from-cookie.ts)，第 14 行。
- 觸發：cookie enabled，cookie 值含不合法的 URI encoding，例如 `%ZZ`。
- 原因：`decodeURIComponent` 的 URIError 未處理。
- 影響：無法退回瀏覽器語言或 default；若在 app 初始化呼叫，例外會中斷初始化。
- 驗收：格式錯誤的 cookie 可被忽略，locale 解析繼續依既有優先序進行。

BUG-05／06 修正紀錄：cookie 與 browser candidate 分別匹配；cookie decoding 失敗回傳 undefined。新增 4 個回歸案例（修正前皆失敗），涵蓋 unsupported cookie、兩種 malformed encoding 與 default fallback。Intor 全部 699 tests、type check 與修改檔案 ESLint 通過；有效 cookie 優先與 cookie disabled 的既有測試持續通過。加入 patch changeset，未 commit；尚未使用真實瀏覽器驗證。

整合驗證：已於 `apps/next-fixture` 建立極簡 Next.js workspace fixture，涵蓋 Web／CMS、多 config、local SSR → Provider／hydration、fallback 與錯誤傳遞的驗證入口。純 CSR cookie helper 使用 client 案例，不假定 Next.js SSR 會呼叫它；remote refetch 尚未建立。經契約討論後，redirect 定位為使用 server request context 的 API，改由 `intor/next/server` 匯出。目前版本 production build 通過；先前相同 export 方案的六個 HTTP SSR 案例曾通過。使用者已回報實際瀏覽器測試未出現問題；此為使用者手動驗證，非自動瀏覽器測試。

## 2. 已確認行為；不直接列為 bug

### 第一份可用資源策略

Local 與 remote loader 目前取得第一份可用語言資源後就停止，不會因某些 key 或 namespace 缺少而準備所有 fallback 語言。Translator 能對已提供的 messages 逐 key fallback，但不負責取得資源。

目前討論方向：先修 BUG-01／02，保留上述載入策略。自動預載所有 fallback 或缺 key 後補載都尚未決定採用。

### SSR messages 的交付範圍

Next.js `intor()` 回傳 `{ config, locale, messages: translator.messages }`。React Provider 直接使用傳入 messages，沒有按元件使用的 keys 自動裁切。Namespace 範圍由 loader config 決定；未指定時，local loader 收集 locale 下所有支援資源。

如果未來準備並保留全部 fallback，將完整結果傳給 client Provider 會增加訊息資料量。這是評估成本，不是已確認的效能問題；尚未測量實際應用程式的 payload 與延遲。

### Process cache 的範圍

Local cache 可讀取既有結果；只有 production 且 `allowCacheWrite` 為 true 時才寫入。`intor()` 預設允許寫入，`getTranslator()` 預設不允許寫入。Cache 限於 process，不消除 client 傳輸成本，也不跨冷啟動共享。

## 3. 待查問題與契約決策

以下均不能當成已重現 bug 或已批准的實作需求。

| ID | 項目 | 待確認內容 |
| --- | --- | --- |
| AUDIT-01 | Config 型別與 runtime 配對 | React `useTranslator<"cms">()` 選擇型別，但 runtime 使用最近的 Provider；server generic 也未與 config 參數綁死。確認這是允許的彈性或需要攔下的誤用。 |
| AUDIT-02 | CLI 檢查範圍與結果 | 盤點未找到 config、無辨識到的 usage、動態 key、包裝呼叫、診斷與 exit code；不可把沒有報錯直接視為完整檢查。 |
| AUDIT-03 | Client 非同步生命週期 | 檢查 config 更換、Provider 卸載、舊請求回寫與 loading 狀態；尚未重現。 |
| AUDIT-04 | RTL 作用範圍 | 區分 locale 方向資訊、區域 dir 與 document dir；多 config 不應直接假定同一份全域方向。尚未決定新增功能。 |
| AUDIT-05 | 過度設計 | 檢查 hooks／handlers、loader overrides、remote、公開 API 的重疊與真實用途；尚未判定應移除任何能力。 |
| AUDIT-06 | Rich replacement 的語意 | 已實測：插值發生於 rich parse 之前，`name = "<b>Alice</b>"` 會變成 tag，`name = "<b>"` 會拋出 unclosed tag。React `createTRich` 也使用此呼叫順序。需確認 replacement 是純文字還是允許 markup；未直接列為 bug，也未宣稱 XSS。 |
| AUDIT-07 | Next.js 多 config routing context | `getLocale(config)` 直接回傳共用 `x-intor-locale` header，未依 config 檢查 supportedLocales 或 config ID。已在 fixture `/zh-TW` 重現：`getLocale(cmsConfig)` 回傳 CMS 不支援的 `zh-TW`。此證據限於同一 request 讀取另一份 config；一般 Web／CMS 各自使用 config 的 flow 尚未發現錯誤。 |
| AUDIT-08 | Next.js 公開 entry point 的 server/client boundary | `apps/next-fixture` 在 Next.js 16.1.7 webpack production build 重現失敗：client 匯入 `useRouter` 經 `intor/next` barrel 觸及 server redirect 的 `next/headers`；proxy 匯入 handler 也觸及未標 client boundary 的 hooks。已保留 useRouter 的 client boundary，並將 request-context redirect 移至 server entry；目前 production build 通過，本批已 freeze。 |

AUDIT-08 進度：經使用者確認，保留 `getLocale(config)` 的 server request context 語意，不新增 Client render redirect 支援；Client event navigation 使用既有 `useRouter()`。`redirect` 改由 `intor/next/server` 匯出，原 `intor/next` export 移除，函式簽章與 runtime 行為不變。保留 `useRouter` 的 `"use client"`。已更新公開 API reports、quickstart 與 major changeset，尚未更新版本；本批已 freeze。目前 Intor build、699 tests、修改檔案 lint 與 Next.js fixture production build 通過。本次已在 `apps/next-fixture` 重跑六個 HTTP SSR／conflict 案例並通過；新增四個 redirect HTTP 案例：en-US／zh-TW／fr-FR 分別以 307 導向自己的 locale root，CMS vi-VN cookie request 以 307 導向 `/cms`。使用者已回報瀏覽器測試未出現問題；此為手動驗證回報，未建立自動瀏覽器測試。

CLI config import 診斷已有獨立紀錄，參見 [CLI config loading plan](cli-config-loading.md)。該文件的既有證據與歷史重現限制維持有效，不能視為本輪重新驗證。

## 4. 本輪驗證紀錄

先前同一 session 已執行：

- `pnpm test`：249 個 test files、1,383 個 runtime tests 通過。
- `pnpm type`：所有具備 type script 的 workspace 套件通過。
- Translator 與 Intor 型別測試：共 12 組通過；使用各套件的 `pnpm exec node --import tsx scripts/test-types.ts`，避開 `tsx` CLI 在 sandbox 的 IPC 權限限制。
- 使用 `node --import tsx` 直接呼叫 local loader／`initTranslator`，重現 BUG-01／02；未新增持久測試。

限制：未執行完整 build、lint、API check、packed consumer 驗證、Next.js app 端到端測試或效能測量。既有測試通過不代表上述跨層問題已被涵蓋。建立本文件時沒有重新執行測試。

## 5. 後續順序

1. 繼續盤點，將新證據分為已重現缺陷、來源碼確認的限制、待決定契約。
2. 逐項確認觸發條件與消費者影響，避免將猜測列為 bug。
3. 問題盤點後再決定修正範圍；不在本文件建立階段修改 runtime、API 或 release 內容。

## 6. 第二輪盤點範圍與證據

本輪限於 `intor-translator` 與 `intor`，其他 packages 不納入新檢查。覆蓋 message lookup、rich parsing、local resource merge、client locale 解析、React messages effects 與 Next.js routing context；尚非逐檔完整 audit。

新增 BUG-03～06 與 AUDIT-06～07。重現使用一次性 `node --import tsx` scripts；沒有新增 runtime 程式碼或持久測試。Rich parsing 與 cookie 案例使用來源碼與模擬輸入，沒有執行瀏覽器／Next.js 端到端驗證。

本輪在兩個 package 目錄分別執行 `pnpm test run`：translator 30 files／171 tests、intor 114 files／665 tests，皆通過。起初以套件名稱 filter 的命令也選到同名 root，造成 `vitest run run` 命令失敗；已改用 package 目錄執行，非產品測試失敗。未重新執行 type、build 或 API check。


### AUDIT-07 契約待確認；config ID 實驗已撤回

使用者確認撤回 Next config ID header、reader 歸屬檢查、對應測試與 changeset。先前 703 tests 與 fixture 隔離案例的通過結果屬於已撤回實驗，不代表目前行為。已 freeze 的 AUDIT-08 redirect entry／useRouter boundary 保留。

正常 Web／CMS 按路徑選 handler 並搭配相應 config 的 flow 尚未發現錯誤。跨 config 案例是刻意在 Web request 呼叫 getLocale(cmsConfig)，證明現有 request routing locale 會被繼承，不足以判定為 bug。Config 設定／messages 隔離不必然要求 locale 隔離。

待確認契約：getLocale(config) 是取得 request routing locale（config 提供 cookie/default fallback），還是獨立取得該 config 的 locale？在實際需求與契約明確前，維持既有 request-scoped 行為，不推進歸屬機制修改。

### AUDIT-07 跨 adapter 契約盤點（尚未實作）

待確認的共同契約：request routing locale 是否允許被多份 config 共用？以下為現況盤點，不將未檢查 config 歸屬直接判為缺陷。

| Adapter | Context | Reader 現況 | 驗證狀態 |
| --- | --- | --- | --- |
| Next | x-intor-* headers | 維持原本 request routing locale；config ID 實驗已撤回 | 跨 config 繼承已觀察，契約待確認 |
| Express | req.intor | getTranslator(config, req) 直接採用 req.intor.locale | 程式碼確認，未補跨 config 重現測試 |
| Fastify | request.intor | getTranslator(config, request) 直接採用 request.intor.locale | 程式碼確認，未補跨 config 重現測試 |
| Hono | c.get("intor") | getTranslator(config, c) 直接採用 context.locale | 程式碼確認，未補跨 config 重現測試 |
| SvelteKit | event.locals.intor | adapter 沒有對應 getTranslator reader，由 consumer 使用 locals | 未確認 consumer 跨 config 使用情境 |

Express／Fastify／Hono 的既有 getTranslator 測試覆蓋 context locale、缺少 context 時的 default 與 params 傳遞，沒有 config 歸屬案例。Handler 自己建立 translator 時使用同一 config 與當次 locale，未發現該路徑的配對問題；跨 config reader 與多 handler 覆寫單一 context 是另外的邊界。

InboundContext 是公開 routing 型別，目前等於 Omit<InboundResult, "shouldRedirect">，也由純 routing helper 回傳。不能直接把 framework config 身分變成純 routing result 的必填欄位而不檢查公開型別與 consumer 相容性。

待決策：其他 adapter 目前不從 cookie 做 reader fallback（只有 default），不能直接宣稱 Next 的 cookie → default 契約已套用所有 adapter。先確認實際跨 config 需求與 request locale 共用契約，再決定是否需要歸屬檢查。本輪不修改任何 adapter 或共同 InboundContext。


### AUDIT-03 React 非同步生命週期檢查

本輪限 React useMessagesEffects、IntorProvider 與共用 createRefetchMessages。未修改 runtime。一次性 characterization tests 使用真實 hook／refetcher，僅 mock remote loader 並以 deferred promise 控制完成時間；執行後移除暫存測試，不將已知問題的行為鎖成正式期待。

已重現：config A remote 請求進行中，rerender 為 config B local（locale 不變）。舊 signal 沒有 abort，loading 維持 true；A 請求完成後，onMessages 收到 A messages，onLoadingEnd 寫入 false。原因是 refetcher 的 controller 僅在自身 instance 內有效，config 更換建立新 instance，而 effect 沒有 cleanup。Provider 的 runtimeMessages 優先於新 config／external messages，因此舊回寫可污染仍掛載的 Provider；是否正式支援同一 Provider 更換 config 仍需確認，不先擴大 API。

已重現清理缺口：請求進行中 unmount，signal 未 abort；完成後 messages／loading 回呼仍執行。此證據不代表新 Provider 被污染，也未宣稱 React warning 或記憶體洩漏。

未發現同一 refetcher 的快速 locale 切換舊結果覆蓋：既有測試確認 abort 前一請求、只套用最新結果。六個共用 refetcher tests 與兩個一次性生命週期案例共八個 tests 通過；生命週期案例是證明現有異常行為，不是修正後 regression。

失敗處理：來源碼確認一般 HTTP／network／invalid-message 失敗由 fetchRemoteResource 吸收，loadRemoteMessages 回傳 undefined，active refetcher finally 結束 loading。未實測真實網路故障。對相同 locale 再呼叫 setLocale 是 no-op，沒有獨立公開 retry 操作；這是目前能力／契約，不直接列為 bug。

另需確認：runtimeMessages 非 null 後，新 external messages／config.messages 仍被 runtime 優先遮蓋，effect 沒有 reset；此為來源碼觀察，尚未用完整 Provider 測試重現。下一步先確認 config／external value 更新契約，再補必要的回歸測試；不從此次檢查直接推出新 retry API 或跨 framework 改造。


### Local SSR → React Provider 外部 value 更新

一次性測試使用真實 IntorProvider／Translator／messages effect，local config 不使用 remote。相同掛載的 Consumer 經 rerender 更新 en messages A → B，再更新 locale fr 與 Bonjour messages，文字與 locale 都正確，Consumer instance 維持一份；測試通過後移除暫存測試。這條正常 local value 更新未發現 bug，不修改 runtime。

apps/next-fixture 的導覽改用 next/link；新增 ClientProbe mount ID、local counter、router.refresh 與 ?probe=A／B server messages 更新入口。Production build 與 A／B HTTP 初始 server/client markup 檢查通過。使用者回報上述瀏覽器測試看起來都沒有問題，包含 refresh counter 保留的觀察；此為使用者手動驗證，非自動 E2E。


### Local loader cache 與錯誤恢復

以一次性 script、真實檔案與獨立 Map pool 實測，allowCacheWrite=true：development 的 invalid JSON 全失敗不寫 cache，修好後可讀取；A → B 檔案更新下次載入得到 B，pool 仍為空。Production 成功結果寫入 process-level cache，檔案更新後仍回傳舊值；清 pool 後讀到新值。符合既有 lifetime cache 設計，未發現失敗 promise／undefined 卡住恢復。

另確認容錯限制：production 同 locale 中一份有效檔案、一份 invalid JSON，壞檔會 warn 並略過，其餘部分結果可快取。修好壞檔後，同 process cache hit 仍不包含該檔；清 pool 後恢復完整結果。這是 partial-success 容錯與 process cache 的組合，不直接列為 bug；是否要 fail-fast／避免快取部分結果仍需先確認契約，不修改 loader 策略。

本輪只更新 audit，未修改 runtime、公開 API 或新增 release 內容。實測僅單 process 本機檔案，不宣稱涵蓋多 worker／部署快取。


### AUDIT-06 rich replacement 實測補充

一次性 script 使用真實 Translator.t、HTML createTRich、React createTRich 與 react-dom/server renderToStaticMarkup。未修改 runtime，測試 script 執行後移除。React SSR rendering 不是瀏覽器執行測試。

| replacement name | t() | HTML／React rich 結果 |
| --- | --- | --- |
| Alice | 普通字串插值 | 普通文字 |
| 2 < 3 & 5 > 4 | 保留原字元 | text nodes 正常 escape，顯示原文字 |
| <b>Alice</b> | 保留 tag 字串 | 解析為 b 元素，不是 literal replacement 文字 |
| <b> | 保留字串 | 兩個 renderer 前的 AST validation 都拋 Unclosed tag |
| </b> | 保留字串 | 都拋 Unmatched closing tag |
| &lt;b&gt;Alice&lt;/b&gt; | 保留 entity 字串 | ampersand 再 escape，不會解碼成原始 <b> 文字 |
| <a href="/probe">Alice</a> | 保留 tag 字串 | HTML 保留 href；React 預設 renderer 忽略 attributes，只建立 a 元素 |

處理順序：t 完成插值 → tokenize／AST → renderer。Tokenizer 註解明示 variables assumed interpolated beforehand，現有順序有設計依據；但未找到清楚定義 replacement 是否允許 markup 的 consumer 文件。Text escaping 發生於解析之後，因此不能阻止合法 replacement tag 改變 rich 結構。不能簡單先 HTML-escape replacement，否則會有 entity 字串顯示的相容性問題。

目前分類仍為契約待確認：若 replacement 預期普通資料，tag 被解讀與單一輸入拋錯值得修正；若刻意允許 rich markup，則需界定信任邊界及錯誤策略。未執行 script/event exploit，不宣稱 React XSS 或 HTML 使用端可直接安全插入任何不可信 replacement。此輪沒有新增 escaping、sanitizer、公開 API 或 changeset。


### AUDIT-06 契約與相容性研究

Replacement 型別為 Record<string, unknown>，沒有 trusted markup 標記；built-in interpolate 只替換 string／number，未找到要求 replacement 注入 semantic tag 的測試。React createTRich 既有測試 mock renderRichMessage，主要驗證 composition 與 element key，未覆蓋真實使用者文字插值。Tokenizer 註解卻明確假設先插值，因此現有順序不能直接視為意外。

建議討論的邊界：message template／formatter 產生 rich 結構，普通 replacement 表示資料；這尚未成為已批准契約。若採用此方向，需要保留 formatHandler／hooks：format stage 先於 interpolate，formatHandler 可讀 replacements 並回傳完整 MessageValue。單純 rich parse 前移至 raw template 會跳過格式化後的結構，直接包裝 replacement escaping 則可能改變 formatHandler 的輸入值；皆不作為本輪修法。

另外需界定 attribute placeholder（例如 message 中 href="{url}"）：HTML renderer 目前支持解析 attributes，React default renderer 忽略 attributes。Text slot 與 attribute slot 不可假定相同處理；現有 tag-renderer callback 接收 children，可由 consumer closure 提供 URL／props。未決定移除 template attributes 或要求 consumer 遷移。

下一個必要決策是：是否曾刻意把 <b>…</b> 等 markup 放進 replacements，以及是否依賴 attributes 中的 placeholder？在這兩項使用範圍未明確前，只保留研究紀錄，不修改 pipeline 或增加新選項。


### AUDIT-06 三層測試契約對照

明確已有測試：tokenizer 支援 semantic tags、多 attributes（含 href）、普通比較符號；AST 驗證未閉合／未配對 tags；replaceValues 支援 nested string／number 插值及缺值保留 placeholder；HTML renderer escape text／attribute values。這些能力應保留。

沒有找到三層整合測試明確要求：replacement markup 必須成為 rich tag，或 attribute placeholder 必須由 replacements 插入。兩者目前能運作是 string interpolation → rich parse 的組合行為；沒有 dedicated test 不代表從未被 consumer 使用，不以此作移除依據。

message README 的 fail-closed syntax 是 tokenizer 層的敘述，不是完整 rich API 保證任何輸入都回傳文字；invalid opening tag 可能成為 text，但其 closing tag 仍被辨識，AST 可因此拋 unmatched closing error。避免把這句描述等同 sanitizer 或 never-throw 契約。

目前建議保留 runtime 相容性並將 replacement 資料／markup 邊界列為設計待決策；不撤除 attributes，不修改 t() 的 plain string 行為，不直接套 HTML escaping 到 replacements。


### AUDIT-06 正式整合測試與使用說明

新增 packages/intor/__test__/integration/rich-replacements.test.ts：真實 Translator → HTML／React createTRich → React static markup，無 parser／renderer mocks。七個案例覆蓋 message tags、比較符號、replacement markup、未閉合／未配對 tags、pre-escaped entities 與 href placeholder 的 renderer 差異。作為 current-behavior characterization，不建立永久 trust policy。docs/quickstart.md 補上處理順序、錯誤與文字語意限制、React tag renderer props 用法。Intor 全部 706 tests、type check 通過；runtime／公開 API／changeset 未修改，尚未 commit。
