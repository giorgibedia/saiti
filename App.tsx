import React, { useState, useRef } from 'react';
import { FloatingHearts } from './components/FloatingHearts';
import { Heart, Stars } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [noCount, setNoCount] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Phrases that appear on the "No" button sequentially
  const phrases = [
    "არა 😒",
    "დაფიქრდი... 🤔",
    "ნუთუ? 🥺",
    "გული მატკინო? 💔",
    "შანსი არაა! 😤",
    "კარგი რა... 😭",
    "მომკლავ... ☠️",
    "გთხოოოოვ! 🙏",
    "სხვა გზა არაა! 😡",
    "მაინც კი-ს დააჭერ! 😎"
  ];

  const getNoButtonText = () => {
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ffa500', '#ff69b4']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ffa500', '#ff69b4']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const dodgeButton = () => {
    if (!containerRef.current) return;

    // Increment count to grow the YES button
    setNoCount(prev => prev + 1);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Better estimation of button size + safety margin
    // We use larger values to ensure it definitely stays on screen
    const buttonWidth = 220; 
    const buttonHeight = 100; 
    const padding = 20;

    // Calculate max allowed positions
    // Math.max(0, ...) ensures we don't get negative values on very small screens
    const maxLeft = Math.max(0, viewportWidth - buttonWidth - padding);
    const maxTop = Math.max(0, viewportHeight - buttonHeight - padding);

    const randomX = Math.max(padding, Math.random() * maxLeft);
    const randomY = Math.max(padding, Math.random() * maxTop);

    setNoButtonPosition({ top: randomY, left: randomX });
  };

  const handleYesClick = () => {
    setIsAccepted(true);
    triggerConfetti();
  };
  
  const handleNoClickForce = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setNoCount(prev => prev + 1);
      dodgeButton();
  }

  // Calculate Yes Button Scale
  // Starts at 1, increases by 0.15 for every "No" attempt
  const yesButtonScale = 1 + (noCount * 0.15);

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

            <div className="flex flex-row justify-center items-center gap-4 relative min-h-[100px]">
              {/* YES Button */}
              <button
                onClick={handleYesClick}
                style={{ 
                    transform: `scale(${yesButtonScale})`,
                    transformOrigin: 'center',
                    zIndex: yesButtonScale > 2 ? 100 : 20 
                }}
                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap
                    ${yesButtonScale > 3 ? 'text-4xl px-12 py-6 ring-8 ring-green-300' : 'text-xl'}
                `}
              >
                კი <span className="text-2xl">😍</span>
              </button>

              {/* NO Button */}
              <button
                ref={noButtonRef}
                onMouseEnter={dodgeButton}
                onTouchStart={dodgeButton}
                onClick={handleNoClickForce}
                className={`bg-red-500 text-white text-lg md:text-xl font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 z-30 whitespace-nowrap select-none max-w-[90vw] overflow-hidden text-ellipsis
                  ${noButtonPosition ? 'fixed transition-all duration-200 ease-out' : 'relative'} 
                `}
                style={
                  noButtonPosition
                    ? { top: noButtonPosition.top, left: noButtonPosition.left }
                    : {}
                }
              >
                {getNoButtonText()}
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