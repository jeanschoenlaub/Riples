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

            const likeCount = await ctx.prisma.like.count({
                where: {
                    ripleId: input.ripleId
                }
            });

            return {
                commentCount,
                comments,
                likeCount
            };
        }),
});