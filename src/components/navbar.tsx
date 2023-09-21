import { useSession, signOut } from "next-auth/react"
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NavBarSignInModal } from "./usermodals/signinmodal";
import { ProfileImage } from '~/components/reusables/profileimage'; // Import ProfileImage component
import { NavBarUserDeleteModal } from "./usermodals/userdeletemodal";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { handleZodError } from "~/utils/error-handling";
import { NavBarUserNameModal } from "./usermodals/usernamemodal";

interface GlobalNavBarProps {
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

export const GlobalNavBar: React.FC<GlobalNavBarProps> = ({ activeTab, setActiveTab }) => {
  const { data: session } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showUserNameModal, setShowUserNameModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef<null | HTMLDivElement>(null);
  

  //We add a mutation for creating a task (with on success)
  const {mutate, isLoading: isDeleting}  = api.users.deleteUser.useMutation({
    onSuccess: async () => {
      await signOut();
      setShowDeleteModal(false);
    },
    onError: (e) => {
      const fieldErrors = e.data?.zodError?.fieldErrors; 
      const message = handleZodError(fieldErrors);
      toast.error(message);
    }
    });

  const deleteUserMutation = () => {
    if (session?.user?.id) {  // Assuming session.user.id contains the user's ID
      mutate({ userId: session.user.id })
    } else {
      toast.error("User ID not found in session");
    }
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
    <div id="global-nav-container" className="flex justify-center w-full">
      {/* LEFT NAV */}
      <div id="global-nav-left" className="flex w-2/5 md:w-1/5 gap-3 justify-center items-center p-2 border border-slate-700">
        <Link href="/about/riples">
          <Image 
              src="/images/logo_128x128.png" 
              alt="Riple logo" 
              width={32}
              height={32}
          />
        </Link>
        <div>
          <Link href="/about/riples">
              {'About Riples'}
          </Link>
        </div>
      </div>

      {/* MIDDLE NAV */}
      <div id="global-nav-mid" className="flex flex-col md:flex-row w-2/5 md:w-3/5 justify-center items-center gap-3 p-2 border border-slate-700">
        {/* Toogle Social / Create if optional parameters active tab otherwise home*/}
        {activeTab && setActiveTab ? (
            <div className="flex items-center justify-center">
              <div className="mx-2 w-40 h-auto bg-gray-300 rounded-full cursor-pointer relative py-4">
                <div
                  className={`absolute top-0 h-full bg-blue-500 bg-opacity-50 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out ${activeTab === "Social" ? "left-0 w-1/2" : "left-1/2 w-1/2"}`}
                >
                </div>
                <div
                  onClick={() => setActiveTab("Social")}
                  className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center rounded-full cursor-pointer ${activeTab === "Social" ? "text-blue-500" : "text-gray-400"} p-2`}
                >
                  Social
                </div>
                <div
                  onClick={() => setActiveTab("Create")}
                  className={`absolute top-0 left-1/2 w-1/2 h-full flex items-center justify-center rounded-full cursor-pointer ${activeTab === "Create" ? "text-blue-500" : "text-gray-400"} p-2`}
                >
                  Create
                </div>
              </div>
            </div>) :
            (
              <Link href="/">
                <svg 
                  className="w-6 h-6 text-gray-800 dark:text-white mb-2 md:mb-0"
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="#0883C6"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                </svg>
              </Link>
          )}
        </div>

          <div id="global-nav-right" className="flex w-1/5 md:w-1/5 gap-3 items-center justify-center p-2 border border-slate-700">
          <div className="flex items-center">
            {session && (
              <div className="relative">
                <div 
                  onClick={toggleUserDropdown} 
                  style={{ cursor: 'pointer' }} // Make the mouse change to a pointer when hovering
                >
                  <ProfileImage user={ session.user } size={32} />
                </div>
                {showDropdown && (
                  <div ref={dropdownRef}  className="absolute right-0 md:right-auto md:left-0 mt-2 w-48 rounded-md shadow-lg z-30 bg-slate-50">
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => signOut()}>Sign Out</button>
                    <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => setShowUserNameModal(true)}>Change User Name</button>
                    <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
                  </div>
                )}
              </div>
            )}
            {!session && (
              <div>
                <button className="bg-blue-500 text-white rounded py-1 px-2 text-center text-sm" onClick={() => setShowSignInModal(true)}>Sign In</button>
              </div>
            )}
            <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
            <NavBarUserDeleteModal showDeleteModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={deleteUserMutation} />
            <NavBarUserNameModal showModal={showUserNameModal} onClose={() => setShowUserNameModal(false)} />
          </div>
        </div>
      </div>
    )
} 

/*
<a href="https://forms.gle/WPq2stK3YBDcggHw5" target="_blank" rel="noopener noreferrer">
  <button className="bg-green-500 text-white rounded py-1 px-2 text-center text-sm">
    Feedback
  </button>
</a>

<input 
  className="outline-none grow grey-background hidden text-xs md:flex search-max-growth" 
  placeholder="Search Riples" 
  type="text"          
*/