
import { createTRPCRouter } from "~/server/api/trpc";
import { projRouter } from "~/server/api/routers/projects";
import { ripleRouter } from "~/server/api/routers/riples";
import { projMemberRouter } from "~/server/api/routers/project-members";
import { taskRouter } from "~/server/api/routers/tasks";
import { userRouter } from "./routers/user";
import { authRouter } from "./routers/auth";

/**
 * 




 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 * 
  
 */
export const appRouter = createTRPCRouter({
  projects: projRouter,
  riples: ripleRouter,
  projectMembers: projMemberRouter,
  tasks : taskRouter,
  users : userRouter,
  auth : authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
