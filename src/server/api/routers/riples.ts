import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import type { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { clerkClient} from "@clerk/nextjs";

const filterUserForClient = (user: User) => {
    return {
      id: user.id,
      username: user.username,
      firstName:user.firstName,
      lastName:user.lastName,
      imageUrl: user.imageUrl
    }
}

// Create a new ratelimiter, that allows 2 requests per 1 minute
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  analytics: true,
})

export const ripleRouter = createTRPCRouter({
    getAll: publicProcedure.query( async ({ ctx }) => {
        const riples = await ctx.prisma.riple.findMany({
          take: 100,
          orderBy: [{ createdAt: "desc" }],
          include: { project: true }  // Include the related project details.
        });
    
        const user = (await clerkClient.users.getUserList({
          userId: riples.map((riple) => riple.authorID),
          limit: 100,
        })).map(filterUserForClient);
    
        return riples.map((riple) => {
          const author = user.find((user) => user.id === riple.authorID)
    
          if (!author) throw new TRPCError ({code: "INTERNAL_SERVER_ERROR", message: "Riple author not found"})
          
          return {
            riple,
            author,
            project: riple.project
          }
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
    

    create: privateProcedure
        .input(
            z.object({
                title: z.string().min(5, { message: "Must be 5 or more characters long" }).max(255, { message: "Must be less than 255 characters long" }),
                content: z.string().min(5, { message: "Must be 5 or more characters long" }).max(50000, { message: "Must be less than 50'000 characters long" }),
                projectId: z.string(),  // Add this
            })
        )
        .mutation(async ({ ctx, input}) => {
        const authorID = ctx.currentUserId;

        const { success } = await ratelimit.limit(authorID)

        if (!success) throw new TRPCError({code:"TOO_MANY_REQUESTS"})

        const riple = await ctx.prisma.riple.create({
            data:{
            authorID,
            title: input.title,
            content: input.content,
            projectId: input.projectId,
            },
        });

        return riple
        }),
});
