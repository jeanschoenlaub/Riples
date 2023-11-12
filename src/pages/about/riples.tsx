import dynamic from 'next/dynamic';
import { useState } from "react";
import { NavBarSignInModal } from "~/features/navbar/signinmodal";
import { useSession } from "next-auth/react";
import { FullPageLayout } from "~/layout/full-page-layout";

export default function AboutRiples() {
  const DynamicReactPlayer = dynamic(() => import('react-player'), {
    ssr: false, // This will load the component only on client side
  });
  const { data: session } = useSession();

  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <>
      <FullPageLayout ToogleinBetween={true}>
          <div className="flex flex-col bg-sky-50 w-full ">
            <section className="mt-4">
                <div className="gap-8 items-center py-2 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-4 lg:px-6">
                    <div className="w-full">
                    {typeof window !== 'undefined' && (
                          <DynamicReactPlayer
                            url="https://youtu.be/lbyVFgKV3Oc"
                            controls={true}
                            playing={false}
                            width={"w-1/2"}
                          />
                        )}
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"> Turning ideas into realities.</h2>
                        <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400"> Ever felt your ideas were lost in the noise or isolated in your creative journey ? With Riples, your ideas echo louder. </p>
                        <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400"> Try a revolutionary platform that streamlines your projects, enables you to collaborate and share with a vibrant community. Whether you want to create the next big thing, get real-life experience in collaborative projects, or follow your friends on their creative adventures, Riples empowers it&apos;s community to turn visions into reality. </p>
                    </div>
                </div>
              
                <div className=" px-4 mx-auto max-w-screen-xl sm:py-8 lg:px-6">
                    <div className="max-w-screen-md mb-4 lg:mb-8">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"> What sets us apart</h2>
                   </div>
                   <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                   <div className="flex flex-col space-y-4">
                <h3 className="mb-2 text-xl font-bold dark:text-white inline-flex items-center space-x-4">
                    <div className="flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 14h12M1 4h12M6.5 16.5h1M2 1h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
                        </svg>
                    </div>
                    Leveraging your time
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Tired of wasting time on social media? So are we. On Riples, you will not only unleash your creative potential but also develop meaningful relationships. Find purpose beyond the scroll.</p>
            </div>

            <div className="flex flex-col space-y-4">
                <h3 className="mb-2 text-xl font-bold dark:text-white inline-flex items-center space-x-4">
                    <div className="flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.333 6.764a3 3 0 1 1 3.141-5.023M2.5 16H1v-2a4 4 0 0 1 4-4m7.379-8.121a3 3 0 1 1 2.976 5M15 10a4 4 0 0 1 4 4v2h-1.761M13 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-4 6h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
                        </svg>
                    </div>
                    Redefining Collaboration
                </h3>
                <p className="text-gray-500 dark:text-gray-400">With Riples, you can share and follow ideas, and work with people from around the world seamlessly, all within a user-friendly interface. Bringing collective intelligence to your doorstep.</p>
            </div>

            <div className="flex flex-col space-y-4">
                <h3 className="mb-2 text-xl font-bold dark:text-white inline-flex items-center space-x-4">
                    <div className="flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    </div>
                    Unified Project Hub
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Forget the hassle of juggling folders, we make all your projects easily accessible across devices. Plus, showcase your portfolio to the world, highlighting your contributions.</p>
            </div>
            </div>
            </div>
              </section>
              {!session && (
              <section className="bg-sky-50 dark:bg-gray-900">
              <div className="py-0 px-4 mx-auto max-w-screen-xl sm:py-0 lg:px-6">
                  <div className="mx-auto max-w-screen-sm text-center">
                      <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900 dark:text-white">Start using Riples today</h2>
                      <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">It&apos;s Free ! No credit card required.</p>
                      <div>
              <button className="bg-blue-500 text-white rounded mb-5 py-2 px-10 md:px-4 text-center text-3xl md:text-2xl" onClick={() => setShowSignInModal(true)}>Sign In</button>
            </div></div>
                
              </div>
          </section>
            )}
                 
            <div className="flex flex-col mt-8 mb-4 space-y-4 items-center">
                <div className="flex space-x-4">
                    <a href="https://forms.gle/WPq2stK3YBDcggHw5" target="_blank" rel="noopener noreferrer">
                        <button className="bg-green-500 text-white rounded py-1 px-2 text-center text-sm">
                          Feedback
                        </button>
                      </a>
                    <div className="text-xl text-gray-700 dark:text-gray-300">or Contact us: <a href="mailto:admin@riples.app" className="text-blue-500 hover:underline">admin@riples.app</a></div>
                </div>
            </div>
          </div>
       <NavBarSignInModal showModal={showSignInModal} onClose={() => setShowSignInModal(false)} />
      </FullPageLayout>
    </>
  );
}