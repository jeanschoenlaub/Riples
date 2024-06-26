import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProjectInfoMutation } from './project-info-api';
import Link from 'next/link';
import type { ProjectAboutInfoProps, EditProjectPayload} from './project-info-type';
import { sortedProjectClassifications } from '~/utils/constants/projectclassifications';

import {LoadingSpinner, MultiSelect, Tooltip, ProfileImage, EditSVG, MultiUserSVG, PrivateSVG, PublicSVG, SingleUserSVG } from '~/components';
import { PROJECT_STATUS_VALUES, getProjectStatusColor } from '~/utils/constants/dbValuesConstants';


interface OptionType {
    value: string;
    label: string;
  }

export const ProjectAboutInfo: React.FC<ProjectAboutInfoProps> = ({
    project,
    projectTags,
    isMember,
    isPending,
    isProjectLead,
    userId,
    username,
}) => {
    const [projectSummary, setProjectSummary] = useState(project.project.summary);
    const [projectStatus, setProjectStatus] = useState(project.project.status);
    const [projectTitle, setProjectTitle] = useState(project.project.title);
    const [projectLink, setProjectLink] = useState(project.project.link);

    // Update state when the project prop changes such as navigating between projects
    useEffect(() => {
        setProjectSummary(project.project.summary);
        setProjectStatus(project.project.status);
        setProjectTitle(project.project.title);
        setProjectLink(project.project.link);
    }, [project.project.summary, project.project.status, project.project.title, project.project.link]);


    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode)
    }

    //For interest tags
    const [interestTags, setInterestTags] = useState<string[]>(projectTags || []);
    const handleTagsChange = (updatedTags: string[]) => {
        setInterestTags(updatedTags);
      };
    const selectedTags: OptionType[] = interestTags.map(tag => ({ value: tag, label: tag }));
 
     //For appliaction mutations
     const Application = {
       userId: userId ?? "",
       projectId: project.project.id,
       projectTitle: project.project.title,
       username: username ?? "",
       projectLeadId: project.project.authorID,
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
        title: projectTitle,
        link: projectLink,
        summary: projectSummary,
        status: projectStatus,
        tags: interestTags,
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
                <div className='text-lg mt-2 mr-6 font-semibold'>Project Info</div>
                
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

            {/* Project Title, only if edit mode */}
            {isEditMode && 
                <div className="flex items-center ml-2 mt-3 mb-3 space-x-2">
                    <label htmlFor="project-title" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="Task Content">
                        Project Title:
                    </label>
                    <input
                        id="project-title"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className={`flex-grow w-full rounded border ${isEditing ? 'cursor-not-allowed' : ''}`}
                        maxLength={255}
                        disabled={!isEditMode }
                    />
                </div>
            }

            {/* Project Story */}
            <div className="block md:flex items-center ml-2 mr-4 mt-6 mb-3 space-x-2">
                <label htmlFor="project-story" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="Task Content">
                    Project Story:
                </label>
                        <textarea
                        id="project-story"
                        value={projectSummary}
                        onChange={(e) => setProjectSummary(e.target.value)}
                        className={`flex-grow w-full rounded border ${isEditing ? 'cursor-not-allowed' : ''}`}
                        maxLength={5000}
                        rows={4}
                        disabled={!isEditMode }
                    />
            </div>

            {/* Project Link, only displayed if there is a link */}
            {(isEditMode || project.project.link !== "") &&
                <div className="block md:flex items-center ml-2 mr-4 mt-6 mb-3 space-x-2">
                    <label htmlFor="project-link" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="Project Link">
                        Project Link:
                    </label>

                    {!isEditMode ? (
                        <Link href={project.project.link}
                            className={`inline-block text-blue-500 underline ml-2 text-base font-semibold`}>
                            {project.project.link}
                        </Link>
                    ) : (
                    <textarea
                            id="project-link"
                            value={projectLink}
                            onChange={(e) => setProjectLink(e.target.value)}
                            className={`flex-grow w-full rounded border ${isEditing ? 'cursor-not-allowed' : ''}`}
                            maxLength={5000}
                            rows={1}
                            disabled={!isEditMode }
                        />
                    )}
                </div>
            }


            {/* Project Status */}
            <div className="flex items-center ml-2 mt-3 mb-3 space-x-2">
                <label htmlFor="project-status" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="Project Status">
                Project Status:
                </label>

                {!isEditMode ? (
                    <span className={`inline-block text-white ml-2 px-2 py-1 text-base font-semibold rounded ${getProjectStatusColor(project.project.status)}`}>
                        {project.project.status}
                    </span>
                ) : (
                    <select 
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                        className={`w-auto ml-2 p-2 mt-1 rounded border ${isEditing ? 'cursor-not-allowed' : ''}`}
                        disabled={isEditing}
                    >
                        {PROJECT_STATUS_VALUES.map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Project Tags */}
            <div className="block md:flex items-center ml-2 mr-4 mt-3 mb-3 space-x-2 ">
                <label htmlFor="project-category" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="User Name">
                    Project Category:
                </label>
                <div className="flex-grow w-full">
                <MultiSelect
                          options={sortedProjectClassifications}
                          value={selectedTags}
                          disabled={!isEditMode}
                          onChange={(selected) => {
                          // Convert OptionType[] back to string[] for onTagsChange
                          if (selected) {
                              handleTagsChange(selected.map(option => option.value));
                          } else {
                              handleTagsChange([]);
                          }
                          }}
                          maxSelection={5}
                          placeholder="Add tags..."
                      />
                    </div>
            </div>

            {/* Project Type & Privacy, only displayed if not project lead (if lead displayed in admin) */}
              { !isProjectLead && (
                <div className='mt-2'>
                    <div id="project-about-project-type" className="flex items-center ml-2 text-gray-500 font-semibold text-sm space-x-3 mb-4 w-32">
                        Project Access:
                        <div id="project-about-project-type-icon" className="flex items-center ml-2 justify-center">
                            <div className='flex items-center text-black font-normal'>
                                {project.project.projectType === "collab" ? 
                                <MultiUserSVG width="6" height="6" marginRight='2' colorFillHex='#2563eb'></MultiUserSVG> // Blue color
                                :<SingleUserSVG width="6" height="6" marginRight='2' colorFillHex='#2563eb'></SingleUserSVG>  // Gray color
                                }
                                {project.project.projectType === "collab" ? "Collaborative" : "Individual"}
                            </div>
                        </div>
                    </div>
              
                  <div id="project-about-project-visibility" className="flex items-center ml-2 text-gray-500 font-semibold text-sm space-x-3 mb-4 w-32">
                      Project Visibility:
                      <div id="project-about-project-visibility-icon" className="flex items-center justify-center ml-2">
                          <div className='flex items-center text-black font-normal'>
                              {project.project.projectPrivacy=== "private" ? 
                                  <PrivateSVG width="6" height="6" marginRight='2' colorFillHex='#2563eb'></PrivateSVG> 
                                  : <PublicSVG width="6" height="6" marginRight='2' colorFillHex='#2563eb'></PublicSVG>}
                              {project.project.projectPrivacy === "private" ? "Private" : "Public"}
                          </div>
                      </div>
                  </div>
              </div>
            )}

            {/* Project Lead */}
            <div className="flex items-center ml-2 mr-2 mt-3 mb-3 space-x-2 ">
                <label htmlFor="project-lead" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="User Name">
                    Project Lead:
                </label>  
                <span className="ml-1 flex items-center text-black font-normal flex-grow w-full ">
                    <div id="project-lead-profile-image" className="flex items-center ">
                        <Link href={`/users/${project.project.authorID}`}>
                        <ProfileImage username={project.author.username} email={project.author.email} image={project.author.image} name={project.author.name} size={32} />
                        </Link>
                    </div>
                    <Link href={`/users/${project.project.authorID}`} className="ml-2">
                        {project.author.username}
                    </Link>
                </span>
        </div>

        {/* About the Project Members, only display if collab project */}
        {(project.project.projectType === "collab") &&(
            <div id="project-about-members" className="flex items-center ml-2 mr-2 mt-3 mb-3 space-x-2 ">
                <label htmlFor="project-members" className="text-sm text-gray-500 font-semibold justify-br flex-shrink-0 w-32" aria-label="User Name">
                    Project Members:
                </label> 
            { 
              project.project.members.filter(user => user.status === "APPROVED").length === 0
                ? (
                  // Render a message or any other component to indicate that there are no members
                  <div className="ml-2 items-center text-center py-2 text-gray-600">
                    No members.
                  </div>
                )
                : (
                  <div className="flex flex-wrap items-center">
                    {project.project.members.filter(user => user.status === "APPROVED").map((user, index) => (
                      <div key={index} className="flex items-center ml-2">
                        {index > 0 && <span className="text-sm font-medium">, </span>}
                        <div id={`riple-card-metadata-auth-profile-image-${index}`} className="flex items-center">
                          <Link href={`/users/${user.id}`}>
                            <ProfileImage username={user.user.username} email={user.user.email} image={user.user.image} name={user.user.name} size={32} />
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
                )
            }
          </div>
        )}

        {/* JOIN / LEAVE PROJECT SECTION AND BUTTON */}
        { (project.project.projectType === "collab") &&
            <div>
                <div id="project-collab-apply-button" className="flex justify-center items-center space-x-2">
                    {userId ? (
                        <>
                            {/* Apply/Quit Button */}
                            {!isProjectLead && (
                                <div className="mt-4 mb-4">
                                    <button 
                                        className={`text-white rounded py-2 px-2 text-center ${isMember ? 'bg-red-500' : 'bg-blue-500'}`} //This is a Apply/Quit button
                                        onClick={() => {
                                            if (userId) {  // Ensure userId is not null
                                                if (isMember || isPending || isProjectLead){
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
                            )}

                            {/* Invite Friend Button (if user is a member or project lead) */}
                            {(isMember || isProjectLead) && (
                                <Tooltip content="To invite a friend, just send them the URL of this project and tell them to Apply to join the project." width="250px">
                                    <button disabled className="p-2 bg-gray-500 text-white rounded cursor-not-allowed">
                                        Invite Friend
                                    </button>
                                </Tooltip>
                            )}
                        </>
                    ) : (
                        <div className="bg-blue-500 text-white rounded py-2 px-2 text-center">
                            You must be signed in to apply.
                        </div>
                    )}
                </div>

                {(userId && !isProjectLead) && 
                    <div id="project-collab-how-to-apply" className="mt-4 ml-2">
                        <section>
                            <ol className="list-decimal list-inside">
                                <Link href="/about/collaborate-on-a-riple-project" className="text-blue-500"> How to collaborate on Riples </Link> 
                            </ol>
                        </section>
                    </div>
                }
            </div>
        }
        </div>
    );
};
