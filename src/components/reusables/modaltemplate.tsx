import React from 'react';
import { LoadingRiplesLogo } from './loading';

interface ModalProps {
  showModal: boolean;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  isLoading?: boolean;
  onClose: () => void;  // <-- Add this prop
}

export const Modal: React.FC<ModalProps> = ({ showModal, isLoading, size = 'medium', children, onClose }) => {
  const sizeClass = {
    small: 'w-2/3 sm:w-2/3 md:w-1/4 max-h-full sm:max-h-[80vh]',
    medium: 'w-full sm:w-2/3 md:w-1/2 max-h-full sm:max-h-[80vh]',
    large: 'w-full sm:w-3/4 max-h-full sm:max-h-[80vh]',
  };
  

  return (
    <div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`bg-white rounded-lg p-4 ${sizeClass[size]} shadow-lg relative overflow-y-auto`}>
            <button 
              onClick={onClose} 
              style={{ top: 'calc(50% - someValue)', right: '100' }} 
              className="fixed text-red-600 hover:text-red-800 text-xl z-10">
              &times; {/* This is an HTML entity representing a multiplication symbol (looks like 'x') */}
            </button>
            <div className="flex justify-center my-4">
              {isLoading ? (
                <LoadingRiplesLogo />
              ) : (
                <div className="loading-container">
                  <img
                    src="/images/logo_128x128.png"
                    className="droplet"
                    alt="Riple logo"
                  />
                </div>
              )}
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};