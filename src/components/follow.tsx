import React, { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { NavBarSignInModal } from '../layout/navbar/signinmodal';
import toast from 'react-hot-toast';
import { LoadingSpinner } from './loading';
import { FollowFullSVG } from './svg';
import { FollowEmptySVG } from './svg-stroke';
import { useOnboarding } from '../features/onboarding/onboardingwrapper';

type FollowProps = {
  projectId: string;
  showText? : boolean;
};

export const Follow: React.FC<FollowProps> = ({ projectId, showText }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // To handle loading state during mutation
  
  const [showTooltip, setShowTooltip] = useState(false);

  const apiContext = api.useContext();//To invalidate cache

  const { data: session } = useSession();

  const { setShowSignInModal } = useOnboarding();//If trying to follow while not logged in
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
        setShowSignInModal(true); // Change to useOnbaording ?
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

  if ((shouldExecuteQuery && followerQuery.isLoading) || isLoading) return <LoadingSpinner size={16} />;
  if (followerQuery.isError) return <p>Error loading followers.</p>;

  return (
    <div className="justify-center relative">
      <div
    className={`cursor-pointer ${showText ? '' : 'border border-gray-300 px-2 py-2'}`}
    onMouseEnter={ () => showText ?? setShowTooltip(true)}
    onMouseLeave={() => showText ?? setShowTooltip(false)}
    onClick={handleToggleFollow}
    role="button" // Accessibility: Indicates the div's role as a button
    tabIndex={0}  // Accessibility: Makes the div focusable
  
>
    {isFollowing ? (
        <div className= "flex items-center">
            <FollowFullSVG width="4" height="4" marginRight="3" colorFillHex='#2563eb'></FollowFullSVG> 
            {showText ? "Unfollow": ""}  
        </div>
    ) : (
        <div className= "flex items-center">
            <FollowEmptySVG width="4" height="4" marginRight="3" colorStrokeHex='#2563eb'></FollowEmptySVG> 
            {showText ? "Follow": ""}    
        </div>
    )}
</div>
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
          //zIndex: 10
        }}>
          {isFollowing ? 'Following' : 'Not Followed'}
        </div>
      )}
    </div>
  );
};

export default Follow;
