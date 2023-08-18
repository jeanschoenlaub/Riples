import Image from 'next/image';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type {RouterOutputs} from "~/utils/api";


//My components
import { LoadingPage} from "~/components/loading";

export const ProjectNav = () => {
  const { data, isLoading } = api.projects.getAll.useQuery();
  if (isLoading ) return(<LoadingPage></LoadingPage>)
  if (!data) return(<div> Something went wrong</div>)

  return(
    <div id="project-side-bar-container" className="border-b border-slate-700 p-4">
      <div id="project-side-bar-container-2" className="flex flex-col gap-3 items-center border-b border-e border-t border-l border-slate-300 p-2 g-4 justify-between rounded-2xl  bg-white ">
        <div id="project-side-bar-header" className="flex gap-2">
          <h1> Your Projects </h1>
        </div>
        <div id="project-side-bar-project-card-container" style={{maxHeight: "80vh", overflowY: "auto"}}>
          {data.map((fullProject) => (
              <ProjectSideBar key={fullProject.projects.id} {...fullProject}></ProjectSideBar>
          ))}
        </div>
      </div>
    </div>
  )
  
}

type fakeData = RouterOutputs["projects"]["getAll"][number]
const ProjectSideBar = (props: fakeData) => {
  const {projects} = props;
  const getImagePath = (ripleType: string) => {
    if (ripleType === 'solo') {
      return '/images/solo_riple.png';
    } else {
      return '/images/multi_riple.png';
    }
  };

  return(
    <div id="project-side-bar-project-card" className="flex items-center p-4 bg-white border-b border-e border-t border-l border-slate-300 justify-between rounded-lg">
        <div id="project-side-bar-project-title">
            {projects.title}
        </div>
        
        <Image 
            src={getImagePath(projects.ripleType)} 
            alt="Riple Type"
            className="rounded-full"
            width={40}
            height={40}
            objectFit="cover"
            objectPosition="center"
        />
    </div>
  )
}