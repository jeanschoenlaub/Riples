import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { StarSVG, GoalSVG } from '~/components/svg-stroke';
import type { RouterOutputs } from '~/utils/api';
import { useProjectGoalMutation } from './goalsapi';
import { LoadingSpinner } from '~/components/loading';
import { GoalModal } from './goalmodal';
import { GoalFinishedModal } from './goalfinishedmodal';
import dayjs from 'dayjs';

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
    const [goalFinished, setGoalFinished] = useState<Goal| undefined>(undefined);
    const [showGoalFinishedModal, setShowGoalFinishedModal] = useState(false);

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

    const GoalFinished = (index: number) => {
        setGoalFinished(goals[index]);
        setShowGoalFinishedModal(true);
    };
        
    return (
        <div>
            <div id="project-about-goals" className="mb-4">
                <div className='text-lg mt-2 ml-2 font-semibold'>Project Goals </div>
                    <ol className="relative border-l ml-4 border-gray-200 dark:border-gray-700 mt-4">
                        {goals.map((goal, index) => (
                            <li key={index} className="mb-6 ml-4">
                                <div className={`absolute mt-0.5 -left-3`}>{goal.status != "finished" ? <GoalSVG colorStrokeHex='#d1d5db'/>:<GoalSVG colorStrokeHex='#4ade80'/>}</div>

                                <div className="flex items-center mb-1">
                                    {/* Goal Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>

                                    {/* Goal Completion and Deadline */}
                                    <span className="ml-2 italic text-sm text-gray-600">
                                        {goal.status === "finished" ? (
                                            <>- Goal completed on {dayjs(goal.editedAt).format('DD/MM/YYYY')}</>
                                        ) : (
                                            <>- Goal deadline on {dayjs(goal.editedAt).format('DD/MM/YYYY')}</>
                                        )}
                                    </span>
                                </div>
                                
                                {/* Goal Notes */}
                                <p className="mb-2 mt-2 text-base text-gray-600">{goal.notes}</p>

                                <div className="flex items-center mb-2">
                                    <div className="border rounded px-2 py-1 mr-1 w-auto">{goal.progress}</div>
                                    <span>/</span>
                                    <div className="px-2 py-1 ml-1 w-auto">{goal.progressFinalValue}</div>
                                    {isProjectLead && (
                                        <div className="flex ml-2 space-x-2">
                                            <button 
                                                onClick={() => startEditing(index)}
                                                className="bg-blue-500 text-white text-base rounded px-2 py-1 justify-center w-auto"
                                            >
                                                Edit
                                            </button>
                                            {goal.status != "finished" && (
                                                <button 
                                                    onClick={() => GoalFinished(index)}
                                                    className="bg-green-500 text-white text-base rounded px-2 py-1 justify-center w-auto"
                                                >
                                                    Done
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>


            </div>
            {(isProjectLead) &&
                <div id="project-collab-goal-create-button" className="mb-2 flex">
                    <div className='mt-2 ml-2 mr-2 md:ml-6 md:mr-6 flex flex-grow space-x-2 items-center'> 
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
                {showGoalFinishedModal && goalFinished && (
                    <GoalFinishedModal 
                        goalFinished={goalFinished}
                        showModal={showGoalFinishedModal}
                        isProjectLead={isProjectLead}
                        isPrivate={projectPrivacy}
                        onClose={() => setShowGoalFinishedModal(false)}
                    />
                )}
        </div>
    );    
}
