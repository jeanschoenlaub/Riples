import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const userOnboardingRouter = createTRPCRouter({
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
            console.log("should create")
        }

    return userOnboarding;
    }),

    setProductTourCompleted: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
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
          console.log("should create")
      }
  
        const updatedOnboarding = await ctx.prisma.userOnboarding.upsert({
          where: { userId: userId },
          create: { userId: userId },
          update: {
            productTourFinished: true
          }
        });
        return updatedOnboarding;
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
  