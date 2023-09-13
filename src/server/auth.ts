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
      console.log("JWT callback:", token, user, account, profile);
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, user, token }) => {
      console.log("Inside session callback", session, user); 
      return {
        ...session,
        user: {
         ...session.user,
          id: user.id,
        },
      };
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Inside signin callback", user); 
      return true
    }
  },
  adapter: PrismaAdapter(prisma),
  debug: true,
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

{/* 
    Credentials({
      name: "credentials",
      credentials: {
        //username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        //isSignUp: { label: "IsSignUp", type: "hidden" }, // Add this line
      },
      authorize: async (credentials, request) => {
        if (!credentials) {
          return null;
        }
        
        const { email, password } = credentials; //username, password, isSignUp

        const user = await prisma.user.findUnique({
          where: { email },
        });
        
        {/* 
        if (isSignUp === 'true') { // Check the flag (it will be a string because it's part of the form)
          if (user) {
            throw new TRPCError({ code: "CONFLICT", message: "User already exists" });
          }
          
          const hashedPassword = await bcrypt.hash(password, 10);
          
          user = await prisma.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
            },
          });
          
          // Generate & store a verification token
          const verificationToken = crypto.randomBytes(32).toString('hex');
          await prisma.verificationToken.create({
            data: {
              identifier: email,
              token: verificationToken,
              expires: new Date(Date.now() + 3600000), // 1 hour from now
            },
          });

          // Send verification email
          try {
            await transporter.sendMail({
              from: 'admin@riples.app',
              to: email,
              subject: 'Please verify your email',
              html: `
                <h1>Email Verification</h1>
                <p>Please verify your email by clicking the following link:</p>
                <a href="http://localhost:3000/verify-email?token=${verificationToken}">Verify Email</a>
              `,
            });
            console.log("Email sent");
          } catch (error) {
            console.error("An error occurred while sending the email: ", error);
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send verification email." });
          }
          
        } else 
          console.log("user sign -in")
          if (!user) {
            throw new TRPCError({ code: "NOT_FOUND", message: "User does not exist" });
          }
          
          const isValid = await bcrypt.compare(password, user.password);
          
          //if (!isValid) {
            //throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect password" });
          //}
        //}
        console.log(user)
        console.log("Normal setup")

        return {
          user
          //id: user.id,
          //email: user.email,
          //username: user.username,
        };
      },
    }),
    */}