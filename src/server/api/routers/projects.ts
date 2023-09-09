import { z } from "zod";
import { createTRPCRouter,publicProcedure, protectedProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";




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

    const users = await ctx.prisma.user.findMany({
      where: {
        id: {
          in: projects.map((project) => project.authorID),
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        // Add any other fields you need
      },
    });

    // Map over projects to add author information
    return projects.map((project) => {
      const author = users.find((user) => user.id === project.authorID);

      if (!author) {
        throw new Error('Project author not found.');
      }

      return {
        project,
        author,
      };
    });
  }),

  getProjectByProjectId: publicProcedure
  .input(z.object({ projectId: z.string() }))
  .query(async ({ ctx, input }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: input.projectId },
    });

    if (!project) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
    }

    const author = await ctx.prisma.user.findUnique({
      where: { id: project.authorID },
      select: {
        id: true,
        name: true,
        image: true,
        // ... other fields you want to select
      },
    });

    if (!author) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Project author not found" });
    }

    return {
      project,
      author,
    };
  }),

  getProjectByAuthorId: publicProcedure
  .input(z.object({ authorID: z.string() }))
  .query(async ({ ctx, input }) => {
    const projects = await ctx.prisma.project.findMany({
      where: { authorID: input.authorID },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    const author = await ctx.prisma.user.findUnique({
      where: { id: input.authorID },
      select: {
        id: true,
        name: true,
        image: true,
        // ... other fields you want to select
      },
    });

    if (!author) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });
    }

    return projects.map((project) => ({
      project,
      author,
    }));
  }),

  applyToProject: protectedProcedure
    .input(
        z.object({
            userId: z.string(), // The ID of the user applying
            projectId: z.string(), // The ID of the project they are applying to
        })
    )
    .mutation(async ({ ctx, input }) => {
        const { userId, projectId } = input;

        // First, find the existing application, if any
        const existingApplication = await ctx.prisma.projectMembers.findFirst({
            where: {
                userID: userId,
                projectId: projectId
            }
        });

        // If an existing application is found and it's in 'PENDING' state, delete it
        if (existingApplication && existingApplication.status === 'PENDING') {
            await ctx.prisma.projectMembers.delete({
                where: {
                    id: existingApplication.id,
                }
            });
            return { status: 'DELETED' };
        }

        // Otherwise, proceed with creating a new application
        const application = await ctx.prisma.projectMembers.create({
            data: {
                userID: userId,
                projectId: projectId,
                status: "PENDING", // Default Status
            },
        });

        return application;
  }),
  

  create: protectedProcedure
  .input(z.object({ content: z.string().min(5, { message: "Must be 5 or more characters long" }) }))
  .mutation(async ({ ctx, input }) => {
    const authorID = ctx.session.user.id;

    const { success } = await ratelimit.limit(authorID);

    if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

    const project = await ctx.prisma.project.create({
      data: {
        authorID,
        title: input.content,
        summary: input.content,
      },
    });

    return project;
  }),
});

