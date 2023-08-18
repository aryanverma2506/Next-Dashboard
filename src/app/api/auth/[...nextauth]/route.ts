import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import httpClient from "@/utils/http-client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials, req) {
        try {
          const responseData = await httpClient({
            url: "/api/auth/login",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...credentials,
            }),
          });
          const user = responseData.userInfo;
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error: any) {
          console.error(error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET!,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
