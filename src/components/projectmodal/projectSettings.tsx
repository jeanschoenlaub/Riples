import { useState } from "react";

interface ProjectSettingsComponentProps {

  }
  
const ProjectSettingsComponent: React.FC<ProjectSettingsComponentProps> = ({
    
  }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(""); // Default is empty
    
    // Assuming these are your project categories.
    const projectCategories = ["Web Development", "Data Science", "Design", "Other"];

    return (
    <div>
      <div className="pb-5 text-2xl flex items-center justify-center"> Let's break it down !</div>
      
      <div className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
        <span className="text-base flex items-center space-x-4 w-auto mr-2" aria-label="Project Category">
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
  
  export default ProjectSettingsComponent;
  