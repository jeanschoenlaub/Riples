import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const projMemberRouter = createTRPCRouter({
  getMembersByProjectId: publicProcedure
  .input(z.object({projectId: z.string()}))
  .query( async ({ ctx, input }) => {
    // Find the project by its unique ID
    const members = await ctx.prisma.projectMembers.findMany({
      where: {
        projectId: input.projectId
      }
    });
   
    return{ members }
  }),
})