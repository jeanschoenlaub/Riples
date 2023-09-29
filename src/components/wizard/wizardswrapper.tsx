import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { WizardOnboarding } from "~/components/onboarding/onboardingwizard/onboardingwizard";
import styles from '~/styles/WizardWrapper.module.css'; // you can adjust the path based on your folder structure
import { api } from '~/utils/api';
import { WizardTask } from './wizardtask';

type WizardContextType = {
    setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
    showWizard: boolean;
    setWizardName: React.Dispatch<React.SetStateAction<string>>;
    setProjectTitle: React.Dispatch<React.SetStateAction<string>>;
    setProjectSummary: React.Dispatch<React.SetStateAction<string>>;
    setTaskNumber: React.Dispatch<React.SetStateAction<string>>;
    setGoalNumber: React.Dispatch<React.SetStateAction<string>>;
};

export const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
    const context = useContext(WizardContext);
    if (!context) {
        throw new Error("useWizard must be used within a Wizard Wrapper");
    }
    return context;
};

interface WizardWrapperProps {
    children: ReactNode;
}

export const WizardWrapper: React.FC<WizardWrapperProps> = ({ children }) => {
    const [showWizard, setShowWizard] = useState(false);
    const [wizardName, setWizardName] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [projectSummary, setProjectSummary] = useState("");
    const [taskNumber, setTaskNumber] = useState("3");
    const [goalNumber, setGoalNumber] = useState("1");


    const { data: session } = useSession();
    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user id is not null
  
    // Conditional query using tRPC
    const userQuery = api.users.getUserByUserId.useQuery(
        { userId: session?.user?.id ?? "" },
        { enabled: shouldExecuteQuery }
    );

    return (
        <WizardContext.Provider value={{ setShowWizard, showWizard, setWizardName, setProjectTitle, setProjectSummary, setTaskNumber, setGoalNumber}}>
            {children}
            <button id="misterwattbutton" className={styles.floatingButton} onClick={() => setShowWizard(!showWizard)}>
                <img src="/images/riple_ai.png" alt="Open Wizard" width={60} height={60} />
            </button>
            {showWizard && (wizardName == "taskWizard") && <div> 
                <div id="wizardtask" className={styles.floatingWindow}>
                    <WizardTask projectTitle={projectTitle} projectSummary={projectSummary} taskNumber={taskNumber} goalNumber={goalNumber} />
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            </div>
            }
            {showWizard && (wizardName == "")  && (!shouldExecuteQuery || userQuery.data?.user?.onBoardingFinished === false) && 
                <div id="wizardonboarding" className={styles.floatingWindow}>
                    {/* If no logged in users or the logged in user hasn't finished the tutorial, show onboarding Mister Watt */}
                    <WizardOnboarding />
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            }
            {showWizard && (userQuery.data?.user?.onBoardingFinished === true) && 
                <div id="wizardreal" className={styles.floatingWindow}>
                    {/* If  finished the tutorial, show real Mister Watt */}
                </div>
            }
        </WizardContext.Provider>
    );
};
