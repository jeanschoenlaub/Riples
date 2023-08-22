import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/api/trpc/projects.getAll",
        "/api/trpc/riples.getAll",
        "/api/trpc/projects.getProjectByProjectId",
        "/api/trpc/projects.getAll,projects.getProjectByProjectId", 
        "/api/trpc/projects.getAll,riples.getAll",
        /^\/projects\//
    ]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
