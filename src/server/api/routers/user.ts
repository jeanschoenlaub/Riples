import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const userRouter = createTRPCRouter({
  getUserByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          username: true,
          // ... other fields you want to select
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return {
        user,
      };
    }),

  updateUsername: publicProcedure
    .input(z.object({
      userId: z.string(),
      username: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check for duplicate username
      const existingUserWithUsername = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });

      if (existingUserWithUsername) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already exists',
        });
      }

      // Update username
      let updatedUser;
      try {
        updatedUser = await ctx.prisma.user.update({
          where: { id: input.userId },
          data: { username: input.username },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the username',
        });
      }

      return {
        user: updatedUser,
      };
    }),
});
