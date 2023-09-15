import React, { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

type FollowProps = {
  projectId: string;
};

export const Follow: React.FC<FollowProps> = ({ projectId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // To handle loading state during mutation
  const { data: session } = useSession();

  
  const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user ID exist
  
  // Conditional query using tRPC to avoid no user error if not signed-in
  const followerQuery = api.projectFollowers.getFollowersByProjectId.useQuery(
    { projectId },
    { enabled: shouldExecuteQuery }
  );

  // Add mutation logic here
  const addFollowerMutation = api.projectFollowers.addFollowerToProject.useMutation();
  const removeFollowerMutation = api.projectFollowers.removeFollowerFromProject.useMutation();

  useEffect(() => {
    setIsFollowing(followerQuery.data?.some(follower => follower.userId === session?.user?.id) ?? false);
  }, [followerQuery.data, session]);

  const toggleFollow = async () => {
    if (!session?.user?.id) return; // Exit if the user is not logged in
    
    setIsLoading(true); // Set loading state
    try {
      const mutationOptions = {
        userId: session.user.id,
        projectId
      };
      if (isFollowing) {
        await removeFollowerMutation.mutateAsync(mutationOptions);
      } else {
        await addFollowerMutation.mutateAsync(mutationOptions);
      }

      // Refetch the follower data
      followerQuery.refetch().catch(err => {
        console.error(err);
      });

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow state:', error);
    } finally {
      setIsLoading(false); // Unset loading state
    }
  };

  if (followerQuery.isLoading || isLoading) return <p>Loading...</p>;
  if (followerQuery.isError) return <p>Error loading followers.</p>;

  return (
    <div className="mt-4 ml-2 mb-2 space-y-4 justify-center">
      <button 
        className= "border rounded border-gray-300 px-4 py-2" 
        onClick={toggleFollow}
        disabled={!shouldExecuteQuery} // Disable the button if the query shouldn't execute
      >
        {isFollowing ? 
            <svg 
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg"
                fill="none" 
                viewBox="0 0 14 20">
                <path stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"/>
           </svg>
         :
            <svg 
                className="w-6 h-6 text-gray-800 dark:text-white" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="#2563eb" 
                viewBox="0 0 14 20">
                <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"/>
            </svg>
         }
      </button>
    </div>
  );
};

export default Follow;