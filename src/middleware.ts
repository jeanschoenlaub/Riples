import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/api/trpc/projects.getAll",
        "/api/trpc/projects.getProjectByProjectId",
        "/api/trpc/projects.getAll,projects.getProjectByProjectId", // Include this line
        /^\/projects\//
    ]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
