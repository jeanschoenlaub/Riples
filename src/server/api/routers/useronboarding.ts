import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const userOnboardingRouter = createTRPCRouter({
    getOnboardingStatus: protectedProcedure
      .input(z.object({
        userId: z.string(),
      }))
      .query(async ({ ctx, input }) => {
            const { userId } = input;
    
            const userOnboarding = await ctx.prisma.userOnboarding.findUnique({
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

    setProductTourCompleted: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { userId } = input;

        const userOnboarding = await ctx.prisma.userOnboarding.findUnique({
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
          },
          select: {
            stepOneCompleted: true,
            stepTwoCompleted: true,
            stepThreeCompleted: true,
            stepFourCompleted: true,
            onBoardingFinished: true
          }
        });

        if (!updatedOnboarding) {
          throw new Error("Failed to update step one status");
        }

        // Check if all steps are completed
        if (updatedOnboarding.stepOneCompleted && updatedOnboarding.stepTwoCompleted && updatedOnboarding.stepThreeCompleted && updatedOnboarding.stepFourCompleted) {
          await ctx.prisma.userOnboarding.update({
            where: { userId: userId },
            data: {
              onBoardingFinished: true
            }
          });
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
          },
          select: {
            stepOneCompleted: true,
            stepTwoCompleted: true,
            stepThreeCompleted: true,
            stepFourCompleted: true,
            onBoardingFinished: true
          }
        });

        if (!updatedOnboarding) {
          throw new Error("Failed to update step one status");
        }

        // Check if all steps are completed
        if (updatedOnboarding.stepOneCompleted && updatedOnboarding.stepTwoCompleted && updatedOnboarding.stepThreeCompleted && updatedOnboarding.stepFourCompleted) {
          await ctx.prisma.userOnboarding.update({
            where: { userId: userId },
            data: {
              onBoardingFinished: true
            }
          });
        }

        return updatedOnboarding;
    }),

    setStepThreeCompleted: protectedProcedure
      .input(z.object({
        userId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { userId } = input;

        const updatedOnboarding = await ctx.prisma.userOnboarding.update({
          where: { userId: userId },
          data: {
            stepThreeCompleted: true
          },
          select: {
            stepOneCompleted: true,
            stepTwoCompleted: true,
            stepThreeCompleted: true,
            stepFourCompleted: true,
            onBoardingFinished: true
          }
        });

        if (!updatedOnboarding) {
          throw new Error("Failed to update step one status");
        }

        // Check if all steps are completed
        if (updatedOnboarding.stepOneCompleted && updatedOnboarding.stepTwoCompleted && updatedOnboarding.stepThreeCompleted && updatedOnboarding.stepFourCompleted) {
          await ctx.prisma.userOnboarding.update({
            where: { userId: userId },
            data: {
              onBoardingFinished: true
            }
          });
        }

        return updatedOnboarding;
    }),
    setStepFourCompleted: protectedProcedure
      .input(z.object({
        userId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { userId } = input;

        const updatedOnboarding = await ctx.prisma.userOnboarding.update({
          where: { userId: userId },
          data: {
            stepFourCompleted: true
          },
          select: {
            stepOneCompleted: true,
            stepTwoCompleted: true,
            stepThreeCompleted: true,
            stepFourCompleted: true,
            onBoardingFinished: true
          }
        });

        if (!updatedOnboarding) {
          throw new Error("Failed to update step one status");
        }

        // Check if all steps are completed
        if (updatedOnboarding.stepOneCompleted && updatedOnboarding.stepTwoCompleted && updatedOnboarding.stepThreeCompleted && updatedOnboarding.stepFourCompleted) {
          await ctx.prisma.userOnboarding.update({
            where: { userId: userId },
            data: {
              onBoardingFinished: true
            }
          });
        }

        return updatedOnboarding;
    }),
  });
  