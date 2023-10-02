import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useProjectInfoMutation } from './projectinfoapi';
import { EditSVG } from '~/components/reusables/svg';
import { LoadingSpinner } from '~/components/reusables/loading';
import Link from 'next/link';
import { ProfileImage } from '~/components/reusables/profileimage';
import type { ProjectAboutInfoProps, EditProjectPayload} from './projectinfotype';

export const ProjectAboutInfo: React.FC<ProjectAboutInfoProps> = ({
    project,
    isMember,
    isPending,
    isProjectLead,
    userId
}) => {
    const [projectSummary, setProjectSummary] = useState(project.project.summary);
    const [projectStatus, setProjectStatus] = useState(project.project.status);

    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    }
 
     //For appliaction mutations
     const Application = {
       userId: userId ?? "",
       projectId: project.project.id,
     };
     const handleApplicationJoin = () => {
       if (userId){
         applyToProject(Application).then(() => {
           toast.success('Project application submited successfully!');
           toggleEditMode();
         })
         .catch(() => {
           toast.error('Error submitting project application');
           toggleEditMode();
         });
       }
       else {
         toast.error('Must be signed-in to apply');
       }
     }
     const handleApplicationQuit = () => {
       if (userId){
         deleteMember(Application).then(() => {
           toast.success('Project modifications saved successfully!');
           toggleEditMode();
         })
         .catch(() => {
           toast.error('Error saving project modification');
           toggleEditMode();
         });
       }
       else {
         toast.error('Must be signed-in to apply');
       }
     }

    const generateEditPayload = (): EditProjectPayload => ({
        projectId: project.project.id,
        title: project.project.title,
        summary: projectSummary,
        status: projectStatus,
    });

    const handleSave = () => {
        editProjectInfo(generateEditPayload()).then(() => {
            toast.success('Project modifications saved successfully!');
            toggleEditMode();
        })
        .catch(() => {
            toast.error('Error saving project modification');
            toggleEditMode();
        });
    }

    const { isEditing, isApplying,  isDeleting, applyToProject, deleteMember, editProjectInfo } = useProjectInfoMutation()

    return (
        <div>
            <div className="flex items-center space-x-4 ml-2">
                <div className='text-lg mt-2 font-semibold'>Project Info</div>
                
                {(isProjectLead && !isEditMode) && (
                    <button 
                        onClick={toggleEditMode}
                        className="bg-blue-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                    >
                        <span className='flex items-center'>
                            Edit 
                            <EditSVG width='4' height='4' marginLeft='2'/>
                        </span>
                    </button>
                )}
                
                {(isProjectLead && isEditMode) && (
                    <>
                        <button 
                            onClick={handleSave}
                            className="bg-green-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                        >
                            <span className='flex items-center space-x-2'>
                                Save 
                                {isEditing && (<LoadingSpinner size={16} />) }
                            </span>
                        </button>
                        <button 
                            onClick={toggleEditMode}
                            className="bg-red-500 mt-2 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>


            {/* Project Story */}
            <div className="flex items-center ml-2 mt-3 mb-3 space-x-2">
                <label htmlFor="project-story" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-24" aria-label="Task Content">
                    Project Story:
                </label>
                {!isEditMode ? (
                    <div 
                        className="flex-grow w-full p-2 rounded border bg-gray-100 cursor-pointer"
                        onClick={toggleEditMode}
                    >
                        {project.project.summary}
                    </div>
                ) : (
                    <textarea
                        id="project-story"
                        value={projectSummary}
                        onChange={(e) => setProjectSummary(e.target.value)}
                        className={`flex-grow w-full p-2 rounded border ${isEditing ? 'cursor-not-allowed' : ''}`}
                        maxLength={50}
                        rows={1}
                    />
                )}
            </div>


            {/* Project Status */}
            <div className="block ml-2 text-sm justify-br text-gray-500 font-semibold" aria-label="Project Status">
                Project Status:
                {!isEditMode ? (
                    <span className={`inline-block ml-2 px-2 py-1 text-base font-semibold rounded ${
                        project.project.status === "Doing" ? "text-yellow-500" : 
                        project.project.status === "To-Do" ? "text-black" : 
                        project.project.status === "Done" ? "text-green-500" : ""
                    }`}>
                        {project.project.status}
                    </span>
                ) : (
                    <select 
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                        className={`w-auto ml-2 p-2 mt-1 rounded border ${isEditing ? 'cursor-not-allowed' : ''}`}
                        disabled={isEditing}
                    >
                        <option value="To-Do">To-Do</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                    </select>
                )}
            </div>

            <span className="text-sm ml-2 mt-2 flex items-center text-gray-500 font-semibold">
            Project Lead:  
            <span className="ml-1 flex items-center text-black font-normal ">
            <div id="riple-card-metadata-auth-profile-image" className="flex items-center">
                <Link href={`/users/${project.project.authorID}`}>
                <ProfileImage user={project.author} size={32} />
                </Link>
            </div>
            <Link href={`/users/${project.project.authorID}`} className="ml-2">
                {project.author.username}
            </Link>
            </span>
        </span>

        {/* About the Project Members */}
        <div id="project-about-members" className="mb-4 ml-2 mt-3  flex flex-wrap items-center">
          <span className="text-sm font-semibold text-gray-500">Project Members:</span>

          <div className="mt-2 flex flex-wrap items-center">
            {project.project.members.filter(user => user.status === "APPROVED").map((user, index) => (
              <div key={index} className="flex items-center ml-2">
                {index > 0 && <span className="text-sm font-medium">, </span>}
                <div id={`riple-card-metadata-auth-profile-image-${index}`} className="flex items-center">
                  <Link href={`/users/${user.id}`}>
                    <ProfileImage user={user.user} size={32} />
                  </Link>
                </div>
                <span className="font-medium ml-1 flex items-center">
                  <Link href={`/users/${user.user.id}`} className="text-sm font-medium ml-2">
                    {user.user.username}
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </div>

         {/* JOIN / LEAVE PROJECT SECTION AND BUTTON */}
         { (project.project.projectType === "collab") &&
          <div>
            <div id="project-collab-apply-button" className="flex justify-center items-center ">
                {(userId && !isProjectLead) ? ( <>
                    <div className="mt-4 mb-4">
                      <button className={`text-white rounded py-1 px-2 text-center ${isMember ? 'bg-red-500' : 'bg-blue-500'}`} //This is a Aplly Quit button and the logic is handled in router
                          onClick={() => {
                              if (userId) {  // Adding this check ensures userId is not null for typescript
                                  if (isMember || isPending || isProjectLead){ // To-Do better logic for isProjetLead
                                    handleApplicationQuit();
                                  }
                                  else { 
                                    handleApplicationJoin();
                                  }
                              }
                          }}
                          disabled={isApplying || isDeleting || isPending}
                      >
                          {isApplying ? 'Updating...' : (isMember ? 'Quit the project' : (isPending ? 'Application submitted' : 'Join the project'))}
                      </button>
                    </div>
                </>
                ) : (
                  !isProjectLead && (
                    <div className="bg-blue-500 text-white rounded py-1 px-2 text-center">
                        You must be signed in to apply.
                    </div>)
                )}
            </div>
            {(userId && !isProjectLead) && <div id="project-collab-how-to-apply" className="mt-4 ml-2">
                <section>
                    <ol className="list-decimal list-inside">
                    <Link href="/about/collaborate-on-a-riple-project" className="text-blue-500"> How to collaborate on Riples </Link> 
                    </ol>
                </section>
            </div>}
          </div>
          }
        </div>
    );
};