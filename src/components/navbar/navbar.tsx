import { useSession, signOut } from "next-auth/react"
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NavBarSignInModal } from "./signinmodal";
import { ProfileImage } from '~/components/reusables/profileimage'; // Import ProfileImage component
import { NavBarUserDeleteModal } from "./userdeletemodal";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { handleZodError } from "~/utils/error-handling";
import { NavBarUserNameModal } from "./usernamemodal";
import ToggleSwitch from "../reusables/toogleswitch";

interface GlobalNavBarProps {
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  ToogleinBetween?: boolean;
}

export const GlobalNavBar: React.FC<GlobalNavBarProps> = ({ activeTab, setActiveTab, ToogleinBetween }) => {
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
      <div id="global-nav-left" className="flex w-2/5 md:w-1/4 gap-3 justify-center items-center p-2 border border-slate-700">
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
      <div id="global-nav-mid" className="flex flex-col md:flex-row w-2/5 md:w-1/2 justify-center items-center gap-3 p-2 border border-slate-700">
        {/* Toogle Social / Create if optional parameters active tab otherwise home*/}
        {activeTab && setActiveTab ? 
            (<ToggleSwitch activeTab={activeTab} setActiveTab={setActiveTab} option1="Social" option2="Create" inBetween={ToogleinBetween}></ToggleSwitch>) :
            (<ToggleSwitch option1="Social" option2="Create" inBetween={ToogleinBetween}></ToggleSwitch>)
        }
      </div>
          <div id="global-nav-right" className="flex w-1/5 md:w-1/4 gap-3 items-center justify-center p-2 border border-slate-700">
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