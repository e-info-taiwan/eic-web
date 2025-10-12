ARG NODE_VERSION=18.18.0

# Install dependencies only when needed
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 
RUN apk add --no-cache python3 make g++ \
    && yarn global add node-gyp

# Install dependencies based on the preferred package manager
COPY ["package.json", "yarn.lock", "./"]
COPY packages/draft-renderer/package.json ./packages/draft-renderer/
COPY packages/e-info/package.json ./packages/e-info/
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build draft-renderer first, then build e-info
RUN cd packages/draft-renderer && yarn build
RUN cd packages/e-info && yarn build

# Production image, copy all the files and run next
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/packages/e-info/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/packages/e-info/.next/standalone ./
COPY --from=builder /app/packages/e-info/.next/static ./.next/static

CMD ["node", "server.js"]
