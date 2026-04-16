import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { getPasswordState, isRootAdminUsername } from "@/lib/auth/password-state";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        const userFound = await db.user.findUnique({
          where: { username: credentials.username },
        });

        if (!userFound) throw new Error("No user found");

        const passwordState = getPasswordState(userFound.password);
        const matchPassword = await bcrypt.compare(credentials.password, passwordState.hash);
        if (!matchPassword) throw new Error("Wrong password");

        return {
          id: userFound.id.toString(),
          name: userFound.username,
          username: userFound.username,
          role: userFound.role,
          mustChangePassword: passwordState.mustChangePassword,
          isRootAdmin: isRootAdminUsername(userFound.username),
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username ?? user.name ?? undefined;
        token.mustChangePassword = Boolean(user.mustChangePassword);
        token.isRootAdmin = Boolean(user.isRootAdmin);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.username = token.username ?? session.user.name ?? undefined;
        session.user.mustChangePassword = Boolean(token.mustChangePassword);
        session.user.isRootAdmin = Boolean(token.isRootAdmin);
      }
      return session;
    },
  },
};
