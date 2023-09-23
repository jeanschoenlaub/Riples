import { api } from "~/utils/api";
import { LoadingPage } from "~/components/reusables/loading";
import { RipleCard } from '../cards/riplecard';
import { useState } from "react";


export const SocialFeed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();
    
    const [showCreateProjModal, setShowCreateProjModal] = useState(false); 

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)

  
    if (!data) return(<div> Something went wrong</div>)
  
    return ( 
      <div>
        <div>
          {data?.map((fullRiple) => (
            <RipleCard key={fullRiple.riple.id} {...fullRiple}></RipleCard>
          ))}
        </div>
      </div>
    )
} 




