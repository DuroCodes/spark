import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_flexsearch: true,
  unstable_staticImage: true,
});

/**
 * @type {import('next').Config}
 */
const nextConfig = withNextra({
  reactStrictMode: true,
  experimental: {
    legacyBrowsers: false,
    topLevelAwait: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
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

export default nextConfig;
