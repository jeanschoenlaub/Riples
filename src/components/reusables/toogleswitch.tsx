import React from 'react';

interface ToggleProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  option1: string;
  option2: string;
  width?: string;
  height?: string;
  background?: string;
}

const ToggleSwitch: React.FC<ToggleProps> = ({
  activeTab, 
  setActiveTab,
  option1,
  option2,
  width = "w-40",
  height = "h-auto",
  background ="bg-gray-300",
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`mx-2 ${width} ${height} ${background} rounded-full cursor-pointer relative py-4`}>
        <div
          className={`absolute top-0 h-full bg-blue-500 bg-opacity-50 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out ${activeTab === option1 ? `left-0 w-1/2` : `left-1/2 w-1/2`}`}
        ></div>
        <div
          onClick={() => setActiveTab(option1)}
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center rounded-full cursor-pointer ${activeTab === option1 ? "text-blue-500" : "text-gray-500"} p-2`}
        >
          {option1}
        </div>
        <div
          onClick={() => setActiveTab(option2)}
          className={`absolute top-0 left-1/2 w-1/2 h-full flex items-center justify-center rounded-full cursor-pointer ${activeTab === option2 ? "text-blue-500" : "text-gray-500"} p-2`}
        >
          {option2}
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
