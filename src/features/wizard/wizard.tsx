import { useSession } from 'next-auth/react';
import styles from '~/styles/WizardWrapper.module.css'; // you can adjust the path based on your folder structure
import { api } from '~/utils/api';
import Image from 'next/image';
import {  WizardTask, WizardOnboarding, WizardAbout,  WizardProjectRiples, WizardChat, useWizard} from '~/features/wizard/';

export const WizardUI: React.FC = () => {
    const { 
        showWizard, setShowWizard, 
        wizardName, 
        projectTitle, projectSummary, projectId,
        taskNumber, goalNumber, 
        ripleWizardModalStep, 
        ripleContent 
    } = useWizard();

    const { data: session } = useSession();
    const shouldExecuteQuery = !!session?.user?.id;

    // Conditional query using tRPC
    const userQuery = api.users.getUserByUserId.useQuery(
        { userId: session?.user?.id ?? "" },
        { enabled: shouldExecuteQuery }
    );

    return (
        <>
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
            {showWizard && (wizardName == "projectabout") && (userQuery.data?.user?.userOnboarding?.onBoardingFinished === true) &&
                <div id="wizardprojectabout" className={`${styles.floatingWindow}`}>
                    {/* If no logged in users or the logged in user hasn't finished the tutorial, show onboarding Mister Watt */}
                    <WizardAbout projectId={projectId}/>
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            }
            {showWizard && (wizardName == "projectriples") && session &&
                <div id="wizardprojectriples" className={`${styles.floatingWindow}`}>
                    {/* If no logged in users or the logged in user hasn't finished the tutorial, show onboarding Mister Watt */}
                    <WizardProjectRiples projectTitle={projectTitle} projectSummary={projectSummary} ripleContent={ripleContent} userId={session?.user.id} modalStep={ripleWizardModalStep}/>
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
                    <WizardChat projectTitle={projectTitle} projectSummary={projectSummary} ripleContent={ripleContent} modalStep={ripleWizardModalStep}/>
                    <br/>
                    <button onClick={() => setShowWizard(false)}>Close</button>
                </div>
            }
        </>        
    );
};