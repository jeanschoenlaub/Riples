import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

const NavBar = () => {
  const {user} = useUser()

  return ( 
    <div id="global-nav" className="border-b border-slate-700 p-2 flex justify-between items-center">
      <div id="nav-profile-image" className="flex gap-3 items-center"> 
        <div>
          <img 
            src="/test.png" 
            alt="Profile Image" 
            className="h-10 w-10 rounded-full"
          />
        </div>
        
        <input 
          className="outline-none grow-0 grey-background" 
          placeholder="Search" 
          role="combobox" 
          aria-autocomplete="list" 
          aria-label="Search" 
          aria-activedescendant="" 
          aria-expanded="false" 
          type="text"
        />

        {user?.imageUrl && 
          <img 
              src={user.imageUrl} 
              alt="Profile Image" 
              className="h-10 w-10 rounded-full"
            />
        }
      </div>
      <div className="flex items-center">
          {!user && <SignInButton />}
          {user && <SignOutButton />}
      </div>
  </div>
  )
} 

export default function Home() {
  const { data, isLoading } = api.projects.getAll.useQuery();

  if (isLoading ) return(<div> Loading ... </div>)

  if (!data) return(<div> Something went wrong</div>)


  const { user } = useUser();


  return (
    <>
      <Head>
          <title>Riples - Collaborate on Projects & Join Creative Bubbles</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Riples is a social platform where creators share projects, inviting others to join their collaborative circles. Dive into a ripple and make waves together!" />
          <meta name="keywords" content="Riples, collaboration, projects, social app, create, join, collaborate, bubbles, ripples, community" />
          <meta name="author" content="Riples Team" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="w-full h-full">
          <div>
            <NavBar></NavBar>
          </div>
          <div className="w-full border-x justify-center border-slate-700 md:max-w-2xl flex flex-col">
            {/* proj get all data */}
            {data?.map((project) => (
                <div className="border-b border-slate-700 p-4" key={project.id}>
                  {project.title} 
                </div>
                
              ) )}
          </div>
        </div>
      </main>
    </>
  );
}
