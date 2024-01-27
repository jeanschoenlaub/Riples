import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const noteRouter = createTRPCRouter({
  getNotesByProjectId: publicProcedure
  .input(z.object({projectId: z.string()}))
  .query( async ({ ctx, input }) => {
    const notes = await ctx.prisma.notes.findMany({
      where: {
        projectId: input.projectId
      },
      orderBy: {
        editedAt: 'desc' // Sort note by the 'editedAt' field in descending order
      },
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

    const ownerUser = await fetchUserData(notes.map((note) => note.ownerId));
    const createdByUser = await fetchUserData(notes.map((note) => note.createdById));

    return notes.map((note) => {
      const owner = ownerUser.find((o) => o.id === note.ownerId);
      const createdBy = createdByUser.find((c) => c.id === note.createdById);

      return {
        note,
        owner,
        createdBy
      }
    });
    }),

    create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5, { message: "Note title must be 5 or more characters long" }).max(255, { message: "Note title must be 255 or less characters long" }),
        content: z.string().max(10000, { message: "Note content must be 10,000 or less characters long" }),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdById = ctx.session.user?.id;
  
      if (!createdById) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not access session id" });
      }

      const note = await ctx.prisma.notes.create({
        data: {
          createdById: createdById,
          title: input.title,
          content: input.content,
          projectId: input.projectId,
        },
      });
  
      return note;
    }),

    edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(5, { message: "Note title must be 5 or more characters long" }).max(255, { message: "Note title must be 255 or less characters long" }),
        content: z.string().max(10000, { message: "Note content must be 10,000 or less characters long" }),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, content, projectId} = input;
      // const updatedById = ctx.session.user.id; not used for now

      const note = await ctx.prisma.notes.update({
        where: { id },
        data: {
          title,
          content,
          projectId,
          editedAt: new Date() // This updates the editedAt field to the current date and time
        },
      });

      return note;
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

      // Retrieve the note and project details to validate permissions
      const note = await ctx.prisma.notes.findUnique({
        where: { id },
      });
      
      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!note || !project) {
        throw new TRPCError ({code: "INTERNAL_SERVER_ERROR", message: "Note or Project not found"})
      }

      if (note.createdById !== userId && project.authorID !== userId) {
        throw new TRPCError ({code: "UNAUTHORIZED", message: "Only the note creator or project owner is allowed to delete"})
      }

      const deletedNote = await ctx.prisma.notes.delete({
        where: { id },
      });

      return deletedNote;
    }),


})