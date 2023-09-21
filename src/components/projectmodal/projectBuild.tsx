import { useState } from "react";

interface ProjectBuildComponentProps {
    projectName: string;
    projectDescription: string;
  }
  
const ProjectBuildComponent: React.FC<ProjectBuildComponentProps> = ({
    projectName,
    projectDescription: string
  }) => {
    const [taskCount, setTaskCount] = useState<number>(5); // Default value is 5 tasks
    const [selectedCategory, setSelectedCategory] = useState<string>(""); // Default is empty

    console.log("Im run too")
    
    // Assuming these are your project categories.
    const projectCategories = ["Web Development", "Data Science", "Design", "Other"];

    return (
    <div>
      <div className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
        <span className="text-sm flex items-center space-x-4 w-auto mr-2" aria-label="Task Count">
            Let's break down your project into:
            <select 
            value={taskCount} 
            onChange={(e) => {
                setTaskCount(parseInt(e.target.value));
            }}
            >
            <option value={5}>5 tasks</option>
            <option value={10}>10 tasks</option>
            </select>
        </span>
        </div>

        <div className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
        <span className="text-sm flex items-center space-x-4 w-auto mr-2" aria-label="Project Category">
            Project Category:
            <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            >
            {projectCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
            ))}
            </select>
        </span>
        </div>
    </div>
    );
  };
  
  export default ProjectBuildComponent;
  