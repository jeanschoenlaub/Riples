import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { appRouter } from '~/server/api/root';

const prisma = new PrismaClient();

export default async function checkUserActivity(req: NextApiRequest, res: NextApiResponse) {

  const caller = appRouter.createCaller({
    session: null,
    revalidateSSG: null, // adjust this if you have a method to revalidate SSG
    prisma
  });

  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const users = await prisma.user.findMany();

    for (const user of users) {

        const userId = user.id;
        const lastLogin = await getLastLogin(userId);

        if (!user.isBot) { // we don't log i

            // Get user's registrationDate from emailVerified field to split into cohorts
            const registrationDate = user.emailVerified;
            
            // Fetch onBoardingCompleted date
            const userOnboarding = await prisma.userOnboarding.findFirst({
                where: {
                    userId: userId,
                    onBoardingFinished: true,
                },
                select: {
                    updatedAt: true
                }
            });
            const onBoardingCompletedDate = userOnboarding?.updatedAt ?? null;

            // Check for project creation within the last day
            const [recentProject, recentTaskUpdate, recentLikedEntry, recentRipleShared] = await Promise.all([
                prisma.project.findFirst({
                    where: { authorID: userId},
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.tasks.findFirst({
                    where: { createdById: userId },
                    orderBy: { editedAt: 'desc' }
                }),
                prisma.like.findFirst({
                    where: { userId: userId },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.riple.findFirst({
                    where: { authorID: userId },
                    orderBy: { createdAt: 'desc' }
                })
            ]);

        
            // Create UserLog entry
            const createUserLogInput = {
                userId,
                date: new Date(),
                registrationDate: registrationDate,
                lastLogin: lastLogin ?? new Date(),
                lastProjectCreated: recentProject?.createdAt ?? null,
                lastTaskEdited: recentTaskUpdate?.editedAt ?? null,
                lastLikedEntry: recentLikedEntry?.createdAt ?? null,
                lastRiple: recentRipleShared?.createdAt ?? null,
                onBoardingCompleted: onBoardingCompletedDate,
            };
            await caller.users.createUserLog(createUserLogInput);
        }
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
      // TO-DO understand better the logic of last login and next-auth's sessions 
      // Subtract 31 days from the expires date to get the login date
      const loginDate = new Date(sessions[0]!.expires.getTime() - (31 * 24 * 60 * 60 * 1000));
      return loginDate;
  } else {
      return new Date('1970-01-01T00:00:00Z'); // don't really understand where sessionn is empty or what to do about it 
  }
}


