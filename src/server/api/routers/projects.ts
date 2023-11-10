import { z } from "zod";
import { createTRPCRouter,publicProcedure, protectedProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

//For images upload
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { env } from "~/env.mjs";

const UPLOAD_MAX_FILE_SIZE = 1000000;

const s3Client = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: env.S3_PUBLIC_IMAGES_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: env.S3_PUBLIC_IMAGES_BUCKET_ACCESS_KEY_SECRET,
  },
});

// Create a new ratelimiter, that allows 2 requests per 1 minute
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  analytics: true,
})

export const projRouter = createTRPCRouter({
  getAll: publicProcedure.query( async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      take:100,
      orderBy: [{
        createdAt: "desc",
     }],
     where: {
      projectPrivacy:"public"
     },
     include: { 
      members: {
        include: {
          user: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      },
    },
    });

    const users = await ctx.prisma.user.findMany({
      where: {
        id: {
          in: projects.map((project) => project.authorID),
        },
      },
    });

    // Map over projects to add author information
    return projects.map((project) => {
      const author = users.find((user) => user.id === project.authorID);

      if (!author) {
        throw new Error('Project author not found.');
      }

      return {
        project,
        author,
      };
    });
  }),

  getAllWithRiples: publicProcedure.query( async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
      include: {
        riples: true, // Include riples
      },
    });

    const users = await ctx.prisma.user.findMany({
      where: {
        id: {
          in: projects.map((project) => project.authorID),
        },
      },
    });

    // Map over projects to add author information
    return projects.map((project) => {
      const author = users.find((user) => user.id === project.authorID);

      if (!author) {
        throw new Error('Project author not found.');
      }

      return {
        project,
        author,
      };
    });
  }),

  getProjectByProjectId: publicProcedure
  .input(z.object({ projectId: z.string() }))
  .query(async ({ ctx, input }) => {
    const projectFromDb = await ctx.prisma.project.findUnique({
      where: { id: input.projectId },
      include: { 
        goals: true,
        members: {
          include: {
            user: true
          }
        },
        tasks: {
          include: {
            subTasks: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
      },
    });

    if (!projectFromDb) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
    }

    // Flatten the tags structure to match frontend's expectation
    const projectTags = projectFromDb.tags.map(rel => rel.tag);
    const project = {
      ...projectFromDb,
      projectTags: projectTags,
      tags: undefined
    };

    const author = await ctx.prisma.user.findUnique({
      where: { id: project.authorID },
    });

    if (!author) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Project author not found" });
    }

    return {
      project,
      author,
    };
  }),

  getProjectByAuthorId: publicProcedure
  .input(z.object({ authorId: z.string() }))
  .query(async ({ ctx, input }) => {
    const projects = await ctx.prisma.project.findMany({
      where: { authorID: input.authorId },
      include: { 
        goals: true,
        members: {
          include: {
            user: true
          }
        },
        tasks: {
          include: {
            subTasks: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
      },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    const author = await ctx.prisma.user.findUnique({
      where: { id: input.authorId },
    });

    if (!author) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });
    }

    return projects.map((project) => ({
      project,
      author,
    }));
  }),

  getProjectByAuthorIdForSideBar: publicProcedure
  .input(z.object({ authorId: z.string() }))
  .query(async ({ ctx, input }) => {
    const projects = await ctx.prisma.project.findMany({
      where: { authorID: input.authorId },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    const author = await ctx.prisma.user.findUnique({
      where: { id: input.authorId },
    });

    if (!author) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });
    }

    return projects.map((project) => ({
      project,
      author,
    }));
  }),

  getFullProjectByAuthorId: publicProcedure
  .input(z.object({ authorId: z.string() }))
  .query(async ({ ctx, input }) => {
    const projects = await ctx.prisma.project.findMany({
      where: { authorID: input.authorId },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
      include: {
        tasks: {
          include: {
            subTasks: true
          }
        },
        goals: true,
      }
    });

    const author = await ctx.prisma.user.findUnique({
      where: { id: input.authorId },
    });

    if (!author) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });
    }

    return projects.map((project) => ({
      project,
      author,
    }));
  }),

  getProjectByMemberId: publicProcedure
  .input(z.object({ memberId: z.string() }))
  .query(async ({ ctx, input }) => {
    // Fetching all projects where the member with the provided memberId is a part of
    const projects = await ctx.prisma.project.findMany({
      where: {
        members: {
          some: {
            userID: input.memberId
          }
        }
      },
      include: { 
        goals: true,
        members: {
          include: {
            user: true
          }
        },
        tasks: {
          include: {
            subTasks: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
      },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    // Since projects already have an authorID, and assuming each project has one author,
    // We'll fetch author data for each project and map them together
    return Promise.all(projects.map(async (project) => {
      const author = await ctx.prisma.user.findUnique({
        where: { id: project.authorID },
      });

      if (!author) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Project author not found" });
      }

      return {
        project,
        author,
      };
    }));
  }),


  create: protectedProcedure
  .input(z.object({
    title: z.string()
      .min(5, { message: "Project title must be 5 or more characters long" })
      .max(255, { message: "Project title must be 255 or less characters long" }),
    summary: z.string()
      .max(5000, { message: "Project Description must be 5000 or less characters long" }),
    isSolo: z.boolean(),
    isPrivate: z.boolean(),
    tasks: z.array(z.string()),   
    goals: z.array(z.string()),  
    tags: z.array(z.string()),  
    postToFeed: z.boolean(),
    postContent: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const authorID = ctx.session.user.id;

    const { success } = await ratelimit.limit(authorID);
    if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

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

    // Now create the project with tasks and tags
    const project = await ctx.prisma.project.create({
      data: {
        authorID,
        title: input.title,
        summary: input.summary,
        projectType: input.isSolo ? "solo" : "collab", 
        projectPrivacy: input.isPrivate ? "private" : "public",
        tasks: {
          create: input.tasks.map(taskTitle => ({
            title: taskTitle,
            content: '',
            createdById: authorID,
          }))
        },
        goals: {
          create: input.goals.map(goalTitle => ({
            title: goalTitle,
            createdById: authorID,
          }))
        },

        tags: {
          create: allTagIds.map(tagId => ({
            tagId
          }))
        }
      },
    });

    // Check if postToFeed is true, and if so, create a ripple
    if (input.postToFeed) {
      await ctx.prisma.riple.create({
        data: {
          title: "New Project !",   // or any suitable title for the ripple
          ripleType: "creation",
          content: input.postContent, // or any suitable content
          projectId: project.id,
          authorID: authorID,
        }
      });
    }

    return project;
  }),

editInfo: protectedProcedure
.input(z.object({
  projectId: z.string(),
  title: z.string()
    .min(5, { message: "Project title must be 5 or more characters long" })
    .max(255, { message: "Project title must be 255 or less characters long" }),
  summary: z.string()
    .max(5000, { message: "Project Description must be 5000 or less characters long" }),
  status: z.string(),
  tags: z.array(z.string()),  // Add tags to the input
}))
.mutation(async ({ ctx, input }) => {
  const authorID = ctx.session.user.id;
  const projectId = input.projectId;

  const { success } = await ratelimit.limit(authorID);
  if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

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
      return ctx.prisma.projectTags.upsert({
        where: {
          tagId_projectId: { tagId, projectId: input.projectId }
        },
        update: {}, // No updates required, just ensure it exists
        create: {
          tagId,
          projectId: input.projectId
        }
      });
    })
  );

  // Now update the project with tasks and tags
  const updatedProject = await ctx.prisma.project.update({
    where: { id: projectId },
    data: {
      title: input.title,
      summary: input.summary,
      status: input.status,
    },
  });
  return updatedProject;
}),

editAdmin: protectedProcedure
.input(z.object({
  projectId: z.string(),
  projectPrivacy: z.string(),
  projectType: z.string(),
}))
.mutation(async ({ ctx, input }) => {
  const authorID = ctx.session.user.id;
  const projectId = input.projectId;

  const { success } = await ratelimit.limit(authorID);
  if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

  // ... (tag logic remains the same)

  // Now update the project with tasks and tags
  const updatedProject = await ctx.prisma.project.update({
    where: { id: projectId },
    data: {
      projectPrivacy: input.projectPrivacy,
      projectType: input.projectType,
    },
  });
  return updatedProject;
  }),
  
  delete: protectedProcedure
  .input(z.object({
    projectId: z.string()
  }))
  .mutation(async ({ ctx, input }) => {
    const authorID = ctx.session.user.id;

    // Check if the user is the owner of the project
    const project = await ctx.prisma.project.findFirst({
      where: {
        id: input.projectId,
        authorID
      }
    });

    if (!project) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found or you do not have permission to delete it." });
    }

    // Delete the project. Due to cascading, related entities will be deleted too.
    await ctx.prisma.project.delete({
      where: { id: input.projectId }
    });

    return { message: "Project successfully deleted." };
  }),

  createPresignedUrl: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session.user.id;
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "the project does not exist",
        });
      }

      const imageId = uuidv4();
      await ctx.prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          coverImageId: imageId,
        },
      });

      return createPresignedPost(s3Client, {
        Bucket: env.NEXT_PUBLIC_S3_PUBLIC_IMAGES_BUCKET,
        Key: `project-cover-images/${imageId}`,
        Fields: {
          key: `project-cover-images/${imageId}`,
        },
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
      });
    }),
});
