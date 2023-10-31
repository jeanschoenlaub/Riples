import type { RouterOutputs } from "~/utils/api";

export type TaskData = RouterOutputs["tasks"]["getTasksByProjectId"][0];
export type SubTaskData = RouterOutputs["tasks"]["getTasksByProjectId"][0]["task"]["subTasks"][0];

export interface SubTasksRowsProps {
    taskData: TaskData;
}

// Payload for creating a new sub-task
export interface CreateSubTaskPayload {
    taskId: string;
    title: string;
  }

// Payload for deleting a sub-task
export interface DeleteSubTaskPayload {
    id: string;
}

// Payload for changing the status of a sub-task
export interface EditSubTaskStatusPayload {
    id: string;
    status: boolean;  // Note: using boolean to match your Prisma model
}
  