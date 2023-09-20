import React from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  riples? : string;  // optional props
  projects? : string;
  collab?: string; 
  admin?: boolean; 
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, riples, projects, collab, admin}) => {
  return (
    <div id="project-main-tabs" className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        
        {/* ABOUT TAB */}
        <li className="mr-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 'about' ? 'text-blue-600 border-blue-300' : 'text-gray-500 border-transparent'}`}>
            <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={activeTab === 'about' ? '#2563eb' : '#9CA3AF'}  // Blue and Gray colors
                viewBox="0 0 20 20"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.546l3.2 3.659a1 1 0 0 0 1.506 0L13.454 14H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-8 10H5a1 1 0 0 1 0-2h5a1 1 0 1 1 0 2Zm5-4H5a1 1 0 0 1 0-2h10a1 1 0 1 1 0 2Z" />
            </svg>
            About
          </button>
        </li>

        {/*  CONDITIONAL RIPLES TAB */}
        {riples && ( <li className="mr-2">
          <button
            onClick={() => setActiveTab('riples')}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 'riples' ? 'text-blue-600 border-blue-300' : 'text-gray-500 border-transparent'}`}>
            <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={activeTab === 'riples' ? '#2563eb' : '#9CA3AF'}  // Blue and Gray colors
                viewBox="0 0 20 20"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            Riples
          </button>
        </li>
        )}

        {/*  CONDITIONAL PROJECTS TAB */}
        {projects && ( <li className="mr-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 'projects' ? 'text-blue-600 border-blue-300' : 'text-gray-500 border-transparent'}`}>
            <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={activeTab === 'projects' ? '#2563eb' : '#9CA3AF'}  // Blue and Gray colors
                viewBox="0 0 20 20"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            Projects
          </button>
        </li>
        )}

        {/* CONDITIONAL TAB COLLAB */}
        {collab && (
            <li className="mr-2">
                <button
                      onClick={() => setActiveTab('collab')}
                      className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 'collab' ? 'text-blue-600 border-blue-300' : 'text-gray-500 border-transparent'}`}>
                  <svg
                      className="w-4 h-4 mr-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill={activeTab === 'collab' ? '#2563eb' : '#9CA3AF'}  // Blue and Gray colors
                      viewBox="0 0 20 20"
                  >
                  <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
                  </svg>
                  Collaboration
              </button>
              </li>
        )}

        {/* CONDITIONAL TAB COLLAB */}
        {admin&& (
            <li className="mr-2">
                <button
                      onClick={() => setActiveTab('admin')}
                      className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === 'admin' ? 'text-blue-600 border-blue-300' : 'text-gray-500 border-transparent'}`}>
                  <svg
                      className="w-4 h-4 mr-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill={activeTab === 'admin' ? '#2563eb' : '#9CA3AF'}  // Blue and Gray colors
                      viewBox="0 0 20 20"
                  >
                  <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                  </svg>
                  Admin
              </button>
              </li>

        )}

      </ul>
    </div>
  );
};

