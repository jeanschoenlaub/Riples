import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { WizardOnboarding } from "~/components/wizard/onboardingwizard";
import styles from '~/styles/WizardWrapper.module.css'; // you can adjust the path based on your folder structure
import { api } from '~/utils/api';

type WizardContextType = {
    setShowWizard: React.Dispatch<React.SetStateAction<boolean>>;
    showWizard: boolean;
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

    const { data: session } = useSession();
    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user id is not null
  
    // Conditional query using tRPC
    const userQuery = api.users.getUserByUserId.useQuery(
        { userId: session?.user?.id ?? "" },
        { enabled: shouldExecuteQuery }
    );

    return (
        <WizardContext.Provider value={{ setShowWizard, showWizard }}>
            {children}
            <button id="misterwattbutton" className={styles.floatingButton} onClick={() => setShowWizard(!showWizard)}>
                <img src="/images/riple_ai.png" alt="Open Wizard" width={60} height={60} />
            </button>
            {showWizard && (!shouldExecuteQuery || userQuery.data?.user?.onBoardingFinished === false) && 
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
