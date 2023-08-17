import { clerkClient} from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
    return {
      id: user.id,
      username: user.username,
      firstName:user.firstName,
      lastName:user.lastName,
      imageUrl: user.imageUrl
    }
}

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

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(5, { message: "Must be 5 or more characters long" }),
      })
    )
    .mutation(async ({ ctx, input}) => {
      const authorID = ctx.currentUserId;

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
