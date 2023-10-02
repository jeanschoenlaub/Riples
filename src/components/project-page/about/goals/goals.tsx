import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { GoalSVG } from '~/components/reusables/svg';
import { StarSVG } from '~/components/reusables/svgstroke';
import type { RouterOutputs } from '~/utils/api';

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

    const [inputValue, setInputValue] = useState('')
    if (projectPrivacy !== "public" && !isProjectLead && !isMember) {
        return null; // or render some placeholder/fallback
    }
    

    const handleCreateClick = () => {
        toast.success("Added new goal")
    }

    return (
        <div id="project-about-goals" className="mb-4">
            <span className="text-lg ml-2 font-semibold text-black">Project Goals</span>
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
            {(isMember || isProjectLead) &&
                <div id="project-collab-task-create-button" className="mb-2 flex">
                <div className='mt-2 ml-6 mr-6 flex flex-grow space-x-2 items-center'> 
                <input 
                    type="text" 
                    value={inputValue}  // Controlled input
                    onChange={(e) => setInputValue(e.target.value)}  // Update state on change
                    placeholder="Add a new goal" 
                    className="py-2 px-4 rounded grow focus:outline-none focus:border-gray-500 border-2"
                />
                <button 
                    className="bg-green-500 text-white text-xs md:text-base rounded px-4 py-2 hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-blue-200"
                    onClick={() => {handleCreateClick();}}
                >
                    <span className='flex items-center'>
                    Add Goal
                    <StarSVG width='4' height='4' marginLeft='2'></StarSVG>
                    </span>
                </button>s
                </div>
            </div> 
            }
        </div>
    );    
}
