import React, { useState } from 'react';
import dayjs from 'dayjs';
import Tooltip from '../reusables/tooltip';
import { ClipboardSVG } from '../reusables/svgstroke';

type UserStatsProps = {
    user: {
        id: string;
        createdAt: Date;
    };
};

export const UserStats: React.FC<UserStatsProps> = ({ user}) => {
    const [onboardingComplete, setOnboardingComplete] = useState(false); 
    return (
        <div>
            <div className="flex items-center space-x-4 ml-2">
                <div className='text-lg mt-2 font-semibold'>User Stats</div>
                {/* Add more buttons or UI elements here, similar to UserAbout if needed */}
            </div>

            {/* Member Since */}
            <div className="flex items-center ml-2 mt-3 mb-3 space-x-2">
                <label className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32">
                    Member since:
                </label>
                <div className="flex-grow w-full p-2">
                    {dayjs(user.createdAt).format('DD/MM/YYYY')}
                </div>
            </div>

            {/* Achievements Section */}
            <div className="flex items-center ml-2 mt-3 mb-3 space-x-2">
                <label className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32">
                    Achievements:
                </label>
                <div className=" p-2">
                    {/* Onboarding Complete Achievement */}
                    <Tooltip content={onboardingComplete ? "Onboarding Complete!" : "Complete onboarding to unlock this achievement!"}>
                        <div 
                            className={`flex-shrink-0 w-5 rounded`}
                            style={{ cursor: 'pointer' }}
                        >
                            <ClipboardSVG width='5' height='5' colorStrokeHex={onboardingComplete ? '#2563eb' : '#9CA3AF'} />
                        </div>
                    </Tooltip>
                </div>
            </div>


            {/* Add more fields similar to UserAbout if needed */}
        </div>
    );
};
