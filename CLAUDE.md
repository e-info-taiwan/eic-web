# EIC Web Project Documentation

## Project Overview

**Project Name**: EIC Web (Environment Info Center Website, 環境資訊中心)
**Codename**: Sachiel
**Tech Stack**: Yarn Workspaces monorepo + Next.js 15 (Pages Router) + TypeScript + Apollo Client 4 + styled-components 5
**Node Version**: `^20.19.5` (root `package.json`; e-info package declares `>=18.18.0`)
**Repo**: https://github.com/e-info-taiwan/eic-web

> Lerna was removed on 2026-05-13 (`adbcf17`). Use `yarn workspace e-info run <script>` from the root.

## Project Structure

```
eic-web/
├── packages/
│   ├── e-info/                        # Main Next.js application
│   │   ├── apollo-client.ts           # getGqlClient(): server → CMS direct (+ID token); browser → /api/graphql proxy
│   │   ├── components/
│   │   │   ├── post/                  # Article page components (post-content, post-credit, post-title, related-post, tag, article-type/)
│   │   │   ├── layout/                # Header / footer / layout shells
│   │   │   ├── shared/                # ResponsiveImage, ArticleListCard, Pagination, modals, TurnstileWidget…
│   │   │   ├── index/                 # Homepage sections
│   │   │   ├── member/                # Member area (bookmarks, history, profile)
│   │   │   └── auth/                  # Login / register forms
│   │   ├── pages/
│   │   │   ├── index.tsx              # Homepage (ISR 60s)
│   │   │   ├── node/[id].tsx          # Article page (ISR 600s; preview 10s)  ← NOT pages/post
│   │   │   ├── category/[id].tsx      # Category listing (SSR) — supports "column" style + classify filter
│   │   │   ├── section/[slug].tsx     # Section listing (SSR)
│   │   │   ├── tag/[name].tsx, author/[id].tsx
│   │   │   ├── feature/index.tsx, feature/[id].tsx   # Topics (專題)
│   │   │   ├── newsletter/{index,[id],subscribe}.tsx # 電子報
│   │   │   ├── event/…, job/…         # Events & jobs (list, detail, create, create/done)
│   │   │   ├── member/…               # bookmarks, history, edit, newsletter, notifications
│   │   │   ├── auth/…                 # login, register, password, *-result
│   │   │   ├── search.tsx, 404.tsx, _app.tsx, _document.tsx, _error.tsx
│   │   │   └── api/
│   │   │       ├── graphql.ts         # Same-origin proxy for browser queries (blocks mutations & member/favorites/readingHistories/event queries)
│   │   │       ├── revalidate.ts      # On-demand ISR (POST {secret, path}; REVALIDATE_SECRET)
│   │   │       ├── robots.ts          # /robots.txt (rewritten here in next.config.mjs)
│   │   │       ├── favorites/{add,check,list,remove,stats}.ts
│   │   │       ├── reading-history/{record,list,delete,delete-multiple}.ts
│   │   │       ├── member/{create,get,update,subscriptions}.ts
│   │   │       ├── newsletter/{check,subscribe}.ts   # Mailchimp
│   │   │       ├── poll/{vote,member-vote,newsletter-vote}.ts
│   │   │       ├── create-event.ts, create-job.ts, upload-photo.ts, donation-pv.ts
│   │   ├── graphql/
│   │   │   ├── query/                 # post, category, section (incl. topic queries), tag, author, event, job, newsletter, poll, donation, …
│   │   │   └── fragments/             # post (PostFields / PostFieldsCard), author, resized-images
│   │   ├── constants/                 # See "Constants Architecture"
│   │   ├── utils/                     # See "Key Utilities"
│   │   ├── hooks/                     # useAuth, useReadingProgress, useReadingTracker, useOutboundLinkTracking, useScrollRestoration, useScrollToEnd
│   │   ├── contexts/                  # auth-context etc.
│   │   ├── styles/theme/              # styled-components theme (breakpoints sm/md/lg/xl, colors, typography)
│   │   ├── types/
│   │   ├── mock-server/               # Local GraphQL mock (USE_MOCK_SERVER=true)
│   │   └── docs/                      # routes.md, prod-iam-lockdown.md, preview-mode-plan.md, ga-tracking-list.md
│   └── draft-renderer/                # @eic-web/draft-renderer 1.4.4 — Draft.js renderer (src/website/eic/)
├── docs/                              # API specs (homepage, header-footer, category/section listing, newsletter), ISR, Mailchimp, dev test data
├── Dockerfile, cloudbuild.yaml        # GCP Cloud Build → Artifact Registry → Cloud Run
└── package.json                       # yarn workspaces root, husky + lint-staged, security `resolutions`
```

