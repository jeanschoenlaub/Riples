import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { RipleCard } from './riplecard';

export const Feed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();

    if (isLoading) return(<LoadingPage></LoadingPage>)
  
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




