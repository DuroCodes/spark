import '../styles.css';
import '../custom.css';

import { SSRProvider } from '@react-aria/ssr';

// Shim requestIdleCallback in Safari
if (typeof window !== 'undefined' && !('requestIdleCallback' in window)) {
  (window as any).requestIdleCallback = (fn) => setTimeout(fn, 1);
  (window as any).cancelIdleCallback = (e) => clearTimeout(e);
}

export default function Nextra({ Component, pageProps }) {
  return (
    <SSRProvider>
      <>
        <svg height="0px" width="0px">
          <defs>
            <linearGradient
              id="pink-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(156, 81, 161, 1)" />
              <stop offset="70%" stopColor="rgba(255, 30, 86, 1)" />
            </linearGradient>
          </defs>
        </svg>
      </>
      <Component {...pageProps} />
    </SSRProvider>
  );
}
