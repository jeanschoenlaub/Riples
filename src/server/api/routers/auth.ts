import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

//TO-DO Add a check on the Verification token expiry 
export const authRouter = createTRPCRouter({
    verifyEmail: publicProcedure
      .input(z.object({
        token: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const emailVerification = await ctx.prisma.verificationToken.findUnique({
          where: { token: input.token },
        });
  
        if (!emailVerification) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid token' });
        }
  
        await ctx.prisma.user.update({
          where: { email: emailVerification.identifier },
          data: { emailVerified: new Date() },
        });
  
        return { message: 'Email verified successfully' };
      }),
  });