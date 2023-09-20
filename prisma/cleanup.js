const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanUpOrphanedRecords() {
  // Fetch projectFollowers and projectMembers in parallel
  const [projectFollowers, projectMembers] = await Promise.all([
    prisma.projectFollowers.findMany({
      select: {
        userId: true,
      },
    }),
    prisma.projectMembers.findMany({
      select: {
        id: true,
        userID: true,
      },
    }),
  ]);

  // Prepare the operations for projectFollowers cleanup
  const projectFollowerOps = projectFollowers.map(async (follower) => {
    const user = await prisma.user.findUnique({
      where: { id: follower.userId },
    });

    if (!user) {
      return prisma.projectFollowers.delete({
        where: { userId: follower.userId },
      });
    }
    return null; // Return null if no operation is to be performed
  });

  // Prepare the operations for projectMembers cleanup
  const projectMemberOps = projectMembers.map(async (member) => {
    const user = await prisma.user.findUnique({
      where: { id: member.userID },
    });

    if (!user) {
      return prisma.projectMembers.delete({
        where: { id: member.id },
      });
    }
    return null; // Return null if no operation is to be performed
  });

  // Combine all operations into a single array
  const allOps = [...projectFollowerOps, ...projectMemberOps];

  // Run all operations in a single transaction
  await prisma.$transaction(await Promise.all(allOps));

  // Finally, disconnect the Prisma client
  await prisma.$disconnect();
}

cleanUpOrphanedRecords()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
