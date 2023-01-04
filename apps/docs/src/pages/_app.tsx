import '~/styles/styles.css';
import '~/styles/custom.css';
import 'nextra-theme-docs';

import { SSRProvider } from '@react-aria/ssr';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { AppType } from 'next/app';
import { Session } from 'next-auth';
import { trpc } from '~/utils/trpc';

const queryClient = new QueryClient();

// Shim requestIdleCallback in Safari
if (typeof window !== 'undefined' && !('requestIdleCallback' in window)) {
  (window as any).requestIdleCallback = (fn) => setTimeout(fn, 1);
  (window as any).cancelIdleCallback = (e) => clearTimeout(e);
}

const MyApp: AppType<{ session: Session | null; }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <QueryClientProvider client={queryClient}>
    <SSRProvider>
      <SessionProvider session={session}>
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
        <Component {...pageProps} />
      </SessionProvider>
    </SSRProvider>
  </QueryClientProvider>
);

export default trpc.withTRPC(MyApp);
