import { useState } from "react";
import Image from 'next/image';

interface ProjectBuildComponentProps {
    projectStatus: string;
    setProjectStatus: React.Dispatch<React.SetStateAction<string>>;
    taskCount: number;
    setTaskCount: React.Dispatch<React.SetStateAction<number>>;
    tasks: string[];
    onTasksChange: (tasks: string[]) => void;
  }
  
const ProjectBuildComponent: React.FC<ProjectBuildComponentProps> = ({
    projectStatus,
    setProjectStatus,
    taskCount,
    setTaskCount,
    tasks,
    onTasksChange,
  }) => {
    const [shake, setShake] = useState(false);

    const handleShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 500);  // Remove the shake class after 500ms
    }
      
    return (
    <div>
      <div className="container mx-auto py-2">
            <div className="p-8 rounded-lg shadow-lg bg-gray-100">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-semibold">Step 2</h1>
                    <p>Breaking it down</p>
                </div>
                <div className="mb-6">
                  <div className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
                    <span className="text-base flex items-center space-x-4 w-auto mr-2" aria-label="Project Status">
                        Project Status:
                        <select 
                        value={projectStatus} 
                        onChange={(e) => {
                            setProjectStatus(e.target.value);
                        }}
                        className="rounded-lg text-lg ml-2"
                        >
                        <option value="To-Do">To-Do</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                        </select>
                    </span>
                  </div>
                  {projectStatus != "Done" ? (
                    <div>
                      <div className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
                        <span className="text-base flex items-center space-x-4 w-auto mr-2" aria-label="Task Count">
                            Let's break down your project into:
                            <select 
                                value={taskCount} 
                                onChange={(e) => {
                                  setTaskCount(parseInt(e.target.value));
                                  handleShake();
                                }}
                                className="rounded-lg text-lg ml-2">
                              <option value={0}></option>
                              <option value={3}>3 tasks</option>
                              <option value={5}>5 tasks</option>
                              <option value={10}>10 tasks</option>
                            </select>
                          <button 
                            className={`bg-sky-50 text-white rounded-full px-1 py-1 ml-2 flex items-center ${shake ? 'shake-animation' : ''}`} 
                            onClick={() => { }}
                          >
                            <Image 
                              src="/images/Riple_ai.png" 
                              alt="Riple logo" 
                              width={32}
                              height={32}
                              className={shake ? 'shake-animation' : ''}
                            />
                          </button>
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2 mb-2">
                      {Array.from({ length: taskCount }).map((_, index) => (
                            <input
                              key={index}
                              value={tasks[index] ?? ""}
                              type="text"
                              placeholder={`Task ${index + 1}`}
                              className="p-2 border rounded"
                              onChange={(e) => {
                                const updatedTasks = [...tasks];
                                updatedTasks[index] = e.target.value;
                                onTasksChange(updatedTasks); // Send the updated tasks back to parent
                              }}
                            />
                            ))}
                          </div>
                        </div>) : "" }
                      </div>
                  </div>
              </div>
          </div>
    );
  };
  
  export default ProjectBuildComponent;
  