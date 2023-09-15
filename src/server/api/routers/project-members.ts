import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


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
          id: { in: members.map((member) => member.userId) },
        },
      });

      return members.map((member) => {
        const user = memberUsers.find((memberUser) => memberUser.id === member.userId);

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
});

