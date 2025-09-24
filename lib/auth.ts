import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { storeMagicLink } from "@/lib/dev/lastLink";
import { getUser, setPro } from "@/lib/db/mockAuth";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    EmailProvider({
      name: "Magisk länk",
      sendVerificationRequest: async ({ identifier, url }) => {
        storeMagicLink(identifier, url);
        console.info(`Magic link för ${identifier}: ${url}`);
      },
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      const email = user?.email ?? (typeof token.email === "string" ? token.email : undefined);
      if (email) {
        const record = getUser(email);
        token.email = email;
        (token as any).pro = record.pro;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
        (session.user as any).pro = Boolean((token as any).pro);
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.email) {
        getUser(user.email);
      }
    },
  },
});

export async function togglePro(email: string, enabled: boolean) {
  setPro(email, enabled);
}
