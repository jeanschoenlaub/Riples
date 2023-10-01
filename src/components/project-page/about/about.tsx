import React, { useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { ProfileImage } from '../../reusables/profileimage';
import toast from 'react-hot-toast';
import { EditSVG} from '../../reusables/svg';
import type { AboutTabProps, EditProjectPayload} from './abouttypes';
import { useProjectMutation } from './aboutapi';
import { LoadingSpinner } from '~/components/reusables/loading';
import { ProjectAboutGoal } from './goals/goals';


export const AboutTab : React.FC<AboutTabProps> = ({ project, isMember, isPending, isProjectLead, userId }) => {
    //All for editing below
    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => {
      setIsEditMode(!isEditMode);
    }
    const handleSave = () => {
      editProject(generateEditPayload()).then(() => {
        toast.success('Project modifications saved successfully!');
        toggleEditMode();
      })
      .catch(() => {
        toast.error('Error saving project modification');
        toggleEditMode();
      });
    }

    console.log(project.project.members)
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
    const [projectSummary, setProjectSummary ] = useState(project.project.summary)
    const [projectStatus, setProjectStatus] = useState(project.project.status);

    // Helper function to generate edit payload
    const generateEditPayload = (): EditProjectPayload => ({
      projectId: project.project.id,
      title: project.project.title,
      summary: projectSummary,
      status: projectStatus,
    });

    const {  isEditing, isApplying,  isDeleting, applyToProject, deleteMember, editProject } = useProjectMutation()
    
    return (
        <div id="proj-about-html" className="mt-4 ml-2 mb-2 space-y-4">
          {(isProjectLead && !isEditMode) && (
            <div className="flex space-x-2">
                <button 
                  onClick={toggleEditMode}
                  className="bg-blue-500 text-white text-sm rounded px-4 py-1 ml-2 flex items-center justify-center w-auto"
                >
                    <span className='flex items-center'>
                        Edit 
                        <EditSVG width='4' height='4' marginLeft='2'/>
                  </span>
              </button>
             
           </div>
        )}
        <hr></hr>
        <span className='text-lg font-semibold'> Project  Info </span>
        {(isProjectLead && isEditMode) && (
            <div className="flex space-x-2">
              <button 
                onClick={handleSave}
                className="bg-green-500 text-white text-sm rounded px-4 py-1 ml-2 flex items-center justify-center w-auto"
              >
                  <span className='flex items-center space-x-2'>
                      Save 
                      {isEditing && (<LoadingSpinner size={16} />) }
                  </span>
              </button>
               <button 
               onClick={toggleEditMode}  
               className="bg-red-500 text-white text-sm rounded px-4 py-1 flex items-center justify-center w-auto"
           >
               Cancel
           </button>
          </div>
        )}

        <label className="block text-sm text-gray-500 mb-3 justify-br" aria-label="Task Content">
          Project Story:
          {!isEditMode ? (
            <>
              <div className="w-full p-2 mt-1 rounded border bg-gray-100">
                {project.project.summary}
              </div>
            </>
          ) : (
            <input
              type="text"
              value={projectSummary}
              onChange={(e) => setProjectSummary(e.target.value)}
              className={`w-full p-2 mt-1 rounded border ${isEditing ? 'cursor-not-allowed' : ''}`}
              maxLength={50}
              disabled={isEditing}
            />
          )}
        </label>


        <ProjectAboutGoal 
            goals={project.project.goals}
            projectPrivacy={project.project.projectPrivacy}
            isProjectLead={isProjectLead}
            isMember={isMember}
            isEditMode={isEditMode}
        />
    
        {/* Project Status */}
        <div className="block text-sm mb-3 justify-br" aria-label="Project Status">
            Project Status:
            {!isEditMode ? (
                <span className={`inline-block px-2 py-1 rounded text-white ${
                    project.project.status === "Doing" ? "bg-yellow-500" : 
                    project.project.status === "To-Do" ? "bg-gray-500" : 
                    project.project.status === "Done" ? "bg-green-500" : ""
                }`}>
                    {project.project.status}
                </span>
            ) : (
                <select 
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    className={`w-auto p-2 mt-1 rounded border ${isEditing ? 'cursor-not-allowed' : ''}`}
                    disabled={isEditing}
                >
                    <option value="To-Do">To-Do</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>
                </select>
            )}
        </div>

        <hr></hr>
        <span className='text-lg font-semibold'> Project Members Info </span>
        {/* About the project Type */}
        <div id="project-about-project-type" className="flex items-center space-x-3 mb-4">
          <div id="project-about-project-type-icon" className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#2563eb"  // Blue and Gray colors
              viewBox="0 0 20 20"
            >
              {project.project.projectType === "collab" 
                ? <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/> 
                : <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>}
            </svg>
            {project.project.projectType === "collab" ? "Collaborative" : "Individual"}
          </div>
    
          <span className="text-sm text-gray-500">
            This is a <span className="font-medium text-sky-500">{project.project.projectType}</span> project  
          </span>
        </div>

         {/* About the project Visibility */}
         <div id="project-about-project-type" className="flex items-center space-x-3 mb-4">
          <div id="project-about-project-type-icon" className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#2563eb"  // Blue and Gray colors
              viewBox="0 0 20 20"
            >
              {project.project.projectType === "collab" 
                ? <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/> 
                : <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>}
            </svg>
            {project.project.projectPrivacy === "private" ? "Private" : "Public"}
          </div>
    
          <span className="text-sm text-gray-500">
            This is a <span className="font-medium text-sky-500">{project.project.projectPrivacy}</span> project  
          </span>
        </div>

          {/* JOIN / LEAVE PROJECT SECTION AND BUTTON */}
          { (project.project.projectType === "collab") &&
          <div>
          <div id="project-collab-how-to-apply" className="mt-4 ml-2 mb-2 space-y-4">
                <section>
                    <ol className="list-decimal list-inside">
                    <Link href="/about/collaborate-on-a-riple-project" className="text-blue-500"> How to collaborate on Riples </Link> 
                    </ol>
                </section>
            </div>

            <div id="project-collab-apply-button" className="mt-4 mb-4 flex justify-center items-center">
                {(userId && !isProjectLead) ? ( <>
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
                </>
                ) : (
                  !isProjectLead && (
                    <div className="bg-blue-500 text-white rounded py-1 px-2 text-center">
                        You must be signed in to apply.
                    </div>)
                )}
            </div>
          </div>
          }
    
        <span className="text-sm text-gray-500 flex items-center">
        Project Lead:  
        <span className="font-medium ml-1 flex items-center">
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
        <div id="project-about-members" className="mb-4 flex flex-wrap items-center">
          <span className="text-sm text-gray-500">Project Members:</span>

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
        
        <hr></hr>
        <span className='text-lg font-semibold'> Project Stats </span>
        {/* Project Tasks and Subtasks Stats */}
{(project.project.projectPrivacy === "public" || isProjectLead || isMember) &&
    <div id="project-tasks-stats" className="mb-4">
        <span className="text-sm text-gray-500 mb-2 block">Tasks and Subtasks Stats:</span>

        <div className="mt-2">
            {/* Completed Tasks */}
            <div className="flex items-center mb-2">
                <span className="mr-2">Completed Tasks: 2/2</span>
            </div>

            
            {/* Completed Subtasks */}
            <div className="flex items-center mb-2">
                <span className="mr-2">Completed SubTasks: 2/2</span>
            </div>
            </div>
        </div>
}


        <p className="italic text-sm text-gray-600">
          Created {dayjs(project.project.createdAt).format('DD/MM/YYYY')}
        </p>
  </div>
)};