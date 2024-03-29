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
      },
      orderBy: {
        editedAt: 'desc' // Sort tasks by the 'editedAt' field in descending order
      },
      include: {
        subTasks: true
      }
    });

    const fetchUserData = async (userIds: string[]) => {
      return await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          username: true,
          createdAt: true,
          description: true,
          onBoardingFinished: true,
          productTourFinished: true,
          tags: {
            select: {
              tag: true  // Select the tag field inside the UserInterestTags model
            }
          },
        }
      });
    };

    const ownerUser = await fetchUserData(tasks.map((task) => task.ownerId));
    const createdByUser = await fetchUserData(tasks.map((task) => task.createdById));

    return tasks.map((task) => {
      const owner = ownerUser.find((o) => o.id === task.ownerId);
      const createdBy = createdByUser.find((c) => c.id === task.createdById);

      return {
        task,
        owner,
        createdBy
      }
    });
  }),

  getTasksByCreatedOrOwnerId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.tasks.findMany({
        where: {
          OR: [
            { ownerId: input.userId },
            { createdById: input.userId }
          ]
        },
        orderBy: { editedAt: 'desc' },
        include: { subTasks: true }
      });

      const fetchUserData = async (userIds: string[]) => {
        return await ctx.prisma.user.findMany({
          where: { id: { in: userIds } },
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            username: true,
            createdAt: true,
            description: true,
            onBoardingFinished: true,
            productTourFinished: true,
            tags: {
              select: {
                tag: true  // Select the tag field inside the UserInterestTags model
              }
            },
          }
        });
      };

      const ownerUser = await fetchUserData(tasks.map(task => task.ownerId));
      const createdByUser = await fetchUserData(tasks.map(task => task.createdById));

      return tasks.map(task => {
        const owner = ownerUser.find(o => o.id === task.ownerId);
        const createdBy = createdByUser.find(c => c.id === task.createdById);
        return { task, owner, createdBy };
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5, { message: "Task title must be 5 or more characters long" }).max(255, { message: "Task title must be 255 or less characters long" }),
        content: z.string().max(10000, { message: "Task title must be 10,000 or less characters long" }),
        status: z.string(),
        due: z.date(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdById = ctx.session.user?.id;
  
      if (!createdById) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not access session id" });
      }

      const task = await ctx.prisma.tasks.create({
        data: {
          createdById: createdById,
          title: input.title,
          content: input.content,
          status: input.status,
          due: input.due,
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
        content: z.string().max(10000, { message: "Task title must be 10,000 or less characters long" }),
        projectId: z.string(),
        due: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, content, projectId, due } = input;
      // const updatedById = ctx.session.user.id; not used for now

      const task = await ctx.prisma.tasks.update({
        where: { id },
        data: {
          title,
          content,
          projectId,
          due,
          editedAt: new Date() // This updates the editedAt field to the current date and time
        },
      });

      return task;
    }),

    delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        projectId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, userId, projectId } = input;

      // Retrieve the task and project details to validate permissions
      const task = await ctx.prisma.tasks.findUnique({
        where: { id },
      });
      
      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!task || !project) {
        throw new TRPCError ({code: "INTERNAL_SERVER_ERROR", message: "Task or Project not found"})
      }

      if (task.createdById !== userId && project.authorID !== userId) {
        throw new TRPCError ({code: "UNAUTHORIZED", message: "Only the task creator or project owner is allowed to delete"})
      }

      const deletedTask = await ctx.prisma.tasks.delete({
        where: { id },
      });

      return deletedTask;
    }),


    changeStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.string().nonempty("Status cannot be empty"), // Add your validation rules here
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      // Optionally, check if the user has permissions to change the status of this task
      // Your logic here...

      const updatedTask = await ctx.prisma.tasks.update({
        where: { id },
        data: { status },
      });

      return updatedTask;
    }),

    changeOwner: protectedProcedure
    .input(z.object({
      id: z.string(),
      projectId: z.string(),
      userId: z.string().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, userId } = input;

      const updatedTask = await ctx.prisma.tasks.update({
        where: { id },
        data: { ownerId: userId ?? "" },
      });
      

      return updatedTask;
    }),

  getSubTasksByTaskId: publicProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      const subTasks = await ctx.prisma.subTasks.findMany({
        where: {
          taskId: input.taskId,
        },
      });
      return subTasks;
    }),

  // Route to create a new sub-task
  createSubTask: protectedProcedure
    .input(
      z.object({ 
        taskId: z.string(),
        title: z.string().min(5, { message: "Sub-task title must be 5 or more characters long" }).max(255, { message: "Sub-task title must be 255 or less characters long" }), 
    }))
    .mutation(async ({ ctx, input }) => {
      const newSubTask = await ctx.prisma.subTasks.create({
        data: {
          taskId: input.taskId,
          title: input.title,
          status: false,
        },
      });
      return newSubTask;
    }),

    editSubTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(5, { message: "Sub-task title must be 5 or more characters long" }).max(255, { message: "Sub-task title must be 255 or less characters long" }),
        content: z.string().max(10000, { message: "Sub-task content must be 10000 or less characters long" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, content } = input;
  
      const subTask = await ctx.prisma.subTasks.update({
        where: { id },
        data: {
          title,
          content
        },
      });
  
      return subTask;
    }),
  

  // Route to delete a sub-task
  deleteSubTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedSubTask = await ctx.prisma.subTasks.delete({
        where: { id: input.id },
      });
      return deletedSubTask;
    }),

  // Route to change the status of a sub-task
  changeSubTaskStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const updatedSubTask = await ctx.prisma.subTasks.update({
        where: { id: input.id },
        data: { status: input.status },
      });
      return updatedSubTask;
    }),

});




