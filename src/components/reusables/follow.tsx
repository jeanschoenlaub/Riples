import React, { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { NavBarSignInModal } from '../navbar/signinmodal';
import toast from 'react-hot-toast';
import { LoadingSpinner } from './loading';

type FollowProps = {
  projectId: string;
};

export const Follow: React.FC<FollowProps> = ({ projectId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // To handle loading state during mutation
  const [showSignInModal, setShowSignInModal] = useState(false); // If click on folllow when not signed in we redirect
  const [showTooltip, setShowTooltip] = useState(false);

  const apiContext = api.useContext();//To invalidate cache

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
    if (!session?.user?.id) {
        toast.error("You must be signed in to create a project")
        setShowSignInModal(true); // Show sign-in modal if the user is not logged in
        return;
    } // Exit if the user is not logged in
    
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

      void apiContext.projectFollowers.getProjectsFollowedByFollowerId.invalidate(); // Invalidate the cache

      // Refetch the follower data
      followerQuery.refetch().catch(err => {
        console.error(err);
      });

      setIsFollowing(!isFollowing);
      //Ui
      if (isFollowing) {
        toast.success("UnFollowed");
      }
      else {
        toast.success("Followed");
      }
    } catch (error) {
      console.error('Failed to toggle follow state:', error);
    } finally {
      setIsLoading(false); // Unset loading state
    }
  };

  const handleToggleFollow = () => {
    toggleFollow().catch(err => {
      console.error("Failed to toggle follow:", err);
    });
  };

  if ((shouldExecuteQuery && followerQuery.isLoading) || isLoading) return <LoadingSpinner size={32} />;
  if (followerQuery.isError) return <p>Error loading followers.</p>;

  return (
    <div className="justify-center relative">
      <button
        className="border rounded border-gray-300 px-2 py-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleToggleFollow}
      >
        {isFollowing ? 
            <svg 
                className="w-4 h-4 text-gray-800 " 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="#2563eb" 
                viewBox="0 0 14 20">
                <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"/>
            </svg>
         :
            <svg 
                className="w-4 h-4 text-gray-800 "
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg"
                fill="none" 
                viewBox="0 0 14 20">
                <path stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"/>
            </svg>
         }
      </button>
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '4px',
          backgroundColor: '#333',
          color: '#fff',
          borderRadius: '4px',
          zIndex: 10
        }}>
          {isFollowing ? 'Following' : 'Not Followed'}
        </div>
      )}
      <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
    </div>
  );
};

export default Follow;
