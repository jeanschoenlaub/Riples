import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { RipleCard } from './riplecard';
import { CreateProjectModal } from "./createprojetmodal";
import { useState } from "react";

export const SocialFeed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();

    
    const [showCreateProjModal, setShowCreateProjModal] = useState(false); 

    if (isLoading) return(<LoadingPage></LoadingPage>)
  
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




