
import { prisma } from "~/server/db";
import { createTRPCRouter,publicProcedure } from "../trpc";
import { z } from "zod";

export const adminStatsRouter = createTRPCRouter({
  // Procedure to get user statistics
  getUserStats: publicProcedure
    .input(z.object({
      selectedDate: z.string(), 
    }))
    .query(async ({ ctx, input }) => {
        const inputDate = new Date(input.selectedDate);
        inputDate.setHours(0, 0, 0, 0);
  
        const statsFor30Days = [];
  
        for (let day = 0; day < 30; day++) {
          const targetDate = new Date(inputDate);
          targetDate.setDate(targetDate.getDate() - day);
          const nextDay = new Date(targetDate);
          nextDay.setDate(targetDate.getDate() + 1);
  
          // Fetch the logs for the last day, week, and month
          const oneDayAgo = new Date(targetDate.getTime() - 864e5);
          const oneWeekAgo = new Date(targetDate.getTime() - 7 * 864e5);
          const oneMonthAgo = new Date(targetDate.getTime() - 30 * 864e5);
  
          const logsForPeriod = await prisma.userLog.findMany({
            where: {
              date: {
                gte: targetDate,
                lt: nextDay,
              },
            },
          });
  
          // Filter the logs for specific statistics
          const totalUsers = logsForPeriod.length;
          const activeLastDay = logsForPeriod.filter(log => log.lastLogin && log.lastLogin >= oneDayAgo).length;
          const activeLastWeek = logsForPeriod.filter(log => log.lastLogin && log.lastLogin >= oneWeekAgo).length;
          const activeLastMonth = logsForPeriod.filter(log => log.lastLogin && log.lastLogin >= oneMonthAgo).length;
          const projectCreatedLastWeek = logsForPeriod.filter(log => log.lastProjectCreated && log.lastProjectCreated >= oneWeekAgo).length;
          const taskEditedLastWeek = logsForPeriod.filter(log => log.lastTaskEdited && log.lastTaskEdited >= oneWeekAgo).length;
          const ripleLastWeek = logsForPeriod.filter(log => log.lastRiple && log.lastRiple >= oneWeekAgo).length;
  ;
  
          // Calculate percentage (utility function)
          const calcPercent = (partialValue: number, totalValue: number) => {
            return totalValue > 0 ? ((partialValue / totalValue) * 100).toFixed(2) : '0.00';
          };
  
          statsFor30Days.push({
            date: targetDate.toISOString().split('T')[0],
            totalNumberOfRegisteredUsers: totalUsers,
            percentActiveLastDay: calcPercent(activeLastDay, totalUsers),
            percentActiveLastWeek: calcPercent(activeLastWeek, totalUsers),
            percentActiveLastMonth: calcPercent(activeLastMonth, totalUsers),
            percentCreatedProjectLastWeek: calcPercent(projectCreatedLastWeek, totalUsers),
            percentTaskEditedLastWeek: calcPercent(taskEditedLastWeek, totalUsers),
            percentRipleLastWeek: calcPercent(ripleLastWeek, totalUsers),
          });
        }
        return statsFor30Days
    }),
});
