import { api } from "~/utils/api";
import type {RouterOutputs} from "~/utils/api";
import { LoadingPage} from "~/components/loading";
import Link from 'next/link';

export const ProjectNav = () => {
  const { data, isLoading } = api.projects.getAll.useQuery();
  if (isLoading ) return(<LoadingPage></LoadingPage>)
  if (!data) return(<div> Something went wrong</div>)

  return(
    <div id="project-side-bar-container" className="border-b border-slate-700 p-4">
      <div id="project-side-bar-container-2" className="flex flex-col gap-3 items-center border-b border-e border-t border-l border-slate-300 p-2 g-4 justify-between rounded-lg  bg-white ">
        <span className="text-xl text-black-500">
           Your Projects
        </span>
        <div id="project-side-bar-project-card-container" className="bg-white p-4  ">
          {data.map((fullProject) => (
              <ProjectSideBarCard key={fullProject.projects.id} {...fullProject}></ProjectSideBarCard>
          ))}
        </div>
      </div>
    </div>
  )
  
}

type projectData = RouterOutputs["projects"]["getAll"][number]
const ProjectSideBarCard = (props: projectData) => {
  const {projects} = props;

  {/* 
  const getImagePath = (projectType: string) => {
    if (projectType === 'solo') {
      return '/images/solo_riple.png';
    } else {
      return '/images/multi_riple.png';
    }
  };

  In image
   src={getImagePath(projects.projectType)} 
*/}

  return(
    <div id="project-side-bar-project-card" className="flex items-center p-4 mb-1 bg-white border-b border-e border-t border-l border-slate-300 justify-between rounded-lg">
        
        <div className="text-sm text-sky-500">
          <Link href={`/projects/${projects.id}`}>
            {projects.title}
          </Link>
        </div>
    </div>
  )
}