import MultiSelect from "~/components/multi-select";
import { AddUserSVG, PrivateSVG, PublicSVG, SingleUserSVG } from "~/components/svg";
import ToggleSwitch from "~/components/toogle-switch";
import Tooltip from "~/components/tooltip";
import {sortedProjectClassifications} from "~/utils/constants/projectclassifications";

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
                <div id="project-access-and-visibility-with-text"> 
                    <div id="project-access-and-visibility" className="flex-row  items-center justify-between border-t space-y-2 py-4 border-gray-300">
                        <div id="project-visibility-label-and-toggle" className="flex items-center justify-center">
                            <div id="project-visibility-label" className="flex mr-2 items-center">
                                {isPrivate ? 
                                <PrivateSVG width="5" height="5" marginRight='2'></PrivateSVG> // Gray color
                                : <PublicSVG  width="5" height="5" marginRight='2'></PublicSVG>}
                                Visibility
                                <Tooltip content="Impacts who can see your projects. Can be changed later." width="200px">
                                    <span>
                                        <svg className="w-4 h-4 ml-1 mb-4 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
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
                    <div id="project-access-label-and-toogle" className="flex items-center justify-center mb-4 md:mb-0">
                            <div id="project-access-label" className="flex mr-2 items-center">
                            {isSolo ? 
                            <SingleUserSVG width="5" height="5" marginRight='2'></SingleUserSVG> 
                            : <AddUserSVG  width="5" height="5" marginRight='2'></AddUserSVG>}
                                Access
                                <Tooltip content="Impacts the accessibility of collaboration tabs (like tasks). Can be changed later." width="200px">
                                    <span>
                                        <svg className="w-4 h-4 ml-1 mb-4 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                    </span>
                                </Tooltip>
                            </div>
                            <div id="project-access-toggle" className="flex mr-2 ml-2">
                                <ToggleSwitch 
                                    activeTab={isSolo ? "Solo" : "Collab"} 
                                    setActiveTab={(value) => setIsSolo(value === "Solo")} 
                                    option1="Solo" 
                                    option2="Collab" 
                                    background="bg-gray-100"
                                    width="w-40"
                                />
                            </div>
                        </div>
                    <div className="text-sm mb-4">
                        {renderProjectVisibilityDescription()}
                    </div>
                </div>
               
                {/* Project Tags */}
                <div id="project-tags" className="mt-6 space-y-2 border-t py-2 border-gray-300">
                        <label htmlFor="projectTaGs" className="text-base font-semibold mb-2">  
                            Project Tags 
                            <span className="text-gray-500 text-sm"> &#40;optional&#41; </span>  
                        </label>
                       
                        <MultiSelect
                          options={sortedProjectClassifications}
                          value={selectedTags}
                          disabled={isLoading}
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
  