import Image from 'next/image';
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import { useState } from "react";
import type { RouterOutputs } from "~/utils/api";

//My components
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import Link from 'next/link';


export const Feed = () => {
    const { data, isLoading } = api.riples.getAll.useQuery();
    // TO-DO Far from ideal - rerenders on server every key @1:52
    const [input, setInput] = useState("")
    const ctx = api.useContext();
        
    //We had a mutation for creating a post (with on success)
    const {mutate, isLoading: isPosting}  = api.projects.create.useMutation({
      onSuccess: () => {
        setInput("");
        void ctx.projects.getAll.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content
        if (errorMessage?.[0]){
          toast.error(errorMessage[0])
        }
        else {toast.error("Post failed ! Please try again later")}
  
      }
    });

    if (isLoading ) return(<LoadingPage></LoadingPage>)
  
    if (!data) return(<div> Something went wrong</div>)
  
    return ( 
      <div>
        <input 
          placeholder="Create a Riple"
          className="grow "
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled = {isPosting}
        >
        </input> 
        { input !== "" && !isPosting && (
            <button  disabled = {isPosting} onClick={() => mutate({content:input})}> 
              Post
            </button>
          )
        }
        {isPosting && (
          <div className="flex items-left justify-left">
             <LoadingSpinner size={20}></LoadingSpinner>
          </div>
        )}
        {data?.map((fullRiple) => (
          <RipleCardMeta key={fullRiple.riples.id} {...fullRiple}></RipleCardMeta>
        ))}
    </div>
    )
  } 
  
  //Not using for now but might use on a user profile a list of project 
  type ProjectWithUser = RouterOutputs["projects"]["getAll"][number]
  const ProjectCardMeta = (props: ProjectWithUser) => {
    const {projects, author} = props;
  
    const getImagePath = (ripleType: string) => {
      if (ripleType === 'solo') {
        return '/images/solo_riple.png';
      } else {
        return '/images/multi_riple.png';
      }
    };
  
    return (
      <div id="riple-card" className="border-b border-slate-700 p-4" key={projects.id}>
        <div id="riple-card-metadata"  className="flex gap-3 items-center border-b border-e border-t border-l border-slate-300 p-2 g-4 justify-between rounded-2xl bg-white">
            <div id="riple-card-metadata-auth-profile-image" className="flex gap-2 items-center">
                <Image 
                    src={author?.imageUrl} 
                    alt="Profile Image" 
                    className="rounded-full"
                    width={40}
                    height={40}
                    objectFit="cover"
                    objectPosition="center"
                />
                <div id="riple-card-metadata-auth-name-and-created-date">
                    <div className="font-bold text-gray-800"> 
                      <Link href={`/projects/${projects.id}`}>
                        {projects.title}
                      </Link>
                    </div>
                    <span className="text-sm text-gray-400"> 
                        {` by `}
                        <span className="font-bold text-gray-400">{`${author?.firstName} ${author?.lastName}`}</span>
                        <span>{` ${dayjs(projects.createdAt).fromNow()} `}</span>
                    </span>
                </div>
            </div>
    
            <div className="flex-shrink-0">
                <div id="riple-card-riple-type" className="flex items-center justify-center"> {/* Added items-center and justify-center */}
                    <Image 
                        src={getImagePath(projects.ripleType)} 
                        alt="Riple Type"
                        className="rounded-full"
                        width={40}
                        height={40}
                    />
                </div>
            </div>
        </div>
      </div>
    );
  }


  //Not using for now but might use on a user profile a list of riple 
  type RipleWithUser = RouterOutputs["riples"]["getAll"][number]
  const RipleCardMeta = (props: RipleWithUser) => {
    const {riples, author} = props;
  
    const getImagePath = (ripleType: string) => {
      if (ripleType === 'solo') {
        return '/images/solo_riple.png';
      } else {
        return '/images/multi_riple.png';
      }
    };
  
    return (
      <div id="riple-card" className="border-b border-slate-700 p-4" key={riples.id}>
        <div id="riple-card-metadata"  className="flex gap-3 items-center border-b border-e border-t border-l border-slate-300 p-2 g-4 justify-between rounded-2xl bg-white">
            <div id="riple-card-metadata-auth-profile-image" className="flex gap-2 items-center">
                <Image 
                    src={author?.imageUrl} 
                    alt="Profile Image" 
                    className="rounded-full"
                    width={40}
                    height={40}
                    objectFit="cover"
                    objectPosition="center"
                />
                <div id="riple-card-metadata-auth-name-and-created-date">
                    <div className="font-bold text-gray-800"> 
                      <Link href={`/riples/${riples.id}`}>
                        {riples.title}
                      </Link>
                    </div>
                    <span className="text-sm text-gray-400"> 
                        {` by `}
                        <span className="font-bold text-gray-400">{`${author?.firstName} ${author?.lastName}`}</span>
                        <span>{` ${dayjs(riples.createdAt).fromNow()} `}</span>
                    </span>
                </div>
            </div>
        </div>
      </div>
    );
  }