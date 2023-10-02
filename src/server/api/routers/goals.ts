import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const goalRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
        z.object({
            projectId: z.string(),
            title: z.string().min(5, { message: "Goal title must be 5 or more characters long" }).max(255, { message: "Goal title must be 255 or less characters long" }),
            progress: z.number(),
            progressFinalValue: z.number(),
        })
        )
        .mutation(async ({ ctx, input }) => {
        const createdById = ctx.session.user?.id;
    
        if (!createdById) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not access session id" });
        }

        const goal = await ctx.prisma.goals.create({
            data: {
            projectId: input.projectId,
            createdById: createdById,
            title: input.title,
            progress: input.progress,
            progressFinalValue: input.progressFinalValue,
            },
        });
    
        return goal;
        }),

    edit: protectedProcedure
        .input(
            z.object({
                goalId: z.string(),
                title: z.string().min(5).max(255),
                progress: z.number(),
                progressFinalValue: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const createdById = ctx.session.user?.id;
            if (!createdById) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not access session id" });
            }

            const updatedGoal = await ctx.prisma.goals.update({
                where: { id: input.goalId },
                data: {
                    title: input.title,
                    progress: input.progress,
                    progressFinalValue: input.progressFinalValue,
                },
            });

            return updatedGoal;
        }),

    delete: protectedProcedure
        .input(
            z.object({
                goalId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const createdById = ctx.session.user?.id;
            if (!createdById) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not access session id" });
            }

            // Ensure only the creator or authorized person can delete the goal
            const goal = await ctx.prisma.goals.findUnique({
                where: { id: input.goalId },
            });

            if (!goal || goal.createdById !== createdById) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized deletion attempt" });
            }

            const deletedGoal = await ctx.prisma.goals.delete({
                where: { id: input.goalId },
            });

            return deletedGoal;
        }),
});