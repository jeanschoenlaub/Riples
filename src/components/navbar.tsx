import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
import { LoadingPage } from "./loading";

export const GlobalNavBar = () => {
  
  const {user, isLoaded} = useUser()

  console.log(user)

  return ( 
    <div id="global-nav" className="flex justify-center w-full">
      <div id="global-nav-left" className="flex w-1/4 p-4 gap-3 border border-slate-700">
        <div>
          <Image 
            src="/images/logo_128x128.png" 
            alt="Riple logo" 
            width={40}
            height={40}
          />
        </div>
        
        <input 
          className="outline-none grow grey-background hidden md:flex" 
          placeholder="Search" 
          type="text"
        />
      </div>

      <div id="global-nav-mid" className="flex w-1/2 p-4  gap-3 border border-slate-700"></div>
        
      <div id="global-nav-right" className="flex w-1/4 p-4 gap-3 border border-slate-700">
        {user?.imageUrl && 
            <Image 
                src={user.imageUrl} 
                alt="Profile Image" 
                className="rounded-full"
                width={40}
                height={40}
              />
          }
        <div className="flex items-center">
            {!user && <SignInButton />}
            {user && <SignOutButton />}
        </div>
      </div>
    </div>
    )
  } 