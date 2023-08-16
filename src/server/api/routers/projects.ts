import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const projRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),
});
