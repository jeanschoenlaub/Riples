import { api } from "~/utils/api";
<<<<<<<< HEAD:src/components/feeds/socialfeed.tsx
import { LoadingPage } from "~/components/reusables/loading";
import { RipleCard } from '../cards/riplecard';
import { CreateProjectModal } from "../createprojectmodal/createprojetmodal";
import { useState } from "react";
========
import { LoadingPage } from "~/components/loading";
import { RipleCard } from './riplecard';
>>>>>>>> main:src/components/feed.tsx

export const Feed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();

<<<<<<<< HEAD:src/components/feeds/socialfeed.tsx
    
    const [showCreateProjModal, setShowCreateProjModal] = useState(false); 

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)
========
    if (isLoading) return(<LoadingPage></LoadingPage>)
>>>>>>>> main:src/components/feed.tsx
  
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




