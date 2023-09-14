import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db";
import nodemailer from 'nodemailer';
import { env } from "~/env.mjs";

import EmailProvider from "next-auth/providers/email";

// TO-DO put pass in .env
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: false,
  port: 587,
  auth: {
    user: 'admin@riples.app',
    pass: 'guskojpqfjfwhuti'
  }
});


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {   
    jwt: async ({token, user, account, profile}) => {
      //console.log("JWT callback:", token, user, account, profile);
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, user, token }) => {
      //console.log("Inside session callback", session, user); 
      const customUser = user as any;  // Bypass TypeScript check
      return {
        ...session,
        user: {
          ...session.user,
          id: customUser.id,
          username: customUser.username,
        },
      };
    },
    async signIn({ user, account, profile, email, credentials }) {
      //console.log("Inside signin callback", user); 
      return true
    }
  },
  adapter: PrismaAdapter(prisma),
  debug: false,
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM
    }),
  ],
};



/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
