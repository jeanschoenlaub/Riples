type WizardProps = {
    tasks: TaskStatus[];
};

type TaskStatus = {
    taskName: string;
    isCompleted: boolean;
    actionLink?: string;
};


export const WizardOnboarding = () => {
    
    const tasks: TaskStatus[] = [
        { taskName: 'Create a project', isCompleted: false, actionLink: '/?activeTab=Create' },
        { taskName: 'Add a task', isCompleted: false, actionLink: '/?activeTab=create' },
        // ... add other tasks
    ];

    return (
        <div className="onboarding-status-window">
            <div className="font-semibold"> Welcome to Riples 👋 </div>
            <div className="mb-4"> Complete these tasks to understand the full power of Riples:</div>
            {tasks.map((task, index) => (
                <div id={`onboardingtask-${index}`} key={index} className="task-status" >
                    <span className={`indicator ${task.isCompleted ? 'completed' : 'pending'}`}>
                        {task.isCompleted ? '✅' : '🔲'}
                    </span>
                    <span>{task.taskName}</span>
                </div>
            ))}
            <div className="mb-4 border-b"> Once your done with these I will help you streamline your projects 🧙🏿‍♂️</div>
        </div>
    );
};

