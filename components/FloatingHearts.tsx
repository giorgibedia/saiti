import React, { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: number;
  animationDuration: number;
  delay: number;
  scale: number;
}

export const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Generate initial hearts
    const heartCount = 30;
    const newHearts: Heart[] = [];
    
    for (let i = 0; i < heartCount; i++) {
      newHearts.push({
        id: i,
        left: Math.random() * 100, // Percentage
        animationDuration: 10 + Math.random() * 20, // 10-30s
        delay: Math.random() * 15 * -1, // Negative delay to start mid-animation
        scale: 0.5 + Math.random() * 1, // 0.5 - 1.5 scale
      });
    }
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-pink-100 via-red-50 to-pink-200">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-pink-400/30 float-up select-none"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.scale * 2}rem`,
            willChange: 'transform, opacity',
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};