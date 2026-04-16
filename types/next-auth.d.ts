import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: string;
      username?: string;
      mustChangePassword?: boolean;
      isRootAdmin?: boolean;
    };
  }

  interface User {
    role?: string;
    username?: string;
    mustChangePassword?: boolean;
    isRootAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    username?: string;
    mustChangePassword?: boolean;
    isRootAdmin?: boolean;
  }
}
