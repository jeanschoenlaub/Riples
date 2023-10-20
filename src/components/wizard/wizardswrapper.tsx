import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { WizardOnboarding } from "~/components/wizard/onboardingwizard";
import styles from '~/styles/WizardWrapper.module.css'; // you can adjust the path based on your folder structure
import { api } from '~/utils/api';
import { WizardTask } from './wizardtask/wizardtask';
import Image from 'next/image';
import { WizardProjectAbout } from './wizardprojectabout/wizardprojectabout';
import { WizardProjectRiples } from './wizardriple/wizardriple';

type WizardContextType = {
    showWizard: boolean;
    setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
    setWizardName: React.Dispatch<React.SetStateAction<string>>;
    setProjectTitle: React.Dispatch<React.SetStateAction<string>>;
    setProjectSummary: React.Dispatch<React.SetStateAction<string>>;
    setTaskNumber: React.Dispatch<React.SetStateAction<string>>;
    setGoalNumber: React.Dispatch<React.SetStateAction<string>>;
    setRipleContent: React.Dispatch<React.SetStateAction<string>>;
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

interface WizardWrapperProps {
    children: ReactNode;
}

export const WizardWrapper: React.FC<WizardWrapperProps> = ({ children }) => {
    // For the create project Wizard
    const [showWizard, setShowWizard] = useState(false);
    const [wizardName, setWizardName] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [projectSummary, setProjectSummary] = useState("");
    const [taskNumber, setTaskNumber] = useState("3");
    const [goalNumber, setGoalNumber] = useState("1");

    //For the Riples Wizard
    const [RipleWizardModalStep, setRipleWizardModalStep] = useState("");
    const [ripleContent, setRipleContent] = useState("");

    const { data: session } = useSession();
    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user id is not null
  
    // Conditional query using tRPC
    const userQuery = api.users.getUserByUserId.useQuery(
        { userId: session?.user?.id ?? "" },
        { enabled: shouldExecuteQuery }
    );

    return (
        <WizardContext.Provider value={{ setShowWizard, showWizard, setWizardName, setProjectTitle, setRipleContent, setProjectSummary, setTaskNumber, setGoalNumber, setRipleWizardModalStep}}>
            {children}
            <button id="misterwattbutton" className={styles.floatingButton} onClick={() => setShowWizard(!showWizard)}>
                <Image src="/images/riple_ai.png" alt="Open Wizard" width={256} height={256} />
            </button>
            {showWizard && (wizardName == "taskWizard") && session && <div> 
                <div id="wizardtask" className={styles.floatingWindow}>
                    <WizardTask projectTitle={projectTitle} projectSummary={projectSummary} taskNumber={taskNumber} goalNumber={goalNumber} userId={session?.user.id}/>
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            </div>
            }
            {showWizard && (wizardName == "")  && (!shouldExecuteQuery || userQuery.data?.user?.userOnboarding?.onBoardingFinished === false) &&
                <div id="wizardonboarding" className={`${styles.floatingWindow}`}>
                    {/* If no logged in users or the logged in user hasn't finished the tutorial, show onboarding Mister Watt */}
                    <WizardOnboarding />
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            }
            {showWizard && (wizardName == "projectabout") &&
                <div id="wizardprojectabout" className={`${styles.floatingWindow}`}>
                    {/* If no logged in users or the logged in user hasn't finished the tutorial, show onboarding Mister Watt */}
                    <WizardProjectAbout />
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            }
            {showWizard && (wizardName == "projectriples") && session &&
                <div id="wizardprojectriples" className={`${styles.floatingWindow}`}>
                    {/* If no logged in users or the logged in user hasn't finished the tutorial, show onboarding Mister Watt */}
                    <WizardProjectRiples projectTitle={projectTitle} projectSummary={projectSummary} ripleContent={ripleContent} userId={session?.user.id} modalStep={RipleWizardModalStep}/>
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            }
            {showWizard && (wizardName == "") && (userQuery.data?.user?.userOnboarding?.onBoardingFinished === true) && 
                <div id="wizardreal" className={styles.floatingWindow}>
                    What would you like AI help with ? Answer here:
                    <div className="flex mt-6 justify-center">
                        <a href="https://forms.gle/nqH1G4d5Usg4aSW57" target="_blank" rel="noopener noreferrer">
                            <button className="bg-green-500 text-white rounded py-1 px-2 text-center text-sm">
                                Feature request
                            </button>
                            </a>
                    </div>
                    <br/>
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            }
        </WizardContext.Provider>
        
    );
};