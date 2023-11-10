import { type ReactNode, useState } from "react";

import { WizardContext, WizardUI } from "~/features/wizard";

interface WizardProviderProps {
    children: ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
    const [showWizard, setShowWizard] = useState(false);
    const [wizardName, setWizardName] = useState("");
    const [projectId, setProjectId] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [projectSummary, setProjectSummary] = useState("");
    const [taskNumber, setTaskNumber] = useState("3");
    const [goalNumber, setGoalNumber] = useState("1");
    const [ripleWizardModalStep, setRipleWizardModalStep] = useState("");
    const [ripleContent, setRipleContent] = useState("");

    return (
        <WizardContext.Provider value={{ 
            showWizard, setShowWizard, 
            wizardName, setWizardName, 
            projectId, setProjectId,
            projectTitle, setProjectTitle, 
            projectSummary, setProjectSummary,
            taskNumber, setTaskNumber, 
            goalNumber, setGoalNumber,
            ripleWizardModalStep, setRipleWizardModalStep,
            ripleContent, setRipleContent
        }}>
            {children}
            <WizardUI></WizardUI>
        </WizardContext.Provider>
    );
};