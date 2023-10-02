
export const EditSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor" 
            viewBox="0 0 20 18"
        >
            <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
            <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
        </svg>
    );
};

export const GoalSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
        <svg 
            className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill={colorFillHex}
            viewBox="0 0 22 20"
        >
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m11.479 1.712 2.367 4.8a.532.532 0 0 0 .4.292l5.294.769a.534.534 0 0 1 .3.91l-3.83 3.735a.534.534 0 0 0-.154.473l.9 5.272a.535.535 0 0 1-.775.563l-4.734-2.49a.536.536 0 0 0-.5 0l-4.73 2.487a.534.534 0 0 1-.775-.563l.9-5.272a.534.534 0 0 0-.154-.473L2.158 8.48a.534.534 0 0 1 .3-.911l5.294-.77a.532.532 0 0 0 .4-.292l2.367-4.8a.534.534 0 0 1 .96.004Z"/>
        </svg>
    );
};

export const ProjectsSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 20"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
    );
};

export const RiplesSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 20"
            >
             <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
    );
};
        
export const AboutSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 20"
            >
             <path d="M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.546l3.2 3.659a1 1 0 0 0 1.506 0L13.454 14H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-8 10H5a1 1 0 0 1 0-2h5a1 1 0 1 1 0 2Zm5-4H5a1 1 0 0 1 0-2h10a1 1 0 1 1 0 2Z" />
            </svg>
    );
};

export const MultiUserSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 19"
            >
                <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
                <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/>
            </svg>
    );
};
     
export const AdminSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 20"
            >
             <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                  </svg>
    );
};

export const SingleUserSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 20"
            >
            <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
            </svg>
    );
};

export const AddUserSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 18"
            >
            <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
            </svg>
    );
};

export const PrivateSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 18"
            >
            <path d="m2 13.587 3.055-3.055A4.913 4.913 0 0 1 5 10a5.006 5.006 0 0 1 5-5c.178.008.356.026.532.054l1.744-1.744A8.973 8.973 0 0 0 10 3C4.612 3 0 8.336 0 10a6.49 6.49 0 0 0 2 3.587Z"/>
            <path d="m12.7 8.714 6.007-6.007a1 1 0 1 0-1.414-1.414L11.286 7.3a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.401.211.59l-6.007 6.007a1 1 0 1 0 1.414 1.414L8.714 12.7c.189.091.386.162.59.211.011 0 .021.007.033.01a2.981 2.981 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z"/>
            <path d="M17.821 6.593 14.964 9.45a4.952 4.952 0 0 1-5.514 5.514L7.665 16.75c.767.165 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z"/>
            </svg>
    );
};

export const PublicSVG = ({ width = "6", height = "6", marginRight = "0", marginLeft = "0", className = "", colorFillHex="currentColor" }) => {
    return (
            <svg
                className={`w-${width} h-${height} mr-${marginRight} ml-${marginLeft} ${className}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill={colorFillHex}  // Blue and Gray colors
                viewBox="0 0 20 18"
            >
            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
            </svg>
    );
};



