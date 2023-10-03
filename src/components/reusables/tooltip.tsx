import { useState } from "react";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    width?: string;
    shiftLeft?: boolean;
    shiftRight?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, width, shiftLeft = false, shiftRight = false }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    let leftValue = '50%';
    let transformValue = 'translateX(-50%)';

    if (shiftLeft) {
        leftValue = '0%';
        transformValue = 'none';
    } else if (shiftRight) {
        leftValue = '100%';
        transformValue = 'translateX(-100%)';  // This will shift the tooltip fully to the left, effectively making it appear to the right of the target
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
                    bottom: '100%',
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

export default Tooltip;
