import { api } from "~/utils/api";
import { LoadingPage } from "~/components";
import { useSession } from "next-auth/react";
import { TaskList } from "../task/task-list";


export const ToDoList = () => {
    const { data: session } = useSession(); 

    const shouldExecuteQuery = !!session?.user?.id; // Run query only if session and user ID exist
    const userId = session?.user?.id ?? ''; //will never be empty 
  
  // Conditional query using tRPC to avoid no user error if not signed-in
    const { data: projectLead, isLoading: projectLeadLoading } = api.projects.getProjectByAuthorId.useQuery(
      { authorId: userId },
      { enabled: shouldExecuteQuery }
    )

    // const { data: projectMember, isLoading: projectMemberLoading } = api.projectMembers.getProjectsByMemberAcceptedId.useQuery(
    //   { userId: userId },
    //   { enabled: shouldExecuteQuery }
    // )

    // const filteredProjectLead = projectLead?.filter(project => project.project.status !== "Done") ?? [];
    // const filteredProjectMember = projectMember?.filter(member => member.project.status !== "Done") ?? [];

    // const combinedProjectsForWorking = [...filteredProjectLead, ...filteredProjectMember];
    
    if (!session) {
        return (<div> Log in to see your projects </div>);
    }

    const isLoading = ( projectLeadLoading ) // || projectMemberLoading )

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)
  
    if ((!projectLead ))//|| !projectMember)) return(<div> Something went wrong</div>)

    console.log(projectLead)

    return(
      <>
      <div id="todolist"> 
        {projectLead && projectLead[0] &&
            <TaskList project={projectLead[0].project} isMember={true} isProjectLead={true} isPending={true}/>
        }
      </div>
    </>  
    )
}