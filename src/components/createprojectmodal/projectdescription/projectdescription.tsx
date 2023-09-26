import MultiSelect from "~/components/reusables/multiselect";
import ToggleSwitch from "~/components/reusables/toogleswitch";
import Tooltip from "~/components/reusables/tooltip";
import projectClassifications from "~/utils/constants/projectclassifications";

interface ProjectDescriptionComponentProps {
      projectName: string;
      setProjectName: React.Dispatch<React.SetStateAction<string>>;
      projectDescription: string;
      setProjectDescription: React.Dispatch<React.SetStateAction<string>>;
      isSolo: boolean;
      setIsSolo: React.Dispatch<React.SetStateAction<boolean>>;
      isPrivate: boolean;
      tags: string[];
      setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
      onTagsChange: (tasks: string[]) => void;
      isLoading: boolean;
  }

interface OptionType {
  value: string;
  label: string;
}
  
const ProjectDescriptionComponent: React.FC<ProjectDescriptionComponentProps> = ({
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    isSolo,
    setIsSolo,
    isPrivate,
    setIsPrivate,
    tags,
    onTagsChange,
    isLoading
  }) => 
  {
    const selectedTags: OptionType[] = tags.map(tag => ({ value: tag, label: tag }));
    const renderProjectVisibilityDescription = () => {
        if (isSolo && !isPrivate) {
            return (
                <em>
                  Your project will be visible to other users, but only you can manage and edit its components. You will be able to share your project updates &#40;riples&#41; on the feed.
                </em>
            );
        } else if (isSolo && isPrivate) {
            return (
                <em>
                  Your project will be visible only to you. You won&apos;t be able to share your project updates &#40;riples&#41; on the feed.
                </em>
            );
        } else if (!isSolo && !isPrivate) {
            return (
                <em>
                    Your project will be visible for everyone, but editable only by you and project collaborators. You will be able to share your project updates &#40;riples&#41; on the feed.
                </em>
            );
        } else {
            return (
                <em>
                    Your project will be visible only to you and accepted project collaborators. You won&apos;t be able to share your project updates &#40;riples&#41; on the feed.
                </em>
            );
        }
    };
    return (
    <div>
        <div className="container mx-auto ">
            <div className="p-4 rounded-lg shadow-lg bg-gray-100">
                <div id="create-projec-modal-project-name-and-content">
                    <div className="text-center mb-4">
                        <h1 className="text-xl font-semibold"> Create a Project </h1>
                    </div>
                    {/* Project Description */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4 w-30">
                            <label htmlFor="projectName" className="text-base font-semibold mr-3 w-30">
                                Project Name *
                            </label>
                            <input
                                id="projectName"
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className={`flex-grow p-1 rounded border textInput ${isLoading ? 'cursor-not-allowed' : ''}`}
                                maxLength={50}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-start w-30">
                            <label htmlFor="projectDescription" className="text-base font-semibold mr-3">
                                The Story <span className="text-gray-500 text-sm">	&#40;optional&#41;</span>
                            </label>
                            <textarea
                                id="projectDescription"
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                className={`w-full p-1 rounded border textareaInput ${isLoading ? 'cursor-not-allowed' : ''}`}
                                rows={2}
                                maxLength={10000}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
                {/* Project Setting */}
                <div id="project-access-and-visibility" className="flex flex-col md:flex-row  items-center justify-between border-t py-4 border-gray-300">
                    <div id="project-access-label-and-toogle" className="flex items-center justify-between mb-4 md:mb-0">
                        <div id="project-access-label" className="flex mr-2 items-center">
                              <svg className="w-5 h-5 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
                              </svg>
                            Access
                            <Tooltip content="Impacts the accessibility of collaboration tabs (like tasks). Can be changed later." width="200px">
                                <span>
                                    <svg className="w-4 h-4 ml-1 mb-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                </span>
                            </Tooltip>
                        </div>
                        <div id="project-access-toggle" className="flex mr-2">
                            <ToggleSwitch 
                                activeTab={isSolo ? "Solo" : "Collab"} 
                                setActiveTab={(value) => setIsSolo(value === "Solo")} 
                                option1="Solo" 
                                option2="Collab" 
                                background="bg-gray-100"
                            />
                        </div>
                    </div>

                    <div id="project-visibility-label-and-toggle" className="flex items-center justify-between">
                        <div id="project-visibility-label" className="flex mr-2 items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                            </svg>
                            Visibility
                            <Tooltip content="Impacts who can see your projects. Can be changed later." width="200px">
                                <span>
                                    <svg className="w-4 h-4 ml-1 mb-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                </span>
                            </Tooltip>
                        </div>
                        <div id="project-visibility-toggle" className="flex mr-2">
                            <ToggleSwitch 
                                activeTab={isPrivate ? "Private" : "Public"} 
                                setActiveTab={(value) => setIsPrivate(value === "Private")} 
                                option1="Private" 
                                option2="Public"
                                background="bg-gray-100" 
                            />
                        </div>
                    </div>
                </div>
                <div className="text-sm mb-4">
                    {renderProjectVisibilityDescription()}
                </div>
                {/* Project Tags */}
                <div className="mt-6 space-y-2 border-t py-2 border-gray-300">
                        <label htmlFor="projectTaGs" className="text-base font-semibold mb-2">  
                            Project Tags <span className="text-gray-500 text-sm">	&#40;optional&#41;</span>
                        </label>
                        <MultiSelect
                          options={projectClassifications}
                          value={selectedTags}
                          onChange={(selected) => {
                          // Convert OptionType[] back to string[] for onTagsChange
                          if (selected) {
                              onTagsChange(selected.map(option => option.value));
                          } else {
                              onTagsChange([]);
                          }
                          }}
                          maxSelection={5}
                          placeholder="Add tags..."
                      />
                  </div>
                
            </div>
        </div>
    </div>
  );
};

export default ProjectDescriptionComponent;
  