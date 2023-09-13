import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { signIn, getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';

interface SignInModalProps {
  showModal: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ showModal, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);


  const resetForm = () => {
    setUsername('');
    setEmail('');
    onClose();
  };

  const handleSignIn = async () => {
        if (isSignUp) {
            const result = await signIn('email', {
                redirect: false,
                email,
              });
            //To-Do Sign up email sent notif 
            if (result?.error) {
                toast.error(result.error);
            } else {
                getSession().then((newSession) => {
                    console.log(newSession); // Optionally, inspect the new session
                    onClose(); // Close the modal
                });
            }
        } else {
          const result = await signIn('email', {
            redirect: false,
            email,
          });
            
            if (result?.error) {
                toast.error(result.error);
            } else {
                console.log("getting session on client");
                getSession().then((newSession) => {
                    console.log(newSession); // Optionally, inspect the new session
                    onClose(); // Close the modal
                  });
            }
        }
      };
    
  return (
    <div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded p-4 w-1/3">
      
            {isSignUp && (
            <label className="block text-sm mb-2">
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mt-1 rounded border"
                maxLength={100}
              />
            </label>
          )}

          <label className="block text-sm mb-2">
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 rounded border"
              maxLength={100}
            />
          </label>

          <button 
            onClick={handleSignIn}
            className="bg-green-500 text-white rounded px-4 py-2 mb-2"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          <button 
            onClick={resetForm}
            className="bg-red-500 text-white rounded px-4 py-2 mb-2"
          >
            Close
          </button>
          <div className="mt-2">
              <span className="text-grey text-sm">
                {isSignUp ? 'Already a user? ' : 'Not a user already? '}
                <button 
                  className="text-blue-500 text-sm" 
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? ' Sign In' : ' Sign Up'}
                </button>
              </span>
            </div>
        </div>
        
      </div>
      )}
      </div>
  );
};
