import { type RouterOutputs, api } from "~/utils/api";
import { ArrowLeftSVG, ArrowRightSVG, LoadingPage, Tooltip } from "~/components";
import { RipleCard } from "~/features/cards/riple-card";
import { useState } from "react";
import React from "react";
import { ProjectFollowCarousel } from "../cards/project-follow-carroussel";


type FullRiple = RouterOutputs["riples"]["getAll"][number]

export const SocialFeed = () => {
    const [riples, setRiples] = useState<FullRiple[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMoreRiples, setHasMoreRiples] = useState(true);

    const { data, isLoading, refetch } = api.riples.getAll.useQuery({
        limit: 10,
        offset: offset,
    });

    const { data: publicProjectData } = api.projects.getAll.useQuery()

    const loadNextRiples = async () => {
        setOffset(prevOffset => prevOffset + 10);
        const newData = await refetch();
        if (newData.data) {
            setRiples(newData.data); // Replace the existing riples with the new set
            if (newData.data.length < 10) setHasMoreRiples(false);
        } else {
            console.error('Failed to fetch new data or data is null.');
        }
    }; 

    const loadPreviousRiples = async () => {
        setOffset(prevOffset => Math.max(prevOffset - 10, 0));
        setHasMoreRiples(true)
        const newData = await refetch();
        if (newData.data) {
            setRiples(newData.data);
        } else {
            console.error('Failed to fetch previous data or data is null.');
        }
    };
  

    if (isLoading) return(<LoadingPage isLoading={isLoading}></LoadingPage>)
  
    if (!data || !publicProjectData) return(<div> Something went wrong</div>)

  
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

        <div id="socialfeed" className="space-y-4 mr-2 ml-2 md:mr-5 md:ml-5">
          {data?.map((fullRiple, index) => (
          <React.Fragment key={fullRiple.riple.id}>
            <RipleCard {...fullRiple} />
            {((index + 1) == 5) && <ProjectFollowCarousel projects={publicProjectData} />} {/* This will insert the carousel after every 5 Riples */}
          </React.Fragment>
        ))}
        </div>

        <div className="flex justify-between mt-4">
            {/* Previous 10 Button */}
            <span className="text-lg flex justify-center items-center space-x-4 w-auto">
                {offset !== 0 && (
                    <button 
                        onClick={() => {void loadPreviousRiples()}}
                        className="bg-blue-500 text-white text-lg rounded px-4 py-1 flex items-center justify-center w-auto"
                        disabled={offset === 0}
                    >
                        <span className='flex items-center'>
                            {/* Assuming you've imported ArrowLeftSVG at the top */}
                            <ArrowLeftSVG width="4" height="4" marginRight="2" />
                            Previous 10
                        </span>
                    </button>
                )}
            </span>

            {/* Next 10 Button */}
            <span className="text-lg flex justify-center items-center space-x-4 w-auto">
                {hasMoreRiples && (
                    <button 
                        onClick={() => { void loadNextRiples(); }}
                        className="bg-blue-500 text-white text-lg rounded px-4 py-1 flex items-center justify-center w-auto"
                    >
                        <span className='flex items-center'>
                            Next 10
                            <ArrowRightSVG width="4" height="4" marginLeft="2" />
                        </span>
                    </button>
                )}
            </span>
        </div>

    </div>
    )
} 




