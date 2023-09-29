import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { generateGoals, generatePost, generateTasks } from "~/server/services/openaicontroller";

export const openAiRouter = createTRPCRouter({
    generateProjectTasks: protectedProcedure
    .input(
        z.object({ 
                projectTitle: z.string(),
                projectSummary: z.string(), 
                taskNumber: z.string(),
                }))
    .mutation(async ({ input }) => {
        const { projectTitle, projectSummary, taskNumber } = input;
        try {
            const tasks = await generateTasks(projectTitle, projectSummary, taskNumber);
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
                }))
    .mutation(async ({ input }) => {
        const { projectTitle, projectSummary, goalNumber } = input;
        try {
            const tasks = await generateGoals(projectTitle, projectSummary, goalNumber);
            return tasks;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Failed to get tasks from OpenAI ChatGPT.",
            });
        }
    }),
    generateProjectPost: protectedProcedure
    .input(
        z.object({ 
                projectTitle: z.string(),
                projectSummary: z.string(), 
                }))
    .mutation(async ({ input }) => {
        const { projectTitle, projectSummary } = input;
        try {
            const tasks = await generatePost(projectTitle, projectSummary);
            return tasks;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "Failed to get tasks from OpenAI ChatGPT.",
            });
        }
    })
});
