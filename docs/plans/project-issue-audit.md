# Intor 問題盤點

更新日期：2026-10-08

狀態：盤點與逐項修正中；BUG-01／03 已修正，其餘項目見各節。

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

- 狀態：已透過 `initTranslator` 與實際 local 資源重現。
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

- [ ] 成功載入的 fallback 語言可被 translator 查找。
- [ ] 保留訊息原本的 locale 身分，不把 fallback 冒充目前語言。
- [ ] 目前 locale 不因 fallback 而切換。
- [ ] 既有靜態與載入訊息的覆寫規則不受破壞。
- [ ] 評估各 merge 呼叫點的契約，不直接假定共用函式應全面改成合併所有語言。

### BUG-03：Translator 將繼承屬性誤判為訊息 key（P2）

- 狀態：已修正，尚未發布。原問題透過來源碼 `CoreTranslator` 實測重現。
- 位置：[find-message-in-locales.ts](../../packages/intor-translator/src/shared/utils/find-message-in-locales.ts)，第 27 行。
- 觸發：一般物件 messages 沒有自有的 `toString`、`constructor` 或 `__proto__` 訊息，仍查找這些 key。
- 原因：路徑查找使用 `in`，將 prototype chain 上的屬性視為訊息。
- 影響：`hasKey("toString")` 回傳 true；`t("toString")` 回傳 function，`t("__proto__")` 回傳 prototype object，跳過正常 missing／fallback。Nested path 也使用相同判斷。
- 驗收：只將 message tree 的自有屬性視為存在；正常自有同名 key 與帶點 key 的既有查找能力須維持。

修正紀錄：路徑查找改用自有屬性判斷。新增 8 個案例涵蓋頂層／巢狀繼承屬性、fallback 與顯式同名 key；修正前其中 5 個失敗，修正後 translator 全部 179 tests 通過，套件 type check 通過。既有帶點 key 測試亦通過。已加入 translator patch changeset；不改動公開 API，也未執行版本更新或發布。

### BUG-04：Local 訊息覆寫結果依非同步讀取完成順序改變（P2）

- 狀態：直接呼叫 `parseFileEntries`，使用自訂 reader 與受控延遲重現；未透過真實 filesystem 延遲重現。
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

驗收：相同輸入不因完成順序改變結果。重複 key 應拒絕、警告或採固定優先序，尚待決策，不假定哪個檔案應勝出。

### BUG-05：不支援的 locale cookie 遮蔽有效瀏覽器語言（P2）

- 狀態：透過 `getClientLocale`、模擬 document／navigator 重現。
- 位置：[get-client-locale.ts](../../packages/intor/src/client/shared/helpers/get-client-locale.ts)，第 31–33 行。
- 觸發：cookie enabled，cookie 有值但不匹配 supportedLocales；瀏覽器偏好可匹配。
- 原因：先用 cookie 或 browser 選一個 candidate，再只 match 一次；cookie 不匹配直接進入 default。
- 影響：例如 supportedLocales 為 en／zh-TW、default 為 en，瀏覽器 zh-TW；無 cookie 得到 zh-TW，cookie 為 unsupported 得到 en。這不符合函式文件中 cookie → browser → default 的解析順序。
- 驗收：無法匹配的 cookie 不阻止嘗試有效 browser locale。

### BUG-06：格式錯誤的 locale cookie 使 client locale 解析拋錯（P2）

- 狀態：透過 `getClientLocale`、模擬 document／navigator 重現。
- 位置：[get-locale-from-cookie.ts](../../packages/intor/src/client/shared/utils/locale/get-locale-from-cookie.ts)，第 14 行。
- 觸發：cookie enabled，cookie 值含不合法的 URI encoding，例如 `%ZZ`。
- 原因：`decodeURIComponent` 的 URIError 未處理。
- 影響：無法退回瀏覽器語言或 default；若在 app 初始化呼叫，例外會中斷初始化。
- 驗收：格式錯誤的 cookie 可被忽略，locale 解析繼續依既有優先序進行。

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
| AUDIT-07 | Next.js 多 config routing context | `getLocale(config)` 直接回傳共用 `x-intor-locale` header，未依 config 檢查 supportedLocales 或 config ID。可能讓不同 config 共用不適用的 locale；尚未用實際 Next.js app 重現。 |

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
