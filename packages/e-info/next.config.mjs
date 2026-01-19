import * as tsImport from 'ts-import'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { ENV, DONATION_PAGE_URL } = await tsImport.load(
  './constants/environment-variables.ts'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
    },
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ]
  },
  webpack: (config, /* eslint-disable-line no-unused-vars */ options) => {
    // svg files
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      // viewBox is required to resize SVGs with CSS.
                      // @see https://github.com/svg/svgo/issues/1128
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    })
    // graphql files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'graphql-tag/loader',
        },
      ],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/donate',
        destination: DONATION_PAGE_URL,
        permanent: true,
      },
    ]
  },
  output: 'standalone',
  // In monorepo, tell Next.js where the workspace root is for dependency tracing
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  async headers() {
    return [
      // for debug purpose
      {
        source: '/',
        headers: [
          {
            key: 'x-build-env',
            value: ENV,
          },
        ],
      },
    ]
  },
}

export default nextConfig
