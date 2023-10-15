import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const likeRouter = createTRPCRouter({
    // Add a like to a riple
    addLike: protectedProcedure
        .input(z.object({ ripleId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.user?.id) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
            }

            const existingLike = await ctx.prisma.like.findFirst({
                where: {
                    ripleId: input.ripleId,
                    userId: ctx.session.user.id
                }
            });

            if (existingLike) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "User has already liked this riple" });
            }

            const newLike = await ctx.prisma.like.create({
                data: {
                    ripleId: input.ripleId,
                    userId: ctx.session.user.id
                }
            });

            return newLike;
        }),

    // Remove a like from a riple
    removeLike: protectedProcedure
        .input(z.object({ ripleId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.user?.id) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
            }

            const deleteLike = await ctx.prisma.like.deleteMany({
                where: {
                    ripleId: input.ripleId,
                    userId: ctx.session.user.id
                }
            });

            return deleteLike;
        }),

    // Check if a user has liked a riple
    hasLiked: protectedProcedure
        .input(z.object({ 
            ripleId: z.string(),
            userId: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            const existingLike = await ctx.prisma.like.findFirst({
                where: {
                    ripleId: input.ripleId,
                    userId: input.userId
                }
            });

            return !!existingLike;
        }),

    // Get count of likes for a riple
    getLikeCount: protectedProcedure
        .input(z.object({ ripleId: z.string() }))
        .query(async ({ ctx, input }) => {
            const likeCount = await ctx.prisma.like.count({
                where: {
                    ripleId: input.ripleId
                }
            });

            return likeCount;
        }),
});
