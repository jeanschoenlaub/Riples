import { useState } from "react";
import MultiSelect from "../reusables/multiselect";
import projectClassifications from '~/utils/constants/projectclassifications';
import ToggleSwitch from "../reusables/toogleswitch";
import Tooltip from "../reusables/tooltip";

interface ProjectSettingsComponentProps {
    tags: string[];
    onTagsChange: (tasks: string[]) => void;
    isSolo: boolean;
    setIsSolo: React.Dispatch<React.SetStateAction<boolean>>;
    isPrivate: boolean;
    setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OptionType {
    value: string;
    label: string;
}

const ProjectSettingsComponent: React.FC<ProjectSettingsComponentProps> =  ({
    tags,
    onTagsChange,
    isSolo,
    setIsSolo,
    isPrivate,
    setIsPrivate,
}) => {

  const selectedTags: OptionType[] = tags.map(tag => ({ value: tag, label: tag }));

  return (
    <div>
        <div className="container mx-auto py-2">
            <div className="p-4 rounded-lg shadow-lg bg-gray-100">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-semibold">Final Step</h1>
                    <p>Configure your project settings</p>
                </div>
                <div className="mb-6">
                    <label className="block mb-2">Project Tags &#40;optional&#41;: </label>
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

            
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <label className="text-base">Project Type</label>
                        <Tooltip content="Information about project type.">
                            <span>
                                <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                            </span>
                        </Tooltip>
                    </div>

                    <ToggleSwitch 
                        activeTab={isSolo ? "Solo" : "Collab"} 
                        setActiveTab={(value) => setIsSolo(value === "Solo")} 
                        option1="Solo" 
                        option2="Collab" 
                        background="bg-gray-100"
                    />

                    <div className="flex items-center space-x-2">
                        <label className="text-base">Visibility</label>
                        <Tooltip content="Information about visibility.">
                            <span>
                                <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                            </span>
                        </Tooltip>
                    </div>

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
    </div>
  );
};

export default ProjectSettingsComponent;
