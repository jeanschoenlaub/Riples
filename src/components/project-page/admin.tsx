import React from 'react';
import dayjs from 'dayjs';
import { api, type RouterOutputs } from '~/utils/api';
import Link from 'next/link';
import { ProfileImage } from '../profileimage';
import { StyledTable } from '../reusables/styledtables';
import toast from 'react-hot-toast';
import { handleZodError } from '~/utils/error-handling';

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
type MemberData = RouterOutputs["projectMembers"]["getMembersByProjectId"];
interface AdminTabProps {
    project: ProjectData["project"];
    members: MemberData;
  }

  export const AdminTab: React.FC<AdminTabProps> = ({ project, members}) => {

  //Custom Hooks
  const { isApproving, isRefusing, approveUser, refuseUser } = useUserStatusMutation({
    onSuccess: () => {
      console.log("User status changed successfully.");
    },
  });

  const isLoading = isApproving || isRefusing;

  const handleApprove = (userId: string, projectId:string) => {
    approveUser({ userId, projectId });
  };

  const handleRefuse = (userId: string, projectId:string) => {
    refuseUser({ userId, projectId });
  };

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
                                    <path stroke="#008000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                </svg>
                            </button>
                            <button onClick={() => handleRefuse(member.user.id,project.id)} disabled={isLoading}>
                                <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="#FF0000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
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
                                <button onClick={() => handleRefuse(member.user.id,project.id)} disabled={isLoading}>
                                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="#FF0000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                            </td>
                            </tr>
                    ))}
            </StyledTable>
        </div>
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
    const { mutate: refuseUserMutation, isLoading: isRefusing } = api.projectMembers.refuseMember.useMutation({
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
      approveUser: approveUserMutation,
      refuseUser: refuseUserMutation,
    };
  };