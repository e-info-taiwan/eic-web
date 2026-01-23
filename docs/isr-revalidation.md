# ISR 與 On-Demand Revalidation 說明

## 目前實作

文章頁 (`/node/[id]`) 已採用 ISR (Incremental Static Regeneration)：

- **`fallback: 'blocking'`**：新文章首次訪問時按需生成
- **`revalidate: 300`**：每 5 分鐘重新驗證快取

## On-Demand Revalidation（待實作）

若需要在 CMS 更新文章時立即清除快取，可新增以下 API：

### 1. 建立 API Route

```typescript
// pages/api/revalidate.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 驗證 secret token
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const id = req.query.id as string

  if (!id) {
    return res.status(400).json({ message: 'Missing id parameter' })
  }

  try {
    // 重新驗證指定文章頁面
    await res.revalidate(`/node/${id}`)
    return res.json({ revalidated: true, path: `/node/${id}` })
  } catch (err) {
    // 若發生錯誤，Next.js 會繼續使用舊的快取
    return res.status(500).json({ message: 'Error revalidating' })
  }
}
```

### 2. 設定環境變數

在 `.env.local` 或部署環境中設定：

```
REVALIDATE_SECRET=your-secret-token-here
```

### 3. 從 CMS 觸發

當 CMS 發布或更新文章時，呼叫此 API：

```bash
# 單篇文章
curl "https://your-domain.com/api/revalidate?id=238659&secret=your-secret-token"

# 回應
{ "revalidated": true, "path": "/node/238659" }
```

### 4. Keystone.js Webhook 設定（選項）

可在 Keystone CMS 的 `afterOperation` hook 中自動觸發：

```typescript
// keystone.ts (CMS 端)
Post: list({
  hooks: {
    afterOperation: async ({ operation, item }) => {
      if (operation === 'update' || operation === 'create') {
        await fetch(
          `${process.env.FRONTEND_URL}/api/revalidate?id=${item.id}&secret=${process.env.REVALIDATE_SECRET}`
        )
      }
    },
  },
})
```

## 調整 revalidate 時間

可根據需求在 `pages/node/[id].tsx` 調整：

| 時間 | 適用情境 |
|------|---------|
| `60` | 新聞類，需要較即時更新 |
| `300` | 一般文章（目前設定）|
| `3600` | 舊文章，較少更新 |

## 相關文件

- [pages/node/[id].tsx](../packages/e-info/pages/node/[id].tsx) - ISR 實作位置
- [Next.js ISR 文件](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
