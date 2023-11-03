import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const forumRouter = createTRPCRouter({
    getForumQuestionsByProjectId: publicProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ ctx, input }) => {
        // Fetch the questions with user details included
        const questions = await ctx.prisma.forumQuestion.findMany({
          where: {
            projectId: input.projectId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: true, // Include the user details of the person who asked the question
            answers: {
              include: {
                user: true, // Include the user details of the person who answered the question
              },
            },
          },
        });
  
        // Return the questions which now includes the user details
        return questions;
      }),

    createForumQuestion: protectedProcedure
        .input(z.object({
        projectId: z.string(),
        content: z.string().min(1), // Ensuring that the content is not empty
        // Add any other fields that might be required for creating a forum question
        }))
        .mutation(async ({ ctx, input }) => {
        // Assuming you want only authenticated users to create questions
        // Check if the user is authenticated
        if (!ctx.session || !ctx.session.user) {
            throw new Error("You must be logged in to create a question.");
        }

        const newQuestion = await ctx.prisma.forumQuestion.create({
            data: {
            projectId: input.projectId,
            content: input.content,
            userId: ctx.session.user.id, // This assumes that you have the user's ID in the session
            // Include any other fields that are required here
            },
        });

        return newQuestion;
    }),
  });