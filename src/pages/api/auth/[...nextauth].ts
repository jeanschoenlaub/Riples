import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '~/server/auth';

const prisma = new PrismaClient();

export default NextAuth({
  ...authOptions,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // Add more providers as needed.
  ],
  // Add other configurations here.
});
