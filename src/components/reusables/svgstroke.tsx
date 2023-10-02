

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