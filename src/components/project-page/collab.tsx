import Link from "next/link"
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import type { RouterOutputs } from '~/utils/api';
import { TaskList } from "~/components/project-page/task/tasklist";

type ProjectData = RouterOutputs["projects"]["getProjectByProjectId"]
interface CollabTabProps {
    project: ProjectData["project"];
    isMember: boolean;
    isPending: boolean;
    isProjectLead: boolean;
    userId: string | undefined;
  }

export const CollabTab: React.FC<CollabTabProps> = ({ project, isMember, isPending, isProjectLead, userId }) => {

    const ctx = api.useContext();
    const {mutate: applyToProjectMutation, isLoading: isApplying}  = api.projectMembers.applyToProject.useMutation({
        onError: (e) => {
          console.error("Mutation error: ", e);
          toast.error("Application failed ! Please try again later")
        },
        onSuccess: () => {
            void ctx.projectMembers.getMembersByProjectId.invalidate()
        }
    })

    const {mutate: deleteProjectMember, isLoading: isDeleting}  = api.projectMembers.deleteProjectMember.useMutation({
        onError: (e) => {
          console.error("Mutation error: ", e);
          toast.error("Application failed ! Please try again later")
        },
        onSuccess: () => {
            void ctx.projectMembers.getMembersByProjectId.invalidate()
        }
    })
    
    return (
        <div>
            {/* TASK TABLE DIV ONLY FOR PROJECT MEMBERS + CREATE TASK */}
            <div id="project-collab-task-table" className="mt-4 ml-2 mb-2 space-y-4">
                { (project.projectPrivacy === "public" || isMember || isProjectLead) && ( 
                    <TaskList project={project} isMember={isMember} isProjectLead={isProjectLead} isPending={isPending}/>
                 )} 
            </div>
            {/* JOIN / LEAVE PROJECT SECTION AND BUTTON */}
            <div id="project-collab-how-to-apply" className="mt-4 ml-2 mb-2 space-y-4">
                <section>
                    <ol className="list-decimal list-inside">
                    <li> Read this info page about what to expect: <Link href="/about/collaborate-on-a-riple-project" className="text-blue-500"> How to collaborate on Riples </Link> </li>
                    <li> Sign in to your Riples Account (on the top right)</li>
                    </ol>
                </section>
            </div>

            <div id="project-collab-apply-button" className="mt-4 mb-4 flex justify-center items-center">
                {(userId && !isProjectLead) ? ( <>
                    <button className={`text-white rounded py-1 px-2 text-center ${isMember ? 'bg-red-500' : 'bg-blue-500'}`} //This is a Aplly Quit button and the logic is handled in router
                        onClick={() => {
                            if (userId) {  // Adding this check ensures userId is not null for typescript
                                const Application = {
                                    userId: userId,
                                    projectId: project.id,
                                };
                                if (isMember || isPending || isProjectLead){ // To-Do better logic for isProjetLead
                                    deleteProjectMember(Application);
                                }
                                else { 
                                    applyToProjectMutation(Application);
                                }
                            }
                        }}
                        disabled={isApplying || isPending}
                    >
                        {isApplying ? 'Updating...' : (isMember ? 'Quit the project' : (isPending ? 'Application submitted' : 'Join the project'))}
                    </button>
                </>
                ) : (
                   <div className="bg-blue-500 text-white rounded py-1 px-2 text-center"> {!isProjectLead ? 'You must be signed in to apply.' : ''} </div>
                )}
            </div>
        </div>
    )
}