## Key Technical Details

### API Environment Configuration

`NEXT_PUBLIC_ENV` selects the environment: `prod`, `dev` (also `main`, for Cloud Build branch names), or anything else = `local`. **Staging was removed** (2026-02-11).

Endpoints are split across two files:

| File | Scope | Exports |
|------|-------|---------|
| `constants/config.server.ts` | **Server-only** (API routes, `getServerSideProps`/`getStaticProps`, the `typeof window === 'undefined'` branch of `apollo-client.ts`). Never import from client-reachable code. | `API_ENDPOINT` (CMS GraphQL), `PREVIEW_API_ENDPOINT` |
| `constants/config.ts` | Runtime env vars, safe for the client bundle | `HOMEPAGE_API_ENDPOINT`, `HEADER_API_ENDPOINT`, `LISTING_API_ENDPOINT`, `POPULAR_SEARCH_ENDPOINT`, `READING_RANKING_ENDPOINT` (all GCS static JSON), `GCS_STATICS_ORIGIN`, `SITE_ORIGIN`, `FIREBASE_CONFIG`, `IS_PREVIEW_MODE`, Mailchimp / Turnstile / Firebase Admin secrets (read from `process.env`) |
| `constants/environment-variables.ts` | Build-time (`NEXT_PUBLIC_*`), also loaded by `next.config.mjs` via `ts-import` — **must stay self-contained, no local imports** | `ENV`, `SITE_URL`, `GA_TRACKING_ID`, `GTM_ID`, `GLOBAL_CACHE_SETTING`, `GOOGLE_CSE_ID`, `TURNSTILE_SITE_KEY` |

**Cloud Run IAM auth**: the CMS GraphQL services run with `--no-allow-unauthenticated`. All server-side calls attach an identity token from `utils/gcp-id-token.ts`:
- On GCP: metadata server.
- Local dev: `gcloud auth print-identity-token --impersonate-service-account=$GCP_IMPERSONATE_SA --audiences=<endpoint>`. Set `GCP_IMPERSONATE_SA` in `packages/e-info/.env.local` (you need `iam.serviceAccountTokenCreator` on that SA). Without it, requests go out unauthenticated and get 403.
- See `packages/e-info/docs/prod-iam-lockdown.md`.

**Browser → CMS**: the browser never talks to the CMS directly. `apollo-client.ts` points client-side Apollo at `${origin}/api/graphql`, which proxies to `API_ENDPOINT` (adding the ID token) but **rejects mutations** and **blocks sensitive queries** (`members`, `favorites`/`readingHistories` filtered by member, `events`). Member data goes through the dedicated `/api/**` routes with Firebase token verification (`utils/verify-firebase.ts`).

**Data sources by page** (JSON-first, GraphQL fallback):
- Homepage → `HOMEPAGE_API_ENDPOINT` (`utils/homepage-api.ts`)
- Header / footer → `HEADER_API_ENDPOINT` (`utils/header-data.ts`)
- Category / section listings → `LISTING_API_ENDPOINT/{category|section}/…` for pages 1–5, GraphQL from page 6 or on failure (`utils/listing-api.ts`)
- Reading ranking / popular search → GA4-derived JSON in the statics bucket
- Everything else → GraphQL

### Apollo Client

```typescript
// apollo-client.ts
getGqlClient()  // returns a fresh ApolloClient
// link chain: rewriteLink (rewrites GCS image URLs to same-origin /images/*) → HttpLink
// server: HttpLink({ uri: API_ENDPOINT, fetch: authFetch })   // ID token attached
// browser: HttpLink({ uri: `${window.location.origin}/api/graphql` })
// defaultOptions.query: { fetchPolicy: 'cache-first', errorPolicy: 'all' }
```

