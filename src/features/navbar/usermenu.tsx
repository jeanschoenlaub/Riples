import { useSession, signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react";
import { ProfileImage } from '~/components/profile-image'; // Import ProfileImage component
import { NavBarUserDeleteModal } from "./userdeletemodal";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { handleMutationError} from "~/utils/error-handling"
import router from "next/router";


export const UserMenu = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef<null | HTMLDivElement>(null);
  const { deleteUser, isDeleting } = UseUserMutations();

  const redirectUserPage = (option: string) => {
    router.push(`/users/${session?.user.id}/?activeTab=${option}`).catch(err => {
        // Handle any errors that might occur during the navigation
        console.error('Failed to redirect:', err);
    });
  };

  const redirectHelpPage = () => {
    router.push(`/help/`).catch(err => {
        // Handle any errors that might occur during the navigation
        console.error('Failed to redirect:', err);
    });
  };

  const handleDeleteUserMutation = () => {
      if (!session?.user?.id) {
        toast.error("User ID not found in session");
        return;
      }
      deleteUser({ userId: session.user.id}).then(() => {
          toast.success('User Deleted Successfully');
          setShowDeleteModal(false);
      })
      .catch(() => {
          toast.error('Error deleting User');
          setShowDeleteModal(false);
      });
  };
  

  // User Drop Down Event 
  const onClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  const toggleUserDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDropdown) {
      window.removeEventListener('click', onClickOutside);
    } else {
      // Delay adding the event listener to allow for the current event to complete
      setTimeout(() => {
        window.addEventListener('click', onClickOutside);
      }, 0);
    }
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('click', onClickOutside);
    };
  }, []);

  return ( 
        <div>
        {session && (
            <div className="relative">
                <div id="userdropdown"
                onClick={toggleUserDropdown} 
                style={{ cursor: 'pointer' }} // Make the mouse change to a pointer when hovering
                >
                <ProfileImage  username={session.user.username ?? ""} email={session.user.email ?? ""} image={session.user.image ?? "" } name={session.user.name ?? ""}  size={32} />
                </div>
                {showDropdown && (
                    <div ref={dropdownRef}  className="absolute right-0 md:right-auto md:left-0 mt-2 w-40 rounded-md shadow-lg z-30 bg-slate-50">
                        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                        <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => signOut()}>Sign Out</button>
                        <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => redirectUserPage("about")}>Your Profile</button>
                        <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => redirectHelpPage()}>Help</button>
                        <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
                    </div>
                )}
            </div>
        )}
        <NavBarUserDeleteModal showDeleteModal={showDeleteModal} isLoading={isDeleting} onClose={() => setShowDeleteModal(false)} onDelete={handleDeleteUserMutation}  />
    </div>
  )
} 

type DeleteUserPayload = {
  userId: string;
}

export const UseUserMutations  = () => {
  const apiContext = api.useContext();
  const handleSuccess = async () => {
      await apiContext.users.getUserByUserId.invalidate();
  };

  // Delete User Mutation
  const { mutate: deleteUserMutation, isLoading: isDeleting } = api.users.deleteUser.useMutation({
      onSuccess: handleSuccess,
  });

  const deleteUser = (payload: DeleteUserPayload): Promise<void> => {
    return new Promise((resolve, reject) => {
        deleteUserMutation(payload, {
            onSuccess: () => { 
                void signOut();
                void router.push("/")
                resolve(); 
            },
            onError: (e) => {
              handleMutationError(e, reject);
            }
        });
    });
};

return {
  isDeleting,
  deleteUser,
};
}