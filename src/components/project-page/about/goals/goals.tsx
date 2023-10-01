import React from 'react';
import { GoalSVG } from '~/components/reusables/svg';
import { RouterOutputs } from '~/utils/api';

type Goal = RouterOutputs["projects"]["getProjectByProjectId"]["project"]["goals"][0]

type ProjectAboutGoalProps = {
    goals: Goal[];
    projectPrivacy: string;
    isProjectLead: boolean;
    isMember: boolean;
    isEditMode?: boolean;
};

export const ProjectAboutGoal: React.FC<ProjectAboutGoalProps> = ({
    goals,
    projectPrivacy,
    isProjectLead,
    isMember,
    isEditMode = false, // default value if not provided
}) => {
    if (projectPrivacy !== "public" && !isProjectLead && !isMember) {
        return null; // or render some placeholder/fallback
    }

    return (
        <div id="project-about-goals" className="mb-4">
            <div className="mt-2">
                {goals.map((goal, index) => (
                    <div key={index} className="block md:flex items-center mb-2">
                        {/* Riple Image */}
                        <div className="flex flex-col items-bottom justify-center mr-4">
                           <GoalSVG />
                        </div>
    
                        <div className="flex flex-col flex-grow mr-2">
                            {/* Label for Goal */}
                            {index === 0 && <label htmlFor={`goalTitle_${index}`} className="mb-1 text-sm text-gray-500">Goal:</label>}
                            <textarea
                                id={`goalTitle_${index}`}
                                value={goal.title}
                                rows={1}
                                className="border rounded grow px-2 py-1 w-full resize-none"
                                disabled={!isEditMode}
                            />
                        </div>
        
                        <div className="flex flex-col ml-2">
                            {/* Label for Progress */}
                            {index === 0 && <label htmlFor={`goalProgress_${index}`} className="mb-1 text-sm text-gray-500">Goals progress:</label>}
                            <div className="flex items-center">
                                <input
                                    id={`goalProgress_${index}_part1`}
                                    type="text"
                                    value={goal.progress}
                                    className="border rounded px-2 py-1 mr-1 w-1/5"
                                />
                                <span>/</span>
                                <input
                                    id={`goalProgress_${index}_part2`}
                                    type="text"
                                    value={goal.progressFinalValue}
                                    className="border rounded px-2 py-1 ml-1 w-1/5"
                                    disabled={!isEditMode}
                                />
                                {(isProjectLead || isMember) && 
                                    <button className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                                        Update
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );    
}
