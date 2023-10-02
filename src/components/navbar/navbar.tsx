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
import router from "next/router";
import { SideNavProject } from "./sidenavproject";

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
  const [showSideNav, setShowSideNav] = useState(false);
  const dropdownRef = useRef<null | HTMLDivElement>(null);

  const redirectUserPage = () => {
    router.push(`/users/${session?.user.id}`).catch(err => {
        // Handle any errors that might occur during the navigation
        console.error('Failed to redirect:', err);
    });
  };

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
    <div id="global-nav-container" className="flex justify-center w-full h-15">
      {/* LEFT NAV */}
      {/* Show on large screens */}
      <div id="global-nav-left-large-screen" className="hidden md:flex w-1/4 gap-3 justify-center items-center p-2 border border-slate-700">
        <div className="w-8 h-8">
        <Link href="/about/riples">
          <Image 
              src="/images/logo_256x256.png" 
              alt="Riple logo" 
              width={256}
              height={256}
          />
        </Link>
        </div>
        <div>
          <Link href="/about/riples">
              {'About Riples'}
          </Link>
        </div>
      </div>
      <div id="global-nav-left-small screen" className="flex md:hidden w-1/5 gap-3 justify-center items-center p-2 border border-slate-700">
       {/* Show on small screens */}
      <button onClick={() => setShowSideNav(!showSideNav)} className="px-2 py-2 rounded-lg bg-blue-500">
        <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
      </svg>
      </button>
      </div>

      {/* MIDDLE NAV */}
      <div id="global-nav-mid" className="flex flex-col md:flex-row w-3/5 md:w-1/2 justify-center items-center gap-3 p-2 border border-slate-700">
        {/* Toogle Social / Create if optional parameters active tab otherwise home*/}
        {activeTab && setActiveTab ? 
            (<ToggleSwitch id="navbartoggle" activeTab={activeTab} setActiveTab={setActiveTab} option1="Social" option2="Create" inBetween={ToogleinBetween}></ToggleSwitch>) :
            (<ToggleSwitch id="navbartoggle" option1="Social" option2="Create" inBetween={ToogleinBetween}></ToggleSwitch>)
        }
      </div>
          <div id="global-nav-right" className="flex w-1/5 md:w-1/4 gap-3 items-center justify-center p-2 border border-slate-700">
          <div className="flex items-center">
            {session && (
              <div className="relative">
                <div id="userdropdown"
                  onClick={toggleUserDropdown} 
                  style={{ cursor: 'pointer' }} // Make the mouse change to a pointer when hovering
                >
                  <ProfileImage user={ session.user } size={32} />
                </div>
                {showDropdown && (
                  <div ref={dropdownRef}  className="absolute right-0 md:right-auto md:left-0 mt-2 w-48 rounded-md shadow-lg z-30 bg-slate-50">
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => signOut()}>Sign Out</button>
                    <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => setShowUserNameModal(true)}>User Settings</button>
                    <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => redirectUserPage()}>Your Portofolio</button>
                    <button className="w-full text-left p-3 border hover:bg-slate-200" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
                  </div>
                )}
              </div>
            )}
            {!session && (
              <div>
                <button className="bg-blue-500 text-white rounded py-1 px-2 md:px-4 text-center text-sm md:text-lg" onClick={() => setShowSignInModal(true)}>Sign In</button>
              </div>
            )}
            <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
            <NavBarUserDeleteModal showDeleteModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={deleteUserMutation} />
            <NavBarUserNameModal showModal={showUserNameModal} onClose={() => setShowUserNameModal(false)} />
            <div className={`fixed top-0 left-0 h-full text-red-600 hover:text-red-800 text-xl transition-transform transform ${showSideNav ? 'translate-x-0' : '-translate-x-full'} w-3/4 bg-white shadow-md z-50 md:hidden flex flex-col`}>
              <div className="flex justify-end p-4">
                  <button onClick={() => setShowSideNav(false)}>&times;</button>
              </div>
              <div className="text-base text-black">
                  Your projects:
                  <SideNavProject onClose={() => setShowSideNav(false)}  />
              </div>
          </div>
        </div>
      </div>
  </div>
  )
} 