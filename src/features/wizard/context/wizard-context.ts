import { createContext, useContext } from "react";

type WizardContextType = {
    showWizard: boolean;
    setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
    wizardName: string;
    setWizardName: React.Dispatch<React.SetStateAction<string>>;
    projectTitle: string;
    setProjectTitle: React.Dispatch<React.SetStateAction<string>>;
    projectId: string;
    setProjectId: React.Dispatch<React.SetStateAction<string>>;
    projectSummary: string;
    setProjectSummary: React.Dispatch<React.SetStateAction<string>>;
    taskNumber: string;
    setTaskNumber: React.Dispatch<React.SetStateAction<string>>;
    goalNumber: string;
    setGoalNumber: React.Dispatch<React.SetStateAction<string>>;
    ripleContent: string;
    setRipleContent: React.Dispatch<React.SetStateAction<string>>;
    ripleWizardModalStep: string;
    setRipleWizardModalStep: React.Dispatch<React.SetStateAction<string>>;
};

export const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
    const context = useContext(WizardContext);
    if (!context) {
        throw new Error("useWizard must be used within a Wizard Wrapper");
    }
    return context;
};