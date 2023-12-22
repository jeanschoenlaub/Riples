import { RouterOutputs, api } from "~/utils/api";
import { DownArrowSVG, LoadingPage, UpArrowSVG } from "~/components";
import { useSession } from "next-auth/react";
import { TaskList } from "../task/task-list";
import { useState } from "react";

type ProjectData = RouterOutputs["projects"]["getProjectByAuthorId"];

export const ToDoList = () => {
    const { data: session } = useSession(); 

    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user ID exist
    const userId = session?.user?.id ?? ''; //will never be empty 
  
    // Conditional query using tRPC to avoid no user error if not signed-in
    const { data: projectLead, isLoading: projectLeadLoading } = api.projects.getProjectByAuthorId.useQuery(
      { authorId: userId },
      { enabled: shouldExecuteQuery }
    )

    const [visibleTaskListIds, setVisibleTaskListIds] = useState(new Set<string>());
    
    const toggleTaskListVisibility = (projectId: string) => {
        setVisibleTaskListIds(prevVisibleTaskListIds => {
            const newVisibleTaskListIds = new Set(prevVisibleTaskListIds);
            if (newVisibleTaskListIds.has(projectId)) {
                newVisibleTaskListIds.delete(projectId);
            } else {
                newVisibleTaskListIds.add(projectId);
            }
            return newVisibleTaskListIds;
        });
    };

    const countNotDoneTasks = (project : ProjectData[0]) => {
        // Assuming you have an array of tasks in your project object
        // Replace this logic based on your actual data structure
        return project.project.tasks.filter(task => task.status != "Done").length;
    };

  
    if (!session) {
        return (<div> Log in to see your projects </div>);
    }

    if (projectLeadLoading) return(<LoadingPage isLoading={projectLeadLoading}></LoadingPage>)
  
    console.log(projectLead)

    return (
        <div id="todolist">
          {projectLead && projectLead.map((item, index) => (
            <div key={item.project.id}>
              
              <button onClick={() => toggleTaskListVisibility(item.project.id)} className="flex items-center text-blue-600">
                        <div className="flex flex-col items-center mr-2">
                            <div className="text-sm">{countNotDoneTasks(item)}</div>
                            {visibleTaskListIds.has(item.project.id) ? (
                                <UpArrowSVG width='5' height='5' />
                            ) : (
                                <DownArrowSVG width='5' height='5' />
                            )}
                        </div>
                        <div className="text-xl mr-2">{item.project.title}</div>
                    </button>
    
              {visibleTaskListIds.has(item.project.id) && (
                <TaskList
                  project={item.project}
                  projectId={item.project.id} 
                  projectType={item.project.projectType}
                  isMember={true}
                  isProjectLead={true}
                  isPending={true}
                />
              )}
            </div>
          ))}
        </div>
      );
    };    
