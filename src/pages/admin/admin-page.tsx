import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';

type UserStats = {
  totalNumberOfRegisteredUsers: number;
  percentActiveLastDay: number;
  percentActiveLastWeek: number;
  percentActiveLastMonth: number;
  percentCreatedProjectLastWeek: number;
  percentTaskEditedLastWeek: number;
  percentRipleLastWeek: number;
  date: string | undefined;
};

const AdminPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0] ?? ""; 

  const [userStats, setUserStats] = useState<UserStats[]>([]);

  // Call the API with the hardcoded date as a parameter
  const { data, isLoading, isError } = api.adminStats.getUserStats.useQuery({
    selectedDate: today, // Pass the string directly, not as a Date object
  });



  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Map each item in the data array to the UserStats type
      const statsArray = data.map(dayData => ({
        totalNumberOfRegisteredUsers: dayData.totalNumberOfRegisteredUsers,
        percentActiveLastDay: parseFloat(dayData.percentActiveLastDay),
        percentActiveLastWeek: parseFloat(dayData.percentActiveLastWeek),
        percentActiveLastMonth: parseFloat(dayData.percentActiveLastMonth),
        percentCreatedProjectLastWeek: parseFloat(dayData.percentCreatedProjectLastWeek),
        percentTaskEditedLastWeek: parseFloat(dayData.percentTaskEditedLastWeek),
        percentRipleLastWeek: parseFloat(dayData.percentRipleLastWeek),
        date: dayData.date,
      }));
  
      setUserStats(statsArray);
    }
  }, [data]);
  

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching user statistics</div>;

  // ...

return (
  <div className="relative overflow-x-auto ml-2 mb-2 mr-2 shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">Date</th>
          <th scope="col" className="px-6 py-3">Registered Users</th>
          <th scope="col" className="px-6 py-3">DAU</th>
          <th scope="col" className="px-6 py-3">WAU</th>
          <th scope="col" className="px-6 py-3">MAU</th>
          <th scope="col" className="px-6 py-3">Project Created Last Week</th>
          <th scope="col" className="px-6 py-3">Task Edited Last Week</th>
          <th scope="col" className="px-6 py-3">Riple Last Week</th>
        </tr>
      </thead>
      <tbody>
        {/* Assume userStats is now an array of DayStats including the 'date' property */}
        {userStats.map((dayStats, index) => (
          <tr key={index} className="bg-white border-b">
            <td className="px-6 py-4">{dayStats.date}</td>
            <td className="px-6 py-4">{dayStats.totalNumberOfRegisteredUsers}</td>
            <td className="px-6 py-4">{`${dayStats.percentActiveLastDay.toFixed(2)}%`}</td>
            <td className="px-6 py-4">{`${dayStats.percentActiveLastWeek.toFixed(2)}%`}</td>
            <td className="px-6 py-4">{`${dayStats.percentActiveLastMonth.toFixed(2)}%`}</td>
            <td className="px-6 py-4">{`${dayStats.percentCreatedProjectLastWeek.toFixed(2)}%`}</td>
            <td className="px-6 py-4">{`${dayStats.percentTaskEditedLastWeek.toFixed(2)}%`}</td>
            <td className="px-6 py-4">{`${dayStats.percentRipleLastWeek.toFixed(2)}%`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
        }

  
export default AdminPage;
