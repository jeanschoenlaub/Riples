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
        content: z.string().min(5, { message: "Question must be 5 or more characters long" }).max(255, { message: "Question must be 255 or less characters long" }),
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
            },
        });

        return newQuestion;
    }),
    createForumAnswer: protectedProcedure
    .input(z.object({
        questionId: z.string(),
        content: z.string().min(5, { message: "Answer must be 5 or more characters long" }).max(10000, { message: "Answer must be 10000 or less characters long" }),
    }))
    .mutation(async ({ ctx, input }) => {
        // Check if the user is authenticated
        if (!ctx.session || !ctx.session.user) {
            throw new Error("You must be logged in to create an answer.");
        }

        // Create the answer and link it to the question and user
        const newAnswer = await ctx.prisma.forumAnswers.create({
            data: {
                content: input.content,
                questionId: input.questionId,
                userId: ctx.session.user.id, // Link to the user ID from the session
                // Include any other fields that are necessary
            },
        });

        // Optionally, you can return the answer with the user details included
        return await ctx.prisma.forumAnswers.findUnique({
            where: {
                id: newAnswer.id,
            },
            include: {
                user: true, // Include the user details of the person who answered the question
            },
        });
    }),

    getForumAnswersByQuestionId: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx, input }) => {
        // Fetch the answers related to the question ID provided
        const answers = await ctx.prisma.forumAnswers.findMany({
            where: {
                questionId: input.questionId,
            },
            orderBy: {
                createdAt: 'desc', // Assuming you have a createdAt field to sort by
            },
            include: {
                user: true, // Include the user details of the person who answered the question
            },
        });

        // Return the answers
        return answers;
    }),
});