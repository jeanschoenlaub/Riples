
import { createTRPCRouter } from "~/server/api/trpc";
import { projRouter } from "~/server/api/routers/projects";
import { ripleRouter } from "~/server/api/routers/riples";
import { projMemberRouter } from "~/server/api/routers/project-members";
import { projFollowerRouter } from "~/server/api/routers/project-follower";
import { taskRouter } from "~/server/api/routers/tasks";
import { userRouter } from "./routers/user";
import { openAiRouter } from "./routers/openai"
import { goalRouter } from "./routers/goals";import { userOnboardingRouter } from "./routers/useronboarding";
import { notificationRouter } from "./routers/notification";
import { likeRouter } from "./routers/like";


/**
 * 




 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 * 
  
 */
export const appRouter = createTRPCRouter({
  openai: openAiRouter,
  projects: projRouter,
  riples: ripleRouter,
  projectMembers: projMemberRouter,
  projectFollowers: projFollowerRouter,
  tasks : taskRouter,
  users : userRouter,
  userOnboarding: userOnboardingRouter,
  goals: goalRouter,
  notification: notificationRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
