import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const feedRouter = createTRPCRouter({
    getRipleDetails: publicProcedure
        .input(z.object({ ripleId: z.string() }))
        .query(async ({ ctx, input }) => {
            const commentCount = await ctx.prisma.comment.count({
                where: {
                    ripleId: input.ripleId
                }
            });

            const comments = await ctx.prisma.comment.findMany({
                where: {
                    ripleId: input.ripleId
                },
                include: {
                    author: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });

            const likes = await ctx.prisma.like.findMany({
                where: {
                    ripleId: input.ripleId
                },
                select: {
                    userId: true // Return only the userIds of those who've liked the riple
                }
            });
    
            const likeCount = likes.length;    

            return {
                commentCount,
                comments,
                likeCount,
                likedUserIds: likes.map(like => like.userId) // Send an array of user IDs to the frontend
            };
        }),
});