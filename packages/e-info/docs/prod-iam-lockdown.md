# Production 部署備忘：CMS GraphQL / Preview IAM 鎖定

dev 上線順序（2026-04-21 完成）的 prod 版本備忘。跨 3 個 repo + 4 個 Cloud Run service。

prod 部署於 2026-04-23 完成（eic-web `90b3176` / CMS merge `5bcd8ae` / data-services merge `38798e5`）。

## 背景

將以下 3 個 prod CMS 側服務從公網直連改為只接受同專案 Cloud Run 服務帶 GCP ID token 的呼叫：

| Service | 舊狀態 | 新狀態 |
|---|---|---|
| `eic-info-cms-gql-prod` | 公開 | `--invoker-iam-check` |
| `eic-info-cms-preview-prod` | 公開 | `--invoker-iam-check` |
| `eic-web-preview-prod` | 公開 | `--invoker-iam-check` |

**不動**：`eic-info-cms-prod`（編輯登入入口，必須對外）、`eic-web-prod`（公開網站）、`eic-data-service-prod`（要先改 code 才能鎖，但目前不鎖它）。

## 影響的 3 個 repo

| Repo | commit (dev 版本) | 作用 |
|---|---|---|
| `e-info-taiwan/eic-web` | `e8f85f8` | web server-side 呼叫 CMS GraphQL 時帶 Bearer ID token |
| `e-info-taiwan/CMS` | `6df7393` | CMS reverse proxy 把流量轉 preview 時帶 Bearer ID token（HPM 5 個 proxy instance）|
| `e-info-taiwan/data-services` | `250e889` | Python `AIOHTTPTransport` 建構點帶 Bearer ID token（6 個 site + 1 helper） |

prod 要把這三個 repo 的 main 合進各自 prod branch（或等效機制）觸發對應 Cloud Build trigger。

## 共用資訊

```bash
PROJECT=mimetic-sweep-456508-k4
REGION=asia-east1
# 所有 Cloud Run 跑在這個 SA 上，授權它一次就覆蓋所有 caller
SA=1090198686704-compute@developer.gserviceaccount.com
```

## 部署順序

**核心原則**：先讓所有 caller 部署帶 token 的版本 → 才鎖 callee。任何 caller 沒更新就鎖，對應流量立刻 403。

### Phase 1 — 部署 prod 端 code（先於任何 IAM 改動）

1. 合併並 push 這三個 repo 的 prod branch，觸發：
   - `eic-web-prod`
   - `eic-web-preview-prod`
   - `e-info-cms-prod`（會同時 deploy `eic-info-cms-prod` / `eic-info-cms-gql-prod` / `eic-info-cms-preview-prod`）
   - `e-info-data-service-prod`

2. 確認所有 build SUCCESS：
   ```bash
   gcloud builds list --project=$PROJECT --limit=10 \
     --format="table(id.scope(builds),status,substitutions.TRIGGER_NAME,substitutions.SHORT_SHA)"
   ```

3. Smoke test 公開網站：
   ```bash
   curl -s -o /dev/null -w "HTTP %{http_code}\n" https://www.e-info.org.tw/
   ```
   （或 prod domain / Cloud Run URL）

此時 IAM 還沒鎖，行為應與過去完全相同。

### Phase 2 — 鎖 CMS GraphQL prod

#### 2a. 授權 caller SA

```bash
for s in eic-info-cms-gql-prod eic-info-cms-preview-prod; do
  gcloud run services add-iam-policy-binding "$s" \
    --project=$PROJECT --region=$REGION \
    --member="serviceAccount:$SA" \
    --role="roles/run.invoker"
done
```

#### 2b. 打開 invoker IAM check

```bash
for s in eic-info-cms-gql-prod eic-info-cms-preview-prod; do
  gcloud run services update "$s" \
    --project=$PROJECT --region=$REGION \
    --invoker-iam-check
done
```

#### 2c. 驗證

公網應該 403：

```bash
for url in \
  https://eic-info-cms-gql-prod-1090198686704.asia-east1.run.app/api/graphql \
  https://eic-info-cms-preview-prod-1090198686704.asia-east1.run.app/api/graphql ; do
  echo -n "$url → "
  curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST "$url" \
    -H 'Content-Type: application/json' -d '{"query":"{__typename}"}'
done
```

公開網站頁面應該仍 200（代表 `eic-web-prod` 的 token 有拿到並送進 CMS）：

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://www.e-info.org.tw/
# 或隨便一篇文章：
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://www.e-info.org.tw/node/238659
```

prod scheduler 跑一輪不應出錯（data-service 改動生效）：

```bash
gcloud scheduler jobs run eic-rss-feed-xml-prod --project=$PROJECT --location=$REGION
# 等幾秒再看結果
gcloud logging read 'resource.type=cloud_scheduler_job AND resource.labels.job_id="eic-rss-feed-xml-prod"' \
  --project=$PROJECT --limit=3 --format="value(timestamp,httpRequest.status)"
```

### Phase 3 — 鎖 web-preview-prod（CMS 預覽流程）

#### 3a. 授權 caller SA

```bash
gcloud run services add-iam-policy-binding eic-web-preview-prod \
  --project=$PROJECT --region=$REGION \
  --member="serviceAccount:$SA" \
  --role="roles/run.invoker"
```

#### 3b. 打開 invoker IAM check

```bash
gcloud run services update eic-web-preview-prod \
  --project=$PROJECT --region=$REGION \
  --invoker-iam-check
