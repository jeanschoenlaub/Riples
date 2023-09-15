import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";


// Create a new ratelimiter, that allows 2 requests per 1 minute
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  analytics: true,
})

export const ripleRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const riples = await ctx.prisma.riple.findMany({
          take: 100,
          orderBy: [{ createdAt: "desc" }],
          include: { project: true },
        });
      
        const authors = await ctx.prisma.user.findMany({
          where: {
            id: { in: riples.map((riple) => riple.authorId) },
          },
        });
      
        return riples.map((riple) => {
          const author = authors.find((user) => user.id === riple.authorId);
          if (!author) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });
          return {
            riple,
            author,
            project: riple.project,
          };
        });
      }),


    getRipleByRipleId: publicProcedure
    .input(z.object({ripleId: z.string()}))
    .query( async ({ ctx, input }) => {
        // Find the riple by its unique ID
        const riple = await ctx.prisma.riple.findUnique({
        where: {
            id: input.ripleId
        }
        });

        if (!riple) {
        throw new TRPCError({code: "NOT_FOUND", message: "riple not found"});
        }

        return { riple };
    }),
    

    create: protectedProcedure
    .input(
        z.object({
        title: z.string().min(5).max(255),
        content: z.string().min(5).max(50000),
        projectId: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const authorId = ctx.session.user.id;

        const { success } = await ratelimit.limit(authorId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

        const riple = await ctx.prisma.riple.create({
        data: {
            authorId,
            title: input.title,
            content: input.content,
            projectId: input.projectId,
        },
        });

        return riple;
    }),
        
    getRiplebyProjectId: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
        const riples = await ctx.prisma.riple.findMany({
        where: { projectId: input.projectId },
        include: { project: true },
        });

        const authors = await ctx.prisma.user.findMany({
        where: {
            id: { in: riples.map((riple) => riple.authorId) },
        },
        });

        return riples.map((riple) => {
        const author = authors.find((user) => user.id === riple.authorId);
        if (!author) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });
        return {
            riple,
            author,
            project: riple.project,
        };
        });
    }),
});
