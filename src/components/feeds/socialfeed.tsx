import { api } from "~/utils/api";
import { LoadingPage } from "~/components/reusables/loading";
<<<<<<<< HEAD:src/components/feed/socialfeed.tsx
import { RipleCard } from '../riplecard';
import { CreateProjectModal } from "../createprojectmodal/createprojetmodal";
========
import { RipleCard } from '../cards/riplecard';
import { CreateProjectModal } from "../projectmodal/createprojetmodal";
>>>>>>>> mvp_sprint_2:src/components/feeds/socialfeed.tsx
import { useState } from "react";

export const SocialFeed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();

    
    const [showCreateProjModal, setShowCreateProjModal] = useState(false); 

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)
  
    if (!data) return(<div> Something went wrong</div>)

    const openProjModal = () => {
      setShowCreateProjModal(true);
    };
  
    return ( 
      <div>
        <div>
          {data?.map((fullRiple) => (
            <RipleCard key={fullRiple.riple.id} {...fullRiple}></RipleCard>
          ))}
        </div>

        <div>
        <CreateProjectModal showModal={showCreateProjModal} onClose={() => {setShowCreateProjModal(false); // Hide the modal when closing
          }}
        />
        </div>
      </div>
    )
} 




