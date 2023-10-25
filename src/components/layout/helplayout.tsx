import type { ReactNode } from "react";
import { GlobalNavBar } from "~/components/navbar/navbar";
import { SideNavProject } from "~/components/navbar/sidenavproject";

interface HelpLayoutProps {
    children: ReactNode;
}

export const HelpLayout: React.FC<HelpLayoutProps> = ({ children }) => {
    return (
        <main className="flex flex-col items-center w-full h-screen">
            <div id="nav-container" className="w-full">
                <GlobalNavBar />
            </div>
            <div id="main-body-container" className="flex justify-center w-full bg-sky-50">
                <div id="project-nav-container" className="hidden md:flex flex-col w-1/4 p-4 ">
                    <SideNavProject />
                </div>
                <div id="feed-container" className="flex flex-col  w-full md:w-3/2 g-4 p-4 ">
                    {children}
                </div>
            </div>
        </main>
    );
};
