import { api } from "~/utils/api";
import { LoadingPage } from "~/components/reusables/loading";
import { RipleCard } from '../cards/riplecard';

export const SocialFeed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)

  
    if (!data) return(<div> Something went wrong</div>)
  
    return ( 
      <div>
        <div id="socialfeed">
          {data?.map((fullRiple) => (
            <RipleCard key={fullRiple.riple.id} {...fullRiple}></RipleCard>
          ))}
        </div>
      </div>
    )
} 




