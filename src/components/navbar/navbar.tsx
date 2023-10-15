import { useSession} from "next-auth/react"
import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";
import ToggleSwitch from "../reusables/toogleswitch";
import { SideNavProject } from "./sidenavproject";
import { MenuSVG } from "../reusables/svgstroke";
import { UserMenu } from "./usermenu";
import { NotificationMenu } from "./notificationmenu";

interface GlobalNavBarProps {
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  ToogleinBetween?: boolean;
}

export const GlobalNavBar: React.FC<GlobalNavBarProps> = ({ activeTab, setActiveTab, ToogleinBetween }) => {
  const { data: session } = useSession();
  const [showSideNav, setShowSideNav] = useState(false);

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
        <MenuSVG width="4" height="4"></MenuSVG>
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
          <div className="flex">
            {session && (
              <div className="flex space-x-2 flex-row items-center">
                  <NotificationMenu></NotificationMenu>
                  <UserMenu></UserMenu>
              </div>
            )}
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