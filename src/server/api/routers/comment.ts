import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
export const commentRouter = createTRPCRouter({

    // Add a comment to a riple
    addComment: protectedProcedure
        .input(z.object({
            ripleId: z.string(),
            content: z.string().min(1).max(1000)
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.user?.id) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
            }

            const newComment = await ctx.prisma.comment.create({
                data: {
                    ripleId: input.ripleId,
                    content: input.content,
                    authorID: ctx.session.user.id
                }
            });

            return newComment;
        }),

    // Remove a comment
    removeComment: protectedProcedure
        .input(z.object({ commentId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.user?.id) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
            }

            const deleteComment = await ctx.prisma.comment.delete({
                where: {
                    id: input.commentId,
                    authorID: ctx.session.user.id // Ensure the authenticated user is the author
                }
            });

            return deleteComment;
        }),

    // Get comments for a riple
    getCommentsByRiple: protectedProcedure
        .input(z.object({ ripleId: z.string() }))
        .query(async ({ ctx, input }) => {
            const comments = await ctx.prisma.comment.findMany({
                where: {
                    ripleId: input.ripleId
                },
                include: {
                    author:true
                },
                orderBy: {
                    createdAt: 'asc' // Assuming newest comments are shown first
                }
            });

            return comments;
        }),

    // Edit a comment (NOT IMPLEMENTED)
    editComment: protectedProcedure
        .input(z.object({
            commentId: z.string(),
            newContent: z.string().min(1).max(1000)
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.user?.id) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
            }

            const updatedComment = await ctx.prisma.comment.update({
                where: {
                    id: input.commentId,
                    authorID: ctx.session.user.id // Ensure the authenticated user is the author
                },
                data: {
                    content: input.newContent
                }
            });

            return updatedComment;
        }),
         // Get count of likes for a riple
    getCommentCount: protectedProcedure
    .input(z.object({ ripleId: z.string() }))
    .query(async ({ ctx, input }) => {
        const commentCount = await ctx.prisma.comment.count({
            where: {
                ripleId: input.ripleId
            }
        });

        return commentCount;
    }),
});
