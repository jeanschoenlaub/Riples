import router from 'next/router';
import React from 'react';
import type { ReactNode } from 'react';

interface ToggleProps {
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  option1: string;
  option2: string;
  option1Node?: ReactNode;
  option2Node?: ReactNode;
  inBetween?: boolean; // Optional middle option
  width?: string;
  height?: string;
  background?: string;
  id? : string;
}

export const ToggleSwitch: React.FC<ToggleProps> = ({
  activeTab, 
  setActiveTab,
  option1,
  option2,
  option1Node,
  option2Node,
  inBetween,
  width = "w-40",
  height = "h-6",
  background ="bg-gray-100",
  id
}) => {
  const getBackgroundPosition = () => {
    if (inBetween) return 'left-1/2 transform -translate-x-1/2';
    return activeTab === option1 ? 'left-0 w-1/2' : 'left-1/2 w-1/2';
  }

  // toogle blue overlay is either half of the toogle size (ie covers one word) or a blue dot in between  
  const computedWidth = inBetween ? "w-8" : `w-${parseInt(width) / 2}`;
  
  const handleRedirectHome = async (option: string) => {
    await router.push(`/?activeTab=${option}`).catch(err => {
      console.error("Navigation error:", err);
    });
  };
  

  const handleOptionClick = (option: string) => {
    if (activeTab && setActiveTab) {
      setActiveTab(option);
    } else {
      void handleRedirectHome(option);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div id={id} className={`mx-2 ${width} ${height} ${background} rounded-full cursor-pointer relative py-4`}>
        <div
          className={`absolute top-0 h-full bg-blue-400 ${computedWidth} bg-opacity-50 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out ${getBackgroundPosition()}`}
        ></div>
        <div
          onClick={() => handleOptionClick(option1)}
          className={`absolute top-0 left-0 w-1/2 h-full text-xl flex items-center justify-center rounded-full cursor-pointer  p-2 ${activeTab === option1 && !inBetween ? "text-blue-600" : "text-gray-500"}`}
        >
          {option1Node ? option1Node : option1}
        </div>
        <div
          onClick={() => handleOptionClick(option2)}
          className={`absolute top-0 left-1/2 w-1/2 h-full text-xl flex items-center justify-center rounded-full cursor-pointer  p-2 ${activeTab === option2 && !inBetween ? "text-blue-600" : "text-gray-500"}`}
        >
          {option2Node ? option2Node : option2}
        </div>
      </div>
    </div>
  );
};
