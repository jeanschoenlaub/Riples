interface WizardChallengeComponentProps {
    setWizardName: React.Dispatch<React.SetStateAction<string>>;
}

export const WizardChallenge: React.FC<WizardChallengeComponentProps> = ({
    setWizardName
}) => {

    return (
        <div>
            Challenge wizard
            <button 
                className="bg-blue-500 w-52 text-white rounded px-4 mt-2 py-1 justify-center focus:outline-none focus:ring focus:ring-blue-200" 
                onClick={() => setWizardName("menu")} > Menu </button>
        </div>
    );
};
