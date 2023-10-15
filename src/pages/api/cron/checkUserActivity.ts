import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { appRouter } from '~/server/api/root';

export default async function checkUserActivity(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  const caller = appRouter.createCaller({
    session: null,
    revalidateSSG: null, // adjust this if you have a method to revalidate SSG
    prisma
  });

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const users = await prisma.user.findMany();

    for (const user of users) {

        const userId = user.id;
        const lastLogin = await getLastLogin(userId);

        // Check for project creation within the last day
        const recentProjects = await prisma.project.findMany({
            where: {
                authorID: userId,
                createdAt: {
                    gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
                },
            },
        });

        // Check for task and subtask updates within the last day
        const recentTaskUpdates = await prisma.tasks.findMany({
            where: {
                createdById: userId,
                editedAt: {
                    gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
                },
            },
        });

      // Use the createUserLog route to create the UserLog entry
      const createUserLogInput = {
          userId: userId,
          date: new Date(),
          lastLogin: lastLogin!,
          lastProjectCreated: recentProjects.length > 0 ? recentProjects[0]!.createdAt : null,
          lastTaskEdited: recentTaskUpdates.length > 0 ? recentTaskUpdates[0]!.editedAt : null
      };
      
      const logResult = await caller.users.createUserLog(createUserLogInput);
    }
    res.status(200).json({ message: 'User activity check completed.' });
  } catch (cause) {
    if (cause instanceof TRPCError) {
        const httpStatusCode = getHTTPStatusCodeFromError(cause);
        res.status(httpStatusCode).json({ error: { message: cause.message } });
        return;
    }
    console.error("Error checking user activity:", cause);
    res.status(500).json({ error: 'Internal Server Error' });
} finally {
    await prisma.$disconnect();
}
}

//Returns the latest session expire token (which at time of writing is 30 days after most recent sign-in)
async function getLastLogin(userId: string): Promise<Date | null> {
  const prisma = new PrismaClient();
  const sessions = await prisma.session.findMany({
      where: {
          userId: userId
      },
      orderBy: {
          expires: 'desc'
      },
      select: {
          expires: true
      }
  });

  if (sessions.length > 0) {
      // Subtract 31 days from the expires date to get the login date
      const loginDate = new Date(sessions[0]!.expires.getTime() - (31 * 24 * 60 * 60 * 1000));
      return loginDate;
  } else {
      return null;
  }
}



