import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
import Link from "next/link";

export const GlobalNavBar = () => {
  
  const {user} = useUser()

  return ( 
    <div id="global-nav-container" className="flex justify-center w-full">
          <div id="global-nav-left" className="flex w-1/5 gap-3 items-center p-2 border border-slate-700">
            <div>
              <Link href="/">
                  <Image 
                      src="/images/logo_128x128.png" 
                      alt="Riple logo" 
                      width={32}
                      height={32}
                      objectFit="cover"
                      objectPosition="center"
                  />
              </Link>
            </div>
            
            <input 
                className="outline-none grow grey-background hidden text-xs md:flex" 
                placeholder="Search Riples" 
                type="text"
            />
          </div>

          <div id="global-nav-mid" className="flex w-3/5 gap-3 p-2 border border-slate-700"></div>
            
          <div id="global-nav-right" className="flex w-1/5 gap-3 items-center p-2 border border-slate-700">
              {user?.imageUrl && 
                  <Image 
                      src={user.imageUrl} 
                      alt="Profile Image" 
                      className="rounded-full"
                      width={32}
                      height={32}
                      objectFit="cover"
                      objectPosition="center"
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