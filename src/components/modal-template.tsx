import React from 'react';
import { LoadingRiplesLogo } from './loading';
import Image from 'next/image';

interface ModalProps {
  showModal: boolean;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  isLoading?: boolean;
  Logo?: boolean;
  Success?: boolean;
  Achievement?: boolean;
  onClose: () => void;  // <-- Add this prop
}

export const Modal: React.FC<ModalProps> = ({ showModal, isLoading, size = 'medium', children, Logo, Success, Achievement, onClose }) => {
  const sizeClass = {
    small: 'w-2/3 sm:w-2/3 md:w-1/4 max-h-full sm:max-h-[80vh]',
    medium: 'w-full sm:w-2/3 md:w-1/2 max-h-full sm:max-h-[80vh]',
    large: 'w-full sm:w-3/4 max-h-full sm:max-h-[80vh]',
  };

  Modal.defaultProps = {
    Logo: true,
    Success: false,
  };
  

  return (
    <div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`bg-white rounded-lg p-4 ${sizeClass[size]} shadow-lg relative overflow-y-auto`}>
            <button 
              onClick={onClose} 
              style={{ top: 'calc(50% - someValue)', right: 'calc(50% - someOtherValue)' }} 
              className="fixed text-red-600 hover:text-red-800 text-xl z-10">
              &times; {/* This is an HTML entity representing a multiplication symbol (looks like 'x') */}
            </button>
            {(Logo && !Success && !Achievement)  ? (
            <div className="flex justify-center my-4">
              {isLoading ? (
                <LoadingRiplesLogo isLoading={isLoading}/>
              ) : (
                <div className="loading-container">
                  <Image
                    src="/images/logo_256x256.png"
                    className="droplet"
                    alt="Riple logo"
                    width={256}
                    height={256}
                  />
                </div>
              )}
            </div>) : <div className="flex justify-center my-4"></div> }
            {/* Increase the font-size for the emoji */}
            {Success ?  <div className="flex justify-center my-4 text-6xl"> 🎉 </div> : null}
            {Achievement ?  <div className="flex justify-center my-4 text-6xl"> 🏅 </div> : null}

            {children}
          </div>
        </div>
      )}
    </div>
  );
};