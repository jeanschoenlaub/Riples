import { api } from "~/utils/api";

import { LoadingPage } from "~/components/reusables/loading";
import { RipleCard } from '~/components/cards/riplecard';
import { CreateProjectModal } from "./createprojectmodal/createprojetmodal";
import { useState } from "react";


export const Feed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();
    
    const [showCreateProjModals, setShowCreateProjModal] = useState(false); 

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)

  
    if (!data) return(<div> Something went wrong</div>)
  
    return ( 
      <div>

        <div>
          {/*<CreateRipleWizard></CreateRipleWizard>*/}
        </div>

        <div>
          {data?.map((fullRiple) => (
            <RipleCard key={fullRiple.riple.id} {...fullRiple}></RipleCard>
          ))}
        </div>

      </div>
    )
} 




