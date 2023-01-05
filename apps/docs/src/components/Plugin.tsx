import Image from 'next/image';
import Link from 'next/link';
import Callout from './Callout';
import { trpc } from '~/utils/trpc';

interface Author {
  name: string;
  image: string;
}

interface PluginProps {
  name: string;
  id: string;
  author: Author;
}

export function PluginCard({ plugin }: { plugin: PluginProps; }) {
  return (
    <a href={`/plugins/${plugin.id}`} className="relative block overflow-hidden p-10 bg-white shadow-lg rounded-xl dark:bg-opacity-5 no-underline text-black dark:text-white">
      <h3 className="m-0 text-lg font-semibold leading-6 tracking-tight text-gray-900 dark:text-white">
        {plugin.name}
      </h3>
      <div className="text-base font-medium text-gray-400 dark:text-gray-500 flex items-center mt-2">
        <div className="w-8 h-8 mr-2">
          <Image className="rounded-full"
            src={plugin.author.image}
            height={128}
            width={128}
            objectFit="cover"
          />
        </div>
        {plugin.author.name}
      </div>
      <style jsx global>{`
      html.dark .icon-circle {
        background: linear-gradient(180deg, rgba(50, 134, 241, 0.2) 0%, rgba(195, 58, 195, 0.2) 100%);
      }
    `}</style>
    </a>
  );
}

export function PluginShowcase() {
  const { data: plugins, status } = trpc.plugins.findAll.useQuery();

  if (status === 'error') {
    return (
      <Callout type="error">An error occured. Please refresh and try again.</Callout>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center">
        <div className="border-t-transparent w-8 h-8 border-4 border-gray-400 rounded-full animate-spin" />
        <h1 className="ml-2 font-extrabold text-lg">Loading Plugins...</h1>
      </div>
    );
  }

  const sortedPlugins = plugins.sort(
    (a, b) => a.createdAt.getMilliseconds() - b.createdAt.getMilliseconds(),
  );

  return (
    <>
      <Link href="/plugins/new">
        <a className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white no-underline bg-black border border-transparent rounded-md dark:bg-white dark:text-black betterhover:dark:hover:bg-gray-300 betterhover:hover:bg-gray-700 md:py-3 md:text-lg md:px-10 md:leading-6 mt-6">
          Submit Plugin →
        </a>
      </Link>
      <div className="grid grid-cols-1 mt-12 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:gap-x-8 lg:gap-y-12">
        {sortedPlugins.map((plugin: PluginProps) => (
          <PluginCard plugin={plugin} key={plugin.id} />
        ))}
      </div>
    </>
  );
}
