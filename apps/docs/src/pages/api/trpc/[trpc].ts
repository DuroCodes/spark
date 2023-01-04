import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createContext } from '~/server/server/trpc/context';
import { appRouter } from '~/server/server/trpc/router/_app';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
        // eslint-disable-next-line no-console
        console.error(`❌ tRPC failed on ${path}: ${error}`);
      }
      : undefined,
});
