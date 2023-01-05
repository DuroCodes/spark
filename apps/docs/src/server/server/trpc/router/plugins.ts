import { z } from 'zod';
import { getHighlighter } from 'shiki';
import { join as pathJoin } from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeAddClasses from 'rehype-add-classes';
import rehypePrettyCode from 'rehype-pretty-code';
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

const shikiPath = () => {
  const path = process.env.SHIKI_PRODUCTION_PATH
    ? pathJoin(process.cwd(), 'public/shiki')
    : pathJoin(process.cwd(), 'public/shiki');

  return path;
};

export const pluginRouter = router({
  create: publicProcedure
    .input(pluginSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.plugin.create({
        // @ts-ignore
        data: input,
      });
    }),

  findById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.plugin.findFirst({ where: { id: input } });

      const highlighter = await getHighlighter({
        theme: 'theme',
        langs: ['typescript', 'javascript'],
        paths: {
          themes: `${shikiPath()}/themes`,
          languages: `${shikiPath()}/languages`,
        },
      });

      const rehypePrettyCodeOptions = {
        highlighter,
        onVisitLine(node: any) {
          if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }];
          }
        },
        onVisitHighlightedLine(node: any) {
          node.properties.className.push('highlighted');
        },
        onVisitHighlightedWord(node: any) {
          node.properties.className = ['highlighted'];
        },
      };

      const html = await serialize(data.description, {
        mdxOptions: {
          format: 'md',
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [rehypePrettyCode, rehypePrettyCodeOptions],
            [rehypeAddClasses, {
              h1: 'mt-2 text-4xl font-bold tracking-tight',
              h2: 'font-semibold tracking-tight mt-10 text-3xl border-b pb-1 dark:border-primary-100/10 contrast-more:border-neutral-400 contrast-more:dark:border-neutral-400',
              h3: 'font-semibold tracking-tight mt-8 text-2xl',
            }],
          ],
          development: false,
        },
      });

      return { data, html };
    }),

  findAll: publicProcedure.query(({ ctx }) => ctx.prisma.plugin.findMany()),
});
