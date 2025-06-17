import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

const handler = NextAuth({
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
          where: {
            username: credentials.username,
          },
        });

        if (!userFound) throw new Error("No user found");

        const matchPassword = await bcrypt.compare(credentials.password, userFound.password);
        if (!matchPassword) throw new Error("Wrong password");

        // ➕ Agregamos el role en el retorno
        return {
          id: userFound.id.toString(),
          name: userFound.username,
          role: userFound.role, // <-- importante para el token
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user && typeof user === "object" && "role" in user) {
      token.role = (user as { role: string }).role;
    }
    return token;
  },
  async session({ session, token }) {
    if (token && session.user) {
      (session.user as { role?: string }).role = token.role as string;
    }
    return session;
  },
},

});

export { handler as GET, handler as POST };
