// Array for task status names
export const TASK_STATUS_VALUES = ["Done", "Doing", "To-Do", "Backlog"];

// Array for corresponding colors
export const TASK_STATUS_COLORS = ["bg-green-500", "bg-yellow-500", "bg-orange-400", "bg-gray-500"];

// Function to get the corresponding color for a status
export const getTaskStatusColor = (status: string) => {
    const index = TASK_STATUS_VALUES.indexOf(status);
    return TASK_STATUS_COLORS[index] ?? "bg-gray-500"; // Default color if status not found
};

// Array for project status names
export const PROJECT_STATUS_VALUES = ["Done", "Doing", "To-Do", "Backlog"];

// Array for corresponding colors
export const PROJECT_STATUS_COLORS = ["bg-green-500", "bg-yellow-500", "bg-orange-400", "bg-gray-500"];

// Function to get the corresponding color for a status
export const getProjectStatusColor = (status: string) => {
    const index = PROJECT_STATUS_VALUES.indexOf(status);
    return PROJECT_STATUS_COLORS[index] ?? "bg-gray-500"; // Default color if status not found
};