import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { Modal} from "~/components/modal-template";
import { GithubSVG, GoogleSVG } from '~/components';

interface SignInModalProps {
  showModal: boolean;
  onClose: () => void;
}

export const NavBarSignInModal: React.FC<SignInModalProps> = ({ showModal, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true); // <- set loading state
    try {
      const result = await signIn('email', { email });
      if (result?.error) {
        toast.error(result.error);
        return; // return early if an error occurred
      }
      onClose();
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    } finally {
      setIsLoading(false); // <- unset loading state
    }
  };

  const handleSignInG = async () => {
    setIsLoading(true); // <- set loading state
    try {
      const result = await signIn('google');
      if (result?.error) {
        toast.error(result.error);
        return; // return early if an error occurred
      }
      onClose();
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    } finally {
      setIsLoading(false); // <- unset loading state
    }
  };

  const handleSignInF = async () => {
    setIsLoading(true); // <- set loading state
    try {
      const result = await signIn('facebook');
      if (result?.error) {
        toast.error(result.error);
        return; // return early if an error occurred
      }
      onClose();
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    } finally {
      setIsLoading(false); // <- unset loading state
    }
  };

  const handleSignInGithub = async () => {
    setIsLoading(true); // <- set loading state
    try {
      const result = await signIn('github');
      if (result?.error) {
        toast.error(result.error);
        return; // return early if an error occurred
      }
      onClose();
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    } finally {
      setIsLoading(false); // <- unset loading state
    }
  };

  const handleSignInL = async () => {
    setIsLoading(true); // <- set loading state
    try {
      const result = await signIn('linkedin');
      if (result?.error) {
        toast.error(result.error);
        return; // return early if an error occurred
      }
      onClose();
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    } finally {
      setIsLoading(false); // <- unset loading state
    }
  };

  return (
    <Modal showModal={showModal} isLoading={isLoading} onClose={onClose} size="small">
      <label className="block text-xs mb-2 mt-4">
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 rounded border"
          maxLength={100}
        />
      </label>
      <div className='flex flex-col items-center justify-center'>

          {/* Email Sign In Button */}
          <button className="bg-sky-50 text-black rounded border-2 mt-2 border-slate-400 w-60 justify-center px-4 py-2 mb-2" onClick={() => {void handleSignIn()}}>
              Sign In with your email
          </button>
          <div className='text-sm italic mb-2 px-1'> (Make sure to check your email junk box) </div>

          {/* Horizontal Rule */}
          <hr className="w-full my-2" />

          {/* Google Sign In Button */}
          <h1>Sign In with your favorite provider</h1>
          <button 
            type="submit" 
            className="bg-sky-50 text-black border-2 border-slate-400 w-60 justify-center rounded mt-4 px-4 py-2 mb-2 flex items-center" 
            onClick={() => {void handleSignInG()}}
          >
            <img 
                loading="lazy" 
                height="24" 
                width="24" 
                src="https://authjs.dev/img/providers/google.svg" 
                alt="Google"
                className="mr-2"
            />
            <span>Sign in with Google</span>
        </button>
        
        {/* Github In Button */}
        <button 
            type="submit" 
            className="bg-sky-50 text-black border-2 border-slate-400 w-60 justify-center rounded mt-4 px-4 py-2 mb-2 flex items-center" 
            onClick={() => {void handleSignInGithub()}}
          >
            <GithubSVG marginRight='2'></GithubSVG>
            <span>Sign in with Github</span>
        </button>
        {/* linkedIn Button */}
        <button 
            type="submit" 
            className="bg-sky-50 text-black border-2 border-slate-400 w-60 justify-center rounded mt-4 px-4 py-2 mb-2 flex items-center" 
            onClick={() => {void handleSignInL()}}
          >
            <img 
                loading="lazy" 
                height="24" 
                width="24" 
                src="https://authjs.dev/img/providers/linkedin.svg" 
                alt="Linkedin svg"
                className="mr-2"
            />
            <span>Sign in with Linkedin</span>
        </button>
        {/* Facebook , not verified yet 
        <button 
            type="submit" 
            className="bg-sky-50 text-black border-2 border-slate-400 w-60 justify-center rounded mt-4 px-4 py-2 mb-2 flex items-center" 
            onClick={() => {void handleSignInF()}}
          >
            <img 
                loading="lazy" 
                height="24" 
                width="24" 
                src="https://authjs.dev/img/providers/facebook.svg" 
                alt="Google"
                className="mr-2"
            />
            <span>Sign in with Facebook</span>
        </button>*/}
        

      </div>

    </Modal>
  );
};
