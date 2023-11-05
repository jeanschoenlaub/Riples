import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateGoals, generatePost, generateTasks} from "~/server/services/openaicontroller";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";


// Create a new ratelimiter, that allows 2 requests per 1 minute
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  analytics: true,
})

export const maxDuration = 300; // This function can run for a maximum of 5 minutes

export const openAiRouter = createTRPCRouter({
    generateProjectTasks: protectedProcedure
    .input(
        z.object({ 
                projectTitle: z.string(),
                projectSummary: z.string(), 
                taskNumber: z.string(),
                userId: z.string(),
                }))
    .mutation(async ({ ctx, input }) => {
        const { projectTitle, projectSummary, taskNumber, userId } = input;

        const { success } = await ratelimit.limit(userId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message:"AI Task Content generation limited to 2 per minute."});
        
        try {
            const tasks = await generateTasks(projectTitle, projectSummary, taskNumber);
            await ctx.prisma.aIUsageLog.create({
                data: {
                  userId: userId,
                  features: 'generateProjectTasks'
                }
            });
            return tasks;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Failed to get tasks from OpenAI ChatGPT.",
            });
        }
    }),
    generateProjectGoals: protectedProcedure
    .input(
        z.object({ 
                projectTitle: z.string(),
                projectSummary: z.string(), 
                goalNumber: z.string(),
                userId: z.string(),
            }))
    .mutation(async ({ ctx, input }) => {
        const { projectTitle, projectSummary, goalNumber, userId } = input;
        const { success } = await ratelimit.limit(userId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message:"AI Content generation limited to 2 per minute."});
        
        try {
            const goals = await generateGoals(projectTitle, projectSummary, goalNumber);
            await ctx.prisma.aIUsageLog.create({
                data: {
                  userId: userId,
                  features: 'generateProjectGoals'
                }
            });
            return goals;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Failed to get goals from OpenAI ChatGPT.",
            });
        }
    }),
    generateProjectPost: protectedProcedure
    .input(
        z.object({ 
                projectTitle: z.string(),
                projectSummary: z.string(), 
                userId: z.string(),
                }))
    .mutation(async ({ ctx, input }) => {
        const { projectTitle, projectSummary, userId } = input;
        const { success } = await ratelimit.limit(userId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message:"AI Content generation limited to 2 per minute."});
        
        try {
            const post = await generatePost(projectTitle, projectSummary);
            await ctx.prisma.aIUsageLog.create({
                data: {
                  userId: userId,
                  features: 'generateProjectPost'
                }
            });
            return post;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Failed to get tasks from OpenAI ChatGPT.",
            });
        }
    }),
    /*
    generateRipleContent: protectedProcedure
    .input(
        z.object({ 
                projectTitle: z.string(),
                projectSummary: z.string(), 
                userPrompt: z.string(),
                userId: z.string(),
            }))
    .mutation(async ({ ctx, input }) => {
        const { projectTitle, projectSummary, userPrompt , userId } = input;

        const { success } = await ratelimit.limit(userId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message:"AI Task Content generation limited to 2 per minute."});
        
        try {
            const riple = await generateRipleContent(projectTitle, projectSummary, userPrompt);
            await ctx.prisma.aIUsageLog.create({
                data: {
                  userId: userId,
                  features: 'generateRipleContent'
                }
            });
            return riple;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Failed to get tasks from OpenAI ChatGPT.",
            });
        }
    }),
    generateRipleHTML: protectedProcedure
    .input(
        z.object({ 
                ripleContent: z.string(),
                userPrompt: z.string(),
                userId: z.string(),
            }))
    .mutation(async ({ ctx, input }) => {
        const { ripleContent, userPrompt , userId } = input;

        const { success } = await ratelimit.limit(userId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message:"AI Task Content generation limited to 2 per minute."});
        
        try {
            const riple = await generateRipleHTML(ripleContent, userPrompt);
            await ctx.prisma.aIUsageLog.create({
                data: {
                  userId: userId,
                  features: 'generateRipleHTML'
                }
            });
            return riple;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Failed to get tasks from OpenAI ChatGPT.",
            });
        }
    }),*/
});
