import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const notificationRouter = createTRPCRouter({
    // Get all user notifications
    getUserNotifications: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input  }) => {

            const notifications = await ctx.prisma.notification.findMany({
                where: {
                    userId: input.userId,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return notifications;
        }),

    // Create a new notification
    createNotification: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                content: z.string().max(255, { message: "Notification content must be 255 or less characters long" }),
                link: z.string().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.user?.id) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
            }

            const notification = await ctx.prisma.notification.create({
                data: {
                    userId: input.userId,
                    content: input.content,
                    link: input.link || null
                }
            });

            return notification;
    }),

    readAllNotification: protectedProcedure
    .input(z.object({
        userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {

        const readAllNotifications = await ctx.prisma.notification.updateMany({
            where: {
                userId: input.userId
            },
            data: {
                read: true
            }
        });
        
        return readAllNotifications;
    }),
});
