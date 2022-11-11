import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';
import { Footer } from './src/components/Footer';
import SparkLogo from './src/components/logos/SparkLogo';

const theme = {
  project: {
    link: 'https://github.com/durocodes/spark',
  },
  docsRepositoryBase: 'https://github.com/DuroCodes/spark/tree/main/apps/docs',
  titleSuffix: ' | Spark',
  unstable_flexsearch: true,
  unstable_staticImage: true,
  toc: {
    float: true,
  },
  font: false,
  chat: {
    link: 'https://spark-handler.js.org/discord',
  },
  feedback: {
    link: 'Question? Give us feedback →',
  },
  logo: function LogoActual() {
    return (
      <>
        <SparkLogo height={32} />
        <span className="sr-only">Spark</span>
      </>
    );
  },
  head() {
    const router = useRouter();
    const { frontMatter, title } = useConfig();
    const fullUrl = router.asPath === '/'
      ? 'https://spark-handler.js.org'
      : `https://spark-handler.js.org${router.asPath}`;
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#2E3037" />
        <meta name="theme-color" content="#2E3037" />
        <meta property="og:type" content="website" />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={frontMatter.description} />
        <meta property="og:url" content={fullUrl} />
        <link rel="canonical" href={fullUrl} />
        <meta
          property="twitter:image"
          content={`https://spark-handler.js.org${frontMatter.ogImage ?? '/og-image.png'}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image"
          content={`https://spark-handler.js.org${frontMatter.ogImage ?? '/og-image.png'}`}
        />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="Spark" />
      </>
    );
  },
  editLink: {
    text: 'Edit this page on GitHub',
  },
  footer: {
    text: () => <Footer />,
  },
  nextThemes: {
    defaultTheme: 'dark',
  },
};
export default theme;
