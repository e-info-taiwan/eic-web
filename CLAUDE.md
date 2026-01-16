# EIC Web Project Documentation

## Project Overview

**Project Name**: EIC Web (Environment Info Center Website)
**Codename**: Sachiel
**Tech Stack**: Lerna Monorepo + Next.js + TypeScript + Apollo GraphQL
**Node Version**: >= 18.18.0

## Project Structure

```
eic-web/
├── packages/
│   ├── e-info/                    # Main website application
│   │   ├── components/            # React components
│   │   │   ├── node/             # Post-related components
│   │   │   │   ├── article-type/ # Different article types
│   │   │   │   ├── post-content.tsx
│   │   │   │   ├── post-credit.tsx
│   │   │   │   ├── post-title.tsx
│   │   │   │   ├── related-post.tsx
│   │   │   │   └── tag.tsx
│   │   │   ├── layout/           # Layout components
│   │   │   ├── shared/           # Shared components
│   │   │   ├── index/            # Homepage components
│   │   │   ├── about/            # About page components
│   │   │   └── ad/               # Advertisement components
│   │   ├── pages/                # Next.js page routes
│   │   │   ├── _app.tsx          # App entry
│   │   │   ├── index.tsx         # Homepage
│   │   │   ├── post/[id].tsx     # Post page
│   │   │   ├── category/[slug].tsx
│   │   │   ├── author/[id].tsx
│   │   │   ├── tag/[name].tsx
│   │   │   ├── about.tsx
│   │   │   └── api/              # API routes
│   │   ├── graphql/              # GraphQL queries & fragments
│   │   │   ├── query/
│   │   │   │   └── post.ts       # Post queries
│   │   │   └── fragments/
│   │   │       ├── post.ts
│   │   │       ├── author.ts
│   │   │       └── resized-images.ts
│   │   ├── constants/            # Constants
│   │   │   ├── config.ts         # API endpoints config
│   │   │   └── constant.ts       # Common constants
│   │   ├── utils/                # Utility functions
│   │   ├── styles/               # Styles
│   │   │   └── theme/            # styled-components theme
│   │   ├── hooks/                # React Hooks
│   │   ├── types/                # TypeScript type definitions
│   │   └── contexts/             # React Context
│   └── draft-renderer/           # Draft.js content renderer
│       └── (Separate package, migrated to @eic-web/draft-renderer 1.4.4)
├── .husky/                       # Git hooks
├── lerna.json                    # Lerna config
├── package.json                  # Root package.json
└── cloudbuild.yaml              # GCP Cloud Build config
```

## Key Technical Details

### API Environment Configuration

API endpoints are defined in `packages/e-info/constants/config.ts`:

- **Development**: `https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql`
- **Staging**: `https://readr-gql-staging-4g6paft7cq-de.a.run.app/api/graphql`
- **Production**: `https://readr-gql-prod-4g6paft7cq-de.a.run.app/api/graphql`

Environment variable `NEXT_PUBLIC_ENV` controls which environment to use (local/dev/staging/prod).

### Apollo Client Configuration

Apollo Client is initialized in two files:
- `packages/e-info/apollo-client.ts` - Main CMS API
- `packages/e-info/editools-apollo-client.ts` - Editools API

**Important**: Migrated from `uri` parameter to `HttpLink` to avoid Apollo Client v4 deprecation warning.

```typescript
// Correct Apollo Client configuration
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({ uri: API_ENDPOINT }),
  cache: new InMemoryCache(),
})
```

### GraphQL Schema

#### Post Data Structure

```typescript
type Post {
  id: string
  title: string
  style: string
  publishTime: string
  heroImage: {
    resized: {
      original: string
      w480: string
      w800: string
      w1200: string
      w1600: string
      w2400: string
    }
    resizedWebp: { ... }
  }
  ogImage: { ... }
  content: string          // Legacy: draft-js JSON string
  contentApiData: JSON     // New: API format content
  brief: JSON              // Legacy: draft-js brief
  briefApiData: JSON       // New: API format brief
  citations: string        // HTML string for references
  tags: [Tag]
  category: Category
  section: Section
  author1, author2, author3: Author
  relatedPosts: [Post]
  // ... more fields
}
```

#### Category Data Structure

