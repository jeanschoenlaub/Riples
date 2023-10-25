import { api } from "~/utils/api";
import { LoadingPage } from "~/components/reusables/loading";
import { RipleCard } from '../cards/riplecard/riplecard';
import Tooltip from "../reusables/tooltip";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const SocialFeed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();
    const {data: session} = useSession() 

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)
  
    if (!data) return(<div> Something went wrong</div>)

  
    return ( 
      <div>
        <div className="p-3 bg-gray-200 rounded-lg shadow-md  mb-5 mr-2 ml-2 md:mr-5 md:ml-5">
          <div className="flex justify-between">
            {/* Filter dropdown */}
            <div className="flex items-center">
              <label htmlFor="filter" className="mr-2 text-gray-600 text-xs md:text-base font-medium">
                Filter Riples:
              </label>
              <Tooltip content="Available soon" shiftLeft={true} width="200px">
                <select id="filter" disabled className="p-2 text-xs md:text-base  bg-white rounded cursor-not-allowed border border-gray-300 shadow-sm">
                  <option>All</option>
                  {/* Add more filter options here */}
                </select>
              </Tooltip>
            </div>

            {/* Order by dropdown */}
            <div className="flex items-center">
              <label htmlFor="order" className="mr-2 text-xs md:text-base  text-gray-600 font-medium">
                Order by:
              </label>
              <Tooltip content="Available soon" width="200px">
                <select id="order" disabled className="p-2 text-xs md:text-base  bg-white rounded cursor-not-allowed border border-gray-300 shadow-sm">
                  <option>Most recent</option>
                  {/* Add more order by options here */}
                </select>
              </Tooltip>
            </div>
          </div>
        </div>

        <div id="socialfeed" className="space-y-4">
          {data?.map((fullRiple) => (
            <RipleCard key={fullRiple.riple.id} {...fullRiple} ></RipleCard>
          ))}
        </div>
    </div>
    )
} 




