const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_staticImage: true,
});

const nextConfig = withNextra({
  reactStrictMode: true,
  experimental: {
    legacyBrowsers: false,
  },
  async redirects() {
    return [
      {
        source: '/usage',
        destination: '/reference/command-line-reference',
        permanent: true,
      },
      {
        source: '/docs/guides/workspaces',
        destination: '/docs/handbook/workspaces',
        permanent: true,
      },
      {
        source: '/docs/core-concepts/workspaces',
        destination: '/docs/handbook/workspaces',
        permanent: true,
      },
      {
        source: '/docs/core-concepts/pipelines',
        destination: '/docs/core-concepts/running-tasks',
        permanent: true,
      },
      {
        source: '/docs/guides/migrate-from-lerna',
        destination: '/docs/handbook/migrating-to-a-monorepo',
        permanent: true,
      },
      {
        source: '/docs/getting-started',
        destination: '/docs',
        permanent: true,
      },
      {
        source: '/discord{/}?',
        permanent: true,
        destination: 'https://discord.gg/sSzyjxvbf5',
      },
      {
        source: '/docs/guides/complimentary-tools',
        permanent: true,
        destination: '/docs/handbook',
      },
      {
        source: '/docs/guides/monorepo-tools',
        permanent: true,
        destination: '/docs/handbook',
      },
      {
        source: '/docs/glossary',
        permanent: true,
        destination: '/docs/handbook',
      },
      {
        source: '/docs/guides/continuous-integration',
        permanent: true,
        destination: '/docs/ci',
      },
      {
        source: '/docs/features/:path*',
        permanent: true,
        destination: '/docs/core-concepts/:path*',
      },
    ];
  },
});

module.exports = nextConfig;
