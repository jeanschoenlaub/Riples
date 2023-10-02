import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EditSVG, GoalSVG } from '~/components/reusables/svg';
import { StarSVG } from '~/components/reusables/svgstroke';
import type { RouterOutputs } from '~/utils/api';
import { useProjectGoalMutation } from './goalsapi';
import { LoadingSpinner } from '~/components/reusables/loading';
import { GoalModal } from './goalmodal';

type Goal = RouterOutputs["projects"]["getProjectByProjectId"]["project"]["goals"][0]

type ProjectAboutGoalProps = {
    projectId: string;
    goals: Goal[];
    projectPrivacy: string;
    isProjectLead: boolean;
    isMember: boolean;
    isEditMode?: boolean;
};

type CreateProjectGoalPayload = {
    projectId: string;
    title: string;
    progress: number;
    progressFinalValue: number;
};

// Main React Functional Component

export const ProjectAboutGoal: React.FC<ProjectAboutGoalProps> = ({
    projectId,
    goals,
    projectPrivacy,
    isProjectLead,
    isMember
}) => {
    const [inputValue, setInputValue] = useState('');
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState<Goal| undefined>(undefined);

const startEditing = (index: number) => {
    setGoalToEdit(goals[index]);
    setShowGoalModal(true);
};
    
    const {
        isCreating,
        createProjectGoal,
    } = useProjectGoalMutation();
    
    if (projectPrivacy !== "public" && !isProjectLead && !isMember) {
        return null;
    }

    
    const generateCreatePayload = ():CreateProjectGoalPayload => ({
        projectId: projectId,
        title: inputValue,
        progress: 0,
        progressFinalValue: 100
    });
    const handleCreateClick = () => {
        createProjectGoal(generateCreatePayload()).then(() => {
            toast.success('Added new goal');
            setInputValue('');
        })
        .catch(() => {
            toast.error('Error adding Goal');
            setInputValue('');
        });
    }
        
    return (
        <div>
            <div id="project-about-goals" className="mb-4">
            <div className='text-lg mt-2 ml-2 font-semibold'>Project Goals </div>
                <div className="mt-2">
                    {goals.map((goal, index) => (
                        <div key={index} className="block md:flex items-center mb-2">
                            <div className="flex flex-col items-bottom justify-center ml-2 mr-4">
                            {index === 0 && <label htmlFor={`goalStar_${index}`} className="mb-1 text-sm text-gray-500"><br></br></label>}
                                <GoalSVG />
                            </div>

                            <div className="flex flex-col w-3/5 mr-2">
                                {index === 0 && <label htmlFor={`goalTitle_${index}`} className="mb-1 text-sm text-gray-500">Goal:</label>}
                                <div>{goal.title}</div>
                            </div>
                    
                            <div className="flex flex-col ml-2">
                                {index === 0 && <label htmlFor={`goalProgress_${index}`} className="mb-1 text-sm text-gray-500">Goals progress:</label>}
                                <div className="flex items-center">
                                        <div className="border rounded px-2 py-1 mr-1 w-auto">
                                            {goal.progress}
                                        </div>
                                        <span>/</span>
                                        <div className="px-2 py-1 ml-1 w-auto">
                                            {goal.progressFinalValue}
                                        </div>
                                         {isProjectLead && (
                                            <div>
                                            <button 
                                                onClick={() => startEditing(index)}
                                                className="bg-blue-500 text-white text-base rounded ml-2 px-4 py-1 justify-center w-auto"
                                            >
                                                Edit
                                            </button>
                                            </div>
                                        )}
                                    </div>
                                   
                                </div>
                            </div>
                    ))}
                </div>
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
                        {isCreating && <LoadingSpinner size={20} />} Add Goal
                        <StarSVG width='4' height='4' marginLeft='2'></StarSVG>
                        </span>
                    </button>
                    </div>
                </div> 
                }
                {showGoalModal && goalToEdit && (
                    <GoalModal 
                        goalToEdit={goalToEdit}
                        projectId={projectId}
                        showModal={showGoalModal}
                        isMember={isMember}
                        isProjectLead={isProjectLead}
                        onClose={() => setShowGoalModal(false)}
                    />
        )}
        </div>
    );    
}
