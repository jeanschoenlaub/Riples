interface ProjectDescriptionComponentProps {
    projectName: string;
    setProjectName: React.Dispatch<React.SetStateAction<string>>;
    projectDescription: string;
    setProjectDescription: React.Dispatch<React.SetStateAction<string>>;
    projectStatus: string;
    setProjectStatus: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
  }
  
  const ProjectDescriptionComponent: React.FC<ProjectDescriptionComponentProps> = ({
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    projectStatus,
    setProjectStatus,
    isLoading
  }) => {
    return (
      <div>
        <div className="pb-5 text-3xl"> Let's Create your project</div>
        <label className="block text-sm mb-3 justify-br" aria-label="Project Title">
        Project Title:
        <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
            maxLength={50}
            disabled={isLoading}
        />
        </label>

        <div className="flex flex-wrap items-center space-x-5 mb-2 md:flex-nowrap">
        <span className="text-sm flex items-center space-x-4 w-auto mr-2" aria-label="Project Status">
            Project Status:
            <select 
            value={projectStatus} 
            onChange={(e) => {
                setProjectStatus(e.target.value);
            }}
            >
            <option value="To-Do">To-Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
            </select>
        </span>
        </div>

        <label className="block text-sm mb-3 justify-br" aria-label="Project Description">
        Project Description:
        <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
            rows={9}
            maxLength={10000}
            disabled={isLoading}
        />
        </label>
      </div>
    );
  };
  
  export default ProjectDescriptionComponent;
  