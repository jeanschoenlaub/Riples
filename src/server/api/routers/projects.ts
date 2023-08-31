import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import type { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { clerkClient} from "@clerk/nextjs";

export const filterUserForClient = (user: User) => {
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

export const projRouter = createTRPCRouter({
  getAll: publicProcedure.query( async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      take:100,
      orderBy: [{
        createdAt: "desc",
     }]
    });

    const user = (await clerkClient.users.getUserList({
      userId: projects.map((project) => project.authorID),
      limit: 100,
    })).map(filterUserForClient);

    return projects.map((projects) => {
      const author = user.find((user) => user.id === projects.authorID)

      if(!author) throw new TRPCError ({code:"INTERNAL_SERVER_ERROR", message:"Riple author not found"})
      return{
        projects,
        author,
      }
    });
  }),

  getProjectByProjectId: publicProcedure
  .input(z.object({projectId: z.string()}))
  .query( async ({ ctx, input }) => {
    // Find the project by its unique ID
    const project = await ctx.prisma.project.findUnique({
      where: {
        id: input.projectId
      }
    });

    if (!project) {
      throw new TRPCError({code: "NOT_FOUND", message: "Project not found"});
    }

    const author = filterUserForClient(await clerkClient.users.getUser( project.authorID));

    if(!author) throw new TRPCError ({code:"INTERNAL_SERVER_ERROR", message:"Project author not found"})
    return{
      project,
      author,
    }
  }),

  getProjectByAuthorId: publicProcedure
  .input(z.object({authorID: z.string()}))
  .query( async ({ ctx, input }) => {
    // Find the project by its unique ID
    const projects = await ctx.prisma.project.findMany({
      where: {
        authorID: input.authorID
      },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    const user = (await clerkClient.users.getUserList({
      userId: projects.map((project) => project.authorID),
      limit: 100,
    })).map(filterUserForClient);

    return projects.map((project) => {
      const author = user.find((user) => user.id === project.authorID)

      if (!author) throw new TRPCError ({code: "INTERNAL_SERVER_ERROR", message: "Riple author not found"})
      
      return {
        project,
        author
      }
    });
  }),
  

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(5, { message: "Must be 5 or more characters long" }),
      })
    )
    .mutation(async ({ ctx, input}) => {
      const authorID = ctx.currentUserId;

      const { success } = await ratelimit.limit(authorID)

      if (!success) throw new TRPCError({code:"TOO_MANY_REQUESTS"})

      const project = await ctx.prisma.project.create({
        data:{
          authorID,
          title: input.content,
          summary: input.content,
        },
      });

      return project
    }),
});
