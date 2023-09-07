import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { clerkClient} from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";

export const taskRouter = createTRPCRouter({
  getTasksByProjectId: publicProcedure
  .input(z.object({projectId: z.string()}))
  .query( async ({ ctx, input }) => {
    const tasks = await ctx.prisma.tasks.findMany({
      where: {
        projectId: input.projectId
      }
    });

    // We also grab the user Data from clerk for the task creator and owner on the server
    const ownerUser = (await clerkClient.users.getUserList({
      userId: tasks.map((task) => task.ownerId),
      limit: 100,
    })).map(filterUserForClient);
    const createdByUser = (await clerkClient.users.getUserList({
      userId: tasks.map((task) => task.createdById),
      limit: 100,
    })).map(filterUserForClient);

    return tasks.map((task) => {
      const owner = ownerUser.find((owner) => owner.id === task.ownerId)
      const createdBy = createdByUser.find((createdBy) => createdBy.id === task.createdById)

      if (!createdBy) throw new TRPCError ({code: "INTERNAL_SERVER_ERROR", message: "Task Creator not found"})
      
      return {
        task,
        owner,
        createdBy
      }
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        title: z.string().min(5, { message: "Task title must be 5 or more characters long" }).max(255, { message: "Task title must be 255 or less characters long" }),
        content: z.string().min(5, { message: "Task Content must be 5 or more characters long" }).max(10000, { message: "Task title must be 10'00 or less characters long" }),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input}) => {
      const createdById = ctx.currentUserId;
      const task = await ctx.prisma.tasks.create({
        data:{
          createdById, 
          title: input.title,
          content: input.content,
          projectId: input.projectId,
        },
      });

      return task
    }),
})