import React, { useState, useEffect } from 'react';
import './CursorTracker.css'; // Import the CSS file for styling

const CursorTracker = () => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [largeCirclePosition, setLargeCirclePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateCursorPosition = (event) => {
            const { clientX, clientY } = event;
            setCursorPosition({ x: clientX, y: clientY });
        };

        window.addEventListener('mousemove', updateCursorPosition);

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition);
        };
    }, []);

    useEffect(() => {
        const updateLargeCirclePosition = () => {
            // Smoothly interpolate the large circle position towards the cursor position
            setLargeCirclePosition((prevPosition) => {
                const easeFactor = 0.2; // Adjust this value for different levels of smoothness
                const dx = cursorPosition.x - prevPosition.x;
                const dy = cursorPosition.y - prevPosition.y;
                const newX = prevPosition.x + dx * easeFactor;
                const newY = prevPosition.y + dy * easeFactor;

                // Check if the large circle is close enough to the target position
                const distance = Math.sqrt(dx * dx + dy * dy);
                const threshold = 5; // Adjust this value as needed
                if (distance < threshold) {
                    // Settle directly on the target position
                    return { x: cursorPosition.x, y: cursorPosition.y };
                } else {
                    // Continue interpolation
                    return { x: newX, y: newY };
                }
            });
        };

        const animationFrame = requestAnimationFrame(updateLargeCirclePosition);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [cursorPosition]);

    return (
        <div className="cursor-container">
            <div className="large-circle" style={{ left: largeCirclePosition.x - 15, top: largeCirclePosition.y - 15 }}></div>
            <div className="small-circle" style={{ left: cursorPosition.x - 7.5, top: cursorPosition.y - 7.5 }}></div>
        </div>
    );
};

export default CursorTracker;
