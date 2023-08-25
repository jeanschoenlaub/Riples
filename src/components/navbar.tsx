import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
import Link from "next/link";

export const GlobalNavBar = () => {
  
  const {user} = useUser()

  return ( 
    <div id="global-nav-container" className="flex justify-center w-full">
      {/* LEFT NAV */}
      <div id="global-nav-left" className="flex w-1/5 gap-3 justify-center items-center p-2 border border-slate-700">
        <Link href="/users/user_2URsJnsYNi5SZ2VMYzVESesLMx5">
          <Image 
              src="/images/logo_128x128.png" 
              alt="Riple logo" 
              width={32}
              height={32}
              objectFit="cover"
              objectPosition="center"
          />
        </Link>
            <div>
              <Link href="/users/user_2URsJnsYNi5SZ2VMYzVESesLMx5">
                 {'About Riples'}
              </Link>
            </div>
          </div>

          <div id="global-nav-mid" className="flex w-3/5  justify-center items-center  gap-3 p-2 border border-slate-700">
            <Link href="/">
              <svg 
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="#0883C6"
                viewBox="0 0 20 20"
                >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
            </Link>
            <input 
                  className="outline-none grow grey-background hidden text-xs md:flex search-max-growth" 
                  placeholder="Search Riples" 
                  type="text"
              />
          </div>
            
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