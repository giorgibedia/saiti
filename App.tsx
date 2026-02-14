import React, { useState, useRef } from 'react';
import { FloatingHearts } from './components/FloatingHearts';
import { Heart, Stars } from 'lucide-react';

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [isNoVanished, setIsNoVanished] = useState(false);
  
  // Ref to track the container to keep the button inside bounds
  const containerRef = useRef<HTMLDivElement>(null);

  // Moves the button to a random position (Used for Desktop Hover)
  const dodgeButton = () => {
    if (isNoVanished) return;
    if (!containerRef.current) return;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Button dimensions (safe estimate)
    const buttonWidth = 120;
    const buttonHeight = 60;
    
    // Calculate safe area (padding from edges)
    const padding = 20;

    // Generate random position within safe bounds
    const randomX = Math.random() * (viewportWidth - buttonWidth - padding * 2) + padding;
    const randomY = Math.random() * (viewportHeight - buttonHeight - padding * 2) + padding;

    setNoButtonPosition({ top: randomY, left: randomX });
  };

  const handleYesClick = () => {
    setIsAccepted(true);
  };

  const handleNoClick = (e: React.MouseEvent | React.TouchEvent) => {
    // When clicked/tapped, trigger the fly-off animation
    e.stopPropagation(); // Prevent bubbling
    setIsNoVanished(true);
  };

  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-transparent" ref={containerRef}>
      <FloatingHearts />

      {/* Main Card Content */}
      <div className="z-10 relative p-4 md:p-6 max-w-lg w-full text-center mx-auto">
        
        {!isAccepted ? (
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-pink-200 transform transition-all hover:scale-[1.02] duration-500 animate-pop-in">
            <div className="flex justify-center mb-6">
               <div className="relative">
                 <Heart className="text-red-500 fill-red-500 w-20 h-20 md:w-28 md:h-28 heart-beat drop-shadow-xl" />
                 <Stars className="text-yellow-400 w-8 h-8 absolute -top-2 -right-4 animate-spin-slow" />
               </div>
            </div>
            
            <h1 className="text-2xl md:text-5xl font-extrabold text-gray-800 mb-8 leading-snug tracking-tight">
              მარი,<br />
              <span className="text-pink-600 drop-shadow-sm">იქნები ჩემი ვალენტინი?</span>
            </h1>

            <div className="flex flex-row justify-center items-center gap-4 md:gap-8 h-24 relative">
              {/* YES Button */}
              <button
                onClick={handleYesClick}
                className={`bg-green-500 hover:bg-green-600 text-white text-lg md:text-xl font-bold py-3 px-6 md:px-10 rounded-full shadow-lg transform transition-all hover:scale-110 active:scale-95 flex items-center gap-2 z-20 ${isNoVanished ? 'scale-110 ring-4 ring-green-200 animate-pulse' : ''}`}
              >
                კი <span className="text-2xl">😍</span>
              </button>

              {/* NO Button */}
              <button
                onMouseEnter={dodgeButton} // Desktop: Run away on hover
                onClick={handleNoClick}    // Mobile/Desktop: Fly away on click
                className={`bg-red-500 text-white text-lg md:text-xl font-bold py-3 px-6 md:px-10 rounded-full shadow-lg transition-all duration-300 z-30 whitespace-nowrap
                  ${noButtonPosition && !isNoVanished ? 'fixed transition-all duration-200 ease-out' : 'relative'} 
                  ${isNoVanished ? 'animate-fly-off fixed' : ''}
                `}
                style={
                  noButtonPosition && !isNoVanished
                    ? { top: noButtonPosition.top, left: noButtonPosition.left }
                    : isNoVanished && noButtonPosition ? { top: noButtonPosition.top, left: noButtonPosition.left } : {}
                }
              >
                არა 😒
              </button>
            </div>
            
            <p className="mt-8 text-xs md:text-sm text-gray-500 opacity-60 font-medium tracking-wide">
              (პასუხი "არა" არ მიიღება)
            </p>
          </div>
        ) : (
          /* Success View */
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(255,105,180,0.5)] border-4 border-pink-300 animate-pop-in mx-4">
            <div className="flex justify-center mb-6">
              <img 
                src="https://media.giphy.com/media/7vDoUoDZHoUQxMPkd7/giphy.gif" 
                alt="Romantic Bear Hug" 
                className="rounded-2xl w-full max-w-[280px] h-auto shadow-lg border-2 border-pink-100"
              />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-pink-600 mb-6 drop-shadow-sm tracking-tight">
              იეეეს! 💖
            </h2>
            <p className="text-lg md:text-2xl text-gray-700 font-semibold leading-relaxed">
              ვიცოდი რომ დაეთანხმებოდი! <br />
              <span className="text-red-500 font-extrabold text-2xl md:text-4xl block mt-4 animate-bounce">
                ახლა ჩვენ ერთად ვართ!
              </span>
            </p>
            <div className="mt-6 flex justify-center gap-4 text-4xl md:text-6xl">
              💑 💍 💝
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;