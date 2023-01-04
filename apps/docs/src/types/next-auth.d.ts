import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    sub: string;
    profile: {
      id: string;
      username: string;
      avatar: string;
      avatar_decoration?: string;
      discriminator: string;
      public_flags: number;
      flags: number;
      banner?: string;
      banner_color?: string;
      accent_color?: number;
      locale: string;
      mfa_enabled: boolean;
      premium_type?: number;
      email: string;
      verified: boolean;
      image_url: string;
    };
  }

  interface Session {
    user?: {
      id: string;
    } & DefaultSession['user'] & JWT['profile'];
  }
}
