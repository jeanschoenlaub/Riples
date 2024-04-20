import React, { useState } from 'react';
import type { RouterOutputs } from '~/utils/api';
import { LinksCardPortofolio } from '../cards/links-portofolio-card';
import { EditSVG } from '~/components/svg';

type UserLinksProps = {
    projectData?: RouterOutputs["projects"]["getProjectByAuthorId"];
    isUserOwner: boolean;
}

export const UserLinks: React.FC<UserLinksProps> = ({ projectData, isUserOwner }) => {
    if (!projectData) return null; 

    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    }

    //const { isEditing, editUserInfo } = useUserInfoMutation()

    // const handleSave = () => {
    //     editUserInfo({
    //         userId: user.id,
    //         name,
    //         description,
    //         tags: interestTags, 
    //     })
    //     .then(() => {
    //         toast.success('User modifications saved successfully!');
    //         toggleEditMode();
    //     })
    //     .catch((error) => {
    //         // Error toast is already handled inside the `editUserInfo` function.
    //         toggleEditMode();
    //     });
    // };
    

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 ml-2 mr-10">

                {/* First we add a section title and Edit button */}
                <div id="user-page-links-tab-edit-section" className="flex items-center space-x-4 ml-2">
    
                    <div className='text-lg mt-2 font-semibold'>
                        Links
                    </div>
                    
                    {isUserOwner && (

                        !isEditMode ? (
                            <button 
                                onClick={toggleEditMode}
                                className="bg-blue-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                            >
                                <span className='flex items-center'>
                                    Edit 
                                    <EditSVG width='4' height='4' marginLeft='2'/>
                                </span>
                            </button>
                        ) 
                        : 
                        (
                            
                            //     <button 
                            //         onClick={handleSave}
                            //         className="bg-green-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                            //     >
                            //         <span className='flex items-center space-x-2'>
                            //             Save 
                            //             {isEditing && (<LoadingSpinner size={16} />) }
                            //         </span>
                            //     </button>
                            <> 
                                <button 
                                    onClick={toggleEditMode}
                                    className="bg-red-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                                >
                                    Cancel
                                </button>
                            </>
                        )
                    )}
                </div>


                {projectData.map((fullProject) => {
                    const isPrivate = fullProject.project.projectPrivacy === 'private';

                    // Render only if the project is public, or if it's private and the user is the owner
                    if (!isPrivate || (isPrivate && isUserOwner)) {
                        return (
                            <LinksCardPortofolio
                                key={fullProject.project.id}
                                isPrivate={isPrivate}
                                {...fullProject}
                            />
                        );
                    }


                    return null;
                })}
            </div>
        </div>
    );
};
