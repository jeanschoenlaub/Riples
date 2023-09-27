import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { generateTasks } from "~/server/services/openaicontroller";

export const openAiRouter = createTRPCRouter({
    generateProjectTasks: protectedProcedure
        .input(z.object({ projectTitle: z.string(), projectSummary: z.string() }))
        .mutation(async ({ input }) => {
            const { projectTitle, projectSummary } = input;
            try {
                const tasks = await generateTasks(projectTitle, projectSummary);
                return tasks;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Failed to get tasks from OpenAI ChatGPT.",
                });
            }
        })
});
