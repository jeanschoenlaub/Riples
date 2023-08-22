import toast from "react-hot-toast";

import { api } from "~/utils/api";
import { useState } from "react";
import { LoadingSpinner } from "./loading";


export const CreateRipleWizard = () => {
    // TO-DO Far from ideal - rerenders on server every key @1:52
    const [input, setInput] = useState("")
    const ctx = api.useContext();
  
    //We add a mutation for creating a post (with on success)
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
    </div>
    )
  }
  