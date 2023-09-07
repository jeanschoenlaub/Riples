import { projRouter } from "~/server/api/routers/projects";
import { createTRPCRouter } from "~/server/api/trpc";
import { ripleRouter } from "./routers/riples";
import { projMemberRouter } from "./routers/project-members";
import { taskRouter } from "./routers/tasks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  projects: projRouter,
  riples: ripleRouter,
  projectMembers: projMemberRouter,
  tasks : taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
