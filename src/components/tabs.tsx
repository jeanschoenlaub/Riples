import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { AboutSVG, AdminSVG, ProjectsSVG, RiplesSVG } from './svg';
import { TaskSVG } from './svg-stroke';

interface TabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  riples? : string;  // optional props
  projects? : string;
  collab?: boolean; 
  admin?: boolean; 
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, riples, projects, collab, admin}) => {
  return (
    <div id="project-main-tabs" className="border-b border-gray-200 ">
       <ul className="flex whitespace-nowrap overflow-x-auto -mb-px text-sm font-medium text-center text-gray-500 ">
        {/* ABOUT TAB */}
        <li className="mr-1">
          <button
            onClick={() => setActiveTab('about')}
            className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-xl ${activeTab === 'about' ? 'text-blue-600 bg-sky-200 border-blue-300' : 'text-gray-500 bg-gray-200 border-transparent'}`}>
            {activeTab === 'about' ? 
                <AboutSVG width="4" height="4" marginRight='2' colorFillHex='#2563eb'></AboutSVG> // Blue color
                :<AboutSVG width="4" height="4" marginRight='2' colorFillHex='#9CA3AF'></AboutSVG>  // Gray color
            }
            About
          </button>
        </li>

        {/*  CONDITIONAL RIPLES TAB */}
        {riples && ( <li className="mr-1">
          <button
            onClick={() => setActiveTab('riples')}
            className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-xl ${activeTab === 'riples' ? 'text-blue-600 bg-sky-200 border-blue-300' : 'text-gray-500 bg-gray-200 border-transparent'}`}>
            {activeTab === 'riples' ? 
                <RiplesSVG width="4" height="4" marginRight='2' colorFillHex='#2563eb'></RiplesSVG> // Blue color
                :<RiplesSVG width="4" height="4" marginRight='2' colorFillHex='#9CA3AF'></RiplesSVG>  // Gray color
            }
            Riples
          </button>
        </li>
        )}

        {/*  CONDITIONAL PROJECTS TAB */}
        {projects && ( <li className="mr-1">
          <button
            onClick={() => setActiveTab('projects')}
            className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-xl ${activeTab === 'projects' ? 'text-blue-600 bg-sky-200 border-blue-300' : 'text-gray-500 bg-gray-200 border-transparent'}`}>
            {activeTab === 'projects' ? 
                <ProjectsSVG width="4" height="4" marginRight='2' colorFillHex='#2563eb'></ProjectsSVG> // Blue
                :<ProjectsSVG width="4" height="4" marginRight='2' colorFillHex='#9CA3AF'></ProjectsSVG>  // Gray colors
            }
            Projects
          </button>
        </li>
        )}

        {/* CONDITIONAL TAB COLLAB */}
        {collab && (
            <li className="mr-1">
                <button
                      id="project-main-tabs-tasks"
                      onClick={() => setActiveTab('collab')}
                      className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-xl ${activeTab === 'collab' ? 'text-blue-600 bg-sky-200 border-blue-300' : 'text-gray-500 bg-gray-200 border-transparent'}`}>
                  {activeTab === 'collab' ? 
                      <TaskSVG width="4" height="4" marginRight='2' colorStrokeHex='#2563eb'></TaskSVG> // Blue
                      :<TaskSVG width="4" height="4" marginRight='2' colorStrokeHex='#9CA3AF'></TaskSVG>  // Gray colors
                  }
                  Tasks
              </button>
              </li>
        )}

        {/* CONDITIONAL TAB ADMIN */}
        {admin&& (
            <li className="mr-1">
                <button
                      onClick={() => setActiveTab('admin')}
                      className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-xl ${activeTab === 'admin' ? 'text-blue-600 bg-sky-200 border-blue-300' : 'text-gray-500 bg-gray-200 border-transparent'}`}>
                  {activeTab === 'admin' ? 
                      <AdminSVG width="4" height="4" marginRight='2' colorFillHex='#2563eb'></AdminSVG> // Blue
                      :<AdminSVG width="4" height="4" marginRight='2' colorFillHex='#9CA3AF'></AdminSVG>  // Gray colors
                  }
                  Admin
              </button>
              </li>

        )}

      </ul>
    </div>
  );
};

