import React, { useState, useRef, useEffect } from 'react';
import { FloatingHearts } from './components/FloatingHearts';
import { Heart, Stars, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [noCount, setNoCount] = useState(0);
  
  // Typewriter state
  const [displayedTitle, setDisplayedTitle] = useState("");
  // Fixed typo here: Ensuring it says "მარი"
  const fullTitle = "მარი, იქნები ჩემი ვალენტინი?";
  
  // Interactive Content State
  const [reasonIndex, setReasonIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const reasons = [
    "შენი ღიმილი, რომელიც დღეს მინათებს ☀️",
    "შენი უსაზღვრო სიკეთე 💖",
    "ის, თუ როგორ ზრუნავ სხვებზე 🤗",
    "შენი იუმორი და სიცილი 😂",
    "როგორც მიგებ უსიტყვოდ 🤫",
    "შენი ლამაზი თვალები 👀",
    "უბრალოდ იმიტომ, რომ შენ, შენ ხარ! ❤️",
    "საუკეთესო ხარ მსოფლიოში! 🌍"
  ];

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

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    // Reset displayed title on mount to restart effect if needed
    setDisplayedTitle(""); 
    
    const timer = setInterval(() => {
      if (index < fullTitle.length) {
        setDisplayedTitle(prev => fullTitle.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100); 
    return () => clearInterval(timer);
  }, [fullTitle]);

  const vibratePhone = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const dodgeButton = () => {
    if (!containerRef.current) return;
    
    // Haptic feedback for failure
    vibratePhone(50);

    // Increment count to grow the YES button
    setNoCount(prev => prev + 1);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Logic to keep button strictly within screen bounds
    // We assume the button is roughly 150-200px wide and 60px high
    const buttonWidth = 180; 
    const buttonHeight = 60; 
    const padding = 20; // Safe area from edges

    const maxLeft = viewportWidth - buttonWidth - padding;
    const maxTop = viewportHeight - buttonHeight - padding;

    // Ensure we don't return negative values (if screen is tiny)
    const safeMaxLeft = Math.max(0, maxLeft);
    const safeMaxTop = Math.max(0, maxTop);

    const randomX = Math.max(padding, Math.random() * safeMaxLeft);
    const randomY = Math.max(padding, Math.random() * safeMaxTop);

    setNoButtonPosition({ top: randomY, left: randomX });
  };

  const handleYesClick = () => {
    setIsAccepted(true);
    triggerConfetti();
    // Success vibration pattern
    vibratePhone([100, 50, 100, 50, 200]);
  };
  
  const handleNoClickForce = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      e.preventDefault(); // Prevent accidental double taps zooming
      dodgeButton();
  }
  
  const showNextReason = () => {
    vibratePhone(20);
    setReasonIndex((prev) => (prev + 1) % reasons.length);
  };

  // Calculate Yes Button Scale
  // Starts at 1, increases by 0.15 for every "No" attempt
  // Capped at scale 8 to prevent crashing the browser layout completely
  const yesButtonScale = Math.min(1 + (noCount * 0.15), 10);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-transparent touch-none" ref={containerRef}>
      <FloatingHearts />

      {/* Main Card Content */}
      <div className="z-10 relative px-4 w-full max-w-lg text-center mx-auto flex flex-col items-center justify-center h-full">
        
        {!isAccepted ? (
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-pink-200 transition-all duration-300 w-full animate-pop-in flex flex-col items-center">
            
            <div className="mb-4 relative">
                 <Heart className="text-red-500 fill-red-500 w-24 h-24 heart-beat drop-shadow-xl" />
                 <Stars className="text-yellow-400 w-8 h-8 absolute -top-2 -right-4 animate-spin-slow" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-8 leading-snug tracking-tight min-h-[80px] md:min-h-[120px] flex items-center justify-center">
              <span>
                {displayedTitle}
                <span className="animate-pulse text-pink-600">|</span>
              </span>
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-6 relative w-full min-h-[150px] mb-8">
              {/* YES Button */}
              <button
                onClick={handleYesClick}
                style={{ 
                    transform: `scale(${yesButtonScale})`,
                    transformOrigin: 'center',
                    zIndex: yesButtonScale > 2 ? 100 : 20 
                }}
                className={`
                    bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap
                    ${yesButtonScale > 3 ? 'p-8 text-4xl ring-8 ring-green-300' : 'py-3 px-10 text-xl'}
                `}
              >
                კი <span className="text-2xl">😍</span>
              </button>

              {/* NO Button */}
              <button
                ref={noButtonRef}
                onMouseEnter={() => {
                  // Only on desktop we use hover logic
                  if (window.matchMedia("(hover: hover)").matches) {
                    dodgeButton();
                  }
                }}
                onTouchStart={handleNoClickForce} 
                onClick={handleNoClickForce}
                className={`bg-red-500 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 z-30 whitespace-nowrap select-none
                  ${noButtonPosition ? 'fixed' : 'relative'} 
                `}
                style={
                  noButtonPosition
                    ? { top: noButtonPosition.top, left: noButtonPosition.left, transition: 'top 0.2s, left 0.2s' }
                    : {}
                }
              >
                {getNoButtonText()}
              </button>
            </div>
            
            <p className="mt-4 text-xs md:text-sm text-gray-500 opacity-60 font-medium tracking-wide">
              (პასუხი "არა" არ მიიღება)
            </p>
          </div>
        ) : (
          /* Success View */
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(255,105,180,0.4)] border-4 border-pink-300 animate-pop-in w-full max-h-[90dvh] overflow-y-auto no-scrollbar">
            <div className="flex justify-center mb-4">
              <img 
                src="https://media.giphy.com/media/7vDoUoDZHoUQxMPkd7/giphy.gif" 
                alt="Romantic Bear Hug" 
                className="rounded-2xl w-full max-w-[240px] h-auto shadow-md border border-pink-100"
              />
            </div>
            <h2 className="text-3xl font-black text-pink-600 mb-2 drop-shadow-sm tracking-tight">
              იეეეს! 💖
            </h2>
            <p className="text-lg text-gray-700 font-semibold leading-relaxed mb-6">
              ახლა ჩვენ ერთად ვართ! <br />
              <span className="text-sm text-gray-400">მოემზადე თავგადასავლებისთვის...</span>
            </p>

            {/* Interactive Section */}
            <div className="grid grid-cols-1 gap-4 w-full">
                
                {/* Reasons Generator */}
                <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
                    <button 
                        onClick={showNextReason}
                        className="w-full bg-white text-pink-600 border border-pink-200 hover:bg-pink-100 font-bold py-2 px-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 mb-2 active:scale-95"
                    >
                        <Sparkles size={18} />
                        რატომ მიყვარხარ?
                    </button>
                    
                    {reasonIndex >= 0 && (
                        <div className="text-pink-700 font-medium text-lg italic animate-pop-in min-h-[3rem] flex items-center justify-center text-center">
                            "{reasons[reasonIndex]}"
                        </div>
                    )}
                </div>

            </div>

            <div className="mt-6 flex justify-center gap-4 text-4xl opacity-80">
              💑 💍 💝
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;