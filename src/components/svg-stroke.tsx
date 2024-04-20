

export const TaskSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
            <svg
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none" 
            width="18" 
            height="20"
            viewBox="0 0 18 20"
        >
        <path 
          stroke={colorStrokeHex}  // Blue and Gray colors
          strokeLinecap="round" 
          strokeWidth="2"
          d="M12 2h4a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4m6 0v3H6V2m6 0a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1M5 5h8m-5 5h5m-8 0h.01M5 14h.01M8 14h5" />
        </svg>
    );
};



export const TaskEditSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFill= "currentColor", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill={colorFill}
            viewBox="0 0 20 20"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M15 17v1a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2M6 1v4a1 1 0 0 1-1 1H1m13.14.772 2.745 2.746M18.1 5.612a2.086 2.086 0 0 1 0 2.953l-6.65 6.646-3.693.739.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"/>
        </svg>
    );
};


export const StarSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" 
                viewBox="0 0 21 20"
            >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="m11.479 1.712 2.367 4.8a.532.532 0 0 0 .4.292l5.294.769a.534.534 0 0 1 .3.91l-3.83 3.735a.534.534 0 0 0-.154.473l.9 5.272a.535.535 0 0 1-.775.563l-4.734-2.49a.536.536 0 0 0-.5 0l-4.73 2.487a.534.534 0 0 1-.775-.563l.9-5.272a.534.534 0 0 0-.154-.473L2.158 8.48a.534.534 0 0 1 .3-.911l5.294-.77a.532.532 0 0 0 .4-.292l2.367-4.8a.534.534 0 0 1 .96.004Z"/>
            </svg>
    );
};


export const RocketSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" 
                viewBox="0 0 21 20"
            >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="m8.806 5.614-4.251.362-2.244 2.243a1.058 1.058 0 0 0 .6 1.8l3.036.356m9.439 1.819-.362 4.25-2.243 2.245a1.059 1.059 0 0 1-1.795-.6l-.449-2.983m9.187-12.57a1.536 1.536 0 0 0-1.26-1.26c-1.818-.313-5.52-.7-7.179.96-1.88 1.88-5.863 9.016-7.1 11.275a1.05 1.05 0 0 0 .183 1.25l.932.939.937.936a1.049 1.049 0 0 0 1.25.183c2.259-1.24 9.394-5.222 11.275-7.1 1.66-1.663 1.275-5.365.962-7.183Zm-3.332 4.187a2.115 2.115 0 1 1-4.23 0 2.115 2.115 0 0 1 4.23 0Z"/>
                  </svg>
    );
};

export const TrashSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" 
                viewBox="0 0 21 20"
            >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
                </svg>
    );
};

export const QuestionSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" 
                viewBox="0 0 21 20"
            >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
    );
};

export const ClipboardSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" 
                viewBox="0 0 21 20"
            >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M5 5h8m-1-3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1m6 0v3H6V2m6 0h4a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4m0 9.464 2.025 1.965L12 9.571"/>
                </svg>
    );
};

export const GoalSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill={colorStrokeHex}
            viewBox="0 0 22 20"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="m11.479 1.712 2.367 4.8a.532.532 0 0 0 .4.292l5.294.769a.534.534 0 0 1 .3.91l-3.83 3.735a.534.534 0 0 0-.154.473l.9 5.272a.535.535 0 0 1-.775.563l-4.734-2.49a.536.536 0 0 0-.5 0l-4.73 2.487a.534.534 0 0 1-.775-.563l.9-5.272a.534.534 0 0 0-.154-.473L2.158 8.48a.534.534 0 0 1 .3-.911l5.294-.77a.532.532 0 0 0 .4-.292l2.367-4.8a.534.534 0 0 1 .96.004Z"/>
        </svg>
    );
};

export const MenuSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFill= "currentColor", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill={colorFill}
            viewBox="0 0 17 14"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    );
};


export const BellSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill={colorStrokeHex}
            viewBox="0 0 16 20"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z"/>
            </svg>
    );
};

