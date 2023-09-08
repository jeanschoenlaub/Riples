import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

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

      // Grab the user data from Clerk for the members
      const memberUsers = (await clerkClient.users.getUserList({
        userId: members.map((member) => member.userID),
        limit: 100,
      })).map(filterUserForClient);

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
});