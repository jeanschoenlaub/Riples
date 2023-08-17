import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

const NavBar = () => {
  const {user} = useUser()

  return ( 
    <div id="global-nav" className="flex justify-center w-full">
      <div id="global-nav-left" className="flex w-1/4 p-4 gap-3 border border-slate-700">
        <div>
          <img 
            src="/logo_128x128.png" 
            alt="Riple logo" 
            className="h-10 w-10"
          />
        </div>
        
        <input 
          className="outline-none grow grey-background" 
          placeholder="Search" 
          role="combobox" 
          aria-autocomplete="list" 
          aria-label="Search" 
          aria-activedescendant="" 
          aria-expanded="false" 
          type="text"
        />
      </div>

      <div id="global-nav-mid" className="flex w-1/2 p-4  gap-3 border border-slate-700">
      </div>
        
      <div id="global-nav-right" className="flex w-1/4 p-4 gap-3 border border-slate-700">
        {user?.imageUrl && 
            <img 
                src={user.imageUrl} 
                alt="Profile Image" 
                className="h-10 w-10 rounded-full"
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

const Feed = () => {
  const { data, isLoading } = api.projects.getAll.useQuery();

  if (isLoading ) return(<div> Loading ... </div>)

  if (!data) return(<div> Something went wrong</div>)

  return ( 
    <div>
    {/* proj get all data */}
    {data?.map((project) => (
      <div className="border-b border-slate-700 p-4" key={project.id}>
        {project.title}
      </div>
    ))}
  </div>
  )
} 

export default function Home() {
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
      
      <main className="flex flex-col items-center w-full h-screen">
    <div className="w-full">
        <NavBar></NavBar>
    </div>

    <div className="flex justify-center w-full">
        <div id="quick-links" className="flex flex-col w-1/4 p-4 border border-slate-700">
            <h1>Quick Links</h1>
        </div>
        
        <div id="feed" className="flex flex-col w-1/2 p-4 border border-slate-700">
            <Feed></Feed>
        </div>
        
        <div id="future-content" className="flex flex-col w-1/4 p-4 border border-slate-700">
            <h1>Future Content</h1>
        </div>
    </div>
</main>

    </>
  );
}
