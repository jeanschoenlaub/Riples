import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const userRouter = createTRPCRouter({
  getUserByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userFromDb = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          username: true,
          createdAt: true,
          description: true,
          userOnboarding: {
            select: {
              onBoardingFinished: true,
              productTourFinished: true
            }
          },
          tags: {
            select: {
              tag: true  // Select the tag field inside the UserInterestTags model
            }
          },          
        },
      });

      if (!userFromDb) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      // Flatten the tags structure to match frontend's expectation
      const interestTags = userFromDb.tags.map(rel => rel.tag);
      const user = {
        ...userFromDb,
        interestTags: interestTags,
        tags: undefined
      };

      console.log(user)

      return {
        user,
      };
    }),

  updateUsername: protectedProcedure
    .input(z.object({
      userId: z.string(),
      username: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check for duplicate username
      const existingUserWithUsername = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });

      if (existingUserWithUsername) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already exists',
        });
      }

      // Update username
      let updatedUser;
      try {
        updatedUser = await ctx.prisma.user.update({
          where: { id: input.userId },
          data: { username: input.username },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the username',
        });
      }

      return {
        user: updatedUser,
      };
    }),
    getProductTourStatus: protectedProcedure
    .input(z.object({
        userId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
        const { userId } = input;

        const user = await ctx.prisma.user.findUnique({
            where: { id: userId },
            select: {
                productTourFinished: true
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
  }),

  editUserInfo: protectedProcedure
  .input(z.object({
    userId: z.string(),
    name: z.string()
      .max(255, { message: "User name must be 255 or fewer characters long" }),
    description: z.string()
      .max(5000, { message: "Description must be 5000 or fewer characters long" }),
    tags: z.array(z.string()),  // Add tags to the input
  }))
  .mutation(async ({ ctx, input }) => {
    const currentUserId = ctx.session.user.id;
    const userIdToUpdate = input.userId;
  
    // You might want to check if the current user is allowed to update this user profile.
    if (currentUserId !== userIdToUpdate) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    // Check existing tags
    const existingTags = await ctx.prisma.tag.findMany({
      where: {
        name: {
          in: input.tags
        }
      }
    });

    const existingTagNames = existingTags.map(t => t.name);
    const newTagNames = input.tags.filter(tag => !existingTagNames.includes(tag));

    if (newTagNames.length > 0) {
      await ctx.prisma.tag.createMany({
        data: newTagNames.map(tagName => ({ name: tagName })),
        skipDuplicates: true
      });
    }

    // Get all tag IDs, including the ones we just created
    const allTags = await ctx.prisma.tag.findMany({
      where: {
        name: {
          in: input.tags
        }
      }
    });

    const allTagIds = allTags.map(t => t.id);

    await Promise.all(
      allTagIds.map(tagId => {
        return ctx.prisma.userInterestTags.upsert({
          where: {
            tagId_userId: { tagId, userId: userIdToUpdate }
          },
          update: {}, // No updates required, just ensure it exists
          create: {
            tagId,
            userId: userIdToUpdate
          }
        });
      })
    );

    // Once all UserInterestTags records are ensured, you can proceed with user update
    const updatedUser = await ctx.prisma.user.update({
      where: { id: userIdToUpdate },
      data: {
        name: input.name,
        description: input.description,
      }
    });
  
    return updatedUser;
}),

createUserLog: publicProcedure
    .input(
        z.object({
        userId: z.string(),
        date: z.date(),
        registrationDate: z.union([z.date(), z.null()]),
        lastLogin: z.union([z.date(), z.null()]),
        lastProjectCreated: z.union([z.date(), z.null()]),
        lastTaskEdited: z.union([z.date(), z.null()]),
        lastLikedEntry: z.union([z.date(), z.null()]),
        lastRiple: z.union([z.date(), z.null()]),
        onBoardingCompleted: z.union([z.date(), z.null()]),
      })
    )
    .mutation(async ({ ctx, input }) => {
        const userLog = await ctx.prisma.userLog.create({
        data: {
            userId: input.userId,
            date: input.date,
            registrationDate: input.registrationDate,
            lastLogin: input.lastLogin,
            lastProjectCreated: input.lastProjectCreated,
            lastTaskEdited: input.lastTaskEdited,
            lastLikedEntry: input.lastLikedEntry,
            lastRiple: input.lastRiple,
            onBoardingCompleted: input.onBoardingCompleted,
        },
        });

        return userLog;
    }),
    
  deleteUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      // Step 1: Find tasks created by the user
      const createdTasks = await ctx.prisma.tasks.findMany({
        where: {
          createdById: input.userId,
        },
      });

      // Step 2: Find tasks owned by the user
      const ownedTasks = await ctx.prisma.tasks.findMany({
        where: {
          ownerId: input.userId,
        },
      });

      // Step 3: Update tasks created by the user
      const updateCreatedPromises = createdTasks.map((task) => {
        return ctx.prisma.tasks.update({
          where: { id: task.id },
          data: {
            createdById: '',
          },
        });
      });

      // Step 4: Update tasks owned by the user
      const updateOwnedPromises = ownedTasks.map((task) => {
        return ctx.prisma.tasks.update({
          where: { id: task.id },
          data: {
            ownerId: '',
          },
        });
      });

      // Execute all updates
      await Promise.all([...updateCreatedPromises, ...updateOwnedPromises]);

      // Step 5: Delete the user
      let deletedUser;
      try {
        deletedUser = await ctx.prisma.user.delete({
          where: { id: input.userId },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting the user',
        });
      }

      return {
        user: deletedUser,
      };
  }),
});