```

#### 3c. 驗證

公網應該 403：

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  https://eic-web-preview-prod-1090198686704.asia-east1.run.app/
```

**編輯流程手動測試**：請一位編輯登入 prod CMS 後台、開一篇草稿、點「預覽」，確認畫面顯示正常（代表 CMS HPM proxy 的 Bearer token 有送到 preview-prod）。

## Rollback

三個點都獨立，可分別回滾：

```bash
# 解除單一 service
gcloud run services update <SERVICE> \
  --project=$PROJECT --region=$REGION --no-invoker-iam-check
```

一鍵全退：

```bash
for s in eic-info-cms-gql-prod eic-info-cms-preview-prod eic-web-preview-prod; do
  gcloud run services update "$s" \
    --project=$PROJECT --region=$REGION --no-invoker-iam-check
done
```

IAM binding 可以保留，不用刪。

## Gotchas / 踩過的坑

### 1. `--no-allow-unauthenticated` 不是 `run services update` 的 flag

那個 flag 只在 `gcloud run deploy` 存在。對已部署 service 要用：
- `gcloud run services [add|remove]-iam-policy-binding ... --member=allUsers`（控制 `allUsers` binding）
- `gcloud run services update ... --[no-]invoker-iam-check`（這個才是我們真正在用的總開關）

兩個機制不同，不能混用。我們用的是 `invoker-iam-check` 的 annotation 方式。

### 2. Caller SA 有 `run.invoker` 不等於能通

Cloud Run IAM 驗的是 request 裡的 Bearer token，**caller 的 service identity 不會自動被識別**。必須 caller 從 metadata server 主動拿 ID token 塞進 Authorization header。SA 有 `run.invoker` 只是「這個 SA 簽出的 token 會被視為合法呼叫者」。

→ 這就是為什麼要動三個 repo 的 code。

### 3. `AUDIENCE` 是 service root URL（不含 path）

拿 ID token 時，`audience` 參數填目標 Cloud Run 的 origin（`https://xxx-.run.app`），不是 `/api/graphql`。程式裡的 helper 用 `new URL(...).origin` 處理。

### 4. 有 Keystone session 時，ID token 要放 `X-Serverless-Authorization`

`Authorization: Bearer <keystone_session>` 被佔用時，ID token 放在 `X-Serverless-Authorization`。Cloud Run IAM 這個 header 也接受，且不會把 Keystone session 擋掉。data-services 的 `utils/gql_auth.py` 會自動判斷。

### 5. 時序窗口：先放 binding、後開 check

Phase 2a/2b 分兩步不是多此一舉。若先 update `--invoker-iam-check` 再加 binding，中間有幾秒 caller 連不上 → 用戶看到 500。先 binding 再 check 則是「開關打開瞬間就已授權」。

### 6. prod 的 CMS service 命名不對稱

dev: `eic-cms-gql-dev` / `eic-cms-preview-dev`  
prod: `eic-info-cms-gql-prod` / `eic-info-cms-preview-prod`（多 `info`）

複製指令時小心別照 dev 貼上。

### 7. data-service 是隱形 caller

最初只盤點了 eic-web 作為 CMS GraphQL caller，漏掉 `eic-data-service-dev` 這個 Python 服務也在打 CMS。鎖完 dev 後 scheduler 每 30 分鐘一輪全噴 403。補上 data-services 的 `gql_auth.py` helper 後才恢復。

prod 同樣的結構，**3 個 repo 都要先部署完才能鎖**。別漏 data-services。

### 8. Prod data-service 自己未鎖

`eic-data-service-prod` 本身仍然是 `--no-invoker-iam-check`（公開 / 由 Cloud Scheduler 呼叫）。Scheduler 呼叫時本來就帶 OIDC token，真要鎖的話需要設定 `run.invoker` 給 `eic-cron-data-service@...` SA。這不在這次 scope 裡。

### 9. CMS / data-services 的 prod 是 merge-based，不能 fast-forward push

`eic-web` 的 prod branch 是 fast-forward workflow，`git push upstream main:prod` 直接成立。但 `CMS` 和 `data-services` 的 prod branch 歷史都是 merge commits（`Merge branch 'main' into prod` 或 `Merge pull request #NN from e-info-taiwan/main`），直接 push main:prod 會被 non-fast-forward reject。

正確做法：

```bash
# CMS / data-services 兩邊都這樣
git checkout -b prod origin/prod        # 本地若還沒 prod branch
git merge main --no-ff -m "Merge branch 'main' into prod"
git push origin prod
git checkout main
```

或在 GitHub 上開 PR main → prod（對應 `Merge pull request` 樣式，有 audit trail）。

## Checklist

- [ ] eic-web prod branch 合併、build SUCCESS
- [ ] CMS prod branch 合併、build SUCCESS
- [ ] data-services prod branch 合併、build SUCCESS
- [ ] 公開網站 smoke test 200
- [ ] Phase 2a: CMS GraphQL / Preview 加 invoker binding
- [ ] Phase 2b: CMS GraphQL / Preview 打開 invoker-iam-check
- [ ] Phase 2c: 公網 curl CMS GraphQL → 403、網站 → 200、scheduler → 200
- [ ] Phase 3a: eic-web-preview-prod 加 invoker binding
- [ ] Phase 3b: eic-web-preview-prod 打開 invoker-iam-check
- [ ] Phase 3c: 公網 curl web-preview-prod → 403、編輯從 prod CMS 點預覽 → 200