```typescript
type Category {
  id: ID!
  slug: String              // URL-friendly identifier (e.g., "ecomid")
  name: String              // Display name (e.g., "環中")
  sortOrder: Int            // Display order
  heroImage: Photo          // Hero image for category
  heroImageCaption: String  // Image caption
  posts: [Post]             // Related posts (ordered by publishTime)
  postsCount: Int           // Number of posts
  featuredPosts: [Post]           // Featured posts (ordered by add time)
  featuredPostsInInputOrder: [Post] // Featured posts (ordered by CMS input order)
  section: Section          // Parent section
  classifies: [Classify]    // Classifications
  classifiesCount: Int
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

**Example Query**:
```graphql
query {
  categories(orderBy: { sortOrder: asc }) {
    id
    slug
    name
    postsCount
    # Featured posts first (in CMS input order), then regular posts
    featuredPostsInInputOrder {
      id
      title
      publishTime
    }
    posts(take: 10) {
      id
      title
      publishTime
    }
  }
}
```

#### Topic Data Structure

```typescript
type Topic {
  id: ID!
  title: String             // Topic title
  status: String            // "published", "draft", etc.
  content: String           // Topic description/summary
  heroImage: Photo          // Hero image for topic
  posts: [Post]             // Related articles
  postsCount: Int           // Number of articles
  tags: [Tag]               // Related tags
  tagsCount: Int            // Number of tags
  isPinned: Boolean         // Whether pinned to top
  sortOrder: Int            // Display order (used for homepage sorting)
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

**Example Query**:
```graphql
query {
  # Homepage uses sortOrder for ordering
  topics(orderBy: { sortOrder: asc }) {
    id
    title
    status
    content
    heroImage {
      resized {
        original
        w480
        w800
        w1200
      }
    }
    postsCount
    posts(take: 24) {
      id
      title
      publishTime
      heroImage {
        resized {
          original
          w480
        }
      }
    }
    tags {
      id
      name
    }
    isPinned
    sortOrder
  }
}
```

**Dev Environment Test Data**:
- Topic ID `3`: "直擊阿聯氣候新時代" (4 posts, isPinned: true)
- Topic ID `2`: "測試用專題" (8 posts, 2 tags)

#### Tag Data Structure

```typescript
type Tag {
  id: ID!
  name: String              // Tag name
  brief: String             // Tag description
  heroImage: Photo          // Tag hero image
  isFeatured: Boolean       // Whether featured tag
  sortOrder: Int            // Display order
  posts: [Post]             // Related posts
  postsCount: Int           // Number of posts
  topics: [Topic]           // Related topics
  topicsCount: Int          // Number of topics
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

**Example Query**:
```graphql
query {
  tags(where: { isFeatured: { equals: true } }) {
    id
    name
    brief
    postsCount
    topicsCount
  }
}
```

#### Section Data Structure

```typescript
type Section {
  id: ID!
  slug: String              // URL-friendly identifier (e.g., "latestnews")
  name: String              // Display name (e.g., "時事新聞")
  categories: [Category]    // Child categories
  categoriesCount: Int      // Number of categories
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: User
  updatedBy: User
}
```

**Example Query**:
```graphql
query {
  sections {
    id
    slug
    name
    categoriesCount
    categories {
      id
      slug
      name
      postsCount
    }
  }
}
```

**Dev Environment Sections**:
| ID | Slug | Name | Categories |
|---|---|---|---|
| 2 | testsection | 測試大分類 | 1 |
| 3 | latestnews | 時事新聞 | 9 |
| 4 | column | 專欄 | 55 |
| 5 | sub | 副刊 | 12 |
| 6 | green | 綠色消費 | 3 |
| 7 | critic | 評論 | 3 |

#### ResizedImages Field Names

Image sizes use `w480`, `w800`, `w1200`, `w1600`, `w2400`, **not** `small`, `medium`, `large`.

### Draft.js Content Rendering

The project uses a custom draft-renderer package (`@eic-web/draft-renderer` v1.4.4).

**Important Changes**:
- New API format uses `contentApiData` and `briefApiData` fields
- These fields are JSON objects, passed directly to the `<Eic>` component
- Image rendering uses `SharedImage` component with fallback mechanism:
  ```typescript
  images={resized} or src={image.url}
  ```

### Styled Components Theme

Theme is defined in `packages/e-info/styles/theme/`, including:
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Color system
- Typography

## Recent Important Changes (2025-10-13)

### 1. Post Layout Refactoring

**Commit**: `954c5be` - Refactor post layout and fix Apollo Client deprecation

**Changes**:
- Moved `RelatedPosts` to the same column as `PostContent` (not in Aside)
- Redesigned `RelatedPosts` as a responsive card grid:
  - Mobile: 1 column
  - Tablet (md): 2 columns
  - Desktop (xl): 3 columns
- Removed dependency on `@readr-media/react-component`'s `RelatedReport`
- Updated text: "相關報導" → "相關文章", "最新報導" → "最新文章"

**Files**:
- `packages/e-info/components/post/article-type/news.tsx`
- `packages/e-info/components/post/related-post.tsx`

### 2. Tags Moved to PostCredit

**Commit**: `954c5be` (same as above)

**Changes**:
- Moved `<PostTag>` and media links from `PostContent` to `PostCredit`
- Added `TagSection` styled component below author information
- Removed `TagGroup` and `DesktopMediaLink` styled components

**Files**:
- `packages/e-info/components/post/post-credit.tsx`
- `packages/e-info/components/post/post-content.tsx`

### 3. Apollo Client Deprecation Fix

**Commit**: `954c5be` (same as above)

**Changes**:
- Changed from `uri: <url>` to `link: new HttpLink({ uri: <url> })`
- Fixed Apollo Client v4 deprecation warning

**Files**:
- `packages/e-info/apollo-client.ts`
- `packages/e-info/editools-apollo-client.ts`

### 4. Citations Styling Update

**Commit**: `445728b` - Update citation section styling and render HTML content

**Changes**:
- Changed title to green (#2d7a4f) `<h3>` tag
- Removed purple background (#f5f0ff) and dark blue title background (#0b2163)
- Removed center alignment and padding
- Added list styles (ul/li) and link styles
- Used `dangerouslySetInnerHTML` to render HTML content

**Important**: Citations field is an HTML string containing complete `<h3>`, `<ul>`, `<li>`, `<a>` tags.

**Files**:
- `packages/e-info/components/post/post-content.tsx`

**Style Example**:
```css
h3 {
  color: #2d7a4f;
  font-size: 20px (mobile) / 24px (desktop);
  font-weight: 700;
}

.content a {
  color: #2d7a4f;
  text-decoration: underline;
}

.content li {
  font-size: 16px (mobile) / 18px (desktop);
  line-height: 1.8;
}
```

### 5. Image Rendering Fix

**Commit**: `3fecc02` - Fix image rendering - fallback to src when resized images unavailable

**Changes**:
- When `resized` or `resizedWebp` are unavailable, fallback to `image.url`
- Use `SharedImage`'s `src` prop as fallback

**Files**:
- `packages/e-info/components/post/post-content.tsx`

### 6. Linting Fixes

**Commit**: `4475ef4` - Fix linting errors - prettier formatting and import sorting

**Changes**:
- Fixed prettier formatting errors (removed extra blank lines)
- Fixed import sorting (simple-import-sort rules)

## Development Workflow

### Install Dependencies

```bash
# Root level
yarn install

# Or within e-info package
cd packages/e-info
yarn install
```

### Development Server

```bash
cd packages/e-info
yarn dev

# Or use lerna from root
lerna run dev --scope=readr
```

Runs at `http://localhost:3000` by default

### Build

```bash
cd packages/e-info
yarn build
```

### Linting

```bash
# Within e-info package
yarn next lint

# Auto-fix
yarn next lint --fix
```

### Git Hooks

Project uses husky and lint-staged:
- Pre-commit: Auto-runs eslint --fix on staged files
- **Note**: Files in `packages/draft-renderer` are skipped

### Testing GraphQL API

You can test the API using curl:

```bash
# Example: Query post
curl -X POST "https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query ($id: ID!) { posts(where: { id: { equals: $id } }) { id title citations } }",
    "variables": { "id": "238646" }
  }'

# Example: Query all categories
cat > /tmp/query.json << 'EOF'
{
  "query": "query { categories(orderBy: { sortOrder: asc }) { id slug name postsCount posts(take: 3) { id title publishTime } } }"
}
EOF
curl -X POST https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql \
  -H 'Content-Type: application/json' \
  -d @/tmp/query.json | jq '.'

# Example: Query all topics with posts and tags
cat > /tmp/query.json << 'EOF'
{
  "query": "query { topics { id title status content heroImage { resized { original w480 w800 } } postsCount posts(take: 5) { id title publishTime } tags { id name } isPinned } }"
}
EOF
curl -X POST https://eic-cms-gql-dev-1090198686704.asia-east1.run.app/api/graphql \
  -H 'Content-Type: application/json' \
  -d @/tmp/query.json | jq '.'
```

**Test IDs in Dev Environment**:
- **Post**: `238659` (最新測試文章, 2025-11-23), `238646` (has heroImage and citations), `238651` (complete citations HTML)
- **Category**: `2` / `testcategory` / "測試中分類" (1 post), `7` / `taiwannews` / "台灣新聞" (8 posts)
- **Section**: `3` / `latestnews` / "時事新聞" (9 categories), `4` / `column` / "專欄" (55 categories)
- **Topic**: `3` / "直擊阿聯氣候新時代" (4 posts, isPinned), `2` / "測試用專題" (8 posts, 2 tags)
- **Tags**: `12` / "深度報導" (1 post), `13` / "中國新聞" (1 post), `16` / "回顧與前瞻" (1 post, 1 topic)

## Deployment

Project uses Google Cloud Build for deployment, configured in `cloudbuild.yaml`.

### Docker Build

```bash
docker build -t eic-web .
```

### Standalone Output

Next.js is configured for standalone output, suitable for containerized deployment.

## Common Issues

### 1. Apollo Client Deprecation Warning

**Issue**: `[ApolloClient]: uri is deprecated`

**Solution**: Use `HttpLink`:
```typescript
import { HttpLink } from '@apollo/client'

new ApolloClient({
  link: new HttpLink({ uri: API_ENDPOINT }),
  cache: new InMemoryCache(),
})
```

### 2. Images Not Displaying

**Issue**: `resized` or `resizedWebp` is null

**Solution**: Use fallback:
```typescript
<SharedImage
  images={image?.resized}
  imagesWebP={image?.resizedWebp}
  src={image?.url}  // fallback
/>
```

### 3. Draft.js Content Rendering Issues

**Issue**: Content not displaying correctly

**Solution**:
- Use `contentApiData` field (not the old `content` field)
- Use `@eic-web/draft-renderer` v1.4.4
- Ensure you're passing the `contentApiData` JSON object correctly

### 4. Citations HTML Not Rendering

**Issue**: HTML tags showing as plain text

**Solution**: Use `dangerouslySetInnerHTML`:
```typescript
<div dangerouslySetInnerHTML={{ __html: postData?.citations || '' }} />
```

### 5. Related Posts Styling Issues

**Issue**: Need to customize Related Posts card styles

**Solution**: Reference the implementation in `related-post.tsx`:
- Use CSS Grid for responsive layout
- Use `SharedImage` for image handling
- Ensure correct import order (SharedImage before styled-components)

## Configuration Files

### next.config.js

Key settings:
- `output: 'standalone'` - For containerized deployment
- SVG loader configuration
- Styled components SSR configuration

### tsconfig.json

Path mapping:
```json
{
  "paths": {
    "~/*": ["./*"]
  }
}
```

### .eslintrc.js

Includes simple-import-sort rules to ensure consistent import ordering.

## Related Documentation & Resources

- **Main Repository**: https://github.com/e-info-taiwan/eic-web
- **Draft Renderer Package**: `@eic-web/draft-renderer`
- **React Components**: `@readr-media/react-component`, `@readr-media/react-image`
- **CMS Backend**: Keystone.js (GraphQL API)

## TODO & Known Issues

### Fixed
- ✅ Apollo Client v4 deprecation warning
- ✅ Post layout refactoring
- ✅ Citations styling update
- ✅ Image rendering fallback
- ✅ Related Posts responsive design

### Known Warnings (Not Errors)
- Console statements in development (pages/post, pages/category, etc.)
- Unused imports in legacy code
- React Hook dependency warnings
- These warnings do not affect build success

## Development Tips

1. **Testing Post Pages**: Use post ID `238659` (最新) or `238646` (has citations and heroImage)
2. **Testing Topic Pages**: Use topic ID `3` (直擊阿聯氣候新時代, isPinned) or `2` (測試用專題, 8 posts)
3. **Testing Category Pages**: Use category slug `testcategory` or ID `2`, or `taiwannews` (8 posts)
4. **Testing Section Pages**: Use section slug `latestnews` (時事新聞) or `column` (專欄)
5. **Style Changes**: Use styled-components, follow existing theme settings
6. **GraphQL Queries**: Reference complete query examples in `graphql/query/post.ts` and `graphql/query/category.ts`
7. **Image Handling**: Prefer `resized` and `resizedWebp`, with `src` fallback
8. **Content Rendering**: Use `contentApiData` field, not the old `content` field
9. **Commit Messages**: Use clear descriptions, reference recent commit style
10. **API Testing**: Use curl with `/tmp/query.json` for complex GraphQL queries (see Testing GraphQL API section)

---

**Last Updated**: 2026-01-16
