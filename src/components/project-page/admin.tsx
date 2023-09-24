import React, { useState } from 'react';
import dayjs from 'dayjs';
import { api, type RouterOutputs } from '~/utils/api';
import Link from 'next/link';
import { ProfileImage } from '../reusables/profileimage';
import { StyledTable } from '../reusables/styledtables';
import toast from 'react-hot-toast';
import { handleZodError } from '~/utils/error-handling';
import { Modal } from '../reusables/modaltemplate';
import { LoadingSpinner } from '../reusables/loading';
import router from 'next/router';

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
type MemberData = RouterOutputs["projectMembers"]["getMembersByProjectId"];

interface AdminTabProps {
    project: ProjectData["project"];
    members: MemberData;
}

export const AdminTab: React.FC<AdminTabProps> = ({ project, members }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  //Custom Hooks
  /* eslint-disable @typescript-eslint/no-empty-function */
  const { isApproving, isRefusing, isDeleting, deleteProject, approveUser, refuseUser } = useUserStatusMutation({
    onSuccess: () => {},
  });
  /* eslint-enable @typescript-eslint/no-empty-function */

  const isLoading = isApproving || isRefusing;

  const handleApprove = (userId: string, projectId:string) => {
    approveUser({ userId, projectId });
  };

  const handleRefuse = (userId: string, projectId:string) => {
    refuseUser({ userId, projectId });
  };

  const handleDeleteProject = async (projectId: string) => {
      try {
        await deleteProject({ projectId: project.id });
        setShowDeleteModal(false);
        await router.push('/');
        toast.success("Project Deleted successfully");
      } catch (error) {
        // You can handle any error related to the deletion here if necessary.
        toast.error("Failed to delete the project");
      }
  }

  return (
    <div id="proj-admin" className="mt-4 ml-2 mb-2 space-y-4">
        {/*  Application list */}
        <div id="application-table" className="mt-2">
            <StyledTable headers={["Applications", "Status", "Action"]}>
                {members
                    .filter(member => member.member.status === "PENDING")
                    .map((member, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                            <Link href={`/users/${member.user.id}`}>
                                <ProfileImage user={member.user} size={32} />
                            </Link>
                            <Link href={`/users/${member.user.id}`} className="text-sm font-medium ml-2">
                                {member.user.username}
                            </Link>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            {member.member.status}
                        </td>
                        <td className="px-6 py-4 space-x-6">
                            <button onClick={() => handleApprove(member.user.id,project.id)} disabled={isLoading}>
                                <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                    <path stroke="#008000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                </svg>
                            </button>
                            <button onClick={() => handleRefuse(member.user.id,project.id)} disabled={isLoading}>
                                <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </td>
                        </tr>
                ))}
            </StyledTable>
        </div>
        
        {/*  Members list */}
        <div id="member-table" className="mt-2">
            <StyledTable headers={["Members", "Action"]}>
                    {members
                        .filter(member => member.member.status === "APPROVED")
                        .map((member, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                <Link href={`/users/${member.user.id}`}>
                                    <ProfileImage user={member.user} size={32} />
                                </Link>
                                <Link href={`/users/${member.user.id}`} className="text-sm font-medium ml-2">
                                    {member.user.username}
                                </Link>
                                </div>
                            </td>
                            <td className="px-6 py-4 space-x-6">
                                <button 
                                  onClick={() => handleRefuse(member.user.id,project.id)} 
                                  disabled={isDeleting}
                                >
                                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                            </td>
                            </tr>
                    ))}
            </StyledTable>
        </div>
        <button 
            onClick={() => setShowDeleteModal(true)} 
            className="bg-red-500 text-white rounded px-4 py-2 mr-2 flex items-center justify-center w-auto"
            disabled={isLoading || isDeleting}
          >
            <span>Delete Project</span>
        </button>
        <Modal showModal={showDeleteModal} isLoading={isLoading} onClose={() => setShowDeleteModal(false)} size="small">
            <h1> Delete Project   </h1>
            <label className="block text-base mb-2 mt-4"> Are you sure you want to delete, all data will be lost forever ? </label>
            <div className='flex flex-col'>
              <div className="flex items-center justify-center space-x-2">
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <button className="bg-green-500 text-white rounded px-4 py-2 mb-2" 
                onClick={() => { void handleDeleteProject(project.id); }}
                disabled={isDeleting}
                > {isDeleting && <LoadingSpinner size={20} />} Yes 
              </button>
              <button className="bg-red-500 text-white rounded px-4 py-2 mb-2" onClick={ () => setShowDeleteModal(false)}> Cancel </button>
              </div>
            </div>
          </Modal>
    </div>
)};

const useUserStatusMutation = ({ onSuccess }: { onSuccess: () => void }) => {
    const apiContext = api.useContext();
  
    // Function to run on successful mutations
    const handleSuccess = () => {
      void apiContext.projectMembers.getMembersByProjectId.invalidate(); // Invalidate the cache for the users
      onSuccess(); // Execute any additional onSuccess logic
    };
  
    // Mutation for approving a user
    const { mutate: approveUserMutation, isLoading: isApproving } = api.projectMembers.approveMember.useMutation({
      onSuccess: handleSuccess,
      onError: (e) => {
        const fieldErrors = e.data?.zodError?.fieldErrors;
        const message = handleZodError(fieldErrors);
        toast.error(message);
      },
    });
  
    // Mutation for refusing a user
    const { mutate: refuseUserMutation, isLoading: isRefusing } = api.projectMembers.deleteProjectMember.useMutation({
      onSuccess: handleSuccess,
      onError: (e) => {
        const fieldErrors = e.data?.zodError?.fieldErrors;
        const message = handleZodError(fieldErrors);
        toast.error(message);
      },
    });

    // Mutation for deleting a project
    const { mutateAsync: deleteProjectAsyncMutation, isLoading: isDeleting } = api.projects.delete.useMutation({
      onSuccess: handleSuccess,
      onError: (e) => {
        const fieldErrors = e.data?.zodError?.fieldErrors;
        const message = handleZodError(fieldErrors);
        toast.error(message);
      },
    });
  
    return {
      isApproving,
      isRefusing,
      isDeleting,
      approveUser: approveUserMutation,
      refuseUser: refuseUserMutation,
      deleteProject: deleteProjectAsyncMutation,
    };
  };