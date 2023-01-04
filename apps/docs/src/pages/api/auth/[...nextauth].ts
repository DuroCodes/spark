import NextAuth, {
  NextAuthOptions, Session, JWT, User,
} from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({
      token, user, account, profile,
    }) {
      if (account) {
        token.id = user.id;
        token.accessToken = account.access_token;
        token.profile = profile;
      }

      return token;
    },
    session({ session, token }: { session: Session; token: JWT; user: User | AdapterUser; }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user = { ...session.user, ...token.profile };
      }

      return session;
    },
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
