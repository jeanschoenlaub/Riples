interface ProjectDescriptionComponentProps {
    projectName: string;
    setProjectName: React.Dispatch<React.SetStateAction<string>>;
    projectDescription: string;
    setProjectDescription: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
  }
  
  const ProjectDescriptionComponent: React.FC<ProjectDescriptionComponentProps> = ({
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    isLoading
  }) => {

    return (
      <div>
        <div className="pb-5 text-2xl flex items-center justify-center"> What are we creating ?</div>
        <label className="block text-base mb-3 justify-br" aria-label="Project Title">
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

        <label className="block text-base mb-3 justify-br" aria-label="Project Description">
        Project Description:
        <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className={`w-full p-2 mt-1 rounded border ${isLoading ? 'cursor-not-allowed' : ''}`}
            rows={5}
            maxLength={10000}
            disabled={isLoading}
        />
        </label>
      </div>
    );
  };
  
  export default ProjectDescriptionComponent;
  