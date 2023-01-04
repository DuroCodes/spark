import { z } from 'zod';
import { Plugin } from '@prisma/client';
import { router, publicProcedure } from '../trpc';

const pluginSchema = z.object({
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  author: z.object({
    name: z.string(),
    image: z.string(),
  }),
});

export const pluginRouter = router({
  create: publicProcedure
    .input(pluginSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.plugin.create({
        data: input as Plugin,
      });
    }),

  findById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => ctx.prisma.plugin.findFirst({ where: { id: input } })),

  findAll: publicProcedure.query(({ ctx }) => ctx.prisma.plugin.findMany()),
});
