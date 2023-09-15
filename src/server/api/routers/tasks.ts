import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
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

    const fetchUserData = async (userIds: string[]) => {
      return await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
      });
    };

    const ownerUser = await fetchUserData(tasks.map((task) => task.ownerId));
    const createdByUser = await fetchUserData(tasks.map((task) => task.createdById));

    return tasks.map((task) => {
      const owner = ownerUser.find((o) => o.id === task.ownerId);
      const createdBy = createdByUser.find((c) => c.id === task.createdById);


      if (!createdBy) throw new TRPCError ({code: "INTERNAL_SERVER_ERROR", message: "Task Creator not found"})
      
      return {
        task,
        owner,
        createdBy
      }
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5, { message: "Task title must be 5 or more characters long" }).max(255, { message: "Task title must be 255 or less characters long" }),
        content: z.string().min(5, { message: "Task Content must be 5 or more characters long" }).max(10000, { message: "Task title must be 10,000 or less characters long" }),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdById = ctx.session.user.id;
      const task = await ctx.prisma.tasks.create({
        data: {
          createdById,
          title: input.title,
          content: input.content,
          projectId: input.projectId,
        },
      });
      return task;
    }),

    edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(5, { message: "Task title must be 5 or more characters long" }).max(255, { message: "Task title must be 255 or less characters long" }),
        content: z.string().min(5, { message: "Task Content must be 5 or more characters long" }).max(10000, { message: "Task title must be 10,000 or less characters long" }),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, content, projectId } = input;
      // const updatedById = ctx.session.user.id; not used for now

      const task = await ctx.prisma.tasks.update({
        where: { id },
        data: {
          title,
          content,
          projectId,
        },
      });

      return task;
    }),
});



