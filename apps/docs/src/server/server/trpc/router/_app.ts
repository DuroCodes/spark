import { router } from '../trpc';
import { pluginRouter } from './plugins';

export const appRouter = router({
  plugins: pluginRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
