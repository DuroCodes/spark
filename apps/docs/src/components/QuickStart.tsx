import {
  ChatIcon,
  ServerIcon,
  SparklesIcon,
  TerminalIcon,
} from '@heroicons/react/outline';
import { DetailedFeatureLink } from './Feature';

export const QuickStartArea = () => (
  <div className="grid grid-cols-1 mt-12 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:gap-x-8 lg:gap-y-12">
    <DetailedFeatureLink
      feature={{
        Icon: SparklesIcon,
        name: 'Create a new project',
        description: 'Build a new Discord bot with Spark.',
      }}
      href="/guide/getting-started/create-new"
    />
    <DetailedFeatureLink
      feature={{
        Icon: ServerIcon,
        name: 'Add to your project',
        description: 'Add things to your bot with Spark.',
      }}
      href="/guide/getting-started/add-to-project"
    />
  </div>
);

export const FeatureArea = () => (
  <div className="grid grid-cols-1 mt-12 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:gap-x-8 lg:gap-y-12">
    <DetailedFeatureLink
      feature={{
        Icon: TerminalIcon,
        name: 'Adding commands',
        description: 'Add new commands to your project.',
      }}
      href="/guide/core-concepts/adding-commands"
    />
    <DetailedFeatureLink
      feature={{
        Icon: ChatIcon,
        name: 'Adding events',
        description: 'Add new events to your project.',
      }}
      href="/guide/core-concepts/adding-events"
    />
  </div>
);
