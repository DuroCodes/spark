import { type GetServerSidePropsContext } from 'next';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth';

import { authOptions } from '~/pages/api/auth/[...nextauth]';

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => unstable_getServerSession(ctx.req, ctx.res, authOptions);
