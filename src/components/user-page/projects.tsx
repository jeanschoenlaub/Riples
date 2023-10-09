import React from 'react';
import dayjs from 'dayjs';

type UserStatsProps = {
    user: {
        id: string;
        createdAt: Date;
    };
};

export const UserStats: React.FC<UserStatsProps> = ({ user}) => {
    return (
        <div>
            <div className="flex items-center space-x-4 ml-2">
                <div className='text-lg mt-2 font-semibold'>User Stats</div>
                {/* Add more buttons or UI elements here, similar to UserAbout if needed */}
            </div>

            {/* Member Since */}
            <div className="flex items-center ml-2 mt-3 mb-3 space-x-2">
                <label className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-24">
                    Member since:
                </label>
                <div className="flex-grow w-full p-2 rounded border bg-gray-100">
                    {dayjs(user.createdAt).format('DD/MM/YYYY')}
                </div>
            </div>

            {/* Add more fields similar to UserAbout if needed */}
        </div>
    );
};
