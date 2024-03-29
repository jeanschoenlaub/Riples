import type { ReactNode } from 'react';
import Head from 'next/head';
import { GlobalNavBar } from '~/features/navbar/navbar';
import { SideNavProject } from './sidenav-project';
import styles from './layout.module.css';

interface FocusLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  ToogleinBetween?: boolean;
}

export const FocusLayout: React.FC<FocusLayoutProps> = ({
  children,
  title = 'Riples - Collaborate on Projects & Join Creative Bubbles',
  description = 'Riples is a social platform where creators share projects, inviting others to join their collaborative circles. Dive into a ripple and make waves together!',
  keywords = 'Riples, collaboration, projects, social app, create, join, collaborate, bubbles, ripples, community',
  activeTab,
  setActiveTab,
  ToogleinBetween = false
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Riples Team" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center w-full h-screen">
        <div id="nav-container" className="w-full">
          <GlobalNavBar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            ToogleinBetween={ToogleinBetween}
          />
        </div>

        <div id="main-body-container" className="flex justify-center w-full bg-sky-50">
          <div id="project-nav-container" className={`${styles.projectNavContainer} hidden md:flex flex-col w-1/4 p-4`}>
            <SideNavProject></SideNavProject>
          </div>

         <div id="Focus-container" className="flex flex-col  w-full md:w-3/4 g-4 ">
            {/* Different Content Between Social and Create */}
            {children}
          </div>
              
        </div>
          
      </main>
    </>
  );
};