Direct server-side fetches (mutations from API routes) use `utils/server-graphql.ts` → `serverGraphQL(query, variables)`, which also attaches the ID token.

### Image URL Proxy

`next.config.mjs` rewrites `/images/:path*` → `${GCS_STATICS_ORIGIN}/images/:path*`. `utils/rewrite-gcs-urls.ts` rewrites GCS URLs inside GraphQL/JSON responses to that same-origin path (applied by the Apollo `rewriteLink` and by the JSON API utils).

### Constants Architecture

```
constants/
├── config.ts                 # Runtime env & public endpoints (see table above)
├── config.server.ts          # Server-only: API_ENDPOINT / PREVIEW_API_ENDPOINT
├── environment-variables.ts  # Build-time NEXT_PUBLIC_* (self-contained; loaded by next.config.mjs)
├── constant.ts               # SITE_TITLE, default images, POST_STYLES
├── layout.ts                 # MAX_CONTENT_WIDTH ('1200px') / MAX_CONTENT_WIDTH_NUM
│                             # POSTS_PER_PAGE (12), POSTS_PER_CATEGORY (3)
│                             # CACHE_MAX_AGE_SECONDS (600), CACHE_TTL_MS, API_TIMEOUT_MS, HEALTH_CHECK_TIMEOUT_MS
├── social.ts                 # SOCIAL_LINKS { facebook, x, instagram, line }, SHARE_URL { facebook(), x(), line() }
├── auth.ts                   # Location options, validation rules
├── redirects.ts              # getNextRewrites(): static-page rewrites (about, faq, privacy… → /node/{id})
├── taxonomy-redirects.ts     # getTaxonomyTermRedirects(): 315 legacy /taxonomy/term/{id} → new URLs
└── legacy-path-redirects.ts  # getLegacyPathRedirects(): legacy article path aliases → /node/{id}
```

**Usage Guidelines**:
- Use `MAX_CONTENT_WIDTH` in styled-components instead of hardcoded `1200px`
- Import `POSTS_PER_PAGE` / `POSTS_PER_CATEGORY` from `~/constants/layout`
- Use `SOCIAL_LINKS` for profile links, `SHARE_URL` for share buttons
- Never hardcode endpoints in utility files; never import `config.server.ts` from components
- `CACHE_MAX_AGE_SECONDS` is duplicated literally in `environment-variables.ts` (ts-import limitation) — keep both in sync

### Routing, Redirects & Sitemap (`next.config.mjs`)

- **Rewrites**: `/robots.txt` → `/api/robots`; `/sitemap/:path*` → GCS statics bucket (sitemaps are generated by data-services, not this repo); `/images/:path*` → GCS; plus `getNextRewrites()` (static pages like `/about` → `/node/2`, `/about-en` → `/node/243200`)
- **Redirects (301)**: `/sitemap.xml` and `/sitemap-*.xml` → `/sitemap/…`; `/rss/posts.xml` → sitemap; legacy `/YYYY/MM/DDDD/file.htm` and `/YYYY/index.htm` → `gs://e-info-legacy`; 315 taxonomy term redirects; legacy article path aliases
- `output: 'standalone'`, `outputFileTracingRoot` set to repo root for the monorepo

### Caching / Rendering Strategy

Full table in `packages/e-info/docs/routes.md`. Summary:

| Page | Mode | Cache |
|------|------|-------|
| `/` | ISR (`getStaticProps`) | `revalidate: 60` |
| `/node/[id]` | ISR | `revalidate: CACHE_MAX_AGE_SECONDS` (600); preview 10; 404 → `revalidate: 60` |
| Listings (`/category`, `/section`, `/tag`, `/author`, `/feature`, `/event`, `/job`, `/search`) | SSR | `public, max-age=600` (prod) via `setCacheControl()` — dev is `no-store` |
| Member / auth pages | SSR | `private, no-store` via `setPrivateCacheControl()` |

