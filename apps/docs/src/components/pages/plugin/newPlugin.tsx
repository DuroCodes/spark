import { signIn, useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormProps, useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Callout from '~/components/Callout';
import { trpc } from '~/utils/trpc';

const schema = z.object({
  name: z.string()
    .min(10, { message: 'Plugin name must be more than 10 characters.' })
    .max(50, { message: 'Plugin name must be less than 50 characters.' }),
  description: z.string()
    .min(50, { message: 'Plugin description must be more than 50 characters.' })
    .max(1000, { message: 'Plugin description must be less than 1000 characters.' }),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  },
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

export default function NewPlugin() {
  const router = useRouter();
  const { data: plugins } = trpc.plugins.findAll.useQuery();
  const { data: session } = useSession();
  const utils = trpc.useContext().plugins;

  const mutation = trpc.plugins.create.useMutation({
    onSuccess: async () => {
      await utils.findAll.invalidate();
    },
  });

  const methods = useZodForm({
    schema,
    defaultValues: {
      name: '',
      description: '',
    },
  });

  if (!session) {
    return (
      <Callout type="default">
        You must be signed in to create plugins. <a onClick={() => signIn('discord')}>Click here</a> to sign in.
      </Callout>
    );
  }

  return (
    <>
      <div className="max-w-screen-lg mx-auto pt-4 pb-8 mb-16 border-b border-gray-400 border-opacity-20">
        <h1><span className="font-bold leading-tight lg:text-5xl">New Plugin</span></h1>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Create a plugin for the Spark community.</p>
          <Link href="/docs/core-concepts/publishing-plugins">Click here</Link> for a guide on how to publish plugins.
        </div>
      </div>
      <form
        onSubmit={methods.handleSubmit(async ({ name, description }) => {
          if (plugins.find((plugin) => plugin.name === name)) {
            return methods.setError('name', { message: 'This name is already taken' });
          }

          await mutation.mutateAsync({
            name,
            description,
            author: {
              name: `${session.user.name}#${session.user.discriminator}`,
              image: session.user.image_url,
            },
            createdAt: new Date(),
          });

          methods.reset();

          await router.push('/plugins');
        })}
        className="space-y-6"
      >
        <div>
          <label className="block mb-2 text-lg font-bold text-gray-900 dark:text-white">Plugin Name</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            {...methods.register('name')}
          />

          {methods.formState.errors.name?.message && (
            <p className="text-red-600">
              {methods.formState.errors.name?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-lg font-bold text-gray-900 dark:text-white">Plugin Description</label>
          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            rows={10}
            {...methods.register('description')}
          />

          {methods.formState.errors.description?.message && (
            <p className="text-red-600">
              {methods.formState.errors.description?.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white no-underline bg-black border border-transparent rounded-md dark:bg-white dark:text-black betterhover:dark:hover:bg-gray-300 betterhover:hover:bg-gray-700 md:py-3 md:text-lg md:px-10 md:leading-6"
        >
          {mutation.isLoading ? 'Loading...' : 'Submit Plugin →'}
        </button>
      </form>
    </>
  );
}
