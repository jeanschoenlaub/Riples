import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const projFollowerRouter = createTRPCRouter({
  addFollowerToProject: publicProcedure
    .input(z.object({ projectId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { projectId, userId } = input;

      // Add follower to the project
      const newFollower = await ctx.prisma.projectFollowers.create({
        data: {
          projectId,
          userId,
        },
      });

      if (!newFollower) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add follower to project",
        });
      }

      return newFollower;
    }),
  removeFollowerFromProject: publicProcedure
    .input(z.object({ projectId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { projectId, userId } = input;

      // Remove follower from the project
      const deleteFollower = await ctx.prisma.projectFollowers.deleteMany({
        where: {
          projectId,
          userId,
        },
      });

      if (!deleteFollower || deleteFollower.count === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove follower from project",
        });
      }

      return {
        success: true,
        message: "Successfully removed follower from project",
      };
    }),
    
    getFollowersByProjectId: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { projectId } = input;

      // Fetch followers for the given project ID
      const followers = await ctx.prisma.projectFollowers.findMany({
        where: {
          projectId,
        },
        select: {
          userId: true, // Select fields you want to return
        },
      });

      if (!followers) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch followers for the project",
        });
      }

      return followers;
    }),
});
