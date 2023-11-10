import { useEffect, useState } from "react";
import { WizardChallenge } from "./wizard-challenge";
import { useOpenAIProjectWizardMutation } from "./wizard-about-apis";
import { api } from "~/utils/api";

export type WizardAboutProps = {
    projectId: string;
};

export const WizardAbout: React.FC<WizardAboutProps> = ({ projectId }) => {
    const [wizardName, setWizardName] = useState("menu");
    const { data: taskData, isLoading: isLoadingTasks, isError } = api.tasks.getTasksByProjectId.useQuery({ projectId });
    const { isGeneratingChallenge, generateProjectChallenge } = useOpenAIProjectWizardMutation();

    useEffect(() => {
        if (wizardName === "idea") {
            console.log("call the idea GPT API");
        } else if (wizardName === "challenge") {
            // When the wizard name is set to "challenge", we prepare the payload
            // and call the function to generate the project challenge.
            generateProjectChallenge(generateChallengePayload(projectId));
        }
    }, [wizardName, projectId, generateProjectChallenge]);

    if (!taskData) return null;

    return (
        <div>
            <div className="onboarding-status-window">
                <div className="font-semibold flex items-center">
                    <span className="text-3xl mr-2">🦸</span>
                    Project Wizard
                </div>
                {wizardName === "menu" && (
                    <>
                        <div className="mb-4"> Keep going, you are doing great work </div>
                        <div id="wizard-about-choice-buttons" className="flex flex-col items-center justify-center mb-4">
                            <button
                                className="bg-blue-500 w-52 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                                onClick={() => setWizardName("idea")}>
                                Brainstorm
                            </button>
                            <button
                                className="bg-blue-500 w-52 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200"
                                onClick={() => setWizardName("challenge")}>
                                Daily Challenge
                            </button>
                        </div>
                    </>
                )}
                {wizardName === "challenge" && <WizardChallenge setWizardName={setWizardName} />}
            </div>
        </div>
    );
};

function generateChallengePayload(projectId :string) {
    // Construct the payload with the required parameters for the assistant
    const payloadChallenge = {
        // Assuming the assistant expects a 'project_id' to retrieve the tasks.
        project_id: projectId
    };

    return payloadChallenge;
}
