import React, { useEffect, useState, useCallback } from 'react';

const ShiningDotsAnimation = () => {
    const [dots, setDots] = useState([]);
    const [containerWidth, setContainerWidth] = useState(1200);

    // Update container width on resize
    useEffect(() => {
        const updateWidth = () => {
            setContainerWidth(window.innerWidth);
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const createDot = useCallback(() => {
        const id = Date.now() + Math.random();
        const startX = Math.random() * containerWidth;
        const size = Math.random() * 2 + 0.8; // Smaller: 0.8-2.8px (reduced from 1.5-4.5px)
        const duration = Math.random() * 6 + 18; // Much slower: 18-24 seconds
        const delay = Math.random() * 6; // 0-6 seconds delay
        const opacity = Math.random() * 0.3 + 0.6; // 0.6-0.9 opacity

        // Beautiful gradient colors
        const colors = [
            '#3B82F6', // Blue
            '#6366F1', // Indigo  
            '#8B5CF6', // Violet
            '#A855F7', // Purple
            '#06B6D4', // Cyan
            '#10B981', // Emerald
            '#F59E0B', // Amber
            '#EF4444', // Red
            '#EC4899', // Pink
            '#F97316', // Orange
            '#84CC16', // Lime
            '#06B6D4', // Cyan
        ];

        const color = colors[Math.floor(Math.random() * colors.length)];

        return {
            id,
            startX,
            size,
            duration,
            delay,
            opacity,
            color,
            // Subtle horizontal drift
            driftX: (Math.random() - 0.5) * 60, // Reduced drift
        };
    }, [containerWidth]);

    useEffect(() => {
        const generateDots = () => {
            // More stars: increased from 25 to 40
            const newDots = Array.from({ length: 40 }, createDot);
            setDots(newDots);
        };

        // Initial generation
        generateDots();

        // Regenerate dots much less frequently for very slow effect
        const interval = setInterval(generateDots, 15000); // Much slower regeneration

        return () => clearInterval(interval);
    }, [createDot]);

    return (
        <>
            {/* CSS Keyframes */}
            <style jsx global>{`
                @keyframes smoothFloatUp {
                    0% {
                        transform: translateY(100px) translateX(0) scale(0);
                        opacity: 0;
                    }
                    3% {
                        transform: translateY(80px) translateX(0) scale(0.3);
                        opacity: 0.3;
                    }
                    8% {
                        transform: translateY(50px) translateX(0) scale(1);
                        opacity: 1;
                    }
                    15% {
                        opacity: 1;
                    }
                    85% {
                        transform: translateY(-1200px) translateX(var(--drift-x)) scale(1);
                        opacity: 0.8;
                    }
                    95% {
                        transform: translateY(-1350px) translateX(var(--drift-x)) scale(0.7);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(-1500px) translateX(var(--drift-x)) scale(0);
                        opacity: 0;
                    }
                }
                
                @keyframes gentleShimmer {
                    0%, 100% {
                        box-shadow: 0 0 3px currentColor, 0 0 6px currentColor;
                        filter: brightness(1);
                    }
                    50% {
                        box-shadow: 0 0 6px currentColor, 0 0 12px currentColor, 0 0 18px currentColor;
                        filter: brightness(1.2);
                    }
                }
                
                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.7;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                }
            `}</style>

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {dots.map((dot) => (
                    <div
                        key={dot.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${dot.startX}px`,
                            bottom: '-50px', // Start from below the viewport
                            width: `${dot.size}px`,
                            height: `${dot.size}px`,
                            backgroundColor: dot.color,
                            opacity: dot.opacity,
                            '--drift-x': `${dot.driftX}px`,
                            animation: `smoothFloatUp ${dot.duration}s cubic-bezier(0.15, 0.25, 0.25, 0.95) ${dot.delay}s infinite, gentleShimmer 6s ease-in-out infinite`, // Much slower with gentler easing
                            boxShadow: `0 0 ${dot.size * 1.5}px ${dot.color}`, // Smaller glow
                            filter: 'blur(0.2px)', // Less blur
                        }}
                    />
                ))}

                {/* Additional sparkle effects - more white stars */}
                {dots.slice(0, 20).map((dot) => ( // Increased from 12 to 20
                    <div
                        key={`sparkle-${dot.id}`}
                        className="absolute rounded-full"
                        style={{
                            left: `${dot.startX + (Math.random() - 0.5) * 30}px`,
                            bottom: '-30px',
                            width: '1px', // Smaller sparkles
                            height: '1px',
                            backgroundColor: '#FFFFFF',
                            opacity: 0.8,
                            animation: `smoothFloatUp ${dot.duration + 2}s cubic-bezier(0.15, 0.25, 0.25, 0.95) ${dot.delay + 1}s infinite, twinkle 5s ease-in-out infinite`, // Much slower
                            boxShadow: '0 0 3px #FFFFFF, 0 0 6px #FFFFFF',
                        }}
                    />
                ))}

                {/* Extra tiny stars for more density */}
                {Array.from({ length: 15 }, (_, i) => (
                    <div
                        key={`extra-star-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: `${Math.random() * containerWidth}px`,
                            bottom: '-40px',
                            width: '0.8px',
                            height: '0.8px',
                            backgroundColor: '#E5E7EB',
                            opacity: 0.6,
                            animation: `smoothFloatUp ${18 + Math.random() * 6}s cubic-bezier(0.15, 0.25, 0.25, 0.95) ${Math.random() * 12}s infinite, twinkle 6s ease-in-out infinite`,
                            boxShadow: '0 0 2px #E5E7EB',
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default ShiningDotsAnimation;