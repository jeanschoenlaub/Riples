import { z } from "zod";
import { createTRPCRouter,publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const userRouter = createTRPCRouter({
    getUserByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
        // Find the user by ID
        const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            // ... other fields you want to select
        },
    });

    // Check if the user exists
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return {
      user,
    };
  }),
})       
