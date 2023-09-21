import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";


export const projMemberRouter = createTRPCRouter({
  getMembersByProjectId: publicProcedure
    .input(z.object({projectId: z.string()}))
    .query(async ({ ctx, input }) => {
      // Find the project members by the project ID
      const members = await ctx.prisma.projectMembers.findMany({
        where: {
          projectId: input.projectId,
        },
      });

      // Grab the user data from Prisma for the members
      const memberUsers = await ctx.prisma.user.findMany({
        where: {
          id: { in: members.map((member) => member.userID) },
        },
      });

      return members.map((member) => {
        const user = memberUsers.find((memberUser) => memberUser.id === member.userID);

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Member user not found",
          });
        }

        return {
          member,
          user,
        };
      });
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


  // Mutation for approving a member
  approveMember: publicProcedure
  .input(z.object({ projectId: z.string(), userId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const updatedMember = await ctx.prisma.projectMembers.update({
      where: {
        projectId_userID: {
          projectId: input.projectId,
          userID: input.userId,
        },
      },
      data: {
        status: 'APPROVED', // Assuming you have a `status` field
      },
    });

    if (!updatedMember) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to approve member',
      });
    }

    return updatedMember;
  }),

  // Mutation for refusing a member
  deleteProjectMember: publicProcedure
  .input(z.object({ projectId: z.string(), userId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const deletedMember = await ctx.prisma.projectMembers.delete({
      where: {
        projectId_userID: {
          projectId: input.projectId,
          userID: input.userId,
        },
      },
    });

    if (!deletedMember) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to refuse member',
      });
    }

    return deletedMember;
  }),
});

