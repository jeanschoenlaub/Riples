import { useState } from "react";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);

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
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px',
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: '4px',
                    zIndex: 10,
                    whiteSpace: 'nowrap'
                }}>
                    {content}
                </div>
            )}
            {children}
        </div>
    );
};

export default Tooltip;
