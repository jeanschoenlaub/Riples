import type { ChangeEvent } from "react";

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
    isLoading: boolean;
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
    isPrivate,
    isLoading
}) => {
    
    function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const textarea = e.target;
        setPostContent(textarea.value);
        
        // Reset the height so scrollHeight can be recalculated
        textarea.style.height = 'auto';
    
        // Set the height to its scroll height (which represents its full content height)
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    return (
      <div>
          <div className="container mx-auto ">
              <div className="p-4 rounded-lg shadow-lg bg-gray-100">
                    <div className="text-center mb-4">
                        <h1 className="text-xl font-semibold"> Break it Down! </h1>
                    </div>
                    {/* Project Tasks */}
                    <div className="flex items-start mb-1 w-30 ">
                        <div className="flex-grow flex-col space-y-3 mb-4">
                            <label htmlFor="projectTasks" className="text-base font-semibold mb-2">  
                                Project Tasks <span className="text-gray-500 text-sm">	&#40;optional&#41;</span>
                            </label>
                            
                            <div className="flex space-x-4 items-end">  
                                <div className="flex-grow flex flex-col space-y-2">
                                    {tasks.map((task, index) => (
                                        <input
                                            key={index}
                                            value={task}
                                            type="text"
                                            placeholder={`Task ${index + 1}`}
                                            className={`flex-grow p-1 rounded border`}
                                            onChange={(e) => {
                                                const updatedTasks = [...tasks];
                                                updatedTasks[index] = e.target.value;
                                                onTasksChange(updatedTasks);
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="space-y-2">  
                                    <button 
                                        onClick={onTaskAdd} 
                                        className="p-2 focus:outline-none  text-white rounded transition duration-150">
                                            <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#008000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                    </button>
                                    <button 
                                        onClick={onTaskDelete} 
                                        className="p-2 focus:outline-none text-white rounded transition duration-150">
                                        <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
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
                                        <input
                                            key={index}
                                            value={goal}
                                            type="text"
                                            placeholder={`Goal ${index + 1}`}
                                            className={`flex-grow p-1 rounded border`}
                                            onChange={(e) => {
                                                const updatedGoals = [...goals];
                                                updatedGoals[index] = e.target.value;
                                                onGoalsChange(updatedGoals);
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="space-y-2">  
                                    <button 
                                        onClick={onGoalAdd} 
                                        className="p-2 focus:outline-none  text-white rounded transition duration-150">
                                            <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#008000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                    </button>
                                    <button 
                                        onClick={onGoalDelete} 
                                        className="p-2 focus:outline-none text-white rounded transition duration-150">
                                        <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
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
                            style={{ overflow: 'hidden', resize: 'none' }}  // hide scrollbar and disable manual resize
                            value={postContent}
                            id="postToFeed" 
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
