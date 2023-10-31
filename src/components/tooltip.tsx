import { useState } from "react";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    width?: string;
    shiftLeft?: boolean;
    shiftRight?: boolean;
    shiftDown?: boolean;  // New prop
}

export const Tooltip: React.FC<TooltipProps> = ({ 
    content, 
    children, 
    width, 
    shiftLeft = false, 
    shiftRight = false,
    shiftDown = false   // Default value set to false 
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    let leftValue = '50%';
    let topValue: string | undefined = '100%';
    let bottomValue: string | undefined = undefined;
    let transformValue = 'translateX(-50%)';

    if (shiftLeft) {
        leftValue = '0%';
        transformValue = 'none';
    } else if (shiftRight) {
        leftValue = '100%';
        transformValue = 'translateX(-100%)';
    }

    if (shiftDown) {
        topValue = '0';
        bottomValue = '100%';
    }

    return (
        <div 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ position: 'relative', cursor: 'pointer' }}
        >
            {showTooltip && (
                <div style={{
                    position: 'absolute',
                    top: topValue,
                    bottom: bottomValue,
                    left: leftValue,
                    transform: transformValue,
                    padding: '4px',
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: '4px',
                    zIndex: 10,
                    width: width ?? 'auto',
                    whiteSpace: width ? 'normal' : 'nowrap', 
                    overflowWrap: 'break-word',
                    boxSizing: 'border-box'
                }}>
                    {content}
                </div>
            )}
            {children}
        </div>
    );
};

