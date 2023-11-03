import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

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

export const ripleRouter = createTRPCRouter({
    // To do fixlimited to 20 most recent riples
    getAll: publicProcedure.input(z.object({ 
        limit: z.number().default(10), 
        offset: z.number().default(0) 
    })).query(async ({ ctx, input }) => {
        const { limit, offset } = input;
        const riples = await ctx.prisma.riple.findMany({
            take: limit,
            skip: offset,
            orderBy: [{ createdAt: "desc" }],
            include: { project: true, images: true },
        });
      
        const authorIDs = riples
            .map((riple) => riple.authorID)
            .filter((id): id is string => Boolean(id));
        const authors = await ctx.prisma.user.findMany({
            where: {
                id: { in: authorIDs },
            },
        });
      
        return riples.map((riple) => {
          const author = authors.find((user) => user.id === riple.authorID);
          if (!author) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });
          return {
            riple,
            author,
            project: riple.project,
            images: riple.images,
          };
        });
      }),

      delete: protectedProcedure
      .input(z.object({ripleId: z.string()}))
      .mutation(async ({ ctx, input }) => {
          // Find the riple by its unique ID to ensure it exists
          const riple = await ctx.prisma.riple.findUnique({
              where: {
                  id: input.ripleId
              }
          });
  
          // If the riple does not exist, throw an error
          if (!riple) {
              throw new TRPCError({code: "NOT_FOUND", message: "Riple not found"});
          }
  
          // If the riple exists, delete it
          await ctx.prisma.riple.delete({
              where: {
                  id: input.ripleId
              }
          });
  
          return { message: "Riple successfully deleted" };
      }),
  

    getRipleByRipleId: publicProcedure
    .input(z.object({ripleId: z.string()}))
    .query( async ({ ctx, input }) => {
        // Find the riple by its unique ID
        const riple = await ctx.prisma.riple.findUnique({
        where: {
            id: input.ripleId
        }
        });

        if (!riple) {
        throw new TRPCError({code: "NOT_FOUND", message: "riple not found"});
        }

        return { riple };
    }),
    

    create: protectedProcedure
    .input(
        z.object({
        title: z.string().min(5, { message: "Riple title must be 5 or more characters long" }).max(255, { message: "Riple title must be 255 or less characters long" }),
        content: z.string().min(5, { message: "Riple content must be 5 or more characters long" }).max(10000, { message: "Riple content must be 10000 or less characters long" }),
        projectId: z.string(),
        ripleImages: z.array(
          z.object({
              id: z.string(),
              caption: z.string().optional(),
          })
      ).optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const authorID = ctx.session.user.id;

        const { success } = await ratelimit.limit(authorID);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

        const riple = await ctx.prisma.riple.create({
        data: {
            authorID,
            title: input.title,
            content: input.content,
            projectId: input.projectId,
        },
        });

        // If ripleImages were provided, associate them with the new riple
        if (input.ripleImages && input.ripleImages.length > 0) {
          for (const imageInput of input.ripleImages) {
              await ctx.prisma.ripleImage.update({
                  where: {
                      ImageId: imageInput.id,
                  },
                  data: {
                      ripleId: riple.id,
                      caption: imageInput.caption,
                  },
              });
          }
      }
        return riple;
    }),
        
    getRipleByProjectId: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
        const riples = await ctx.prisma.riple.findMany({
          where: { projectId: input.projectId },
          include: { project: true, images: true },
          orderBy: [{ createdAt: "desc" }],
        });

        const authorIDs = riples
            .map((riple) => riple.authorID)
            .filter((id): id is string => Boolean(id));
        const authors = await ctx.prisma.user.findMany({
            where: {
                id: { in: authorIDs },
            },
        });

        return riples.map((riple) => {
        const author = authors.find((user) => user.id === riple.authorID);
        if (!author) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });
        return {
            riple,
            author,
            project: riple.project,
            images: riple.images,
        };
        });
    }),
    getRiplesByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
        const riples = await ctx.prisma.riple.findMany({
            where: { authorID: input.userId },
            include: { project: true },
            orderBy: [{ createdAt: "desc" }],
        });

        const author = await ctx.prisma.user.findUnique({
            where: { id: input.userId },
        });

        if (!author) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Riple author not found" });

        return riples.map((riple) => {
            return {
                riple,
                author,
                project: riple.project,
            };
        });
    }),

    createRipleImagePresignedUrl: protectedProcedure
    .mutation(async ({ ctx, input }) => {

      const imageId = uuidv4();

      // Check if an image with the generated ID already exists
      const existingRipleImage = await ctx.prisma.ripleImage.findUnique({
          where: {
              ImageId: imageId,
          },
      });

      if (existingRipleImage) {
          throw new Error("An image with this ID already exists. Please retry");
      }

      // Save the imageId in the RipleImage table
      await ctx.prisma.ripleImage.create({
        data: {
          ImageId: imageId,
        },
      });

      return createPresignedPost(s3Client, {
        Bucket: env.NEXT_PUBLIC_S3_PUBLIC_IMAGES_BUCKET,
        Key: `riple-images/${imageId}`,
        Fields: {
          key: `riple-images/${imageId}`,
        },
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
      });
    }),

});