export const ShareSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill={colorStrokeHex}
            viewBox="0 0 18 18"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="m5.953 7.467 6.094-2.612m.096 8.114L5.857 9.676m.305-1.192a2.581 2.581 0 1 1-5.162 0 2.581 2.581 0 0 1 5.162 0ZM17 3.84a2.581 2.581 0 1 1-5.162 0 2.581 2.581 0 0 1 5.162 0Zm0 10.322a2.581 2.581 0 1 1-5.162 0 2.581 2.581 0 0 1 5.162 0Z"/>
            </svg>
    );
};

export const ArrowLeftSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill={colorStrokeHex}
            viewBox="0 0 14 10"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M13 5H1m0 0 4 4M1 5l4-4"/>
            </svg>
    );
};

export const ArrowRightSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill={colorStrokeHex}
            viewBox="0 0 14 10"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
    );
};

export const FollowEmptySVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 14 20"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"/>
            </svg>
    );
};


export const CodeSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 20 16"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15"/>
            </svg>
              
    );
};

export const BreadCrumbArrowSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 14 6"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="m1 9 4-4-4-4"/>
        </svg>
              
    );
};


export const MagicWandSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 20 21"
        >

        <path 
            fill={colorStrokeHex}  
            d="M16 13h-2v2h2v-2ZM10 2H8v2h2V2ZM7 4H5v2h2V4ZM4 2H2v2h2V2Zm15 8h-2v2h2v-2Zm0 5h-2v2h2v-2Z"
        />
        <path 
            stroke={colorStrokeHex}  
            strokeLinecap="round" 
            strokeWidth="2"
            strokeLinejoin="round"
            d="m12.555 5.117 2.828 2.828M14 16v4m-2-2h4M3 6v4M1 8h4m11.01-6.339 2.828 2.829L3.99 19.339 1.161 16.51 16.01 1.661Z"/>
        </svg>     
    );
};


export const NextRightArrowSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 8 14"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="1"
                strokeLinejoin="round"
                d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
        </svg>
    );
};

export const PrevLeftArrowSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 8 14"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="1"
                strokeLinejoin="round"
                d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
        </svg>
    );
};

export const GiftSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 20 20"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M8 19v-9m3-4H5.5a2.5 2.5 0 1 1 0-5C7 1 8.375 2.25 9.375 3.5M12 19v-9m-9 0h14v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8ZM2 6h16a1 1 0 0 1 1 1v3H1V7a1 1 0 0 1 1-1Zm12.155-5c-3 0-5.5 5-5.5 5h5.5a2.5 2.5 0 0 0 0-5Z"/>
        </svg>
    );
};

export const GlobeSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 21 20"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M6.487 1.746c0 4.192 3.592 1.66 4.592 5.754 0 .828 1 1.5 2 1.5s2-.672 2-1.5a1.5 1.5 0 0 1 1.5-1.5h1.5m-16.02.471c4.02 2.248 1.776 4.216 4.878 5.645C10.18 13.61 9 19 9 19m9.366-6h-2.287a3 3 0 0 0-3 3v2m6-8a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
    );
};

export const UpArrowSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 14 8"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="0.8"
                strokeLinejoin="round"
                d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
             </svg>
    );
};


export const DownArrowSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 10 6"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="0.8"
                strokeLinejoin="round"
                d="m1 1 4 4 4-4" />
        </svg> 
    );
};

export const ExternalLinkSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 20 20"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="1"
                strokeLinejoin="round"
                d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
            </svg>
    );
};

export const ProjectSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 22 21"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="1"
                strokeLinejoin="round"
                d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
            </svg>
    );
};

export const NotesSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 24 24"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M5 19V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v13H7a2 2 0 0 0-2 2Zm0 0c0 1.1.9 2 2 2h12M9 3v14m7 0v4"/>
            </svg>
    );
};

export const LinksSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorStrokeHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 24 24"
        >
            <path 
                stroke={colorStrokeHex}  // Blue and Gray colors
                strokeLinecap="round" 
                strokeWidth="2"
                strokeLinejoin="round"
                d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
        </svg>
    );
};

