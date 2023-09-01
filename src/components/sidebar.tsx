import { api } from "~/utils/api";
import type {RouterOutputs} from "~/utils/api";
import { LoadingPage} from "~/components/loading";
import Link from 'next/link';

export const ProjectNav = () => {
  

  return(
    <div id="project-side-bar-container"> Future Content</div>
  )


/*
const { data, isLoading } = api.projects.getAll.useQuery();
  if (isLoading ) return(<LoadingPage></LoadingPage>)
  if (!data) return(<div> Something went wrong</div>)s
<div id="project-side-bar-container" className="border-b border-slate-700 p-4">
  <div id="project-side-bar-container-2" className="flex flex-col items-center border-b border-e border-t border-l border-slate-300 p-2 justify-between rounded-lg bg-white ">
    <span className="text-xl text-black-500">
        Your Projects
    </span>
    <div id="project-side-bar-project-card-container" className="bg-white p-2  ">
      {data.map((fullProject) => (
          <ProjectSideBarCard key={fullProject.projects.id} {...fullProject}></ProjectSideBarCard>
      ))}
    </div>
  </div>
</div>*/
  
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
        
        <div className="text-sm font-bold text-riple-dark-blue">
          <Link href={`/projects/${projects.id}`}>
            {projects.title}
          </Link>
        </div>
    </div>
  )
}