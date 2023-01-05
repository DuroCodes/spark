import remarkGfm from 'remark-gfm';
import rehypeAddClasses from 'rehype-add-classes';
import rehypePrettyCode from 'rehype-pretty-code';
import { serialize } from 'next-mdx-remote/serialize';
import theme from './theme.json';

const rehypePrettyCodeOptions = {
  theme,
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

export async function mdxToHtml(source: string) {
  const mdxSource = await serialize(source, {
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

  return { html: mdxSource };
}