On-demand ISR: `POST /api/revalidate` with `{ secret, path }` (`REVALIDATE_SECRET`). See `docs/isr-revalidation.md`.

### GraphQL Schema (as used by the frontend)

#### Post

```typescript
type Post {
  id, title, subtitle, style, state, publishTime, otherByline
  heroImage / ogImage: Photo { resized { original w480 w800 w1200 w1600 w2400 } resizedWebp { … } }
  content: String            // Draft.js raw JSON string — rendered by DraftRenderer
  contentApiData: JSON       // New array format — queried, NOT rendered
  contentPreview: String     // Plain-text excerpt — used by all listing cards (replaces brief/contentApiData in lists)
  brief: JSON | String       // Draft.js raw object (new) or plain string (legacy) — post-content handles both
  briefApiData: JSON         // Not rendered
  citations: JSON | String   // Draft.js raw object (new) or HTML string (legacy) — post-content handles both
  categories: [Category]     // ← plural; a post can belong to multiple categories (2026-04-13)
  section: Section
  topic: Topic
  tags: [Tag]
  locations: [Location]
  // Author roles — each has an *InInputOrder variant honouring CMS input order;
  // fall back to the plain field when InInputOrder is empty.
  reporters, stringers (特約記者), translators, reviewers, writers, sources: [Author]
  reportersInInputOrder, stringersInInputOrder, …: [Author]
  relatedPosts: [Post]
  attachments: [Attachment]
  poll: Poll
  ad: PostAd
  isNewsletter: Boolean
}
```

