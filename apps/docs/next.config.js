const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_flexsearch: true,
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
        source: '/discord{/}?',
        permanent: true,
        destination: 'https://discord.gg/jNwHBwYJZH',
      },
    ];
  },
});

module.exports = nextConfig;
