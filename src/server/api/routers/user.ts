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
          createdAt: true,
          onBoardingFinished: true,
          productTourFinished: true
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

  updateUsername: protectedProcedure
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
    getProductTourStatus: protectedProcedure
    .input(z.object({
        userId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
        const { userId } = input;

        const user = await ctx.prisma.user.findUnique({
            where: { id: userId },
            select: {
                productTourFinished: true
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }),
  deleteUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      // Step 1: Find tasks created by the user
      const createdTasks = await ctx.prisma.tasks.findMany({
        where: {
          createdById: input.userId,
        },
      });

      // Step 2: Find tasks owned by the user
      const ownedTasks = await ctx.prisma.tasks.findMany({
        where: {
          ownerId: input.userId,
        },
      });

      // Step 3: Update tasks created by the user
      const updateCreatedPromises = createdTasks.map((task) => {
        return ctx.prisma.tasks.update({
          where: { id: task.id },
          data: {
            createdById: '',
          },
        });
      });

      // Step 4: Update tasks owned by the user
      const updateOwnedPromises = ownedTasks.map((task) => {
        return ctx.prisma.tasks.update({
          where: { id: task.id },
          data: {
            ownerId: '',
          },
        });
      });

      // Execute all updates
      await Promise.all([...updateCreatedPromises, ...updateOwnedPromises]);

      // Step 5: Delete the user
      let deletedUser;
      try {
        deletedUser = await ctx.prisma.user.delete({
          where: { id: input.userId },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting the user',
        });
      }

      return {
        user: deletedUser,
      };
  }),
});
