import type { ChangeEvent } from "react";
import { useRef, useEffect } from 'react';

interface ProjectBuildComponentProps {
    tasks: string[];
    onTaskAdd: () => void;
    onTaskDelete: () => void;
    onTasksChange: (tasks: string[]) => void;
    goals: string[];
    onGoalsChange: (goals: string[]) => void;
    onGoalAdd: () => void;
    onGoalDelete: () => void;
    postToFeed: boolean;
    setPostToFeed: (value: boolean) => void;
    postContent: string;
    setPostContent: React.Dispatch<React.SetStateAction<string>>;
    isPrivate: boolean;
}
  
const ProjectBuildComponent: React.FC<ProjectBuildComponentProps> = ({
    tasks,
    onTasksChange,
    onTaskAdd,
    onTaskDelete,
    goals,
    onGoalsChange,
    onGoalAdd,
    onGoalDelete,
    postToFeed,
    setPostToFeed,
    postContent,
    setPostContent,
    isPrivate
}) => {
    //Quite complexe logic for dynamically resizing textarea on programmatic input of text (via taskWizard)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const tasksRefs = useRef<(HTMLTextAreaElement | null)[]>(
        Array(tasks.length).fill(null) as (HTMLTextAreaElement | null)[]
    );
    const goalsRefs = useRef<(HTMLTextAreaElement | null)[]>(
        Array(goals.length).fill(null) as (HTMLTextAreaElement | null)[]
    );
    useEffect(() => {
        tasksRefs.current = Array(tasks.length).fill(null) as (HTMLTextAreaElement | null)[];
    }, [tasks.length]);
    useEffect(() => {
        goalsRefs.current = Array(goals.length).fill(null) as (HTMLTextAreaElement | null)[];
    }, [goals.length]);

    useEffect(() => {
        tasks.forEach((_, index) => {
            const ref = tasksRefs.current[index];
            if (ref instanceof HTMLTextAreaElement) {
                resizeTextarea(ref);
            }
        });
    }, [tasks]);
    
    useEffect(() => {
        goals.forEach((_, index) => {
            const ref = tasksRefs.current[index];
            if (ref instanceof HTMLTextAreaElement) {
                resizeTextarea(ref);
            }
        });
    }, [goals]);
    
    
    useEffect(() => {
        resizeTextarea(textareaRef.current);
    }, [postContent]);
    

    useEffect(() => {
        console.log(tasksRefs.current);
        console.log(goalsRefs.current);
    }, [tasks, goals]);

    function resizeTextarea(textarea?: HTMLTextAreaElement | null) {
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }
    

    function handleTaskChange(e: ChangeEvent<HTMLTextAreaElement>, index: number) {
        const updatedTasks = [...tasks];
        updatedTasks[index] = e.target.value;
        onTasksChange(updatedTasks);
        resizeTextarea(tasksRefs.current[index]);
    }
    
    function handleGoalChange(e: ChangeEvent<HTMLTextAreaElement>, index: number) {
        const updatedGoals = [...goals];
        updatedGoals[index] = e.target.value;
        onGoalsChange(updatedGoals);
        resizeTextarea(goalsRefs.current[index]);
    }
    
    function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setPostContent(e.target.value);
        resizeTextarea(textareaRef.current);
    }

    return (
      <div>
          <div className="container mx-auto ">
              <div className="p-4 rounded-lg shadow-lg bg-gray-100">
                    <div className="text-center mb-4">
                        <h1 className="text-xl font-semibold"> Break it Down! </h1>
                    </div>
                    {/* Project Tasks */}
                    <div id="project-build-tasks" className="flex items-start mb-1 w-30 ">
                        <div className="flex-grow flex-col space-y-3 mb-4">
                            <label htmlFor="projectTasks" className="text-base font-semibold mb-2">  
                                Project Tasks <span className="text-gray-500 text-sm">	&#40;optional&#41;</span>
                            </label>
                            
                            <div className="flex space-x-4 items-end">  
                                <div className="flex-grow flex flex-col space-y-2">
                                    {tasks.map((task, index) => (
                                        <textarea
                                            key={index}
                                            value={task}
                                            ref={el => tasksRefs.current[index] = el}
                                            rows={1}
                                            placeholder={`Task ${index + 1}`}
                                            style={{ overflow: 'hidden', resize: 'none' }}  // hide scrollbar and disable manual resize
                                            className={`flex-grow p-1 rounded border`}
                                            onChange={(e) => handleTaskChange(e, index)}
                                        />
                                    ))}
                                </div>

                                <div className="space-y-2">  
                                    <button 
                                        onClick={onTaskAdd} 
                                        className="p-2 focus:outline-none  text-white rounded transition duration-150">
                                            <svg className="w-4 h-4 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#008000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                    </button>
                                    <button 
                                        onClick={onTaskDelete} 
                                        className="p-2 focus:outline-none text-white rounded transition duration-150">
                                        <svg className="w-4 h-4 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                            <path stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Project Goals */}
                    <div className="flex items-start mb-1 w-30 border-t py-2 border-gray-300">
                        <div className="flex-grow flex-col ">
                            <label htmlFor="projectGoals" className="text-base font-semibold ">  
                                Project Goals <span className="text-gray-500 text-sm">	&#40;optional&#41;</span>
                            </label>
                            
                            <div className="flex space-x-4 space-y-2 items-end">  
                                <div className="flex-grow flex flex-col space-y-2">
                                    {goals.map((goal, index) => (
                                        <textarea
                                        key={index}
                                        ref={el => goalsRefs.current[index] = el}
                                        value={goal}
                                        rows={1}
                                        placeholder={`Goal ${index + 1}`}
                                        style={{ overflow: 'hidden', resize: 'none' }}  // hide scrollbar and disable manual resize
                                        className={`flex-grow p-1 rounded border`}
                                        onChange={(e) => handleGoalChange(e, index)}
                                    />
                                    ))}
                                </div>

                                <div className="space-y-2">  
                                    <button 
                                        onClick={onGoalAdd} 
                                        className="p-2 focus:outline-none  text-white rounded transition duration-150">
                                            <svg className="w-4 h-4 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#008000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                    </button>
                                    <button 
                                        onClick={onGoalDelete} 
                                        className="p-2 focus:outline-none text-white rounded transition duration-150">
                                        <svg className="w-4 h-4 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                            <path stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Checkbox & input for posting to feed */}
                    <div className="flex items-center mt-4">
                        <input 
                            type="checkbox" 
                            id="postToFeed" 
                            className={`form-checkbox h-4 w-4 ${isPrivate ? 'text-gray-400' : 'text-indigo-600'}`}
                            checked={postToFeed}
                            disabled={isPrivate} // Disable the checkbox if isPrivate is true
                            onChange={(e) => setPostToFeed(e.target.checked)} 
                        />
                        <label htmlFor="postToFeed" className={`ml-2 text-sm ${isPrivate ? 'text-gray-400' : 'text-gray-900'}`}>
                            Post this project creation to the feed &#40;only for public projects&#41;
                        </label>
                    </div>
                    {/* Text input for posting to feed */}
                    <div className="flex items-center mt-4">
                        <textarea 
                            ref={textareaRef}
                            style={{ overflow: 'hidden', resize: 'none' }}  // hide scrollbar and disable manual resize
                            value={postContent}
                            id="postToFeed" 
                            rows={1}
                            placeholder={`This is the cool new project I am working on, I/we will ...`}
                            className={`flex-grow p-1 rounded border`}
                            disabled={isPrivate} 
                            onChange={handleContentChange} 
                        />
                    </div>
                    <label htmlFor="postToFeed" className={`ml-2 text-sm ${isPrivate ? 'text-gray-400' : 'text-gray-900'}`}>
                            You can add a text to your post
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ProjectBuildComponent;
