import type { RouterOutputs } from '~/utils/api';
import { RipleCard } from '~/features/cards/riple-card';
import { useState } from 'react';
import { CreateRipleModal } from '../../create-riple/createriple';
import { useWizard } from "~/features/wizard";
import toast from 'react-hot-toast';

type RipleData = RouterOutputs["riples"]["getRipleByProjectId"]
interface RipleTabProps {
    ripleData: RipleData;
    projectId: string;
    projectTitle: string,
    projectSummary: string,
    projectCoverImageId: string,
    isProjectLead: boolean,
    isMember: boolean,
}

export const RiplesTab: React.FC<RipleTabProps> = ({ ripleData, isProjectLead, isMember, projectId, projectTitle, projectSummary, projectCoverImageId  }) => {


    const [showCreateRipleModal, setShowCreateRipleModal] = useState(false);
    const wizardContext = useWizard()

    // Function to open the creation modal
    const openCreateRipleModal = () => {
        if (isProjectLead){
            setShowCreateRipleModal(true);
        }
        else{
            toast.error("Posting only allowed for project Lead")
        }
    };

    // Function to close the creation modal
    const closeCreateRipleModal = () => {
        setShowCreateRipleModal(false);
        if (wizardContext.wizardName == "projectriples"){
            wizardContext.setShowWizard(false); //Only force close wizard if we actually opened the createproject modal
        }
        if (isProjectLead){
            wizardContext.setWizardName("projectabout")
        }
    };


    return (
        <div className=" space-y-4 border-r-2 border-l-2 border-b-2 border-gray-200 text-gray-800">
            
            {/* Post Content Bar */}
            <div className="p-3 mt-4 ml-2 mr-2 bg-gray-200 rounded-lg shadow-md mb-5">
                <div className="flex justify-between items-center">
                    {/* Post Content Input */}
                        <div className="flex flex-grow items-center"
                        onClick={openCreateRipleModal}>
                            <input 
                                type="text" 
                                placeholder="What's on your mind?" 
                                className="p-2 flex-grow bg-white w-full rounded border border-gray-300 shadow-sm mr-2" 
                                disabled={true}
                            />
                        </div>
                    
                    {/* Post Button */}
                        <button className="p-2 bg-gray-500 text-white rounded" onClick={openCreateRipleModal}>
                            Post
                        </button>
                </div>
            </div>
            {/* Display ripples */}
            {ripleData && ripleData.length > 0 ? (
                <div className='space-y-2'>
                    {ripleData.map((fullRiple) => (
                        <RipleCard 
                        key={fullRiple.riple.id} 
                        {...fullRiple}
                    />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-full text-center">
                    Your Riples (project updates) will be displayed here once you start posting for this project.
                </div>
            )}
            {/* Create Riple Modal usage */}
            <CreateRipleModal 
                showModal={showCreateRipleModal}
                projectId={projectId}
                projectTitle={projectTitle}
                projectSummary={projectSummary}
                projectCoverImageId={projectCoverImageId}
                onClose={closeCreateRipleModal}
            />
        </div>
        
    )
}

