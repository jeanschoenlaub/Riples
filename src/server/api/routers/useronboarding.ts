import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const userOnboardingRouter = createTRPCRouter({
    editProductTourStatus: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          productTourFinished: z.boolean(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { userId, productTourFinished } = input;
  
        const updatedUser = await ctx.prisma.user.update({
          where: { id: userId },
          data: {
            productTourFinished
          },
        });
        return updatedUser;
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
  
    getOnboardingStatus: protectedProcedure
      .input(z.object({
        userId: z.string(),
      }))
      .query(async ({ ctx, input }) => {
            const { userId } = input;
    
            let userOnboarding = await ctx.prisma.userOnboarding.findUnique({
            where: {
                userId: userId
            }
            });
    
        // If not, create it
        if (!userOnboarding) {
            await ctx.prisma.userOnboarding.create({
                data: { userId: userId }
            });
        }

    return userOnboarding;
    }),
  
    setStepOneCompleted: protectedProcedure
      .input(z.object({
        userId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { userId } = input;
  
        const updatedOnboarding = await ctx.prisma.userOnboarding.update({
          where: { userId: userId },
          data: {
            stepOneCompleted: true
          }
        });
  
        if (!updatedOnboarding) {
          throw new Error("Failed to update step one status");
        }
  
        return updatedOnboarding;
    }),
    setStepTwoCompleted: protectedProcedure
      .input(z.object({
        userId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { userId } = input;
  
        const updatedOnboarding = await ctx.prisma.userOnboarding.update({
          where: { userId: userId },
          data: {
            stepTwoCompleted: true
          }
        });
  
        if (!updatedOnboarding) {
          throw new Error("Failed to update step one status");
        }
  
        return updatedOnboarding;
      })
  
  });
  