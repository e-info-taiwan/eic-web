ARG NODE_VERSION=18.18.0

# Install dependencies only when needed
FROM node:${NODE_VERSION}-alpine AS deps
# Create workspace structure
WORKDIR /workspace

# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache python3 make g++ \
    && yarn global add node-gyp

# Set up workspace - cloudbuild copies root-package.json, yarn.lock, and draft-renderer
# into the e-info package directory before building

# First, set up the packages directory with e-info's package.json
RUN mkdir -p packages/e-info
COPY package.json ./packages/e-info/

# Copy draft-renderer package
COPY draft-renderer ./packages/draft-renderer/

# Now copy workspace root configuration (this will be the workspace root)
COPY root-package.json ./package.json
COPY yarn.lock ./
COPY .eslintrc.js ./

# Install dependencies for the entire workspace
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:${NODE_VERSION} AS builder
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/package.json /workspace/yarn.lock /workspace/.eslintrc.js ./
COPY --from=deps /workspace/packages ./packages

# Copy e-info source (current directory in build context)
COPY . ./packages/e-info/

# Build draft-renderer first
RUN cd packages/draft-renderer && yarn build

# Build e-info
RUN cd packages/e-info && yarn build

# Production image, copy all the files and run next
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /workspace/packages/e-info/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /workspace/packages/e-info/.next/standalone ./
COPY --from=builder /workspace/packages/e-info/.next/static ./.next/static

CMD ["node", "server.js"]
