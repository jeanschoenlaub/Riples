type TaskStatus = {
    taskName: string;
    isCompleted: boolean;
    actionLink?: string; // URL or route to guide the user to complete the task
};

type OnboardingStatusProps = {
    tasks: TaskStatus[];
};

const OnboardingStatus: React.FC<OnboardingStatusProps> = ({ tasks }) => {
    return (
        <div className="onboarding-status-window">
            {tasks.map((task, index) => (
                <div key={index} className="task-status">
                    <span className={`indicator ${task.isCompleted ? 'completed' : 'pending'}`}>
                        {task.isCompleted ? '✅' : '❌'}
                    </span>
                    <span>{task.taskName}</span>
                    {!task.isCompleted && task.actionLink && <a href={task.actionLink}>Go</a>}
                </div>
            ))}
        </div>
    );
};