Removed from the schema (don't query): `category` (singular), `heroCaption`, `author1/2/3`, `actionList`.

Two fragments in `graphql/fragments/post.ts`: `PostFields` (detail pages, full image sizes, `brief` + `contentApiData`) and `PostFieldsCard` (listings: `original/w480/w800` only, `contentPreview`). Listing queries must filter `state: { equals: "published" }`.

#### Category

```typescript
type Category {
  id, slug, name, sortOrder, description
  heroImage: Photo
  posts: [Post], postsCount
  featuredPosts / featuredPostsInInputOrder: [Post]
  section: Section
  style: String               // 'column' → column listing layout
  classifies: [Classify]      // Sub-classification tags; /category/[id]?classify={id} filters
  columnClassifyTags: [Classify]
}
```

Both Section and Category have a `style` field. When it is `'column'`, `/category/[id]` renders the **column layout** (`categoryColumnPageData` query: classify grid with posts, category's own heroImage, section/category description). Section-level column pages use `columnCategoryTags` for the tag row (fallback: `categories`).

#### Topic (專題, `/feature`)

```typescript
type Topic {
  id, title, status, authorInfo, isPinned, sortOrder, publishTime, updatedAt
  content: JSON | String     // "Preface" — Draft.js raw object (new) or legacy plain string
  heroImage: Photo
  posts: [Post], postsCount
  postsInInputOrder: [Post]  // CMS manual order — topicById aliases it to `posts`
  redirectUrl: String        // If set, /feature/[id] 302s to it
}
```

- `tags` was **removed** from Topic (2026-02-26).
- `/feature` list orders by `publishTime desc` (`allTopics`), falling back to `updatedAt` (`allTopicsFallback`) if the backend lacks the field.
- `/feature/[id]` tries `topicById` (`postsInInputOrder`) and falls back to `topicByIdFallback` (`publishTime desc`) on schema error — prod may lag dev. Both live in `graphql/query/section.ts`.

#### Tag / Section

Unchanged from earlier docs: Tag `{ id name brief heroImage isFeatured sortOrder posts postsCount topics topicsCount }`; Section `{ id slug name style description heroImage columnCategoryTags categories categoriesCount }`.

#### ResizedImages

Sizes are `w480`, `w800`, `w1200`, `w1600`, `w2400` (card fragments only request `original`, `w480`, `w800`).

### Draft.js Content Rendering (`@eic-web/draft-renderer` 1.4.4)

Source lives in `packages/draft-renderer/src/website/eic/`; build with `yarn workspace @eic-web/draft-renderer build` (babel → `lib/`). `lib/` is committed — rebuild and commit it whenever `src/` changes, or the app won't see the change.

**Block renderers** (`block-renderers/`): `image` (supports `link` URL → clickable, `captionRichText` with inline links), `slideshow` (v1 + **slideshow-v2**: justified rows, `widthPercentage`, `maxImagesPerRow`, `lightboxEnabled`; mobile 4:3), `video` (`youtube` + **video-v2** YouTube embed; infographic image takes priority when both exist), `audio`, `background-image`, `background-video`, `info-box` (multi-paragraph, images), `color-box`, `divider`, `embedded-code`, `related-post`, `side-index` (in-article TOC; headings rendered as `h3`; has a mobile panel), `table` (links/bold/custom styles in cells, vertically centred, horizontal scroll when wide), `media`.

**Rendering rules in `components/post/post-content.tsx`**:
- Render `content` (Draft.js string) via `DraftRenderer`; `contentApiData` is ignored (incompatible array format)
- `brief`: Draft.js object → `DraftRenderer`; string → plain text. Bold renders at font-weight 900; custom colours preserved, default green
- `citations`: string → `dangerouslySetInnerHTML`; object → `DraftRenderer`. Section is hidden when empty (`hasContentInRawContentBlock`)
- Long content is **split into up to 3 `DraftRenderer` segments** at safe block boundaries (never inside consecutive list blocks) so ads can be interleaved
- Footnotes are extracted from content (`extractFootnotesFromContent`)
- Heading styles h1–h5 defined in draft-renderer shared-style; body min 18px desktop

### Images

Use `components/shared/responsive-image.tsx` (`ResponsiveImage`) — a stateless replacement for `@readr-media/react-image`'s `SharedImage` that fixed stale-image bugs (2026-05-08). Hero images fall back to the default image on load failure. Card image containers use fixed `aspect-ratio` (4:3 for article cards, 2:1 for topic cards / hero images at max 960px) to avoid layout shift. Default images differ by post style (editor `編輯直送` posts) and by page (event / newsletter lists).

### Fonts

Noto Sans TC is self-hosted via `next/font/google` in `pages/_app.tsx` (2026-05-19) to avoid the Google Fonts CDN slice race and mixed-weight CJK rendering on Windows Firefox. Don't add `<link>` tags to Google Fonts.

### Member / Auth

- Firebase Auth (client, `FIREBASE_CONFIG`) + Firebase Admin (server, `FIREBASE_ADMIN_*`) for token verification
- Cloudflare Turnstile on public forms (event/job create, upload-photo, newsletter); `TURNSTILE_SECRET_KEY` unset → verification skipped
- Member APIs under `/api/favorites`, `/api/reading-history`, `/api/member`; bookmarks page has favourite stats per section and section filtering, infinite scroll
- Newsletter subscription via Mailchimp dual audiences (`MAILCHIMP_LIST_ID_DAILY` / `_WEEKLY`); `/api/newsletter/check` verifies status before subscribing. See `docs/newsletter-subscription-spec.md`, `docs/mailchimp-template-guide.md`

### SEO: Head Meta & JSON-LD

- `components/layout/custom-head.tsx` renders title / description / canonical / OG / Twitter. Pass `path` (site-relative) so canonical + `og:url` are correct; pass `type="article"` with `publishedTime` / `modifiedTime` / `section` / `tags` on article pages to emit `article:*` meta. Absolute URLs use `SITE_ORIGIN` (`config.ts`), never `SITE_URL`.
- `CustomHead` also emits site-wide JSON-LD (`NewsMediaOrganization` + `WebSite` with `SearchAction`) on every page; articles reference the organization via `@id`.
- Builders live in `utils/json-ld.ts` (`buildNewsArticle`, `buildArticleBreadcrumb`, `buildBreadcrumb`, `buildOrganization`, `buildWebSite`); render with `<JsonLd id="…" data={…} />` (`components/layout/json-ld.tsx`), which escapes `<` so `</script>` in content can't break out.
- `/node/[id]` emits `NewsArticle` + `BreadcrumbList` (首頁 → section → categories[0] → 文章). Author = reporters + writers + stringers (`*InInputOrder` first), falling back to `otherByline`; translators / reviewers / sources are not authors. Redirect pages (`/about` etc.) get `type="website"` and no article JSON-LD.
- Listing / feature / newsletter pages pass `path` and `breadcrumbs` to `LayoutGeneral`, which forwards `path` to `CustomHead` (canonical / `og:url`; paginated pages use `pagedPath()` → `?page=N`) and renders `BreadcrumbList` JSON-LD. Use `HOME_CRUMB` as the first item. Deliberately no `ItemList` / `CollectionPage` — no rich-result benefit.

### GA4 Analytics Tracking (`utils/gtag.ts`)

```typescript
sendEvent(category, action, label?)
sendEventWithDimensions(category, action, label?, dimensions?)
sendArticlePageview(path, { articleId, articleTitle, articleCategory, articleSection, articleTags })
sendConversion('newsletter_subscribe' | 'donation_complete' | 'share_complete' | 'external_link_click', value?)
sendMemberEvent('login' | 'register' | 'logout' | 'bookmark' | 'unbookmark', label?)
sendReadingProgress(progress, articleId?, articleCategory?)
sendOutboundClick(url, linkText?)
```

Hooks: `useReadingProgress` (25/50/75/100%), `useOutboundLinkTracking`, `useReadingTracker` (reading history). Donation clicks post to `/api/donation-pv`. Full event list: `packages/e-info/docs/ga-tracking-list.md`.

### Key Utilities (`utils/`)

| File | Purpose |
|------|---------|
| `server-graphql.ts` | Server-side GraphQL fetch with ID token (used by API routes for mutations) |
| `gcp-id-token.ts` | Cloud Run / gcloud-impersonation identity token, cached per audience |
| `homepage-api.ts`, `header-data.ts`, `listing-api.ts` | JSON-first data loaders with GraphQL fallback, timeouts, TTL cache |
| `rewrite-gcs-urls.ts` | Rewrite GCS URLs → `/images/*` |
| `common.ts` | `setCacheControl()` / `setPrivateCacheControl()`, `isServer` |
| `page-props.ts` | `withHeaderData()` / `withHeaderDataStatic()` — wrap `getServerSideProps` / `getStaticProps` to inject header/footer data |
| `preview.ts` | Preview-mode helpers |
| `verify-firebase.ts`, `verify-turnstile.ts` | Server-side auth / bot checks |
| `post.ts`, `data-set.ts`, `gravatar.ts`, `local-storage.ts` | Misc helpers |

## Development Workflow

```bash
yarn install                              # root
yarn workspace e-info run dev             # http://localhost:3000
yarn workspace e-info run build
yarn workspace e-info run mock-server     # optional local GraphQL mock (USE_MOCK_SERVER=true)
yarn workspace @eic-web/draft-renderer build   # after editing draft-renderer/src
cd packages/e-info && yarn next lint [--fix]
```

`packages/e-info/.env.local` (not committed) — commonly needed: `NEXT_PUBLIC_ENV`, `GCP_IMPERSONATE_SA` (to reach the IAM-locked CMS locally), `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`, `MAILCHIMP_*`, `FIREBASE_ADMIN_*`, `REVALIDATE_SECRET`.

Git hooks (husky + lint-staged): pre-commit runs `eslint --fix` on staged files, skipping `packages/draft-renderer`.

### Testing GraphQL API

The Cloud Run GraphQL endpoints return `403` for plain curl. Attach a gcloud identity token:

```bash
TOKEN=$(gcloud auth print-identity-token)

curl -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query ($id: ID!) { posts(where: { id: { equals: $id } }) { id title citations categories { id name } } }",
    "variables": { "id": "238646" }
  }'

# Complex queries: write to a file first
cat > /tmp/query.json << 'EOF'
{ "query": "query { categories(orderBy: { sortOrder: asc }) { id slug name postsCount posts(take: 3) { id title publishTime } } }" }
EOF
curl -X POST https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d @/tmp/query.json | jq '.'
```

Endpoints: dev `eic-cms-gql-dev-…`, prod `eic-info-cms-gql-prod-…`, preview `eic-cms-preview-{dev,prod}-…` (see `config.server.ts`).

**Test IDs in Dev Environment** (fuller list in `docs/dev-test-data.md`):
- **Post**: `238659` (最新測試文章), `238646` (heroImage + citations), `238651` (complete citations), `2` (關於我們, via `/about` rewrite), `243200` (`/about-en`)
- **Category**: `2` / `testcategory`, `7` / `taiwannews` (8 posts)
- **Section**: `3` / `latestnews` (時事新聞), `4` / `column` (專欄, column style)
- **Topic**: `3` (直擊阿聯氣候新時代, isPinned), `2` (測試用專題, 8 posts)
- **Tags**: `12` (深度報導), `13` (中國新聞), `16` (回顧與前瞻)

## Deployment

Cloud Build (`cloudbuild.yaml`) → `docker buildx` with registry layer cache → Artifact Registry `asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/` → Cloud Run. Branch name becomes `NEXT_PUBLIC_ENV` (`main` maps to dev config). `NEXT_PUBLIC_*` values are passed as `--build-arg` so they reach `next build`. Substitutions: `_IMAGE_NAME`, `_IS_PREVIEW_MODE`, `_TURNSTILE_SITE_KEY`. Preview mode is a separate deployment with `NEXT_PUBLIC_IS_PREVIEW_MODE=true` (uses `PREVIEW_API_ENDPOINT`, `no-store`, ISR 10s).

## Documentation Index

| Location | Contents |
|----------|----------|
| `docs/homepage-api-spec.md`, `docs/homepage-api-example.json` | Homepage JSON contract |
| `docs/header-footer-api-spec.md`, `docs/header-footer-api-example.json` | Header/footer JSON contract |
| `docs/category-listing-api-spec.md`, `docs/section-listing-api-spec.md`, `docs/listing-json-integration-plan.md` | Listing JSON API |
| `docs/graphql-api.md` | GraphQL reference |
| `docs/isr-revalidation.md` | On-demand ISR |
| `docs/newsletter-api-spec.md`, `docs/newsletter-subscription-spec.md`, `docs/mailchimp-template-guide.md` | Newsletter |
| `docs/dev-test-data.md` | Dev CMS data inventory |
| `packages/e-info/docs/routes.md` | Every route with render mode & cache policy |
| `packages/e-info/docs/prod-iam-lockdown.md` | Cloud Run IAM lockdown playbook |
| `packages/e-info/docs/preview-mode-plan.md` | Preview deployment design |
| `packages/e-info/docs/ga-tracking-list.md` | GA4 event inventory |

## Common Issues

1. **403 from CMS locally** → set `GCP_IMPERSONATE_SA` in `.env.local` and make sure you're `gcloud auth login`'d with an account that can impersonate it.
2. **Images not displaying** → `resized`/`resizedWebp` null: pass `src={image?.url}` fallback to `ResponsiveImage`.
3. **Content not rendering** → render `content` (Draft.js string), not `contentApiData`; `brief`/`citations` may be object *or* string — handle both.
4. **draft-renderer change not showing** → rebuild `lib/` and commit it.
5. **`next.config.mjs` fails to load a constant** → files loaded via `ts-import` (`environment-variables.ts`, `redirects.ts`, `taxonomy-redirects.ts`, `legacy-path-redirects.ts`, `config.ts`) cannot import `~/…` paths.
6. **Client bundle contains CMS URL** → something imported `config.server.ts` from client-reachable code.
7. **Topic page works in dev, 500 in prod** → schema lag; use the `*Fallback` query pattern.
8. **Hydration errors on cards** → use the stretched-link pattern (`<Link>` + overlay) as in `article-list-card.tsx`, not `onClick` + `router.push`. Next 15: no `legacyBehavior` / nested `<a>`.

## Change Log (condensed)

### 2026-06 → 2026-09
- SEO: `NewsArticle` + `BreadcrumbList` JSON-LD on article pages, `BreadcrumbList` + canonical on category / section / tag / author / feature / newsletter pages, site-wide Organization/WebSite JSON-LD, canonical + `og:url` + `og:type=article` + `article:*` meta in `CustomHead`; `updatedAt` added to post query
- Sitemap index served from statics bucket via `/sitemap/*` rewrite; `robots.txt` declares it (`952ff2d`, `cbd83ee`)
- Hero image → default-image fallback on load failure; draft-renderer default-image path fix (`1e39920`, `de7ad67`)
- Member bookmarks: favourite stats + section filtering (`4dc0225`); donation button; GraphQL-driven section descriptions (`2a525bf`)
- Topic posts use CMS manual order (`postsInInputOrder`) with prod-compatible fallback (`b5f86ae`, `5195c86`)
- Legacy redirects: 315 taxonomy/term URLs + article aliases (`6452f76`, `1157c68`)

### 2026-05
- **Next.js 14 → 15.5.18**, `<Link legacyBehavior>` patterns migrated, Lerna removed, yarn audit fixes via `resolutions` (`de26665`, `ec33483`, `adbcf17`, `535da7f`)
- Noto Sans TC self-hosted via `next/font` (`1645a43`)
- `SharedImage` → stateless `ResponsiveImage` (`ce2c1b2`); copy-link button; bookmark/copy tooltips
- Stringers (特約記者) surfaced in PostCredit and author pages (`7919164`)

### 2026-04
- **CMS GraphQL endpoints moved to server-only `config.server.ts`; Cloud Run ID token attached server-side; local dev impersonation** (`e02eb19`, `e8f85f8`, `be7087a`)
- **Post `category` → `categories[]`** (`7aa939a`); author `*InInputOrder` fields (`2bad7db`, `71789d6`)
- Column-style category pages + classify filtering (`4fbc3c0`, `e27dd8d`)
- Topic preface as Draft.js rich text with legacy string support (`3c0f27a`, `723bfc6`); topic cards 2:1
- GCS image proxy via `/images/*` rewrite (`894c5bb`); `www` subdomain for prod `SITE_ORIGIN`
- draft-renderer: VIDEO-V2, captionRichText, side-index mobile panel, infographic priority
- Cloud Build: buildx registry cache, regional AR, alpine images, `--build-arg` for `NEXT_PUBLIC_*`

### 2026-03
- Backend schema change: `brief` is Draft.js, `heroCaption` removed (`28d812f`); citations rendered from Draft.js (`2c3f875`)
- Category/section listing JSON API (`afe45a5`); reading ranking from GA4 (`7caa773`)
- On-demand ISR `/api/revalidate`; `CACHE_MAX_AGE_SECONDS` unified; private no-store for member/auth (`1f799c8`, `89f7b8f`, `d1afa3a`)
- Proxy blocks event queries (`87dbfc4`); published-state filters on listing queries
- Custom scroll-restoration hook (`ca9b547`); `ServerStyleSheet` restored to prevent FOUC
- draft-renderer: slideshow-v2 options & justified layout, infobox multi-paragraph, table cell styling, h1–h5 heading styles, clickable image links, annotation styles
- Mailchimp status check before subscribe (`9bd6a14`); Turnstile locked to light theme
- Topic `tags` removed; `/feature` sorted by `publishTime` with fallback

### 2026-02
- `contentPreview` replaces `brief`/`contentApiData` in listing queries (`d528b4f`)
- Staging env removed; prod endpoints updated; homepage/header from GCS static JSON (`cb456e8`, `54a7c18`)
- Newsletter templates converted to table layout; Turnstile fixes; Google CSE SPA fixes
- Topic `redirectUrl`; infinite scroll on bookmarks/history; event/job create split into done pages
- Constants extraction (`social.ts`, `layout.ts`, endpoint consolidation) (`00f2f17`)
- Legacy post styles and dead code removed (`d8315a8`)

### 2025-10 → 2026-02 (earlier)
- GA4 enhancements (article dimensions, conversions, member events, reading progress, outbound links) (`6495f6d`)
- Dead code cleanup (editools client, google-sheets API, MISO SDK) (`6495f6d`, `b5eefec`)
- Post layout refactor, tags moved to PostCredit, RelatedPosts card grid, Apollo `HttpLink` migration (`954c5be`)
- Citations styling, image `src` fallback, lint fixes (`445728b`, `3fecc02`, `4475ef4`)

---

**Last Updated**: 2026-09-18
