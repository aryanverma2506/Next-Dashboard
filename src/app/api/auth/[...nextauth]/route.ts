import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import redis from "@/lib/redis";
import UserModel from "@/models/user-model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "E-mail",
          type: "email",
          placeholder: "E-mail",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials) {
            return null;
          }

          const { email, password } = credentials;
          const cachedUserData = await redis.get(email);

          if (cachedUserData) {
            const user = JSON.parse(cachedUserData);
            if (await bcrypt.compare(password, user.password)) {
              return { id: user._id, email: email };
            }
          }

          const existingUser = await UserModel.findOne({ email: email }).select(
            {
              updatedAt: 0,
              createdAt: 0,
              __V: 0,
            }
          );

          if (!existingUser || !(await existingUser.matchPassword(password))) {
            return null;
          }

          const existingUserObject = existingUser.toObject();

          await redis.set(email, JSON.stringify(existingUserObject));

          return { id: existingUser._id, email: email };
        } catch (error: any) {
          console.error(error);
          return null;
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
